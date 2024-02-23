import express from "express"
import path from "path"

import { default as pool } from './db'

import { stringToIntDict, stringToStringDict, stringToIntListDict, stringToStringListDict, intToStringDict, intToIntDict, intToStringListDict, intToIntListDict, cleanDiacriticsEngmaMarking, getIntersectionAndUnion, laxifyWordData} from './functions'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT

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



function zip(list1: any[], list2: any[]): any {
    let zipped: any = {};
    for (let i = 0; i < list1.length; i++) {
        zipped[list1[i]] = list2[i];
    }
    return zipped;
}

function getWordCountDict(wordList: string[], countList: number[], keepDiacritics: boolean): stringToIntDict {
    let countDict: stringToIntDict = {};
    for (let i = 0; i < wordList.length; i++) {
        let cleanedWord = "";
        if (!keepDiacritics) {
            cleanedWord = cleanDiacriticsEngmaMarking(wordList[i]);
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
    let useDiacritics: boolean = tableName == "words_diacritics";
    let queryWord: string = word;
    if (!useDiacritics){
        queryWord = cleanDiacriticsEngmaMarking(word);
    }

    let query = await pool.query('SELECT * FROM ' + tableName + ' WHERE word = $1::text', [queryWord]);

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

    if (useDiacritics){
        await pool.query('UPDATE ' + tableName + ' SET addresses = $1::int[], verse_counts = $2::int[], correspondingWord = $3::text WHERE word = $4::text', [newAddressArray, newVerseCountArray, cleanDiacriticsEngmaMarking(word), word]);
    } else {
        let correspondingArray: string[] = queryRow.corresponding_words;
        if (!correspondingArray.includes(cleanDiacriticsEngmaMarking(word))) {
            correspondingArray.push(cleanDiacriticsEngmaMarking(word));
        }
        await pool.query('UPDATE ' + tableName + ' SET addresses = $1::int[], verse_counts = $2::int[], corresponding_words = $3::text[] WHERE word = $4::text', [newAddressArray, newVerseCountArray, correspondingArray, cleanDiacriticsEngmaMarking(word)]);
    }
}

async function processWordInTable(word: string, verseID: number, count: number, tableName: string) {
    let tableHasWord = await wordAlreadyInTable(word, tableName);

    let useDiacritics: boolean = tableName == "words_diacritics";

    let consoleString = "";

    let verseIDArray = [verseID];
    let countArray = [count];

    if (tableHasWord) {
        await updateExistingWordInTable(word, verseID, count, tableName);
        consoleString = word + " updated";
    } else {
        let queryString: string = "";
        let noDiacriticsWord: string = cleanDiacriticsEngmaMarking(word);
        if (useDiacritics) {    
            await pool.query('INSERT INTO ' + tableName + "(word, addresses, verse_counts, corresponding_word) VALUES ($1::text, $2::int[], $3::int[], $4::text)", [word, verseIDArray, countArray, noDiacriticsWord])
        } else {
            let verseIDArray = [verseID];
            let countArray = [count];
            await pool.query('INSERT INTO ' + tableName + "(word, addresses, verse_counts) VALUES ($1::text, $2::int[], $3::int[], $4::text[])", [noDiacriticsWord, verseIDArray, countArray, [word]]); 
        }
        consoleString = word + " inserted";
    }
    return consoleString;
}

async function appendWordDataOneTable(verseEditionID: number, countDict: stringToIntDict, tableName: string) {
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

async function appendWordData(verseEditionID: number, diacriticCountDict: stringToIntDict, noDiacriticCountDict: stringToIntDict) {
    let outputString = await appendWordDataOneTable(verseEditionID, diacriticCountDict, "words_diacritics");
    await appendWordDataOneTable(verseEditionID, noDiacriticCountDict, "words_no_diacritics");

    return outputString;

}

async function processOneVerseWordData(verseID: number) {
    let verseQuery = await pool.query("SELECT * FROM all_verses WHERE id = $1::int", [verseID]);
    let verseRow = verseQuery.rows[0];
    let verseBook = verseRow.book;
    
    let outputString = "";
    if (verseRow.words_first_edition.length > 1) {
        outputString = verseRow.words_first_edition[0];
    } else {
        outputString = "meow";
    }
    return outputString;
    /*
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
    let diacriticCountDictList: stringToIntDict[] = [];
    let noDiacriticWordDictList: stringToIntDict[] = [];

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
    return "mrow";
    */
}

// This function populates the 'correspondence' columns in the word tables. In words_diacritics, this is the diacritic-less version of the word; in words_no_diacritics, it's an array of all words in words_diacritics that correspond to this word
export async function populateCorrespondences() {
    console.log("Successfully called 'populating correspondences'.")
    let diacriticWordQuery = await pool.query("SELECT * FROM words_diacritics");
    let diacriticWordRows = diacriticWordQuery.rows;

    let noDiacriticWordQuery = await pool.query("SELECT * FROM words_no_diacritics");
    let noDiacriticWordRows = noDiacriticWordQuery.rows;

    let noDiacriticsReferenceList: string[] = [];
    for (let i = 0; i < noDiacriticWordRows.length; i++) {
        noDiacriticsReferenceList.push(noDiacriticWordRows[i].word);
    }

    let allDiacriticsList: string[] = [];
    let noDiacriticsWorkingList: string[] = [];
    let noDiacriticsToDiacriticsDict: stringToStringListDict = {};
    
    for (let i = 0; i < diacriticWordRows.length; i++) {
        let diacriticWord = diacriticWordRows[i].word;
        allDiacriticsList.push(diacriticWord);
        
        let noDiacriticsWord = cleanDiacriticsEngmaMarking(diacriticWord);
        if (noDiacriticsToDiacriticsDict[noDiacriticsWord] == undefined) {
            noDiacriticsToDiacriticsDict[noDiacriticsWord] = [diacriticWord];
        } else {
            noDiacriticsToDiacriticsDict[noDiacriticsWord].push(diacriticWord);
            noDiacriticsWorkingList.push(noDiacriticsWord);
        }
    }

    for (let j=0; j < allDiacriticsList.length; j++) {
        let diacriticWord = allDiacriticsList[j];
        let noDiacriticWord = cleanDiacriticsEngmaMarking(diacriticWord);

        await pool.query('UPDATE words_diacritics SET corresponding_word = $1::text WHERE word = $2::text', [noDiacriticWord, diacriticWord]);

    }

    for (let k=0; k < noDiacriticsWorkingList.length; k++) {
        let noDiacriticWord = noDiacriticsWorkingList[k];
        let diacriticWordArray = noDiacriticsToDiacriticsDict[noDiacriticWord];

        if (noDiacriticsReferenceList.includes(noDiacriticWord)) {
            await pool.query('UPDATE words_no_diacritics SET corresponding_words = $1::text[] WHERE word = $2::text', [diacriticWordArray, noDiacriticWord]);
        }
        else {
            await pool.query('INSERT INTO words_no_diacritics (word, corresponding_words) VALUES ($1::text, $2::text[])', [noDiacriticWord, diacriticWordArray]);
        }
    }
    return "Processed correspondences for " + allDiacriticsList.length.toString() + " words.";
}

async function getOldWordsInBook(editionID: string, diacriticsStrict: boolean): Promise<string[]> {

    let tableName = "book_words_no_diacritics";
    if (diacriticsStrict) {
        tableName = "book_words_diacritics";
    }
    let queryDiacritics = await pool.query("SELECT * FROM " + tableName + " WHERE textID = $1::text", [editionID]);

    let queryRows = queryDiacritics.rows;

    let allWords: string[] = [];
    for (let i = 0; i < queryRows.length; i++) {
        let word = queryRows[i].word;
        allWords.push(word);      
    }
    return allWords;
}

async function updateBookWordTable(editionID: string, removeWords: string[], addWords: string[], laxDiacritics: boolean) {

    let tableName = "book_words_no_diacritics";
    if (laxDiacritics) {
        tableName = "book_words_diacritics";
    }

    for (let i = 0; i < removeWords.length; i++) {
        await pool.query("DELETE FROM " + tableName + " WHERE word = $1::text AND textID = $2::text", [removeWords[i], editionID]);
    }

    for (let j = 0; j < addWords.length; j++) {
        await pool.query("INSERT INTO " + tableName + "(word, textID) VALUES ($1::text, $2::text)", [addWords[j], editionID]);
    }

    console.log("Removed " + removeWords.length.toString() + " words and added " + addWords.length.toString() + " words to " + editionID + " in " + tableName);

}

async function processOneBookWordTable(editionID: string, newWordList: string[], newCountDict: stringToIntDict, laxDiacritics: boolean) {

    let oldWords = await getOldWordsInBook(editionID, laxDiacritics);

    let workingWordList = newWordList;
    let workingCountDict = newCountDict;
    
    if (laxDiacritics) {
        let wordData = laxifyWordData(newWordList, newCountDict);
        workingWordList = wordData.laxWordList;
        workingCountDict = wordData.laxCountDict;
    }

    let wordData = getIntersectionAndUnion(workingWordList, oldWords);

    let addWords = wordData.list1Only;
    let removeWords = wordData.list2Only;
    let intersection = wordData.intersection;
    console.log(intersection);

    await updateBookWordTable(editionID, removeWords, addWords, laxDiacritics);
}

async function processBookWordTables(book: string, p: number, newWordList: string[], newCountDict: stringToIntDict) {
    let editionToIDDict: intToStringDict = {
        2: "-a",
        3: "-b",
        5: "-M",
        7: "-Z"
    };

    let thisEditionID = book + editionToIDDict[p];

    await processOneBookWordTable(thisEditionID, newWordList, newCountDict, true);

    let noDiacriticsWordData = laxifyWordData(newWordList, newCountDict);
    await processOneBookWordTable(thisEditionID, noDiacriticsWordData.laxWordList, noDiacriticsWordData.laxCountDict, false);
}


export async function processWordsOneText(book: string, p: number) {

    let numToColumnDict: intToStringDict = {
        2: "first_edition_raw",
        3: "second_edition_raw",
        5: "other_edition_raw",
        7: "other_edition_raw"
    };

    let numToWordsDict: intToStringDict = {
        2: "words_first_edition",
        3: "words_second_edition",
        5: "words_other_edition",
        7: "words_other_edition"
    };

    let numToCountsDict: intToStringDict = {
        2: "word_counts_first_edition",
        3: "word_counts_second_edition",
        5: "word_counts_other_edition",
        7: "word_counts_other_edition"
    }

    let allVerses: any = await pool.query("SELECT * FROM all_verses WHERE book = $1::text", [book]);
    let allRows = allVerses.rows;

    let newWordsText: string[] = [];
    let newCountsTextDict: stringToIntDict = {};

    let fixWordListDict: intToStringListDict = {};
    let fixCountListDict: intToIntListDict = {};
    for (let i = 0; i < allRows.length; i++) {
        let thisRow = allRows[i];
        let thisVerseID = thisRow.id;
        let columnText = thisRow[numToColumnDict[p]];
        let oldWordsList = thisRow[numToWordsDict[p]];
        let oldCountsList = thisRow[numToCountsDict[p]];

        let splitText = columnText.split(" ");

        let newWordsList: string[] = [];
        let newWordsToCountDict: stringToIntDict = {};
        let newCountsList: number[] = [];
        for (let j=0; j < splitText.length; j++) {
            let newWord = cleanDiacriticsEngmaMarking(splitText[j]);
            if (newWordsList.includes(newWord)) {
                newWordsToCountDict[newWord] += 1;
            } else {
                newWordsList.push(newWord);
                newWordsToCountDict[newWord] = 1;
            }
        }

        for (let k = 0; k < newWordsList.length; k++) {
            let word = newWordsList[k];
            let count = newWordsToCountDict[word];
            newCountsList.push(count);

            if (!newWordsText.includes(word)) {
                newWordsText.push(word);
                newCountsTextDict[word] = count;
            } else {
                newCountsTextDict[word] += count;
            }
        }

        if (oldWordsList != newWordsList) {
            fixWordListDict[thisVerseID] = newWordsList;
        }
        if (oldCountsList != newCountsList) {
            fixCountListDict[thisVerseID] = newCountsList;
        }
    }

    processBookWordTables(book, p, newWordsText, newCountsTextDict);
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