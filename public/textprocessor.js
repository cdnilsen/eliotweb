
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

async function getRawVerseDict(book, edition) {
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
        let verse = splitAddress[1];
        let lineText = splitLine.slice(1).join(" ");
        try {
            let verseIDNum = getVerseIDNum(bookNum, chapterString(chapter), verseString(verse));
            verseDict[verseIDNum] = lineText;
        } catch (err) {
            console.log("Error: " + line);
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendRawJSON(book, edition) {
    let verseDict = await getRawVerseDict(book, edition);
    //let stringifiedDict = JSON.stringify(verseDict);
    let allKeyList = Object.keys(verseDict);
    for (let i = 0; i < allKeyList.length; i++) {
        let verseNum = allKeyList[i];
        let verseJSON = {"id": verseNum, "text": verseDict[verseNum], "edition": edition, "book": book};
        //console.log(verseJSON);
        /*fetch('/test', {
            method: 'POST',
            body: JSON.stringify(verseJSON),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));*/
        sleep(100);
        fetch('/addRaw', {
            method: 'POST',
            body: JSON.stringify(verseJSON),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).then(res => console.log(res)).catch(err => console.error(err));
    }
}


async function processText(whichBook, whichEdition) {
    sendRawJSON(whichBook, whichEdition)

    //fetch('/fetchBook/' + whichBook + "/" + whichEdition).then(res => res.json()).then(res => console.log(typeof res)).catch(err => console.error(err));
    /*
    let fileAddress = './texts/' + whichBook + "." + whichEdition + ".txt";

    let backendAddress = '/fetchBook/' + whichBook + "/" + whichEdition;

    fetch(backendAddress).then(res => res.json()).then(res => {
        let fileObject = res;
    

        //Currently fetching all text from frontend. We probably want all this to occur in the backend ASAP
        let fileText = fileObject.text();
        let textLines = fileText.split("\n");

        let bookNum = bookNumberString(whichBook);
        //let editionNum = editionNumberString(whichEdition);

        for (let i = 0; i < textLines.length; i++) {
            let line = textLines[i];
            if (line == "") {
                continue;
            }
            let splitLine = line.split(" ");
            let address = splitLine[0];
            let splitAddress = address.split(".");
            let chapter = splitAddress[0];
            let verse = splitAddress[1];

            let verseIDNum = getVerseIDNum(bookNum, chapterString(chapter), verseString(verse));
            console.log(verseIDNum);
        }
    }).catch(err => console.error(err));

    //Each verse's ID key should be a numerical string generated from its book. The metrical psalms are just weird and will need to be treated separately.
    //E.g., Exodus 12.13 will be 102012013: dummy 1, followed by 02 (Exodus), followed by 012 (chapter 12), followed by 013 (verse 13).

    //TODO for other texts like Mayhew's translation of Cotton. Those'll probably be e.g. 201, 202...
    
    fetch('/processText').then(res => res.json()).then(res => {

    }).catch(err => console.error(err));
    */
}

document.getElementById('submit').addEventListener("click", function() {
    let whichBook = bookDropdown.value;
    //clean this up later
    let whichEdition = document.getElementById('searchEditionDropdown').value;

    processText(whichBook, whichEdition);
});
    