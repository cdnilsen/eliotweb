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

export async function processVerseJSON(rawJSON: any) {
    let idNumber = rawJSON.id;
    let rawText = rawJSON.text;
    let book = rawJSON.book;
    let edition = rawJSON.edition;
    let columnString = editionToColumnDict[edition];

    let chapter = idNumber.slice(4, 6);
    let verse = idNumber.slice(6);

    const verseEntry = await pool.query('SELECT * FROM all_verses WHERE id = $1::text', [idNumber]);
    if (verseEntry.rows.length > 0) {
        return "Verse already exists in database.";
    } else {
        return "Verse not in database";
    }
}

app.post('/addRaw', wrapAsync(async (req, res) => {
    const allVerseIDs = await pool.query('SELECT * FROM all_verses')
    const allVerseIDsArray = allVerseIDs.rows;
    res.json(allVerseIDsArray);
}))