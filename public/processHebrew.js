//A program to process the Hebrew text from the XML files

let xmlFolder = './Hebrew XML/';
let jsonFolder = './Hebrew JSON/';

const allBookList = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Songs",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi"
];

function getHapaxBook(hapaxAddress) {
    return hapaxAddress.slice(1, -1).split(" ").slice(0, -1).join(" ");
}

// This works and its results have added to OTHapaxList.txt. However, it's still here in case we need to fetch it again.
async function populateHapaxes() {
    let hapaxFile = await fetch('OT Hapaxes.txt');
    let hapaxText = await hapaxFile.text();
    let textLines = hapaxText.split('\n');


    let bookToHapaxDict = {};

    for (let i = 0; i < textLines.length; i++) {
        let line = textLines[i];
        if (line[0] == "[") {
            let lineList = textLines[i].split('\t');

            let book = getHapaxBook(lineList[0]);

            if (!(book in bookToHapaxDict)) {
                bookToHapaxDict[book] = [];
            }
            
            //There are no doublets, I checked
            let hapax = lineList[1];
            bookToHapaxDict[book].push(hapax);
        }
    }
    let outputDiv = document.getElementById("output");
    for (let i = 0; i < allBookList.length; i++) {
        if (!(allBookList[i] in bookToHapaxDict)) {
            console.log(allBookList[i] + " not in dictionary")
            bookToHapaxDict[allBookList[i]] = [];
        } else {
            let thisBookDiv = document.createElement("div");
            
            let thisBookSpan = document.createElement("span");
            thisBookSpan.innerHTML = allBookList[i] + " | ";

            let allWordsSpan = document.createElement("span");
            let allWordsString = "";
            for (let j = 0; j < bookToHapaxDict[allBookList[i]].length; j++) {
                allWordsString += bookToHapaxDict[allBookList[i]][j] + ", ";
            }
            allWordsSpan.innerHTML = allWordsString;

            thisBookDiv.appendChild(thisBookSpan);
            thisBookDiv.appendChild(allWordsSpan);

            outputDiv.appendChild(thisBookDiv);
        }
    }
    
}

async function getRightHapaxes(book) {
    let allHapaxFile = await fetch('./OTHapaxList.txt');
    let allHapaxText = await allHapaxFile.text();
    let bookList = allHapaxText.split('\n');

    let thisLine = "";
    for (let i = 0; i < bookList.length; i++) {
        let strippedLine = bookList[i].split(" | ")
        if (strippedLine[0].trim() == book) {
            thisLine = strippedLine[1];
            break;
        }
    }
    console.log(thisLine.split(","));
    return thisLine.split(",");
}

async function processXMLLine(line, book, chapterCounter, verseCounter, wordCounter, finalLineText) {
    //console.log(line);
    let lineType = line[1];

    if (lineType == 'c') {
        chapterCounter++;
        verseCounter = 0;
    } else if (lineType == 'v') {
        verseCounter++;
        wordCounter = 0;
    } else {
        let lineText = line.slice(3, -4);

        //let isHapax = isHapax(lineText);

        let hasSofPasuk = (lineText.endsWith("׃"));
        
        let wordSpace = " ";
        if (hasSofPasuk) {
            lineText = lineText.slice(0, -1);
            wordSpace = "׃";
        }

        if (lineType == 'w') {
            wordCounter++;
            finalLineText += lineText + wordSpace;
        }
        if (lineType == 'k') {
            wordCounter++;
            finalLineText += "<K>" + lineText;
        }

        if (lineType == 'q') {
            wordCounter++;
            finalLineText += "<Q>" + lineText + "</Q></K>" + wordSpace;
        }
    }
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
    
    let hapaxList = await getRightHapaxLine(bookName);

    for (let i = 0; i < bookLines.length; i++) {
        let xmlLine = bookLines[i].trim();
        
        let currentChapter = 0;
        let currentVerse = 0;
        let currentWord = 0;
        
        if (lineProcessBool(xmlLine)) {
            processXMLLine(xmlLine, bookName, currentChapter, currentVerse, currentWord);
        }
    }
}

document.getElementById("submit").addEventListener("click", async function() {
    event.preventDefault();
    let bookName = document.getElementById("dropdown").value;

    await processBook(bookName);
});