import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT


export async function addRaw(rawJSON: any) {


}
app.post('/addRaw', wrapAsync(async (req, res) => {
    const allVerseIDs = await pool.query('SELECT * FROM all_verses')
    const allVerseIDsArray = allVerseIDs.rows;
    res.json(allVerseIDsArray);
}))