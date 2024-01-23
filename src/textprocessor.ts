import express from "express"
import path from "path"

import { default as pool } from './db'
import { wrapAsync } from './utils'

const app = express()
const port = process.env.PORT

app.get('/processText', wrapAsync(async (req, res) => {
    const words = await pool.query('SELECT * FROM test_table')
    res.json(words.rows)
}))