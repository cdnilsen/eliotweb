import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'
import { wordSearch } from './wordSearchMass'
import { processVerseJSON, addComparedVerses, addComparedBook, addComparedChapter } from './textprocessor'
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

app.get('/getAllBookIDs/:book', wrapAsync(async (req, res) => {
    try {
        let book: string = req.params.book;
        let query = await pool.query('SELECT * FROM all_verses WHERE book = $1::text', [book]);
        let IDList: number[] = [];
        query.rows.forEach((row: any) => {
            IDList.push(row.id);
        });
        res.json(IDList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in getAllBookIDs');
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
app.put('/compareVerse/:verseID', wrapAsync(async (req, res) => {
    try {
        let verseID: number = parseInt(req.params.verseID);

        let result = await addComparedVerses(verseID, 'first_edition_raw', 'second_edition_raw', 'compared_first_edition', 'compared_second_edition');
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


app.get('/fetchChapter/:book/:chapter/:editionNum', wrapAsync(async (req, res) => {
    try {
        let book: string = req.params.book;

        let chapter: number = parseInt(req.params.chapter);
        
        let editionNum: number = parseInt(req.params.editionNum);
        
        let resultRows = await getChapterText(book, chapter, editionNum);
        
        res.json(resultRows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in fetchVerse');
    }
}));

app.put('/compareVerse/:verseID', wrapAsync(async (req, res) => {
    try {
        let verseID: number = parseInt(req.params.verseID);
        let rawFirst: string = 'first_edition_raw';
        let rawSecond: string = 'second_edition_raw';
        
        let comparedFirst: string = 'compared_first_edition';
        let comparedSecond: string = 'compared_second_edition';

        let result = await addComparedVerses(verseID, rawFirst, rawSecond, comparedFirst, comparedSecond);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in fetchVerse');
    }
}));

app.put('/compareChapter/:book/:chapter', wrapAsync(async (req, res) => {
    try {
        let book: string = req.params.book;
        let chapter: number = parseInt(req.params.chapter);

        let rawFirst: string = 'first_edition_raw';
        let rawSecond: string = 'second_edition_raw';

        let comparedFirst: string = 'compared_first_edition';
        let comparedSecond: string = 'compared_second_edition';

        let result = await addComparedChapter(book, chapter, rawFirst, rawSecond, comparedFirst, comparedSecond);
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


app.get('/fetchVerse/:verseID/:editionNum', wrapAsync(async (req, res) => {
    try {
        let verseID: number = parseInt(req.params.verseID);
        
        let editionNum: number = parseInt(req.params.editionNum);

        let result = await getVerseText(verseID, editionNum);
        
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

type wordSearchDict = {
    // Word, verses, word counts in each verse, and total count
    [key: string]: string | number[] | number
}

type searchDictList = wordSearchDict[];

app.get('/getWords/:searchString/:searchSetting', wrapAsync(async (req, res) => {
    let searchString: string = req.params.searchString;

    let searchSetting: string = req.params.searchSetting;

    let matchingWordRows = await wordSearch(searchString, parseInt(searchSetting));

    let outputList: searchDictList  = [];

    for (let i = 0; i < matchingWordRows.length; i++) {
        let row = matchingWordRows[i];
        let outputDict: wordSearchDict = {};

        outputDict["word"] = row.word;
        outputDict["totalCount"] = row.total_count;
        outputDict["allVerses"] = row.addresses;
        outputDict["allVerseCounts"] = row.verse_counts;
        outputList.push(outputDict);
    }

    res.json(outputList);
    
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

