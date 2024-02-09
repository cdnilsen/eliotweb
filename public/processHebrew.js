//A program to process the Hebrew text from the XML files

let xmlFolder = './Hebrew XML/';
let jsonFolder = './Hebrew JSON/';

function processXMLLine(line, chapterCounter, verseCounter, wordCounter) {
    let lineType = line[1];
    let lineText = line.slice(3, -4);
    console.log(line);
    console.log(lineText);
}

function lineProcessBool(line) {
    let lineType = line[1];
    let relevantTags = ['c', 'v', 'w', 'k', 'q'];
    if (relevantTags.includes(lineType) && line[2] == ">") {
        return true;
    } else {
        return false;
    }
}

async function processBook(bookName) {
    let bookXML = await fetch(xmlFolder + bookName + '.xml');
    let bookXMLText = await bookXML.text();
    let bookLines = bookXMLText.split('\n');

    let allLineDict = {};
    for (let i = 0; i < bookLines.length; i++) {
        let xmlLine = bookLines[i].trim();
        
        let currentChapter = 0;
        let currentVerse = 0;
        let currentWord = 0;
        
        if (lineProcessBool(xmlLine)) {
            processXMLLine(xmlLine, currentChapter, currentVerse, currentWord);
        }
    }
}

document.getElementById("submit").addEventListener("click", async function() {
    event.preventDefault();
    let bookName = document.getElementById("dropdown").value;

    await processBook(bookName);
});