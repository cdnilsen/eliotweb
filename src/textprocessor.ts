import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT

app.get('', wrapAsync(async (req, res) => {
}))

app.post('/addRaw/:json', wrapAsync(async (req, res) => {
    const allVerseIDs = await pool.query('SELECT id FROM all_verses')
    const allVerseIDsArray = allVerseIDs.rows;
    res.json(allVerseIDsArray);
}))

app.put('/words/:word/increment', wrapAsync(async (req, res) => {
    const update = await pool.query('UPDATE words_diacritics SET total_count = total_count + 1 WHERE word = $1::text', [req.params.word])
    res.json(update)
}))

app.get('/fetchBook/:book/:edition', wrapAsync(async (req, res) => {
    const textAddress = "./texts/" + req.params.book + "." + req.params.edition + ".txt";

    let bookObject = await fetch(textAddress);
    res.json(bookObject);
}))

app.use(express.static('public'))

// Async init - have to wait for the client to connect
;(async function () {
    await pool.connect()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })    
})()