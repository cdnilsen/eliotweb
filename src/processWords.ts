import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT

type stringToStringDict = { 
    [key: string]: string 
};

type stringToNumberDict = {
    [key: string]: number
};

type stringToStringListDict = {
    [key: string]: string[]
};

type stringToNumberListDict = {
    [key: string]: number[]
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

async function wordAlreadyInTable(word: string, tableName: string) {
    let tableHasWordBool: boolean = false;
    let query = await pool.query("SELECT * FROM " + tableName + " WHERE word = $1::text", [word]);
    if (query.rows.length > 0) {
        tableHasWordBool = true;
    }
    return tableHasWordBool;
}


//Edition counts should probably be re-processed later on
async function updateExistingWordInTable(word: string, verseID: number, count: number, tableName: string) {
    let query = await pool.query('SELECT * FROM ' + tableName + ' WHERE word = $1::text', [word]);

    let queryRow = query.rows[0];

    let addressArray: number[] = queryRow.addresses;
    let verseCounts: number[] = queryRow.verse_counts;

    let newAddressArray: number[] = [];
    let newVerseCountArray: number[] = [];

    
    let addressFound: boolean = false;

    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i] == verseID) {
            addressFound = true;
            newAddressArray.push(verseID);
            newVerseCountArray.push(count);
        } else {
            newAddressArray.push(addressArray[i]);
            newVerseCountArray.push(verseCounts[i]);
        }
    }

    if (!addressFound) {
        newAddressArray.push(verseID);
        newVerseCountArray.push(count);
    }

    await pool.query('UPDATE ' + tableName + ' SET addresses = $1::int[], verse_counts = $2::int[] WHERE word = $3::text', [newAddressArray, newVerseCountArray, word]);
}

async function processWordInTable(word: string, verseID: number, count: number, tableName: string) {
    let tableHasWord = await wordAlreadyInTable(word, tableName);

    let consoleString = "";
    if (tableHasWord) {
        await updateExistingWordInTable(word, verseID, count, tableName);
        consoleString = word + " updated";
    } else {
        let verseIDArray = [verseID];
        let countArray = [count];
        await pool.query('INSERT INTO ' + tableName + "(word, addresses, verse_counts) VALUES ($1::text, $2::int[], $3::int[])", [word, verseIDArray, countArray]);
        consoleString = word + " inserted";
    }
    return consoleString;
}

async function appendWordDataOneTable(verseEditionID: number, countDict: stringToNumberDict, tableName: string) {
    let allWords = Object.keys(countDict);
    let outputString = "";
    for (let i = 0; i < allWords.length; i++) {
        let thisWord = allWords[i];
        let thisCount = countDict[thisWord];
        outputString += await processWordInTable(thisWord, verseEditionID, thisCount, tableName) + "\n";
    }
    return outputString; 
}

async function processBookWordTable(textName: string, wordList: string[], tableName: string) {
    let myQuery = await(pool.query("SELECT * FROM " + tableName + " WHERE textID = $1::string", [textName]));
    let queryRows = myQuery.rows;
    let existingWords: string[] = [];
    let getRidOfWords: string[] = [];
    for (let i = 0; i < queryRows.length; i++) {
        existingWords.push(queryRows[i].word);
        if (!wordList.includes(queryRows[i].word)) {
            getRidOfWords.push(queryRows[i].word);
        }
    }

    let wordsToAdd: string[] = [];
    for (let j = 0; j < wordList.length; j++) {
        if (!existingWords.includes(wordList[j])) {
            wordsToAdd.push(wordList[j]);
        }
    }

    for (let k = 0; k < getRidOfWords.length; k++) {
        await pool.query("DELETE FROM " + tableName + " WHERE word = $1::text AND textID = $2::text", [getRidOfWords[k], textName]);
    }

    for (let l = 0; l < wordsToAdd.length; l++) {
        await pool.query("INSERT INTO " + tableName + "(word, textID) VALUES ($1::text, $2::text)", [wordsToAdd[l], textName]);
    }

    return getRidOfWords;
}

async function cleanUpWordIndex(tableName: string, nukableWords: string[]) {


}

async function updateBookWordTables(textName: string, wordListDiacritics: string[], wordListNoDiacritics: string[]) {

    let nukeWordsDiacritics = await processBookWordTable(textName, wordListDiacritics, 'book_words_diacritics');

    let nukeWordsNoDiacritics = await processBookWordTable(textName, wordListNoDiacritics, 'book_words_no_diacritics'); 

}

async function getHapaxes(checkDiacritics: boolean) {
    let tableName = "words_diacritics";
    if (checkDiacritics == false) {
        tableName = "words_no_diacritics";
    }
    let query = await pool.query("SELECT * FROM " + tableName + " WHERE total_count = 1");
    let allHapaxList = [];
    let rows = query.rows;
    for (let i = 0; i < rows.length; i++) {
        allHapaxList.push(rows[i].word);
    }
    return allHapaxList;
}

async function appendWordData(verseEditionID: number, diacriticCountDict: stringToNumberDict, noDiacriticCountDict: stringToNumberDict) {
    let outputString = await appendWordDataOneTable(verseEditionID, diacriticCountDict, "words_diacritics");
    await appendWordDataOneTable(verseEditionID, noDiacriticCountDict, "words_no_diacritics");

    return outputString;

}

async function processOneVerseWordData(verseID: number) {
    let verseQuery = await pool.query("SELECT * FROM all_verses WHERE id = $1::int", [verseID]);
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
    let finalOutput: string = "";
    for (let j = 0; j < activeVersesList.length; j++) {
        let thisVerseID = activeVersesList[j];
        let thisDiacriticCountDict = diacriticCountDictList[j];
        let thisNoDiacriticCountDict = noDiacriticWordDictList[j];

        finalOutput += await appendWordData(thisVerseID, thisDiacriticCountDict, thisNoDiacriticCountDict);
    }
    return finalOutput;
}

// This function populates the 'correspondence' columns in the word tables. In words_diacritics, this is the diacritic-less version of the word; in words_no_diacritics, it's an array of all words in words_diacritics that correspond to this word
export async function populateCorrespondences() {

    return "populateCorrespondences worked (?)";
    /*
    let diacriticWordQuery = await pool.query("SELECT * FROM words_diacritics");
    let diacriticWordRows = diacriticWordQuery.rows;
    
    let diacriticToNoneDict: stringToStringDict = {};
    let noneToDiacriticDict: stringToStringListDict = {};
    let allDiacriticsList: string[] = [];
    let allNoDiacriticsList: string[] = [];
    
    for (let i = 0; i < diacriticWordRows.length; i++) {
        let diacriticWord = diacriticWordRows[i].word;
        allDiacriticsList.push(diacriticWord);

        let noDiacriticWord = cleanDiacritics(diacriticWord);
        diacriticToNoneDict[i] = noDiacriticWord;
        
        if (! allNoDiacriticsList.includes(noDiacriticWord)) {
            allNoDiacriticsList.push(noDiacriticWord);
            noneToDiacriticDict[noDiacriticWord] = [diacriticWord];
        } else {
            noneToDiacriticDict[noDiacriticWord].push(diacriticWord);
        }
    }

    for (let j = 0; j < allDiacriticsList.length; j++) {
        let word = allDiacriticsList[j];
        await pool.query("UPDATE words_diacritics SET corresponding_word = $1::text WHERE word = $2::text", [diacriticToNoneDict[word], word]);
    }

    for (let k = 0; k < allNoDiacriticsList.length; k++) {
        let word = allNoDiacriticsList[k];
        await pool.query("UPDATE words_no_diacritics SET corresponding_words = $1::text[] WHERE word = $2::text", [noneToDiacriticDict[word], word]);
    }

    return "Processed correspondences for " + allDiacriticsList.length.toString() + " words.";
    */
}

export async function processBatchWordData(rawJSON: any) {
    let idList: string[] = Object.values(rawJSON);

    let outputStringList: string[] = [];
    for (let i = 0; i < idList.length; i++) {
        let outcomeString = await processOneVerseWordData(parseInt(idList[i]));
        outputStringList.push(outcomeString);
    }
    
    return outputStringList;
}
/*
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}*/

async function getTotalCounts(tableName: string) {
    return ("did getTotalCounts in " + tableName);
    
    /*
    let query = await pool.query("SELECT * FROM " + tableName);
    let queryRows = query.rows;
    let queryRowsLength = queryRows.length;

    let wordToCountListDict: stringToNumberListDict = {};
    let allWords: string[] = [];
    
    for (let i = 0; i < queryRowsLength; i++) {
        let word = queryRows[i].word;
        let countList = queryRows[i].verse_counts;

        let totalCount = countList.reduce((a: number, b: number) => a + b, 0);
        if (!wordToCountListDict[word]) {
            allWords.push(word);
            wordToCountListDict[word] = totalCount;
        } else {
            wordToCountListDict[word] += totalCount;
        }

    }

    let startingIndex = 0;
    let endingIndex = 49;
    while (startingIndex <= allWords.length) {
        let myWordList = allWords.slice(startingIndex, Math.max(endingIndex, allWords.length));
        for (let j = 0; j < myWordList.length; j++) {
            let word = allWords[j];
            await pool.query("UPDATE " + tableName + " SET total_count = $1::int WHERE word = $2::text", [wordToCountListDict[word], word]);
        }
        startingIndex += 50;
        endingIndex += 50;
    }
    */
}

export async function getTotalWordCounts() {
    let string1 = await getTotalCounts("words_diacritics");
    let string2 = await getTotalCounts("words_no_diacritics");

    return string1 + "\n" + string2;
}