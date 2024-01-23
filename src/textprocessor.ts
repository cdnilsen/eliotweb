import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT

app.get('/fetchBook/:book/:edition', wrapAsync(async (req, res) => {
    const book = req.query.book;
    const edition = req.query.edition;
    let textAddress = "./texts/" + book + "." + edition + ".txt";

    let bookObject = await fetch(textAddress);
    res.json(bookObject);
}))

app.get('/processText', wrapAsync(async (req, res) => {
    const words = await pool.query('SELECT * FROM test_table')
    res.json(words.rows)
}))

app.use(express.static('public'))

// Async init - have to wait for the client to connect
;(async function () {
    await pool.connect()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })    
})()