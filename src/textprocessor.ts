import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT;

function cleanPunctuation(word: string): string {
    let cleanWord = word.replace(/[.,\/#!%\^&\*?;:{}=\_`~()]/g, "");
    cleanWord = cleanWord.replace('[', '').replace(']', '');
    return cleanWord;
}

type stringToIntDict = {
    [key: string]: number
}

function getWordsInText(verseText: string): stringToIntDict {
    let finalWordList: string[] = [];
    let finalCountDict: stringToIntDict = {};
    let finalCountList: number[] = [];
    let wordList = verseText.split(" ");
    for (let i = 0; i < wordList.length; i++) {
        let cleanWord = cleanPunctuation(wordList[i]);
        if (cleanWord.length > 0 && !finalWordList.includes(cleanWord.toLowerCase())) {
            finalWordList.push(cleanWord.toLowerCase());
            finalCountDict[cleanWord.toLowerCase()] = 1;
        } else if (cleanWord.length > 0) {
            finalCountDict[cleanWord.toLowerCase()] += 1;
        }
    }
    for (let i = 0; i < finalWordList.length; i++) {
        finalCountList.push(finalCountDict[finalWordList[i]]);
    }
    return finalCountDict;
}
//Rename this string to string type or something
type stringToStringDict = {
    [key: string]: string
}

const editionToColumnDict: stringToStringDict = {
    "First Edition": "first_edition_raw",
    "Second Edition": "second_edition_raw",
    "Mayhew": "other_edition_raw",
    "Zeroth Edition": "other_edition_raw",
    "KJV": "kjv",
    "Grebrew": "grebrew" // Are we even using this except in Greek?
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
}

function killDiacritics(word: string): string {
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
    }

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

async function removeVerseCiteFromWordTable(verseIDNum: number, editionNum: number, word: string, wordCount: number, useDiacritics: boolean) {
}

async function updateOneWordTable(verseIDNum: number, editionNum: number, word: string, wordCount: number, useDiacritics: boolean) {

    let whichTable = "";
    if (useDiacritics) {
        whichTable = "words_diacritics";
    } else {
        whichTable = "words_no_diacritics";
    }

    let checkQuery = await pool.query('SELECT * FROM ' + whichTable + ' WHERE word = $1', [word]);

    let hasWord = (checkQuery.rows.length > 0);

    if (hasWord) {
        let thisRow = checkQuery.rows[0];
        let verseIDList = thisRow.addresses;
        let verseCountList = thisRow.verse_counts;
        let thisEditionList = thisRow.all_editions;
        let thisEditionCountList = thisRow.edition_counts;

        let thisEditionIndex = thisEditionList.indexOf(editionNum);

        let updatedVerseIDList = verseIDList;
        let updatedVerseCountList = verseCountList;

        for (let i = 0; i < verseIDList.length; i++) {
            if (verseIDList[i] != verseIDNum || wordCount == verseCountList[i]) {
                updatedVerseIDList.push(verseIDList[i]);
                updatedVerseCountList.push(verseCountList[i]);
            } else {
                updatedVerseIDList.push(verseIDNum);
                updatedVerseCountList.push(wordCount);
                thisEditionCountList[thisEditionIndex] -= verseCountList[i];
                thisEditionCountList[thisEditionIndex] += wordCount;
            }
        }
        await pool.query('UPDATE ' + whichTable + ' SET addresses = $1, verse_counts = $2, all_editions = $3, editionCounts = $4 WHERE word = $5', [updatedVerseIDList, updatedVerseCountList, thisEditionList, thisEditionCountList, word]);
    } else {
        let addressArray: number[] = [];
        addressArray.push(verseIDNum);

        let verseCountArray: number[] = [];
        verseCountArray.push(wordCount);

        let editionArray: number[] = [];
        editionArray.push(editionNum);

        let editionCountArray: number[] = [];
        editionCountArray.push(wordCount);

        await pool.query('INSERT INTO ' + whichTable + '(word, addresses, verse_counts, all_editions, edition_counts) VALUES($1, $2, $3, $4, $5)', [word, addressArray, verseCountArray, editionArray, editionCountArray]);
    }
}

async function updateWordTables(verseID: string, edition: string, wordList: string[], wordCountList: number[]) {

    //Prime numbers make it easy to check which editions a word is in
    const editionToNumDict: stringToStringDict = {
        "First Edition": "2",
        "Second Edition": "3",
        "Mayhew": "5",
        "Zeroth Edition": "7"
    };

    let editionNum = editionToNumDict[edition];
    let verseIDNum = parseInt(editionNum + verseID);
    let diacriticsDict: stringToIntDict = {};
    let noDiacriticsDict: stringToIntDict = {};
    
    for (let i = 0; i < wordList.length; i++) {
        diacriticsDict[wordList[i]] = wordCountList[i];
        let wordCleaned = killDiacritics(wordList[i]);
        if (wordCleaned in noDiacriticsDict) {
            noDiacriticsDict[wordCleaned] += wordCountList[i];
        } else {
            noDiacriticsDict[wordCleaned] = wordCountList[i];
        }
    }

    let diacriticsList = Object.keys(diacriticsDict);
    let noDiacriticsList = Object.keys(noDiacriticsDict);

    for (let i = 0; i < diacriticsList.length; i++) {
        await updateOneWordTable(verseIDNum, parseInt(editionNum), diacriticsList[i], diacriticsDict[diacriticsList[i]], true);
    }

    for (let j = 0; j < noDiacriticsList.length; j++) {
        await updateOneWordTable(verseIDNum, parseInt(editionNum), noDiacriticsList[j], noDiacriticsDict[noDiacriticsList[j]], false);
    }
}

async function updateOneEdition() {

}


async function updateEdition(verseExists: boolean, verseID: string, verseText: string, edition: string, book: string, consoleAddress: string, editionColumn: string, wordListColumn: string, wordList: string[], wordCountColumn: string, wordCountList: number[], chapter: number, verse: number) {

    let isMassachusett: boolean = (edition == "First Edition" || edition == "Second Edition" || edition == "Mayhew" || edition == "Zeroth Edition");

    if (verseID == "102040027") {
        console.log("This is the verse that's causing problems");
        console.log(verseText);
        console.log(wordList);
        console.log(wordCountList);
    }
    if (isMassachusett && verseExists) {
        let queryText = "UPDATE all_verses SET " + editionColumn + " = $1, " + wordListColumn + " = $2, " + wordCountColumn + " = $3 WHERE id = $4";
        await pool.query(queryText, [verseText, wordList, wordCountList, parseInt(verseID)])
        return (consoleAddress + " updated in database.")

    } else if (isMassachusett && !verseExists) {
        await pool.query('INSERT INTO all_verses(id, book, ' + editionColumn + ', ' + wordListColumn + ', ' + wordCountColumn + ', chapter, verse) VALUES($1, $2, $3, $4, $5, $6, $7)', [parseInt(verseID), book, verseText, wordList, wordCountList, chapter, verse]);
        return (consoleAddress + " inserted into database.")

    } else if (!isMassachusett && verseExists) {
        let queryText = "UPDATE all_verses SET " + editionColumn + " = $1 WHERE id = $2";
        await pool.query(queryText, [verseText, parseInt(verseID)])
        return (consoleAddress + " updated in database.")

    } else if (!isMassachusett && !verseExists) {
        await pool.query('INSERT INTO all_verses(id, book, ' + editionColumn + ', chapter, verse) VALUES($1, $2, $3, $4, $5)', [parseInt(verseID), book, verseText, chapter, verse]);
        return (consoleAddress + " inserted into database.")
    }
}

async function verseUpdate(verseExists: boolean, verseID: string, verseText: string, edition: string, book: string) {
    let editionColumn = editionToColumnDict[edition];
    let wordListColumn = editionToWordListDict[edition];
    let wordCountColumn = editionToCountListDict[edition];

    let consoleAddress = "";
    let chapter = 0;
    let verse = 0;
    if (verseID.endsWith("Epilogue")) {
        chapter = 999;
        verse = 1;
        consoleAddress = edition + " " + book + " epilogue";
    } else {
        chapter = parseInt(verseID.slice(3, 6));
        verse = parseInt(verseID.slice(6));
        consoleAddress = edition + " " + book + " " + verseID.slice(3, 6) + ":" + verseID.slice(6);
    }
    
    let wordList: string[] = [];
    let wordCountList: number[] = [];
    if (edition == "First Edition" || edition == "Second Edition" || edition == "Mayhew" || edition == "Zeroth Edition") {
        let wordTextsAndCountDict = getWordsInText(verseText);
        wordList = Object.keys(wordTextsAndCountDict);
        for (let i = 0; i < wordList.length; i++) {
            wordCountList.push(wordTextsAndCountDict[wordList[i]]);
        }
    }

    let outcome = await updateEdition(verseExists, verseID, verseText, edition, book, consoleAddress, editionColumn, wordListColumn, wordList, wordCountColumn,wordCountList, chapter, verse);
    return outcome;
}

export async function processVerseJSON(rawJSON: any) {
    let idNumber = rawJSON.id;
    console.log(typeof idNumber);
    let rawText = rawJSON.text;
    let book = rawJSON.book;
    let edition = rawJSON.edition;
    let myQuery = await pool.query('SELECT * FROM all_verses WHERE id = $1', [parseInt(idNumber)]);
    let hasVerse = (myQuery.rows.length > 0);
    let returnValue = await verseUpdate(hasVerse, idNumber, rawText, edition, book);
    return returnValue;
}