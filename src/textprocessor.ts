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

async function verseUpdate(verseExists: boolean, verseID: string, verseText: string, editionColumn: string, book: string) {

    if (verseExists) {
        let queryText = "UPDATE all_verses SET " + editionColumn + " = $1 WHERE id = $2";
        await pool.query(queryText, [verseText, parseInt(verseID)])
    } else {
        let queryText = "INSERT INTO all_verses (id, " + editionColumn + ", book) VALUES ?";
        await pool.query(queryText, [parseInt(verseID), verseText, book]);
    }
}

export async function processVerseJSON(rawJSON: any) {
    let idNumber = rawJSON.id;
    let rawText = rawJSON.text;
    let book = rawJSON.book;
    let edition = rawJSON.edition;
    let columnString = editionToColumnDict[edition];
    let myQuery = await pool.query('SELECT * from all_verses WHERE id = $1', [parseInt(idNumber)]);

    //if myQuery.rows.length > 0, then the verse already exists in the database and we want to pass `true` to 'verseExists' in verseUpdate
    await verseUpdate((myQuery.rows.length > 0), idNumber, rawText, columnString, book);

    return myQuery.rows;
    let chapter = idNumber.slice(4, 6);
    let verse = idNumber.slice(6);

    const verseEntry = await pool.query('SELECT * FROM all_verses WHERE id = $1::text', [idNumber]);
    if (verseEntry.rows.length > 0) {
        return "Verse already exists in database.";
    } else {
        return "Verse not in database";
    }
}
