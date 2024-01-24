import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT

type editionToColumnDictType = {
    [key: string]: string
}
const editionToColumnDict: editionToColumnDictType = {
    "First Edition": "first_edition_raw",
    "Second Edition": "second_edition_raw",
    "Mayhew": "mayhew_raw",
    "Zeroth Edition": "zeroth_edition_raw",
    "KJV": "kjv",
    "Grebrew": "grebrew" // Are we even using this except in Greek?
};

async function verseUpdate(verseExists: boolean, verseID: string, verseText: string, edition: string, book: string) {
    let editionColumn = editionToColumnDict[edition];
    //Epilogues should probably be processed in some other fashion
    let consoleAddress = "";
    let chapter = 0;
    let verse = 0;
    if (verseID.endsWith("Epilogue")) {
        chapter = 999;
        verse = 1;
        consoleAddress = edition + " " + book + " epilogue";
    } else {
        chapter = parseInt(verseID.slice(4, 6));
        verse = parseInt(verseID.slice(6));
        consoleAddress = edition + " " + book + " " + verseID.slice(4, 6) + ":" + verseID.slice(6);
    }

    
    
    if (verseExists) {
        //return "verse exists in the db"
        let queryText = "UPDATE all_verses SET " + editionColumn + " = $1 WHERE id = $2";
        await pool.query(queryText, [verseText, parseInt(verseID)])
        return ( consoleAddress + " updated in database.")
    } else {
        //return "verse does not exist in the db"
        await pool.query('INSERT INTO all_verses(id, book, ' + editionColumn + ', chapter, verse) VALUES($1, $2, $3, $4, $5)', [parseInt(verseID), book, verseText, chapter, verse]);
        return (consoleAddress + " inserted into database.")
    }
}

export async function processVerseJSON(rawJSON: any) {
    //All these have been console'd and are known to work
    let idNumber = rawJSON.id;
    let rawText = rawJSON.text;
    let book = rawJSON.book;
    let edition = rawJSON.edition;
    let myQuery = await pool.query('SELECT * FROM all_verses WHERE id = $1', [parseInt(idNumber)]);
    let hasVerse = (myQuery.rows.length > 0);
    //if myQuery.rows.length > 0, then the verse already exists in the database and we want to pass `true` to 'verseExists' in verseUpdate

    let returnValue = await verseUpdate(hasVerse, idNumber, rawText, edition, book);

    return returnValue;
}
/*
    let chapter = idNumber.slice(4, 6);
    let verse = idNumber.slice(6);

    const verseEntry = await pool.query('SELECT * FROM all_verses WHERE id = $1::text', [idNumber]);
    if (verseEntry.rows.length > 0) {
        return "Verse already exists in database.";
    } else {
        return "Verse not in database";
    }
}
*/
