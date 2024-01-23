import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT


export async function processVerseJSON(rawJSON: any) {

    let idNumber = rawJSON.id;
    let rawText = rawJSON.text;
    let book = rawJSON.book;
    let chapter = idNumber.slice(4, 7);
    let verse = idNumber.slice(7);
    console.log(chapter.toString() + ":" + verse.toString());
}
app.post('/addRaw', wrapAsync(async (req, res) => {
    const allVerseIDs = await pool.query('SELECT * FROM all_verses')
    const allVerseIDsArray = allVerseIDs.rows;
    res.json(allVerseIDsArray);
}))