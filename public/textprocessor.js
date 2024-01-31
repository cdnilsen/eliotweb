
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
    "Psalms (prose)",
    //"Psalms (metrical)", Will require a separate process
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
    "Malachi", 
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation"
];

const bookToChapterDict = {
    "": 0,
    "Genesis": 50,
    "Exodus": 40,
    "Leviticus": 27,
    "Numbers": 36,
    "Deuteronomy": 34,
    "Joshua": 24,
    "Judges": 21,
    "Ruth": 4,
    "1 Samuel": 31,
    "2 Samuel": 24,
    "1 Kings": 22,
    "2 Kings": 25,
    "1 Chronicles": 29,
    "2 Chronicles": 36,
    "Ezra": 10,
    "Nehemiah": 13,
    "Esther": 10,
    "Job": 42,
    "Psalms (prose)": 150,
    "Psalms (metrical)": 150,
    "Proverbs": 31,
    "Ecclesiastes": 12,
    "Song of Songs": 8,
    "Isaiah": 66,
    "Jeremiah": 52,
    "Lamentations": 5,
    "Ezekiel": 48,
    "Daniel": 12,
    "Hosea": 14,
    "Joel": 3,
    "Amos": 9,
    "Obadiah": 1,
    "Jonah": 4,
    "Micah": 7,
    "Nahum": 3,
    "Habakkuk": 3,
    "Zephaniah": 3,
    "Haggai": 2,
    "Zechariah": 14,
    "Malachi": 4,
    "Matthew": 28,
    "Mark": 16,
    "Luke": 24,
    "John": 21,
    "Acts": 28,
    "Romans": 16,
    "1 Corinthians": 16,
    "2 Corinthians": 13,
    "Galatians": 6,
    "Ephesians": 6,
    "Philippians": 4,
    "Colossians": 4,
    "1 Thessalonians": 5,
    "2 Thessalonians": 3,
    "1 Timothy": 6,
    "2 Timothy": 4,
    "Titus": 3,
    "Philemon": 1,
    "Hebrews": 13,
    "James": 5,
    "1 Peter": 5,
    "2 Peter": 3,
    "1 John": 5,
    "2 John": 1,
    "3 John": 1,
    "Jude": 1,
    "Revelation": 22
};

function getBookToNumDict(bookList) {
    let finalDict = {};
    for (let i = 0; i < bookList.length; i++) {
        let book = bookList[i];
        finalDict[book] = i + 1;
    }
    return finalDict;
}

function bookNumberString(book) {
    let finalString = "1";
    let bookIDNum = getBookToNumDict(allBookList)[book].toString();
    if (bookIDNum.length == 1) {
        bookIDNum = "0" + bookIDNum;
    }
    return finalString + bookIDNum;
}

//This is probably not going to be needed, but here just in case
function editionNumberString(edition){
    let finalString = "";
    if (edition == "First Edition") {
        finalString = "1";
    } else if (edition == "Second Edition") {
        finalString = "2";
    } else if (edition == "Zeroth Edition") {
        finalString = "0";
    } else if (edition == "Mayhew") {
        finalString = "3";
    }
    return finalString;
}

function chapterString(chapter) {
    let chapterIDNum = chapter.toString();
    if (chapterIDNum.length == 1) {
        chapterIDNum = "00" + chapterIDNum;
    } else if (chapterIDNum.length == 2) {
        chapterIDNum = "0" + chapterIDNum;
    }
    return chapterIDNum;
}

function verseString(verse) {
    let verseIDNum = verse.toString();
    if (verseIDNum.length == 1) {
        verseIDNum = "00" + verseIDNum;
    } else if (verseIDNum.length == 2) {
        verseIDNum = "0" + verseIDNum;
    }
    return verseIDNum;
}

function getVerseIDNum(bookNum, chapterNum, verseNum) {
    return bookNum.toString() + chapterNum.toString() + verseNum.toString();
}

let bookDropdown = document.getElementById("searchBookDropdown");
let blankOption = document.createElement('option');
blankOption.text = "";
blankOption.value = "";
bookDropdown.add(blankOption);

for (let i = 0; i < allBookList.length; i++) {
    let book = allBookList[i];
    let bookOption = document.createElement('option');
    bookOption.text = book;
    bookOption.value = book;
    bookDropdown.add(bookOption);
}

let editionDropdownContainer = document.getElementById("edition-dropdown-container");

bookDropdown.addEventListener("change", function() {

    //editionDropdownContainer.innerHTML = "";
    let editionDropdown = document.getElementById('searchEditionDropdown');
    editionDropdown.innerHTML = "";
    document.getElementById("searchEditionLegend").hidden = false;
    editionDropdown.hidden = false;

    let blankOption = document.createElement('option');
    blankOption.text = "";
    blankOption.value = "";
    editionDropdown.add(blankOption);

    let editionList = ["First Edition", "Second Edition"];

    if (bookDropdown.value == "Genesis") {
        editionList.push("Zeroth Edition");
    }

    if (bookDropdown.value == "Psalms (prose)" || bookDropdown.value == "John") {
        editionList.push("Mayhew");
    }

    editionList.push("KJV");

    for (let i = 0; i < editionList.length; i++) {
        let edition = editionList[i];
        let editionOption = document.createElement('option');
        editionOption.text = edition;
        editionOption.value = edition;
        editionDropdown.add(editionOption);
    }
    editionDropdownContainer.hidden = false;
});

document.getElementById('searchEditionDropdown').addEventListener("change", function() {
    document.getElementById("submit").hidden = false;
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRawVerseDict(book, startChapter, endChapter, textLines) {
    let verseDict = {};
    let bookNum = bookNumberString(book);
    for (let i = 0; i < textLines.length; i++) {
        let line = textLines[i];
        if (line == "") {
            continue;
        }
        let splitLine = line.split(" ");
        let splitAddress = splitLine[0].split(".");
        let chapter = parseInt(splitAddress[0]);
        if (chapter >= startChapter && chapter <= endChapter) {
            let verse = parseInt(splitAddress[1]);
            let lineText = splitLine.slice(1).join(" ");
            try {
                let verseIDNum = getVerseIDNum(bookNum, chapterString(chapter), verseString(verse));
                verseDict[verseIDNum] = lineText;
            } catch (err) {
                console.log("Error: " + line);
            }
            sleep(200);
        }
    }
    return verseDict;
}

async function sendADict(myDict, routeString) {
    fetch(routeString, {
        method: 'POST',
        body: JSON.stringify(myDict),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
}


async function sendRawJSON(book, edition, startChapter, endChapter, textLines) {
    let verseDict = await getRawVerseDict(book, startChapter, endChapter, textLines);
    let allKeyList = Object.keys(verseDict);
    for (let i = 0; i < allKeyList.length; i++) {
        let verseNum = allKeyList[i];
        let verseJSON = {"id": verseNum, "text": verseDict[verseNum], "edition": edition, "book": book};
        //console.log(verseNum + ": " + verseDict[verseNum]);
        fetch('/addRaw', {
            method: 'POST',
            body: JSON.stringify(verseJSON),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
    }
    //console.log("Finished sending raw JSON from chapter " + startChapter.toString() + " to " + endChapter.toString() + " of " + book + " (" + edition + ").");
    return allKeyList.length;
}

async function processText(whichBook, whichEdition, startChapter, endChapter, textLines) {
    let numberOfVerses = await sendRawJSON(whichBook, whichEdition, startChapter, endChapter, textLines);
    console.log("processText called from " + startChapter + "to " + endChapter + ".");
    return numberOfVerses;
}

document.getElementById('submit').addEventListener("click", async function() {
    document.getElementById("text-container").innerHTML = "";
    let whichBook = bookDropdown.value;
    let startChapter = 1;
    let endChapter = 10;
    let whichEdition = document.getElementById('searchEditionDropdown').value;

    let totalVersesProcessed = 0;
    console.log(bookToChapterDict[whichBook]);

    let fileAddress = './texts/' + whichBook + "." + whichEdition + ".txt";

    let file = await fetch(fileAddress);
    let fileText = await file.text();
    let textLines = fileText.split("\n");
    
    while (startChapter <= bookToChapterDict[whichBook] || endChapter <= bookToChapterDict[whichBook]) {
        let numberOfVerses = await processText(whichBook, whichEdition, startChapter, endChapter, textLines);
        totalVersesProcessed += numberOfVerses;
        //console.log("Processed from chapter " + startChapter.toString() + " to " + endChapter.toString() + " of " + whichBook + " (" + whichEdition + ").");
        startChapter += 10;
        endChapter += 10;
    }
    
    //numberOfVerses = await processText(whichBook, whichEdition, 11, 20);

    let processedTextString = "Total verses processed: " + totalVersesProcessed.toString() + "\n";

    let processedTextSpan = document.createElement('span');
    processedTextSpan.innerHTML = processedTextString;
    document.getElementById("text-container").appendChild(processedTextSpan);
});

async function getAllVerseIDs() {
    let allVerseIDs = await fetch("/getAllVerseIDs").then(res => res.json()).then(res => res).catch(err => console.error(err));

    return allVerseIDs;
}

document.getElementById('process_words').addEventListener("click", async function() {
    //document.getElementById("text-container").innerHTML = "";
    let allIDList = await getAllVerseIDs();
    //allIDList = allIDList.sort();
    let allIDLength = allIDList.length;
    console.log(allIDLength.toString());
    
    let startingIndex = 0;
    let endingIndex = 50;
    while (startingIndex <= allIDLength) {
        let myIDList = allIDList.slice(startingIndex, endingIndex);
        console.log(myIDList);
        fetch('/processWords', {
            method: 'POST',
            body: JSON.stringify(myIDList),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => {
            console.log(res);
            //for (let i = 0; i < res.length; i++) {
            //}
        }).catch(err => console.error(err));
        
        //console.log("Processed " +  endingIndex.toString() + "/" + allIDLength.toString() + " verses.");
        
        startingIndex += 50;
        endingIndex += 50;
    }
    let newSpan = document.createElement('span');
    newSpan.innerHTML = allIDLength.toString() + " verses processed.\n";

    sleep(500);

    fetch('/populateCorrespondences', {
        method: 'PUT',
        body: JSON.stringify({"dummy": 0}),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));

    document.getElementById("text-container").appendChild(newSpan);
});


document.getElementById('run_word_counts').addEventListener("click", async function() {
    fetch('/runWordCounts', {
        method: 'PUT',
        body: JSON.stringify({"dummy": 0}),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
});