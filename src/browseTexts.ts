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

type StringToAnyDict = {
    [key: string]: any
};

type IntToAnyDict = {
    [key: number]: any
};

export async function getVerseText(verseNumber: number, useRawText: boolean, editionNumber: number)  {

    await(pool.query("SELECT * FROM all_verses WHERE id = 101003009"));
    
    return("This is a test.");
}
    //let queryRows = await pool.query("SELECT * FROM all_verses WHERE id = $1::int", [verseNumber]);
    
    //return queryRows.rows[0].id;
    
    /*
    let rawTextDict: IntToAnyDict = {
        2: queryRows.rows[0].first_edition_raw,
        3: queryRows.rows[0].second_edition_raw,
        5: queryRows.rows[0].other_edition_raw,
        7: queryRows.rows[0].other_edition_raw,
        11: queryRows.rows[0].kjv,
        13: queryRows.rows[0].grebrew
    };

    let comparedText: StringToAnyDict = {
        2: queryRows.rows[0].compared_first_edition,
        3: queryRows.rows[0].compared_second_edition,
        5: queryRows.rows[0].compared_other_edition,
        7: queryRows.rows[0].compared_other_edition,
        11: queryRows.rows[0].kjv,
        13: queryRows.rows[0].grebrew
    };

    let finalDict: StringToAnyDict = {};

    let useWhichDict: IntToAnyDict = {};

    if (useRawText) {
        useWhichDict = rawTextDict;
    } else {
        useWhichDict = comparedText;
    }

    let allTextNumbers: number[] = [2, 3, 5, 7, 11, 13];
    for (let i = 0; i < allTextNumbers.length; i++) {
        if ((editionNumber % allTextNumbers[i]) == 0) {
            finalDict[i] = useWhichDict[i]
        }
    }

    return finalDict;
}*/


    





// Default error handling middleware is fine for now

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// Async init - have to wait for the client to connect
;(async function () {
    await pool.connect()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })    
})()

