import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT


export async function wordSearch() {
    

}


export async function addComparedVerses(idNum: number, sourceColumn1: string, sourceColumn2: string) {
    let myQuery = await pool.query('SELECT * from all_verses WHERE id=$1::int', [idNum]);
    let queryRow = myQuery.rows[0];

    let column1RawText: string = queryRow[sourceColumn1];
    let column2RawText: string = queryRow[sourceColumn2];

    return "!!!!" + column1RawText;
    /*
    let comparedTextDict = getComparedVerses(column1Text, column2Text);

    let comparedText1 = comparedTextDict['string1'];
    let comparedText2 = comparedTextDict['string2'];

    await pool.query(`UPDATE all_verses SET addresses = $1, verse_counts = $2, all_editions = $3, editionCounts = $4 WHERE word = $5`, [updatedVerseIDList, updatedVerseCountList, thisEditionList, thisEditionCountList, word]);
    */
}

