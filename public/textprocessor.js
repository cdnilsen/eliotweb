
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

const pentateuchList = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy"
];

const historicalList = [
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
    "Esther"
];

const wisdomList = [
    "Job",
    "Psalms (prose)",
    //"Psalms (metrical)", Will require a separate process
    "Proverbs",
    "Ecclesiastes",
    "Song of Songs"
];

const prophetsList = [
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

const epistlesList = [
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
    "Jude"
]

const otherNTList = [
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
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

/*
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

document.getElementById('process_words').addEventListener("click", async function() {
    //document.getElementById("text-container").innerHTML = "";
    let allIDList = await getAllVerseIDs();
    //allIDList = allIDList.sort();
    let allIDLength = allIDList.length;

    let startingIndex = 0;
    let endingIndex = 50;

    while (startingIndex <= allIDLength) {
        let myIDList = allIDList.slice(startingIndex, endingIndex); // works when logged
        fetch('/processWords', {
            method: 'POST',
            body: JSON.stringify(myIDList),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => {
            console.log(res[0].toString() + " worked!");
        }).catch(err => console.log(err));
        startingIndex += 50;
        endingIndex += 50;
    }
    //console.log(howManyFailed.toString() + " JSONs failed of "+ howManyTotal.toString());
    let newSpan = document.createElement('span');
    newSpan.innerHTML = allIDLength.toString() + " verses processed.\n";

    sleep(500);
    /*
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
*/

async function getAllVerseIDs() {
    let allVerseIDs = await fetch("/getAllVerseIDs").then(res => res.json()).then(res => res).catch(err => console.error(err));
    console.log("Number of verse IDs: " + allVerseIDs.length.toString());

    return allVerseIDs;
}

async function runCorrespondences() {
    document.getElementById("text-container").innerHTML = "";
    /*
    let allIDList = await getAllVerseIDs();
    allIDList = allIDList.sort();
    let allIDLength = allIDList.length;

    let startingIndex = 0;
    let endingIndex = 50;

    while (startingIndex <= allIDLength) {
        let myIDList = allIDList.slice(startingIndex, endingIndex); // works when logged
        fetch('/processWords', {
            method: 'POST',
            body: JSON.stringify(myIDList),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => {
            //console.log(res[0].toString() + " worked!");
        }).catch(err => console.log(err));
        startingIndex += 50;
        endingIndex += 50;
    }

    //console.log(howManyFailed.toString() + " JSONs failed of "+ howManyTotal.toString());
    let newSpan = document.createElement('span');
    newSpan.innerHTML = allIDLength.toString() + " verses processed.\n";

    sleep(500);
    */
    fetch('/populateCorrespondences', {
        method: 'PUT',
        body: JSON.stringify({"dummy": 0}),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
    
    //document.getElementById("text-container").appendChild(newSpan);
}

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
        console.log(verseJSON);
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

function cleanPunctuation(word) {
    let finalWord = word;
    finalWord = finalWord.replace(/[.,\/#!%\^&\*?;:{}=\_`~()]/g, '');
    return finalWord;
}

function getKJVDictList(verseIDList, verseDict) {
    let finalWordList = [];
    let wordToVerseIDDict = {};
    let wordToVerseCountDict = {};
    let wordToTotalCountDict = {};
    for (let i = 0; i < verseIDList.length; i++) {
        let verseWordList = [];
        let thisVerseWordToCountDict = {};
        let verseID = parseInt(verseIDList[i]);
        let verseText = verseDict[verseID];
        let wordList = verseText.split(" ");
        for (let j=0; j < wordList.length; j++) {
            let word = wordList[j];
            word = cleanPunctuation(word).toLowerCase();
            if (verseWordList.includes(word)) {
                thisVerseWordToCountDict[word] += 1;
            } else {
                verseWordList.push(word);
                thisVerseWordToCountDict[word] = 1;
            }
        }
        for (let k=0; k < verseWordList.length; k++) {
            let word = verseWordList[k];
            if (wordToVerseIDDict[word]) {
                wordToVerseIDDict[word].push(verseID);
                wordToVerseCountDict[word].push(thisVerseWordToCountDict[word]);
                wordToTotalCountDict[word] += thisVerseWordToCountDict[word];
            } else {
                wordToVerseIDDict[word] = [verseID];
                wordToVerseCountDict[word] = [thisVerseWordToCountDict[word]];
                wordToTotalCountDict[word] = thisVerseWordToCountDict[word];
            }
            finalWordList.push(word);
        }
    }

    let finalDictList = [];
    for (let i = 0; i < finalWordList.length; i++) {
        let thisWord = finalWordList[i];
        let thisWordDict = {};
        thisWordDict["word"] = thisWord;
        thisWordDict["verseIDs"] = wordToVerseIDDict[thisWord];
        thisWordDict["verseCounts"] = wordToVerseCountDict[thisWord];
        thisWordDict["totalCount"] = wordToTotalCountDict[thisWord];
        finalDictList.push(thisWordDict);
        /*
        console.log(typeof thisWordDict["word"]);
        console.log(typeof thisWordDict["verseIDs"]);
        console.log(typeof thisWordDict["verseIDs"][0]);
        console.log(typeof thisWordDict["verseCounts"]);
        console.log(typeof thisWordDict["verseCounts"][0]);
        console.log(typeof thisWordDict["totalCount"]);
        */
    }
    return finalDictList;
}

async function createKJVJSON(bookName) {
    let book = await fetch('./texts/' + bookName + '.KJV.txt');
    let bookText = await book.text();
    let bookTextLines = bookText.split("\n");

    let verseDict = await getRawVerseDict(bookName, 1, bookToChapterDict[bookName], bookTextLines);

    let allVerseIDList = Object.keys(verseDict);
    allVerseIDList.sort();

    let verseDictList = getKJVDictList(allVerseIDList, verseDict);
    let startingIndex = 0;
    let endingIndex = 1;
    while (startingIndex <= verseDictList.length) {
        let thisDictList = verseDictList.slice(startingIndex, endingIndex);
        fetch('/updateKJV', {
            method: 'POST',
            body: JSON.stringify(thisDictList),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
        startingIndex += 1;
        endingIndex += 1;
        sleep(250);
    }
}

async function processText(whichBook, whichEdition, startChapter, endChapter, textLines) {
    let numberOfVerses = 0;
    
    numberOfVerses = await sendRawJSON(whichBook, whichEdition, startChapter, endChapter, textLines);
    console.log("processText called from " + startChapter + "to " + endChapter + ".");

    return numberOfVerses;
}

async function submitTextForProcessing(whichBook, whichEdition, myTextContainer) {
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
        console.log("Processed from chapter " + startChapter.toString() + " to " + endChapter.toString() + " of " + whichBook + " (" + whichEdition + ").");
    }

    let processedTextString = "Total verses processed: " + totalVersesProcessed.toString() + "\n";

    let processedTextSpan = document.createElement('span');
    processedTextSpan.innerHTML = processedTextString;
    myTextContainer.innerHTML = "";
    myTextContainer.appendChild(processedTextSpan);
}

function createDropdown(id) {
    let newDropdown = document.createElement('select');
    newDropdown.id = id;
    newDropdown.classList.add("dropdown");
    return newDropdown;
}

function addListToDropdown(dropdown, list, addBlank) {
    if (addBlank) {
        let blankOption = document.createElement('option');
        blankOption.text = "";
        blankOption.value = "";
        dropdown.add(blankOption);
    }

    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let option = document.createElement('option');
        option.text = item;
        option.value = item;
        dropdown.add(option);
    }
}

function createDropdownFromList(dropdownID, list, addBlank=true) {
    let dropdown = createDropdown(dropdownID);
    addListToDropdown(dropdown, list, addBlank);
    return dropdown;
}

//These have to be created *outside* the function
let actionChoicesDiv = document.getElementById("action-choices");

let selectSectionDiv = document.createElement('div');
selectSectionDiv.id = "select-section-div";
    
let selectBookDiv = document.createElement('div');
selectBookDiv.id = "select-book-div";

let selectEditionDiv = document.createElement('div');
selectEditionDiv.id = "select-edition-div";

let submitButton = document.createElement('button');
submitButton.id = "submit";
submitButton.hidden = true;

actionChoicesDiv.appendChild(selectSectionDiv);
actionChoicesDiv.appendChild(selectBookDiv);
actionChoicesDiv.appendChild(selectEditionDiv);
actionChoicesDiv.appendChild(submitButton);

async function getBookIDList(book) {
    let bookIDList = await fetch("/getAllBookIDs/" + book).then(res => res.json()).then(res => res).catch(err => console.error(err));

    return bookIDList;
}

async function runEditionVocab(whichBook, whichEdition, myTextContainer) {
    document.getElementById("text-container").innerHTML = "";
    
    fetch('/processWordsBook/' + whichBook + "/" + whichEdition, {
        method: 'POST',
        body: JSON.stringify({"dummy": 0}),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        for (let i = 0; i < res.length; i++) {
            let thisText = res[i];
            let thisTextSpan = document.createElement('span');
            thisTextSpan.innerHTML = thisText + "<br>";
            myTextContainer.appendChild(thisTextSpan);
        }

    }).catch(err => console.log(err));    
}

async function createDropdownChain(includeEdition, includesKJV) {
    let whichSectionLabel = document.createElement('span');
    whichSectionLabel.innerHTML = "Select a section of the Bible: ";

    selectSectionDiv.appendChild(whichSectionLabel);

    let sectionNameList = ["Pentateuch", "Historical Books", "Wisdom Books", "Prophets", "New Testament (not epistles)", "New Testament (epistles)"];

    let whichSectionDropdown = createDropdownFromList("which-section-dropdown", sectionNameList, true);

    let selectBookDropdown = createDropdown("bookDropdown");
    selectBookDropdown.hidden = true;

    let selectEditionDropdown = createDropdown("editionDropdown");
    selectEditionDropdown.hidden = true;

    selectSectionDiv.appendChild(whichSectionDropdown);
    actionChoicesDiv.appendChild(selectSectionDiv);

    let originalLanguage = "";

    let textContainerDiv = document.getElementById("text-container");
    textContainerDiv.innerHTML = "";

    let whichBook = "";
    let whichEdition = "";

    whichSectionDropdown.addEventListener("change", function() {
        selectBookDropdown.innerHTML = "";
        selectEditionDropdown.innerHTML = "";

        selectBookDiv.innerHTML = "";
        selectEditionDiv.innerHTML = "";
        submitButton.innerHTML = "";
        submitButton.hidden = true;

        let whichBookLabel = document.createElement('span');
        whichBookLabel.innerHTML = "Select a book: ";
        selectBookDiv.appendChild(whichBookLabel);

        let sectionToBookListDict = {
            "Pentateuch": pentateuchList,
            "Historical Books": historicalList,
            "Wisdom Books": wisdomList,
            "Prophets": prophetsList,
            "New Testament (not epistles)": otherNTList,
            "New Testament (epistles)": epistlesList
        };

        let whichSection = whichSectionDropdown.value;

        let bookList = sectionToBookListDict[whichSection];

        addListToDropdown(selectBookDropdown, bookList, true);

        if (whichSection == "New Testament (not epistles)" || whichSection == "New Testament (epistles)") {
            originalLanguage = "Greek";
        } else {
            originalLanguage = "Hebrew";
        }

        selectBookDiv.appendChild(selectBookDropdown);
        selectBookDropdown.hidden = false;

        actionChoicesDiv.appendChild(selectBookDiv);

        textContainerDiv.innerHTML = "";

        if (includeEdition) {
            selectBookDropdown.addEventListener("change", function() {
                selectEditionDropdown.innerHTML = "";

                selectEditionDiv.innerHTML = "";
                submitButton.innerHTML = "";
                submitButton.hidden = true;
            
                let editionsList = ["First Edition", "Second Edition"];

                if (selectBookDropdown.value == "Genesis") {
                    editionsList.push("Zeroth Edition");
                } else if (selectBookDropdown.value == "Psalms (prose)" || selectBookDropdown.value == "John") {
                    editionsList.push("Mayhew");
                }

                if (includesKJV) {
                    editionsList.push("KJV");
                }

                //editionsList.push(originalLanguage);

                addListToDropdown(selectEditionDropdown, editionsList, true);
                selectEditionDropdown.hidden = false;

                let whichEditionLabel = document.createElement('span');
                whichEditionLabel.innerHTML = "Select an edition: ";
                selectEditionDiv.appendChild(whichEditionLabel);

                selectEditionDiv.appendChild(selectEditionDropdown);

                actionChoicesDiv.appendChild(selectEditionDiv);

                textContainerDiv.innerHTML = "";
                
                whichBook = selectBookDropdown.value;

                selectEditionDropdown.addEventListener("change", function() {
                    submitButton.innerHTML = "<b>Submit</b>";
                    submitButton.hidden = false;
                    actionChoicesDiv.appendChild(submitButton);
                    
                    whichEdition = selectEditionDropdown.value;

                    textContainerDiv.innerHTML = "";
                    submitButton.hidden = false;
                    submitButton.innerHTML = "<b>Submit</b>";
                    submitButton.addEventListener("click", async function() {
                        if (includeEdition && includesKJV) {
                            await submitTextForProcessing(whichBook, whichEdition, textContainerDiv);
                        } else if (includeEdition) {
                            let bookToPrimeDict = {
                                "First Edition": "2",
                                "Second Edition": "3",
                                "Mayhew": "5",
                                "Zeroth Edition": "7"
                            }
                            console.log("Hello! You've called runEditionVocab!");
                            await runEditionVocab(whichBook, bookToPrimeDict[whichEdition], textContainerDiv);
                        }
                    });
                });
            });
        } else {
            // runs the comparator
            selectBookDropdown.addEventListener("change", function() {
                selectEditionDropdown.innerHTML = "";

                selectEditionDiv.innerHTML = "";
                submitButton.innerHTML = "";
                //submitButton.hidden = true;

                //textContainerDiv.innerHTML = "";
                
                whichBook = selectBookDropdown.value;
                console.log(whichBook);
                //textContainerDiv.innerHTML = "";
                selectEditionDropdown.innerHTML = "";
                submitButton.hidden = false;
                actionChoicesDiv.appendChild(submitButton);
                submitButton.addEventListener("click", async function() {
                    let allVerseIDList = await (getBookIDList(whichBook));

                    let numOfIDs = allVerseIDList.length;
                    allVerseIDList = allVerseIDList.sort();
                    //console.log(allVerseIDList);

                    let startingIndex = 0;
                    let endingIndex = 50;

                    let unsuccessfulIDs = [0];
                    while (startingIndex <= numOfIDs || endingIndex <= numOfIDs) {
                        for (let i = startingIndex; i < endingIndex; i++) {
                            let verseID = allVerseIDList[i];
                            fetch('/compareVerse/' + verseID.toString(), {
                                method: 'PUT',
                                body: JSON.stringify({"dummy": 0}),
                                headers: {
                                "Content-type": "application/json; charset=UTF-8"
                                }
                            }).then(res => res.json()).then(res => res).catch(err => {
                                unsuccessfulIDs.push(verseID);
                                console.error(err);
                            });
                            sleep(50);     
                        }
                        startingIndex += 50;
                        endingIndex += 50;
                    }
                    console.log(unsuccessfulIDs);
                    return;
                });
            });
        }
    });
}


async function processTextPopulateHTML() {
    await createDropdownChain(true, true);
}

async function processTextComparisons() {
    await createDropdownChain(false, false);
}

function getRadioSelection() {
    let allRadioButtons = document.getElementsByName("action");
    let radioList = Array.from(allRadioButtons);
    for (let i = 0; i < radioList.length; i++) {
        if (radioList[i].checked) {
            return radioList[i].value;
        }
    }
}

async function processWordsOneText() {
    await createDropdownChain(true, false);
}

async function callRadioFunction(whichAction) {
    if (whichAction == "processAText") {
        await processTextPopulateHTML();
    } else if (whichAction == "compareVerses") {
        await processTextComparisons();
    } else if (whichAction == "runCorrespondences") {
        await runCorrespondences();
    } else if (whichAction == "processWordsOneText") {
        await processWordsOneText();
    }
}

function addActionButtonLegend() {
    let whichAction = getRadioSelection();

    let actionToButtonLegendDict = {
        "processAText": "Process a Text",
        "compareVerses": "Compare Verses",
        "runCorrespondences": "Run Correspondences",
        "processWordsOneText": "Process Words in a Text",
        "runWordCounts": "Run All Word Counts"
    };

    document.getElementById("pickActionLegend").innerHTML = actionToButtonLegendDict[whichAction];
}

window.addEventListener("DOMContentLoaded", () => {
    addActionButtonLegend();
});

let allRadioButtons = document.getElementsByName("action");
let radioButtonsList = Array.from(allRadioButtons);

for (let i = 0; i < radioButtonsList.length; i++) {
    radioButtonsList[i].addEventListener("change", function() {
        document.getElementById("action-choices").innerHTML = "";
        document.getElementById("text-container").innerHTML = "";
        addActionButtonLegend();
    });
}



document.getElementById('pickAction').addEventListener("click", async function() {
    document.getElementById("text-container").innerHTML = "";
    document.getElementById("action-choices").innerHTML = "";
    let whichAction = getRadioSelection();
    await callRadioFunction(whichAction);
});