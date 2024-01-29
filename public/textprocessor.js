
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
    let chapterIDNum = chapter;
    if (chapterIDNum.length == 1) {
        chapterIDNum = "00" + chapterIDNum;
    } else if (chapterIDNum.length == 2) {
        chapterIDNum = "0" + chapterIDNum;
    }
    return chapterIDNum;
}

function verseString(verse) {
    let verseIDNum = verse;
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

async function getRawVerseDict(book, edition, startChapter, endChapter) {
    let fileAddress = './texts/' + book + "." + edition + ".txt";

    let file = await fetch(fileAddress);
    let fileText = await file.text();
    let textLines = fileText.split("\n");
    let verseDict = {};
    let bookNum = bookNumberString(book);
    for (let i = 0; i < textLines.length; i++) {
        let line = textLines[i];
        if (line == "") {
            continue;
        }
        let splitLine = line.split(" ");
        let splitAddress = splitLine[0].split(".");
        let chapter = splitAddress[0];
        if (parseInt(chapter) >= startChapter && parseInt(chapter) <= endChapter) {
            let verse = splitAddress[1];
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


async function sendRawJSON(book, edition, startChapter, endChapter) {
    let verseDict = await getRawVerseDict(book, edition, startChapter, endChapter);
    let allKeyList = Object.keys(verseDict);
    for (let i = 0; i < allKeyList.length; i++) {
        let verseNum = allKeyList[i];
        let verseJSON = {"id": verseNum, "text": verseDict[verseNum], "edition": edition, "book": book};
        console.log(verseNum + ": " + verseDict[verseNum]);
        fetch('/addRaw', {
            method: 'POST',
            body: JSON.stringify(verseJSON),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
    }
    return allKeyList.length;
}

async function processText(whichBook, whichEdition, startChapter, endChapter) {
    let numberOfVerses = await sendRawJSON(whichBook, whichEdition, startChapter, endChapter);
    return numberOfVerses;
}

document.getElementById('submit').addEventListener("click", async function() {
    document.getElementById("text-container").innerHTML = "";
    let whichBook = bookDropdown.value;
    let startChapter = 1;
    let endChapter = 10;
    let whichEdition = document.getElementById('searchEditionDropdown').value;

    let totalVersesProcessed = 0;
    let numberOfVerses = 1; //dummy value
    while (numberOfVerses > 0) {
        numberOfVerses = await processText(whichBook, whichEdition, startChapter, endChapter);
        totalVersesProcessed += numberOfVerses;
        startChapter += 10;
        endChapter += 10;
    }

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
    document.getElementById("text-container").innerHTML = "";
    let allIDList = await getAllVerseIDs();
    allIDList = allIDList.sort();
    let allIDLength = allIDList.length;
    
    
    let startingIndex = 0;
    let endingIndex = 49;
    while (startingIndex <= allIDLength) {
        let myIDList = allIDList.slice(startingIndex, endingIndex);
    
        fetch('/processWords', {
            method: 'POST',
            body: JSON.stringify(myIDList),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
        
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