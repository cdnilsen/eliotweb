import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'
import { wordSearch } from './wordSearchMass'
import { addRawVerseText } from './textprocessor'
import { processBatchWordData, processWordsOneText, populateCorrespondences, getTotalWordCounts } from './processWords'
import { getVerseText, getChapterText } from './browseTexts'

//const express = require('express');
const app = express();
const port = process.env.PORT || 8000; // Use your preferred port

// Middleware to parse JSON bodies
app.use(express.json());
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
        console.log("Hello!");
        console.log(req.body);
        //res.json(req.body);
        let returnValue = await addRawVerseText(req.body);
        res.json(returnValue);
        //processVerseJSON(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error in addRaw');
    }
}));