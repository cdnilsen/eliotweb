import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'
import { wordSearch } from './wordSearchMass'
import { processVerseJSON } from './textprocessor'
import { processBatchWordData, populateCorrespondences, getTotalWordCounts } from './processWords'

import { getVerseText } from './browseTexts'

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
        await processVerseJSON(req.body);

        //processVerseJSON(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in addRaw');
    }
}));

app.get('/getAllVerseIDs', wrapAsync(async (req, res) => {
    try {
        let query = await pool.query('SELECT * FROM all_verses');
        let IDList: number[] = [];
        query.rows.forEach((row: any) => {
            IDList.push(row.id);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in getAllVerseIDs');
    }
}));

app.post('/processWords', wrapAsync(async (req, res) => {
    try {
        await processBatchWordData(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in processWords');
    }
}));

app.put('/populateCorrespondences', wrapAsync(async (req, res) => {
    try {
        await populateCorrespondences();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in populateCorrespondences');
    }
}));

app.put('/runWordCounts', wrapAsync(async (req, res) => {
    try {
        await getTotalWordCounts();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in populateCorrespondences');
    }
}));


app.get('/fetchVerse/:verseID/:editionNumber/:useRawString', wrapAsync(async (req, res) => {
    try {
        let verseID: number = parseInt(req.params.verseID);
        let editionNumber: number = parseInt(req.params.editionNumber);
        let useRawString: boolean = (req.params.useRawString === 'true');

        let verseTextDict = await getVerseText(verseID, useRawString, editionNumber);
        res.json(verseTextDict);

        //res.json((verseID.toString() + ": " + editionNumber.toString() + ": " + useRawText.toString()));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in fetchVerse');
    }
}));


app.get('/fetchBook/:book/:edition', wrapAsync(async (req, res) => {

    const outputString = "Got a request for " + req.params.book + " " + req.params.edition + ".";
    //const textAddress = "./texts/" + req.params.book + "." + req.params.edition + ".txt";

    //let bookObject = await fetch(textAddress);
    res.json(outputString);
}));

app.get('/words', wrapAsync(async (req, res) => {
    const words = await pool.query('SELECT * FROM test_table')
    res.json(words.rows)
}));

app.put('/words/:word/increment', wrapAsync(async (req, res) => {
    await pool.query('UPDATE words_diacritics SET total_count = total_count + 1 WHERE word = $1::text', [req.params.word])
    
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

