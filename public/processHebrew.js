//A program to process the Hebrew text from the XML files

let xmlFolder = './Hebrew XML/';
let fs = require('fs');
let path = require('path');
let jsonFolder = './Hebrew JSON/';

async function processBook(bookName) {
    let xmlPath = path.join(xmlFolder, bookName + '.xml');
    let xmlData = fs.readFileSync(xmlPath, 'utf8');
    let jsonData = await xml2json(xmlData);
    for (let i = 0; i < jsonData.length; i++) {
        let xmlLine = jsonData[i];
        console.log(xmlLine.strip());
    }
}

document.getElementById("dropdown").addEventListener("change", async function() {
    let bookName = this.value;

    await processBook(bookName);
});