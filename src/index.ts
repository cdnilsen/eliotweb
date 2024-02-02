import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'
import { wordSearch } from './wordSearchMass'
import { processVerseJSON, addComparedVerses } from './textprocessor'
import { processBatchWordData, populateCorrespondences, getTotalWordCounts } from './processWords'
import { getVerseText, getChapterText } from './browseTexts'

const app = express();
app.use(express.json());
const port = process.env.PORT;

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
        let returnValue = await processVerseJSON(req.body);
        res.json(returnValue);
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
        res.json(IDList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in getAllVerseIDs');
    }
}));

app.post('/processWords', wrapAsync(async (req, res) => {
    try {
        //this seems to work...?
        let result = await processBatchWordData(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in processWords');
    }
}));

//change this to a PUT request
app.get('/compareWords/:verseID', wrapAsync(async (req, res) => {
    try {
        let verseID: number = parseInt(req.params.verseID);

        let result = await addComparedVerses(verseID, 'first_edition_raw', 'second_edition_raw');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in compareWords');
    }
}));

app.put('/populateCorrespondences', wrapAsync(async (req, res) => {
    try {
        //let result = await populateCorrespondences();
        let result = "called populateCorrespondences (fix later)";
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in populateCorrespondences');
    }
}));

app.put('/runWordCounts', wrapAsync(async (req, res) => {
    try {
        let result = await getTotalWordCounts();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in populateCorrespondences');
    }
}));


app.get('/fetchChapter/:book/:chapter/:editionNum/:useRawString', wrapAsync(async (req, res) => {
    try {
        let book: string = req.params.book;

        let chapter: number = parseInt(req.params.chapter);
        
        let editionNum: number = parseInt(req.params.editionNum);
        
        let useRawString: boolean = (req.params.useRawString === 'true');

        let resultRows = await getChapterText(book, chapter, editionNum, useRawString);
        
        res.json(resultRows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in fetchVerse');
    }
}));

app.get('/compareVerse/:verseID', wrapAsync(async (req, res) => {
    try {
        let verseID: number = parseInt(req.params.verseID);
        let rawFirst: string = 'first_edition_raw';
        let rawSecond: string = 'second_edition_raw';
        let result = await addComparedVerses(verseID, rawFirst, rawSecond);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in fetchVerse');
    }
}));

app.put('/runWordCounts', wrapAsync(async (req, res) => {
    try {
        let result = await getTotalWordCounts();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in populateCorrespondences');
    }
}));


app.get('/fetchVerse/:verseID/:editionNum/:useRawString', wrapAsync(async (req, res) => {
    try {
        let verseID: number = parseInt(req.params.verseID);
        
        let editionNum: number = parseInt(req.params.editionNum);
        
        let useRawString: boolean = (req.params.useRawString === 'true');

        let result = await getVerseText(verseID, editionNum, useRawString);
        
        res.json(result);
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

