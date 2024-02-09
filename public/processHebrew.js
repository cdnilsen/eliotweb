//A program to process the Hebrew text from the XML files

let xmlFolder = './Hebrew XML/';
let jsonFolder = './Hebrew JSON/';

function getHapaxBook(hapaxAddress) {
    return hapaxAddress.slice(1, -1).split(" ").slice(0, -1).join(" ");
}

async function getHapaxes() {
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
    for (let book in bookToHapaxDict) {
        console.log(book);
        console.log(bookToHapaxDict[book]);
    }
}

async function processXMLLine(line, chapterCounter, verseCounter, wordCounter, finalLineText) {
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
    
    let hapaxList = await getHapaxes();

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