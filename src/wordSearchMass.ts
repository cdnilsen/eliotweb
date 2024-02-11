import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT


// Numerical code for search settings: 2 = is exactly, 3 = contains, 5 = starts with, 7 = ends with. 11 = search in Massachuett, 13 = search in English (only Massachusett right now). 17 = clean the diacritics
export async function wordSearch(searchString: string, searchSetting: number) {

    let table = 'words_diacritics'
    if (searchSetting % 17 == 0) {
        table = 'words_no_diacritics'
    }

    let queryString = "SELECT * FROM " + table + " WHERE "

    if (searchSetting % 2 == 0) { // is exactly
        queryString += "word = $1::text"
    } else if (searchSetting % 3 == 0) { // contains (placeholder)
        queryString = "word = kah"
    } else if (searchSetting % 5 == 0) {
        queryString += "starts_with($1::text, word)"
    } else if (searchSetting % 7 == 0) { //  ends with
        queryString = "word = kah"
    }

    let allQuery = await pool.query(queryString, [searchString]);

    return allQuery.rows;
}


