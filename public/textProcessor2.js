
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getVerseIDNum(bookNum, chapterNum, verseNum) {
    return bookNum.toString() + chapterNum.toString() + verseNum.toString();
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

async function processText(whichBook, whichEdition, startChapter, endChapter, textLines) {
    let numberOfVerses = await sendRawJSON(whichBook, whichEdition, startChapter, endChapter, textLines);
    console.log("processText called from " + startChapter + "to " + endChapter + ".");
    return numberOfVerses;
}

async function submitTextForProcessing(whichBook, whichEdition, myTextContainer) {
    myTextContainer.innerHTML = "";

    let startChapter = 1;
    let endChapter = 10;

    let totalVersesProcessed = 0;
    let totalChapters = bookToChapterDict[whichBook];

    let fileAddress = './texts/' + whichBook + '.' + whichEdition + '.txt';

    let file = await fetch(fileAddress);
    let fileText = await file.text();
    let textLines = fileText.split("\n");

    while (startChapter <= totalChapters || endChapter <= totalChapters) {
        let numberOfVerses = await processText(whichBook, whichEdition, startChapter, endChapter, textLines);
        totalVersesProcessed += numberOfVerses;
        startChapter += 10;
        endChapter += 10;
        await sleep(1000);
    }

    let processedTextString = "Total verses processed: " + totalVersesProcessed.toString() + "\n";

    let processedTextSpan = document.createElement('span');
    processedTextSpan.innerHTML = processedTextString;
    myTextContainer.appendChild(processedTextSpan);
}