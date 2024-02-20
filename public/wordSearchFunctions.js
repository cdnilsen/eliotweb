export const topBookList = [
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

function createTriangle(unclickedColor, clickedColor) {
    let triangle = document.createElement('span');
    triangle.name = "triangle";
    triangle.innerHTML = " ▶";
    triangle.style.color = unclickedColor;
    triangle.style.cursor = "pointer";
    triangle.addEventListener('click', function() {
        if (triangle.innerHTML === " ▶") {
            triangle.innerHTML = " ▼";
            triangle.style.color = clickedColor;
        } else {
            triangle.innerHTML = " ▶";
            triangle.style.color = unclickedColor;
        }
    });
    return triangle;
}

export function addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak=true) {
    let triangle = createTriangle(unclickedColor, clickedColor);
    parentContainer.appendChild(triangle);
    if (addBreak) {
        let breakSpan = document.createElement('br');
        parentContainer.appendChild(breakSpan);
    }
    return triangle;
}

export function addChildToExistingTriangle(parentContainer, parentTriangle, childContainer) {
    parentContainer.appendChild(childContainer);
    childContainer.hidden = true;
    parentTriangle.addEventListener('click', function() {
        childContainer.hidden = !childContainer.hidden;
    });
}

function rightPlural (count, singular, plural=undefined) {
    if (count == undefined) {
        count = 0;
    }
    if (count == 1) {
        return singular;
    } else if (plural == undefined) {
        return singular + "s";
    } else {
        return plural;
    }
}

export function getHeaderText(wordCount, tokenCount, sortAlphabetical, headerString) {

    let useToken = sortAlphabetical;
    if (headerString == "8" && sortAlphabetical) {
        headerString = "ꝏ̄";
    }

    let wordOrWords = rightPlural(wordCount, "word");

    let tokenOrTokens = rightPlural(tokenCount, "token");

    if (useToken) {
        return "<u><b><i>" + headerString + "</i></b></u> (" + wordCount.toString() + " " + wordOrWords + ", " + tokenCount.toString() + " total " + tokenOrTokens + ")";
    } else {
        return "<u><i><b>" + headerString + "</b> " + tokenOrTokens + "</i></u> ("  + wordCount.toString() + " " + wordOrWords + ")";
    }
}

export function getBooks(verseList, verseCount, word) {
    let allBooks = [];
    let dictOfDicts = {};
    for (let i = 0; i < verseList.length; i++) {
        let thisVerseDict = decodeVerseCode(verseList[i], verseCount[i], word);
        let bookNum = thisVerseDict["bookNum"];

        if (dictOfDicts[bookNum] === undefined) {
            dictOfDicts[bookNum] = [thisVerseDict];
            allBooks.push(bookNum);
        } else {
            dictOfDicts[bookNum].push(thisVerseDict);
        }
    }
    allBooks.sort((a, b) => a - b);
    return [allBooks, dictOfDicts];
}

function getAddressString(dbNum) {
    let stringAddress = dbNum.toString().slice(3);
  
    let chapter = parseInt(stringAddress.slice(0, 3));
    let verse = parseInt(stringAddress.slice(3));

    let finalAddress = chapter.toString() + ":" + verse.toString();
    return '<span class="verse-click" style="text-decoration: underline dotted;">' + finalAddress + '</span>'
}

function getVerseCiteSpans(verseList, dictOfDicts, bookName) {
    let allVerseTextList = [];
    for (let i=0; i < verseList.length; i++) {
        let verse = verseList[i];
        let verseData = dictOfDicts[verse];
        let editionNum = verseData["allEditions"];

        if (bookName == "Genesis") {
            editionNum *= 11;
        } else if (bookName == "Psalms (prose)" || bookName == "John") {
            editionNum *= 13;
        }
        let prefix = editionToSuperscriptDict[editionNum];
        let suffix = getVerseSuffix(verseData);
        let finalString = prefix + verse + suffix;
        allVerseTextList.push(finalString);
    }
    return allVerseTextList;

}

export function processBookData(bookDataList, bookHTMLSpan, bookName) {
    let allVerses = [];
    let redoneDictionaries = {};
    let totalCount = 0;

    let allAddresses = [];

    for (let i=0; i < bookDataList.length; i++) {
        let thisVerseData = bookDataList[i];
        let thisDBCode = thisVerseData["dbVerseCode"];
        let thisAddress = getAddressString(thisDBCode);

        if (!allAddresses.includes(thisAddress)) {
            allAddresses.push(thisAddress);
        }

        let thisEdition = thisVerseData["editionNum"];
        let thisCount = thisVerseData["verseCount"];
        totalCount += thisCount;

        if (i == 0 || allVerses.slice(-1)[0] != thisAddress) {
            allVerses.push(thisAddress);
            redoneDictionaries[thisAddress] = {"allEditions": 1};
        }

        redoneDictionaries[thisAddress]["allEditions"] *= thisEdition;
        redoneDictionaries[thisAddress][thisEdition] = thisCount;
    }
    let totalCountString = totalCount.toString();

    if (totalCount > 1) {
        bookHTMLSpan.innerHTML += `</i> (${totalCountString}): `;
    } else {
        bookHTMLSpan.innerHTML += ":</i> ";
    }

    return getVerseCiteSpans(allVerses, redoneDictionaries, bookName);
}

export function zip(list1, list2) {
    let zipped = {};
    for (let i = 0; i < list1.length; i++) {
        zipped[list1[i]] = list2[i];
    }
    return zipped;
}

export function resetResults() {
    let allVerseSpans = document.getElementsByClassName('cite-span');
    for (let i = 0; i < allVerseSpans.length; i++) {
        allVerseSpans[i].classList.remove('active');
        allVerseSpans[i].style.color = "black";
        allVerseSpans[i].style.fontWeight = "normal";
    }
    
    //Probably inefficient as it requires another check to the database. However, it looks like things work!
    let allPopups = document.getElementsByClassName('show-verse');
    for (let i = 0; i < allPopups.length; i++) {
        allPopups[i].remove();
    }
}

export function getCountDictionaries(wordList, dictOfDicts, sortAlphabetical) {
    let allHeaders = [];
    let headerToWordListDict = {};
    let headerToWordCountDict = {};
    let headerToTokenCountDict = {};
    let totalWords = 0;
    let totalTokens = 0;

    for (let i=0; i < wordList.length; i++) {
        let thisWord = wordList[i];
        let wordCount = dictOfDicts[thisWord]["totalCount"];

        let myHeader;

        if (sortAlphabetical) {
            myHeader = cleanDiacritics(thisWord[0]);
        } else {
            myHeader = wordCount;
        }

        if (headerToWordListDict[myHeader] === undefined) {
            headerToWordListDict[myHeader] = [thisWord];
            headerToWordCountDict[myHeader] = 1;
            headerToTokenCountDict[myHeader] = wordCount;
            allHeaders.push(myHeader);
            totalWords += 1;
            totalTokens += wordCount;
        } else {
            headerToWordListDict[myHeader].push(thisWord);
            headerToWordCountDict[myHeader] += 1;
            headerToTokenCountDict[myHeader] += wordCount;
            totalWords += 1;
            totalTokens += wordCount;
        }
    }
    if (sortAlphabetical) {
        allHeaders = alphabetizeWords(allHeaders);
    } else {
        allHeaders.sort((a, b) => b - a);
    }
    return [allHeaders, headerToWordListDict, headerToWordCountDict, headerToTokenCountDict, totalWords, totalTokens];
}