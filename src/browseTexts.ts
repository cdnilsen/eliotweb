import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT
/*
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
*/
type StringToAnyDict = {
    [key: string]: any
};

type IntToAnyDict = {
    [key: number]: any
};

type stringToStringDict = {
    [key: string]: string
}

type IntToStringListDict = {
    [key: number]: string[]
};

const editionToColumnRawDict: stringToStringDict = {
    "First Edition": "first_edition_raw",
    "Second Edition": "second_edition_raw",
    "Mayhew": "other_edition_raw",
    "Zeroth Edition": "other_edition_raw",
    "KJV": "kjv",
    "Grebrew": "grebrew" // Are we even using this except in Greek?
};

const editionToColumnComparedDict: stringToStringDict = {
    "First Edition": "first_edition_compared",
    "Second Edition": "second_edition_compared",
    "Mayhew": "other_edition_raw",
    "Zeroth Edition": "other_edition_compared",
    "KJV": "kjv",
    "Grebrew": "grebrew"
}

//Since this gets used in getChapterText, it really needs to be rewritten as a function

function verseFetcher(queryRow: any, editionNumber: number) {

    let textDict: IntToAnyDict = {
        2: queryRow.first_edition_raw,
        3: queryRow.second_edition_raw,
        5: queryRow.other_edition_raw,
        11: queryRow.kjv,
        13: queryRow.grebrew
    };

    let finalVerseDict: StringToAnyDict = {};

    let allTextNumbers: number[] = [2, 3, 5, 11, 13];
    for (let k = 0; k < allTextNumbers.length; k++) {
        let p = allTextNumbers[k];
        if ((editionNumber % p) == 0 && textDict[p] != null) {
            finalVerseDict[p] = textDict[p]
        } else {
            finalVerseDict[p] = "";
        }
    }
    return finalVerseDict;
}

export async function getVerseText(dbCode: number, editionNumber: number)  {
    let queryRows = await pool.query("SELECT * FROM all_verses WHERE id = $1::int", [dbCode]);

    return verseFetcher(queryRows.rows[0], editionNumber);
}

//Should probably turn this into a function that can get all the verses from *any* group of rows...also needs to include verse numbers!
export async function getChapterText(book: string, chapter: number, editionNumber: number) {
    
    let queryRows = await pool.query('SELECT * FROM all_verses WHERE book = $1::text AND chapter = $2::int', [book, chapter]);

    let queryRowsLength = Math.max(queryRows.rows.length, 1);

    queryRows.rows.sort((a: any, b: any) => a.id - b.id);

    let finalDict: IntToStringListDict = {
        101: [queryRowsLength.toString()] //a nice prime number
    };

    for (let j = 0; j < queryRowsLength; j++) {
        let thisRow = queryRows.rows[j];
        let thisVerseDict = verseFetcher(thisRow, editionNumber);
        let thisVerseKeyList = Object.keys(thisVerseDict);
        thisVerseKeyList.sort((a, b) => parseInt(a) - parseInt(b));
        for (let k = 0; k < thisVerseKeyList.length; k++) {
            let thisKey = parseInt(thisVerseKeyList[k]);
            if (thisKey in finalDict && thisVerseDict[thisKey] != "") {
                finalDict[thisKey].push(thisVerseDict[thisKey]);
            } else if (thisVerseDict[thisKey] != "") {
                finalDict[thisKey] = [thisVerseDict[thisKey]];
            } else {
                finalDict[thisKey] = [""];
            }
        }
    }
    return finalDict;
}