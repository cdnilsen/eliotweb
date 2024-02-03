import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT;

//Go through this file later and use the $1::int type enforcement on queries

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

function getVerseText(rawWordsList: string[]): string {
    return rawWordsList.join(" ");
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


function processEngma(word: string, edition: string, book: string, chapter: number, verse: number): string {
    
    let wordCopy = word;
    if (wordCopy.endsWith('ŋ')) {
        let chapterString = chapter.toString();
        let verseString = verse.toString();
        wordCopy = wordCopy.slice(0, -1) + "Ŋ";
        console.log(`!!! CHECK ${word} AT ${edition} ${book} ${chapterString}:${verseString}`);
    }
    
    let labialEngmaClusters = ['ŋp', 'ŋb', 'ŋm', 'ŋf'];

    let replacementLabialClusters = ['mp', 'mb', 'mm', 'mf'];

    for (let i = 0; i < labialEngmaClusters.length; i++) {
        wordCopy = wordCopy.split(labialEngmaClusters[i]).join(replacementLabialClusters[i]);
    }
    wordCopy = wordCopy.split('ŋ').join('n')
    return wordCopy;
}

function cleanDiacriticsEngma(word: string, edition: string, book: string, chapter: number, verse: number): string {

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
        "ã": "aŋ",
        "õ": "oŋ",
        "ñ": "nn",
        "m̃": "mm",
        "ũ": "uŋ",
        "ẽ": "eŋ",
        "ĩ": "iŋ",
        "ā": "aŋ",
        "ē": "eŋ",
        "ī": "iŋ",
        "ō": "oŋ",
        "ū": "uŋ"
    };

    let cleanedWord = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i] in charReplacementDict) {
            cleanedWord += charReplacementDict[word[i]];
        } else {
            cleanedWord += word[i];
        }
    }
    return processEngma(cleanedWord, edition, book, chapter, verse);
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
        let queryText = "UPDATE all_verses SET " + editionColumn + " = $1 WHERE id = $2::int";
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

function findLongestCommonSubstring(str1: string, str2: string): string {
    //(courtesy of GeeksForGeeks) 
    let longestSubstring = ""; 
    for (let i = 0; i < str1.length; i++) { 
        for (let j = 0; j < str2.length; j++) { 
            let substring = ""; 
            let x = i; 
            let y = j; 
            while (x < str1.length &&  
                   y < str2.length &&  
                   str1[x] === str2[y]) { 
                substring += str1[x]; 
                x++;
                y++;
            } 
            if (substring.length > longestSubstring.length) { 
                longestSubstring = substring; 
            } 
        } 
    } 
    return longestSubstring; 
}

function findDifferences(string1: string, string2: string): string[] {
    let longestSubstringMoreThanOne: boolean = false;

    while (longestSubstringMoreThanOne == false) {
        let longestSubstring = findLongestCommonSubstring(string1, string2);
        if (longestSubstring.length == 1) {
            longestSubstringMoreThanOne = true;
            break;
        }

        let shreddedSubstring1 = "";
        let shreddedSubstring2 = "";

        for (let i = 0; i < longestSubstring.length; i++) {
            shreddedSubstring1 += longestSubstring[i] + "ϥ";
            shreddedSubstring2 += longestSubstring[i] + "ϣ";
        }

        shreddedSubstring1 = "›" + shreddedSubstring1.slice(0, -1) + "‹";
        shreddedSubstring2 = "»" + shreddedSubstring2.slice(0, -1) + "«";

        //replaceAll needed just in case the longest substring is found more than once
        string1 = string1.split(longestSubstring).join(shreddedSubstring1);
        string2 = string2.split(longestSubstring).join(shreddedSubstring2);
    }
    return [string1, string2];
}

function getDifferenceList(myString: string, bracketList: stringToStringDict): string[] {
    let leftBracket = bracketList['left'];
    let rightBracket = bracketList['right'];

    let newString = leftBracket + myString + rightBracket;

    newString = newString.split(leftBracket).join(leftBracket + "¡");
    newString = newString.split(rightBracket).join("¡" + rightBracket);

    return newString.split("¡");
}

function cleanSpuriousTags(word: string): string {
    let myString = word;
    myString = myString.split("Ƀβ").join("");
    myString = myString.split("Řř").join("");
        
    myString = myString.split("Ƀ{β").join("{");
    myString = myString.split("Ř{ř").join("{");
    myString = myString.split("Ƀ}").join("}");
    myString = myString.split("Ř}ř").join("}");

    return myString;
}

function getComparedVerses(string1: string, string2: string): stringToStringDict {
    //These were previously just two-member lists, but this is more human-readable
    let string1BracketDict: stringToStringDict = {
        'left': '‹',
        'right': '›'
    }

    let string2BracketDict: stringToStringDict = {
        'left': '«',
        'right': '»'
    }

    let processedStrings = findDifferences(string1, string2);

    let string1List = getDifferenceList(processedStrings[0], string1BracketDict);
    let string2List = getDifferenceList(processedStrings[1], string2BracketDict);

    let finalStringList1: string[] = [];
    let finalStringList2: string[] = [];

    for (let i = 0; i < string1List.length; i++) {
        let substring1 = string1List[i];
        let substring2 = string2List[i];

        let testSubstring1 = substring1.split("‹").join("");
        testSubstring1 = testSubstring1.split("›").join("");

        let testSubstring2 = substring2.split("«").join("");
        testSubstring2 = testSubstring2.split("»").join("");

        if (testSubstring1 != testSubstring2 && testSubstring1.toLowerCase() == testSubstring2.toLowerCase()) {
            /*
            let firstCharSubstring1 = (testSubstring1[0] == "‹")
            let firstCharSubstring2 = (testSubstring2[0] == "«")

            let lastCharSubstring1 = (testSubstring1[testSubstring1.length - 1] == "›")
            let lastCharSubstring2 = (testSubstring2[testSubstring2.length - 1] == "»")
            */

            substring1 = substring1.split("‹").join("Ƀ");
            substring1 = substring1.split("›").join("β");

            substring2 = substring2.split("«").join("Ƀ");
            substring2 = substring2.split("»").join("β");
            /*
            if (firstCharSubstring1) {
                substring1 = "Ƀ" + substring1;
            }

            if (firstCharSubstring2) {
                substring2 = "Ƀ" + substring2;
            }

            if (lastCharSubstring1) {
                substring1 += "β";
            }

            if (lastCharSubstring2) {
                substring2 += "β";
            }
            */
        } else {
            /*
            let firstCharSubstring1 = (testSubstring1[0] == "‹")
            let firstCharSubstring2 = (testSubstring2[0] == "«")

            let lastCharSubstring1 = (testSubstring1[testSubstring1.length - 1] == "›")
            let lastCharSubstring2 = (testSubstring2[testSubstring2.length - 1] == "»")
            */

            substring1 = substring1.split("‹").join("Ř");
            substring1 = substring1.split("›").join("ř");

            substring2 = substring2.split("«").join("Ř");
            substring2 = substring2.split("»").join("ř");
            /*
            if (firstCharSubstring1) {
                substring1 = "Ř" + substring1;
            }

            if (firstCharSubstring2) {
                substring2 = "Ř" + substring2;
            }

            if (lastCharSubstring1) {
                substring1 += "ř";
            }

            if (lastCharSubstring2) {
                substring2 += "ř";
            }
            */
        }
        finalStringList1.push(substring1);
        finalStringList2.push(substring2);
    }

    let finalString1 = "";
    let finalString2 = "";
    for (let i = 0; i < finalStringList1.length; i++) {
        finalString1 += finalStringList1[i];
        finalString2 += finalStringList2[i];
    }

    finalString1 = finalString1.split("ϥ").join("");
    finalString2 = finalString2.split("ϣ").join("");

    finalString1 = cleanSpuriousTags(finalString1);
    finalString2 = cleanSpuriousTags(finalString2);

    let finalStringDict: stringToStringDict = {
        'string1': finalString1,
        'string2': finalString2
    }
    
    return finalStringDict;
}

export async function addComparedVerses(idNum: number, sourceColumn1: string, sourceColumn2: string, comparedColumn1: string, comparedColumn2: string) {

    let getRowQuery = await pool.query('SELECT * from all_verses WHERE id=$1::int', [idNum]);
    let queryRow = getRowQuery.rows[0];

    let column1RawText: string = queryRow[sourceColumn1];
    let column2RawText: string = queryRow[sourceColumn2];

    
    let comparedTextDict = getComparedVerses(column1RawText, column2RawText);

    let comparedText1 = comparedTextDict['string1'];
    let comparedText2 = comparedTextDict['string2'];

    await pool.query(`UPDATE all_verses SET ${comparedColumn1} = $1, ${comparedColumn2} = $2 WHERE id = $3::int`, [comparedText1, comparedText2, idNum]);

    return("Verse #" + idNum.toString() + " has been compared and updated.");
}

export async function addComparedChapter(book: string, chapter: number, sourceColumn1: string, sourceColumn2: string, comparedColumn1: string, comparedColumn2: string) {

    let getRowQuery = await pool.query('SELECT * from all_verses WHERE book=$1 AND chapter=$2::int', [book, chapter]);

    let queryRows = getRowQuery.rows;

    let queryLength = queryRows.length;

    let allIDList: number[] = [];
    for (let k = 0; k < queryLength; k++) {
        allIDList.push(queryRows[k].id);
    }

    for (let i = 0; i < queryLength; i++) {
        let idNum = queryRows[i].id;
        let column1RawText: string = queryRows[i][sourceColumn1];
        let column2RawText: string = queryRows[i][sourceColumn2];

        let comparedTextDict = getComparedVerses(column1RawText, column2RawText);

        let comparedText1 = comparedTextDict['string1'];
        let comparedText2 = comparedTextDict['string2'];

        await pool.query(`UPDATE all_verses SET ${comparedColumn1} = $1, ${comparedColumn2} = $2 WHERE id = $3::int`, [comparedText1, comparedText2, idNum]);
    }

    return("Chapter " + chapter.toString() + " of " + book + " has been compared and updated.");

}

export async function addComparedBook(book: string, sourceColumn1: string, sourceColumn2: string, comparedColumn1: string, comparedColumn2: string) {
    let getRowQuery = await pool.query('SELECT * from all_verses WHERE book=$1', [book]);
    let queryRows = getRowQuery.rows;

    let queryLength = queryRows.length;

    let allIDList: number[] = [];
    for (let k = 0; k < queryLength; k++) {
        allIDList.push(queryRows[k].id);
    }

    let startingIndex = 0;
    let endingIndex = 50;

    while (startingIndex <= queryLength || endingIndex <= queryLength) {
        for (let i = startingIndex; i < endingIndex; i++) {
            let idNum = queryRows[i].id;
            let column1RawText: string = queryRows[i][sourceColumn1];
            let column2RawText: string = queryRows[i][sourceColumn2];

            let comparedTextDict = getComparedVerses(column1RawText, column2RawText);

            let comparedText1 = comparedTextDict['string1'];
            let comparedText2 = comparedTextDict['string2'];

            await pool.query(`UPDATE all_verses SET ${comparedColumn1} = $1, ${comparedColumn2} = $2 WHERE id = $3::int`, [comparedText1, comparedText2, idNum]);
        }
        startingIndex += 50;
        endingIndex += 50;
    }
    return("Book " + book + " has been compared and updated.");
}

