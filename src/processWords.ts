import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT;

type stringToStringDict = { 
    [key: string]: string 
};

type stringToNumberDict = {
    [key: string]: number
};

const editionToWordListDict: stringToStringDict = {
    "First Edition": "words_first_edition",
    "Second Edition": "words_second_edition",
    "Mayhew": "words_other_edition",
    "Zeroth Edition": "words_other_edition"
};

const editionToCountListDict: stringToStringDict = {
    "First Edition": "word_counts_first_edition",
    "Second Edition": "word_counts_second_edition",
    "Mayhew": "word_counts_other_edition",
    "Zeroth Edition": "word_counts_other_edition"
};

const editionToNumDict: stringToStringDict = {
    //These are primes, which allows for easy checking by modulo.
    "First Edition": "2",
    "Second Edition": "3",
    "Mayhew": "5",
    "Zeroth Edition": "7"
};

function cleanDiacritics(word: string): string {
    let charReplacementDict: stringToStringDict = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "à": "a",
        "è": "e",
        "ì": "i",
        "ò": "o",
        "ù": "u",
        "â": "a",
        "ê": "e",
        "î": "i",
        "ô": "o",
        "û": "u",
        "ä": "a",
        "ë": "e",
        "ï": "i",
        "ö": "o",
        "ü": "u",
        "ã": "a",
        "õ": "o",
        "ñ": "nn",
        "m̃": "mm",
        "ũ": "u",
        "ẽ": "e",
        "ĩ": "i",
        "ā": "an",
        "ē": "en",
        "ī": "in",
        "ō": "on",
        "ū": "un"
    };

    let cleanedWord = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i] in charReplacementDict) {
            cleanedWord += charReplacementDict[word[i]];
        } else {
            cleanedWord += word[i];
        }
    }
    return cleanedWord;
}

function getWordCountDict(wordList: string[], countList: number[], keepDiacritics: boolean): stringToNumberDict {
    let countDict: stringToNumberDict = {};
    for (let i = 0; i < wordList.length; i++) {
        let cleanedWord = "";
        if (!keepDiacritics) {
            cleanedWord = cleanDiacritics(wordList[i]);
        } else {
            cleanedWord = wordList[i];
        }
        if (cleanedWord in countDict) {
            countDict[cleanedWord] += countList[i];
        } else {
            countDict[cleanedWord] = countList[i];
        }
    }
    return countDict;
}

async function wordAlreadyInTable(word: string, tableName: string){
    let query = await pool.query("SELECT * FROM $1::text WHERE word = $2::text", [tableName, word]);
    if (query.rows.length > 0) {
        return true;
    } else {
        return false;
    }
}


//Edition counts should probably be re-processed later on
async function updateWordInTable(word: string, verseID: number, count: number, tableName: string) {
    let verseIDArray = [verseID];
    let countArray = [count];
    let tableHasWord = await wordAlreadyInTable(word, tableName);

    if (tableHasWord) {
        await pool.query('UPDATE ' + tableName + ' SET addresses = array_append(addresses, $1::int), verse_counts = array_append(verse_counts, $2::int) WHERE word = $3::text', [verseID, count, word]);

    } else {
        await pool.query('INSERT INTO ' + tableName + "(word, addresses, verse_counts) VALUES ($1::text, $2::int[], $3::int[])", [word, verseIDArray, countArray]);
    }
    return ("Updated " + word + " in " + tableName + ".");

}

async function appendWordDataOneTable(verseEditionID: number, countDict: stringToNumberDict, tableName: string) {
    let allWords = Object.keys(countDict);
    let returnString = "";
    for (let i = 0; i < allWords.length; i++) {
        let thisWord = allWords[i];
        let thisCount = countDict[thisWord];
        returnString = await updateWordInTable(thisWord, verseEditionID, thisCount, tableName);
    }
    return returnString;
}


async function appendWordData(verseEditionID: number, diacriticCountDict: stringToNumberDict, noDiacriticCountDict: stringToNumberDict) {
    let returnStringDiacritics = await appendWordDataOneTable(verseEditionID, diacriticCountDict, "words_diacritics");
    let returnStringNoDiacritics = await appendWordDataOneTable(verseEditionID, noDiacriticCountDict, "words_no_diacritics");
    
    return (returnStringDiacritics + "\n" + returnStringNoDiacritics);
}

async function processOneVerseWordData(verseID: number) {
    let verseQuery = await pool.query("SELECT * FROM all_verses WHERE verse_id = $1::int", [verseID]);
    let verseRow = verseQuery.rows[0];
    let verseBook = verseRow.book;

    let editionColumnList = [verseRow.words_first_edition, verseRow.words_second_edition];
    let countColumnList = [verseRow.word_counts_first_edition, verseRow.word_counts_second_edition];

    let firstEditionID = "2" + verseID.toString().slice(1);
    let secondEditionID = "3" + verseID.toString().slice(1);

    let editionIDList = [firstEditionID, secondEditionID];

    let otherEditionID = "";
    if (verseBook == "Genesis") {
        editionColumnList.push(verseRow.words_other_edition);
        countColumnList.push(verseRow.word_counts_other_edition);
        otherEditionID = "7" + verseID.toString().slice(1);
        editionIDList.push(otherEditionID);
    } else if (verseBook == "Psalms (prose)" || verseBook == "John") {
        editionColumnList.push(verseRow.words_other_edition);
        countColumnList.push(verseRow.word_counts_other_edition);
        otherEditionID = "5" + verseID.toString().slice(1);
        editionIDList.push(otherEditionID);
    }

    let activeVersesList: number[] = [];
    let diacriticCountDictList: stringToNumberDict[] = [];
    let noDiacriticWordDictList: stringToNumberDict[] = [];

    for (let i = 0; i < editionColumnList.length; i++) {
        let thisEditionWordList = editionColumnList[i];
        let thisEditionCountList = countColumnList[i];
        let thisEditionID = parseInt(editionIDList[i]);
        if (thisEditionWordList != null) {
            activeVersesList.push(thisEditionID);
            diacriticCountDictList.push(getWordCountDict(thisEditionWordList, thisEditionCountList, true));
            noDiacriticWordDictList.push(getWordCountDict(thisEditionWordList, thisEditionCountList, false));
        }
    }

    let returnString = "";
    for (let j = 0; j < activeVersesList.length; j++) {
        let thisVerseID = activeVersesList[j];
        let thisDiacriticCountDict = diacriticCountDictList[j];
        let thisNoDiacriticCountDict = noDiacriticWordDictList[j];
        returnString = await appendWordData(thisVerseID, thisDiacriticCountDict, thisNoDiacriticCountDict);
    }
    return returnString;
}

export async function processBatchWordData(idList: number[]) {
    let returnString = ""
    for (let i = 0; i < idList.length; i++) {
        returnString = await processOneVerseWordData(idList[i]);
    }
    return returnString;
}