import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT

app.get('/dynamicContent', (req, res) => {
    res.send(`Hi! I'm some dynamic content! You loaded this page at millisecond ${new Date().getTime()} of the UNIX 年号.`)
})

app.post('/addRaw', wrapAsync(async (req, res) => {
    const allVerseIDs = await pool.query('SELECT id FROM all_verses')
    const allVerseIDsArray = allVerseIDs.rows;
    res.json(allVerseIDsArray);
}))

app.get('/fetchBook/:book/:edition', wrapAsync(async (req, res) => {

    const outputString = "Got a request for " + req.params.book + " " + req.params.edition + ".";
    //const textAddress = "./texts/" + req.params.book + "." + req.params.edition + ".txt";

    //let bookObject = await fetch(textAddress);
    res.json(outputString);
}))

app.get('/words', wrapAsync(async (req, res) => {
    const words = await pool.query('SELECT * FROM test_table')
    res.json(words.rows)
}))

app.put('/words/:word/increment', wrapAsync(async (req, res) => {
    const update = await pool.query('UPDATE words_diacritics SET total_count = total_count + 1 WHERE word = $1::text', [req.params.word])
    res.json(update)
}))

app.post('/words/:word', wrapAsync(async (req, res) => {
    // TODO: check if the word already exists and return a good error
    const insert = await pool.query("INSERT INTO words_diacritics VALUES ($1::text, 0)", [req.params.word])
    res.json(insert)
}))

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

