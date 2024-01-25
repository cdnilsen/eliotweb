import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'
import { wordSearch } from './wordSearchMass'
import { processVerseJSON } from './textprocessor'
import { processBatchWordData } from './processWords'

const app = express();
app.use(express.json());
const port = process.env.PORT

app.get('/dynamicContent', (req, res) => {
    res.send(`Hi! I'm some dynamic content! You loaded this page at millisecond ${new Date().getTime()} of the UNIX 年号.`)
})

app.post('/test', wrapAsync(async (req, res) => {
    try {
        res.json('hi!');
    } catch (error) {
        console.error(error);
    }
}))

app.post('/addRaw', wrapAsync(async (req, res) => {
    try {
        //console.log(req.body);
        //res.json(req.body);
        let outcome = await processVerseJSON(req.body);
        res.json(outcome);
        //processVerseJSON(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in addRaw');
    }
}));

app.post('/getAllVerseIDs', wrapAsync(async (req, res) => {
    try {
        let query = await pool.query('SELECT * FROM all_verses');
        let IDList: number[] = [];
        query.rows.forEach((row: any) => {
            IDList.push(row.id);
        });
        res.json(IDList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in getAllVerseIDs');
    }
}));

app.post('/processWords', wrapAsync(async (req, res) => {
    try {
        let outcome = await processBatchWordData(req.body);
        res.json(outcome);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in processWords');
    }
}));


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

