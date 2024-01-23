const pool = require('./app/db.js');

const getAllWords = async () => {
    try {
        const result = await pool.query('SELECT * FROM words');
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};

getAllWords().then((result) => {
    console.log('All words:', result);
    })
    .catch((error) => {
        console.error('Error executing query', error);
    });

module.exports = {
    getAllWords,
};

async function textFilePromise(fileName) {
    return fetch(fileName).then(response => response.text());
}

async function getBookLines(book, edition) {
    let fileName = "./texts/" + book + "." + edition + ".txt";
    let text = await textFilePromise(fileName);
    let lines = text.split("\n");
    return lines;
}

function getVerseAndRawText(line) {
    let words = line.split(" ");
    let verseAddress = words[0];
    let lineText = words.slice(1).join(" ").trim();
    return [verseAddress, lineText];
}

async function createVerseDocs(bookName) {
    let bookTextFirstEdition = await textFilePromise("./texts/" + bookName + "First Edition.txt");
    let bookTextSecondEdition = await textFilePromise("./texts/" + bookName + "Second Edition.txt");
    let bookTextKJV = await textFilePromise("./texts/" + bookName + "KJV.txt");

    firstEditionLines = bookTextFirstEdition.split("\n");
    secondEditionLines = bookTextSecondEdition.split("\n");
    kjvLines = bookTextKJV.split("\n");

    for (let i = 0; i < firstEditionLines.length; i++) {
        let processedLine = getVerseAndRawText(firstEditionLines[i]);
        let docString = "α." + bookName + (i + 1).toString();

        await setDoc(doc(db, "books", bookName), {
            name: bookName,
            title: bookName,
            chapters: chapters
        });
    }
}

async function bookUpdate() {
    getBooks().then((querySnap) => {
        console.log("num of docs:", querySnap.size);
        querySnap.docs.forEach((docSnap, index) => console.log(`doc #${index}:`, docSnap.data()));
    });
}

function appendBookData(bookSnap, parentDiv) {
    let bookData = bookSnap.data();
    let bookName = bookData.name;
    let bookTitle = bookData.title;
    let bookChapters = bookData.chapters;
    let chapterString = '<span style=color:blue">'
    
    for (let i = 0; i < bookChapters.length; i++) {
        let chapterNum = bookChapters[i].toString();
        chapterString += chapterNum + ", ";
    }
    chapterString = chapterString.slice(0, -2) + '</span>';
    let chapterSpan = document.createElement("span");
    chapterSpan.innerHTML = chapterString;

    let bookDiv = document.createElement("div");
    bookDiv.innerHTML = `<span style="color:red">${bookTitle}</span>/${bookName}</h3><br>` + chapterString;
    parentDiv.appendChild(bookDiv);
}

document.getElementById("writeString").addEventListener("click", () => {
    document.getElementById("bookList").innerHTML = "";
    let newBook = document.getElementById("sampleString").value;
    createBook(newBook);
    bookUpdate();
    getBooks().then((querySnap) => {
        console.log("num of docs:", querySnap.size);
        querySnap.docs.forEach((docSnap, index) => appendBookData(docSnap, document.getElementById("bookList")));
    });
    let url = new URL(window.location.href);
    window.history.replaceState({}, '', url);
});




/*
//Put this in a module
function cleanDiacritics(word) {
    var charReplacementDict = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "à": "a",
        "è": "e",
        "ì": "i",
        "ò": "o",
        "ù": "u",
        "â": "a",
        "ê": "e",
        "î": "i",
        "ô": "o",
        "û": "u",
        "ä": "a",
        "ë": "e",
        "ï": "i",
        "ö": "o",
        "ü": "u",
        "ã": "a",
        "õ": "o",
        "ñ": "nn",
        "m̃": "mm",
        "ũ": "u",
        "ẽ": "e",
        "ĩ": "i",
        "ā": "an",
        "ē": "en",
        "ī": "in",
        "ō": "on",
        "ū": "un"
    }

    var cleanedWord = "";
    for (var i = 0; i < word.length; i++) {
        if (word[i] in charReplacementDict) {
            cleanedWord += charReplacementDict[word[i]];
        } else {
            cleanedWord += word[i];
        }
    }
    return cleanedWord;
}

function cleanPunctuation(word) {
    let cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    cleanWord = cleanWord.replace('[', '').replace(']', '');
    return cleanWord;
}

async function textFilePromise(fileName) {
    return fetch(fileName).then(response => response.text());
}


async function getBookLines(book, edition) {
    let fileName = "./texts/" + book + "." + edition + ".txt";
    let text = await textFilePromise(fileName);
    let lines = text.split("\n");
    return lines;
}

function getWordsOneLine(line) {
    let words = line.split(" ");
    let verseAddress = words[0];
    let lineText = words.slice(1).join(" ").trim();
    let finalWords = [];
    let finalWordCountDict = {};
    for (let i = 1; i < words.length; i++) {
        let thisWord = words[i].toLowerCase();
        thisWord = cleanPunctuation(thisWord);
        if (thisWord.endsWith("\r")) {
            thisWord = thisWord.slice(0, -1);
        }
        if (! thisWord == "") {
            if (! (finalWords.includes(thisWord))) {
                finalWords.push(thisWord);
                finalWordCountDict[thisWord] = 1;
            } else {
                finalWordCountDict[thisWord] += 1;
            }
        }
    }
    return [verseAddress, finalWords, finalWordCountDict, lineText];
}

function processWordsOneLine(wordList, wordAddressDict, wordVerseCountDict, editionLetter, verseAddress, book, wordCountDict, editionWordList, editionCountDict) {
    for (let j = 0; j < wordList.length; j++) {
        let thisWord = wordList[j];
        if (! (wordAddressDict.hasOwnProperty(thisWord))) {
            wordAddressDict[thisWord] = [];
            wordVerseCountDict[thisWord] = [];
        }
        wordAddressDict[thisWord].push(editionLetter + "." + book + "." + verseAddress);
        wordVerseCountDict[thisWord].push(wordCountDict[thisWord]);

        if (! (editionWordList.includes(thisWord))) {
            editionWordList.push(thisWord);
            editionCountDict[thisWord] = wordCountDict[thisWord];
        } else {
            editionCountDict[thisWord] += wordCountDict[thisWord];
        }
    }
}

function processAllLines(lineList, lineTextDict, editionWordList, editionCountDict, wordAddressDict, wordVerseCountDict, book, editionLetter) {
    for (let i = 0; i < lineList.length; i++) {
        let processedLine = getWordsOneLine(lineList[i]);
        let verseAddress = processedLine[0];
        let allWordList = processedLine[1];
        let wordCountDict = processedLine[2];
        let lineText = processedLine[3];
        lineTextDict[verseAddress] = lineText;

        processWordsOneLine(allWordList, wordAddressDict, wordVerseCountDict, editionLetter, verseAddress, book, wordCountDict, editionWordList, editionCountDict)
    }
}

function getEditionLetter(edition) {
    let editionLetterDict = {
        "First Edition": "α",
        "Second Edition": "β",
        "Mayhew": "M",
        "Zeroth Edition": "א"
    }
    return editionLetterDict[edition];
}

async function getWordsAllLines(book, edition) {
    let editionLetter = getEditionLetter(edition);

    let lines = await getBookLines(book, edition);
    let lineTextDict = {};
    let editionWordList = [];
    let editionCountDict = {};
    let wordAddressDict = {};
    let wordVerseCountDict = {};

    processAllLines(lines, lineTextDict, editionWordList, editionCountDict, wordAddressDict, wordVerseCountDict, book, editionLetter);

    let finalDict = {
        "lineTextDict": lineTextDict,
        "editionWordList": editionWordList,
        "editionCountDict": editionCountDict,
        "wordAddressDict": wordAddressDict,
        "wordVerseCountDict": wordVerseCountDict,
        "editionLetter": editionLetter
    }
    return finalDict;
}

async function processAllEditions(book, killDiacritics=false) {
    let editionList = ["First Edition", "Second Edition"];
    
    if (book == "John" || book == "Psalms (prose)") {
        editionList.push("Mayhew");
    }

    if (book == "Genesis") {
        editionList.push("Zeroth Edition");
    }
    
    let allEditionDicts = [];
    for (let i = 0; i < editionList.length; i++) {
        let editionDict = await getWordsAllLines(book, editionList[i]);
        allEditionDicts.push(editionDict);
    }

    let finalWordList = [];
    let finalVerseDict = {};
    let finalVerseCountDict = {};
    let finalCountDict = {};
    

    for (let j = 0; j < allEditionDicts.length; j++) {
        let thisEditionDict = allEditionDicts[j];
        
        let thisEditionLineTextDict = thisEditionDict["lineTextDict"];
        let thisEditionWordList = thisEditionDict["editionWordList"];
        let thisEditionCountDict = thisEditionDict["editionCountDict"];
        let thisEditionWordAddressDict = thisEditionDict["wordAddressDict"];
        let thisEditionWordVerseCountDict = thisEditionDict["wordVerseCountDict"];
        let thisEditionLetter = thisEditionDict["editionLetter"];

        for (let k = 0; k < thisEditionWordList.length; k++) {
            let thisWord = thisEditionWordList[k];
            let finalWord = thisWord;
            if (killDiacritics) {
                finalWord = cleanDiacritics(finalWord);
            }
            if (! (finalWordList.includes(finalWord))) {
                finalWordList.push(finalWord);
                finalCountDict[finalWord] = thisEditionCountDict[thisWord];
            } else {
                finalCountDict[finalWord] += thisEditionCountDict[thisWord];
            }

            let allAddresses = thisEditionWordAddressDict[thisWord];
            let allVerseCounts = thisEditionWordVerseCountDict[thisWord];

            for (let l = 0; l < allAddresses.length; l++) {
                let thisAddress = allAddresses[l];
                let thisVerseCount = allVerseCounts[l];
                if (! (finalVerseDict.hasOwnProperty(thisAddress))) {
                    finalVerseDict[thisAddress] = [];
                    finalVerseCountDict[thisAddress] = [];
                }
                finalVerseDict[thisAddress].push(finalWord);
                finalVerseCountDict[thisAddress].push(thisVerseCount);
            }
        }
    }

    finalWordList = finalWordList.toSorted(Intl.Collator().compare);
    /*
    for (let m = 0; m < finalWordList.length; m++) {
        //console.log(finalWordList[m] + ": " + finalCountDict[finalWordList[m]]);
    }
    

    let finalDict = {};
    finalDict["wordList"] = finalWordList;
    finalDict["verseDict"] = finalVerseDict;
    finalDict["verseCountDict"] = finalVerseCountDict;
    finalDict["countDict"] = finalCountDict;

    return finalDict;
}

async function jsonReader(fileName) {
    return fetch(fileName).then(response => response.json());
}

async function printJSONOnConsole(fileName) {
    let json = await jsonReader(fileName);
    let processedJSONDict = {};

    for (let i = 0; i < json.length; i++) {
        let thisDict = json[i];
        let word = thisDict["word"];
        processedJSONDict[word] = thisDict;
    }
    return processedJSONDict;
}

async function jsonWriter(fileName, json) {
    let file = fs.open(fileName, 'w');
    await file.write(JSON.stringify(json));
    await file.close();
}


async function updateWordCountJSONs(book) {

    let bookDataDiacritics = await processAllEditions(book, false);
    let bookDataNoDiacritics = await processAllEditions(book, true);

    //console.log(bookDataDiacritics);

    let diacriticsJSON = "./wordCountDiacritics.json";
    let noDiacriticsJSON = "./wordCountNoDiacritics.json";

    jsonWriter(diacriticsJSON, bookDataDiacritics);
    jsonWriter(noDiacriticsJSON, bookDataNoDiacritics);
}

updateWordCountJSONs("Exodus"); */