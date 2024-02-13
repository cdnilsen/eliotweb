// Allows the user to search for matching words in the Massachusett texts and outputs a list of all their cites.
const topBookList = [
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


const editionToSuperscriptDict = {
    //Possible combinations in Genesis:
    22: "<sup>α</sup>",
    33: "<sup>β</sup>",
    77: "<sup>א</sup>",
    66: "<sup>αβ</sup>",
    154: "<sup>αא</sup>",
    231: "<sup>βא</sup>",
    462: "",

    //Possible combinations in John or the prose Psalms:
    26: "<sup>α</sup>",
    39: "<sup>β</sup>",
    65: "<sup>M</sup>",
    78: "<sup>αβ</sup>",
    130: "<sup>αM</sup>",
    195: "<sup>βM</sup>",
    390: "",

    //For all other books. 5 and 7 are needed for getting the right suffix but won't be called in the prefix.
    2: "<sup>α</sup>",
    3: "<sup>β</sup>",
    5: "<sup>M</sup>",
    6: "",
    7: "<sup>א</sup>"
}


let customAlphabetizationDict = {
    "a": 0,
    "á": 1,
    "â": 2,
    "à": 3,
    "ã": 4,
    "ā": 5,
    "ä": 6,
    "b": 7,
    "c": 8,
    "d": 9,
    "e": 10,
    "é": 11,
    "ê": 12,
    "è": 13,
    "ẽ": 14,
    "ē": 15,
    "ë": 16,
    "f": 17,
    "g": 18,
    "h": 19,
    "i": 20,
    "í": 21,
    "î": 22,
    "ì": 23,
    "ĩ": 24,
    "ī": 25,
    "ï": 26,
    "j": 27,
    "k": 28,
    "l": 29,
    "m": 30,
    "̃": 31, //This is the tilde that represents a following nasal
    "n": 32,
    "ñ": 33,
    //"ŋ": 34,
    "o": 34,
    "ó": 35,
    "ô": 36,
    "ò": 37,
    "õ": 38,
    "ō": 39,
    "ö": 40,
    "8": 41,
    "p": 42,
    "q": 43,
    "r": 44,
    "s": 45,
    "t": 46,
    "u": 47,
    "ú": 48,
    "û": 49,
    "ù": 50,
    "ũ": 51,
    "ū": 52,
    "ü": 53,
    "v": 54,
    "w": 55,
    "x": 56,
    "y": 57,
    "z": 58
};


//Courtesy of stack exchange
function makeComparer(order) {
    let ap = Array.prototype;
  
    // mapping from character -> precedence
    let orderMap = {},
        max = order.length + 2;
    ap.forEach.call(order, function(char, idx) {
      orderMap[char] = idx + 1;
    });
  
    function compareChars(l, r) {
      let lOrder = orderMap[l] || max,
          rOrder = orderMap[r] || max;
  
      return lOrder - rOrder;
    }
  
    function compareStrings(l, r) {
      let minLength = Math.min(l.length, r.length);
      let result = ap.reduce.call(l.substring(0, minLength), function (prev, _, i) {
          return prev || compareChars(l[i], r[i]);
      }, 0);
  
      return result || (l.length - r.length);
    }
  
    return compareStrings;
}

function alphabetizeWords(wordList) {
    let compare = makeComparer("aáâàãāäbcdeéêèẽēëfghiíîìĩīïjklm̃nñŋoóôòõōö8pqrstuúûùũūüvwxyz");
    return wordList.sort(compare);
}


//This function is an attempt to deal with the macra and tildes that Eliot uses to represent a following nasal
function processEngma(word) {

    let wordCopy = word;
    //These will need to be dealt with manually, but we'll need to do that later
    if (word.endsWith('ŋ')) {
        //let chapterString = chapter.toString();
        //let verseString = verse.toString();
        wordCopy = word.slice(0, -1);
        wordCopy = wordCopy + "Ŋ";
    }
    
    let labialEngmaClusters = ['ŋb', 'ŋp', 'ŋm', 'ŋf'];

    let replacementClusters = ['mb', 'mp', 'mm', 'mf'];

    for (let i = 0; i < 4; i++) {
        wordCopy = wordCopy.split(labialEngmaClusters[i]).join(replacementClusters[i]);
    }

    wordCopy = wordCopy.split('ŋ').join('n');

    return wordCopy;
}

function cleanDiacritics(word) {

    let charReplacementDict = {
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
        "ã": "aN",
        "õ": "oN",
        "ñ": "nn",
        "m̃": "mm",
        "ũ": "uN",
        "ẽ": "eN",
        "ĩ": "iN",
        "ā": "aN",
        "ē": "eN",
        "ī": "iN",
        "ō": "oN",
        "ū": "uN"
    };

    let cleanedWord = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i] in charReplacementDict) {
            cleanedWord += charReplacementDict[word[i]];
        } else {
            cleanedWord += word[i];
        }
    }
    return processEngma(cleanedWord);
}

function populateColumns(popupDiv, editionNum, allVerseList) {

}

//Address num probably not needed here
async function showVersesInBox(popupDiv, editionNum, dbCode) {

    console.log("Show verses in box was called!");
    let fetchString = "/fetchVerse/" + dbCode.toString() + "/" + editionNum.toString();
    fetch(fetchString, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        console.log(res);
        popupDiv.hidden = false;
    });
}


function addClickableTriangle(unclickedColor, clickedColor, spanContainer, addFollowingBreak) {  
    let followingBreak = ""
    if (addFollowingBreak) {
        followingBreak = "<br>";
    }
    let clickableTriangle = document.createElement('span')
    clickableTriangle.innerHTML = ' ▶' + followingBreak;
    clickableTriangle.style.color = unclickedColor;
    clickableTriangle.style.cursor = "pointer";

    let htmlToggleDict = {
        " ▶": " ▼",
        " ▼": " ▶",
        " ▶<br>": " ▼<br>",
        " ▼<br>": " ▶<br>"
    }

    let unClickedHTML = [" ▶", " ▶<br>"];
    let clickedHTML = [" ▼", " ▼<br>"];

    clickableTriangle.addEventListener("click", function() {
        console.log("Clicked me!")
        spanContainer.hidden = !spanContainer.hidden;
        if (unClickedHTML.includes(clickableTriangle.innerHTML)) {
            clickableTriangle.style.color = clickedColor;
        } else {
            clickableTriangle.style.color = unclickedColor;
        }
        clickableTriangle.innerHTML = htmlToggleDict[clickableTriangle.innerHTML];
    });
    return clickableTriangle;
}

//Returns a dictionary with the info about this verse. Calls 'word' to debug position of Deuteronomy
function decodeVerseCode(verseCode, verseCount, word) {
    //Examples of verse codes: 225003010, 325003010, 219104022. The first digit is the edition number, the next two are the book number, the next three are the chapter number, and the last three are the verse number. Note that both verseCode and verseCount are lists of strings.
    
    let finalDict = {};
    finalDict["verseCount"] = parseInt(verseCount);
    finalDict["editionNum"] = parseInt(verseCode[0]);
    finalDict["bookNum"] = parseInt(verseCode.slice(1, 3));

    finalDict["addressNum"] = parseInt(verseCode.slice(3, 9));

    finalDict["dbVerseCode"] = parseInt("1" + verseCode.toString().slice(1));
    return finalDict;

}

function getCiteSuffix(editionList, countList) {
    let allCountsEqual = true;
    let allCountsOne = true
    let firstCount = countList[0];
    for (let i = 0; i < countList.length; i++) {
        if (countList[i] != firstCount) {
            allCountsEqual = false;
        }
        if (countList[i] != 1) {
            allCountsOne = false;
        }
    }

    if (allCountsEqual && allCountsOne) {
        return "";
    } else if (allCountsEqual) {
        return " (" + firstCount.toString() + ")"
    } else {
        finalString = " (";
        for (let j = 0; j < countList.length; j++) {
            finalString += editionToSuperscriptDict[editionList[j]];
            finalString += countList[j].toString();
            finalString += "/";
        }
        return finalString.slice(0, -1) + ")";
    }
}

function getAddressString(dbNum) {
    let stringAddress = dbNum.toString().slice(3);
  
    let chapter = parseInt(stringAddress.slice(0, 3));
    let verse = parseInt(stringAddress.slice(3));

    let finalAddress = chapter.toString() + ":" + verse.toString();
    return finalAddress;
}

function processVerseCite(addressNum, editionList, countList, dbCode, thisBookName) {
    let editionNum = 1;
    let totalCountVerse = 0;
    for (let i=0; i < editionList.length; i++) {
        editionNum *= editionList[i];
        totalCountVerse += countList[i];
    }
    //Once Greek and Hebrew are added, change this to 858 (= 2 * 3 * 11(KJV) * 13 (Grebew))
    let verseLinkNum = 66;
    // This gives a unique prime factorization of all the possibilities. E.g. an edition number of 6 should get no prefix (the book in question is only 1st/2nd edition and so 6 means it exists in both verses), but an edition number of 66 means that the word occurs in both of Eliot's editions of this verse but not Mayhew's (even though an edition of this verse by Mayhew exists).
    if (thisBookName == "Genesis") {
        verseLinkNum *= 7;
        editionNum *= 11;
    } else if (thisBookName == "Psalms (prose)" || thisBookName == "John") {
        verseLinkNum *= 5;
        editionNum *= 13;
    }
    let prefix = editionToSuperscriptDict[editionNum];

    let address = getAddressString(dbNum);

    let suffix = getCiteSuffix(editionList, countList);

    let finalString = prefix + address + suffix;

    let verseDiv = document.createElement("div");
    verseDiv.classList.add("dotted-underline");
    verseDiv.innerHTML = finalString;

    let popupVerseBox = document.createElement("div");
    popupVerseBox.classList.add("popup-verse-box");
    popupVerseBox.hidden = true;
    //verseDiv.appendChild(popupVerseBox);

    verseDiv.addEventListener("click", async function() {
        console.log("Hello, you clicked on me!")
        showVersesInBox(verseDiv, popupVerseBox, verseLinkNum, dbCode);
    });

    return [verseDiv, totalCountVerse];

}
//This will have to be split up into multiple functions. First get the book divs and create triangles for the ones that need them. Then get the verse

function getBooks(verseList, verseCount, word) {
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
/*
function getBookDivs(verseList, verseCount, word) {
    let allBookDivs = [];

    let dictOfDicts = {};
    let allBookList = [];

    let allVerseContainers = [];
    let hasTriangleList = [];

    for (let i=0; i < verseList.length; i++) {
        let verseDict = decodeVerseCode(verseList[i], verseCount[i], word);

        let bookNum = verseDict["bookNum"];

        if (dictOfDicts[bookNum] === undefined) {
            dictOfDicts[bookNum] = [verseDict];
            allBookList.push(bookNum);
        } else {
            dictOfDicts[bookNum].push(verseDict);
        }
    }
    allBookList.sort((a, b) => a - b);
    for (let j=0; j < allBookList.length; j++) {
        let thisBookDictList = dictOfDicts[allBookList[j]];

        let thisBookName = topBookList[allBookList[j] - 1];       

        let verseAddressDict = {};
        let verseCountDict = {};
        let dbCodeDict = {};
        
        let allAddresses = [];
        for (let k=0; k < thisBookDictList.length; k++) {
            let thisVerseDict = thisBookDictList[k];
            let thisVerseEdition = thisVerseDict["editionNum"];
            let thisVerseAddress = thisVerseDict["addressNum"];
            let thisVerseCount = thisVerseDict["verseCount"];
            let dbVerseCode = thisVerseDict["dbVerseCode"];

            if (verseAddressDict[thisVerseAddress] === undefined) {
                verseAddressDict[thisVerseAddress] = [thisVerseEdition];
                verseCountDict[thisVerseAddress] = [thisVerseCount];
                dbCodeDict[thisVerseAddress] = dbVerseCode;
                allAddresses.push(thisVerseAddress);
            } else {
                verseAddressDict[thisVerseAddress].push(thisVerseEdition);
                verseCountDict[thisVerseAddress].push(thisVerseCount);
            }
        }

        let allVerseSpanList = [];
        let thisBookTotalCount = 0;
        for (let l=0; l < allAddresses.length; l++) {
            let thisAddress = allAddresses[l];
            if (thisAddress == undefined) {
                console.log(allAddresses);
                console.log("undefined address: " + word);
                console.log(verseAddressDict);
                console.log(verseCountDict);
                console.log(thisBookDictList)
            }

            let thisEditionList = verseAddressDict[thisAddress];
            let thisCountList = verseCountDict[thisAddress];
            let thisDBCode = dbCodeDict[thisAddress];

            let verseInfo = processVerseCite(thisAddress, thisEditionList, thisCountList, thisDBCode, thisBookName);

            allVerseSpanList.push(verseInfo[0]);
            thisBookTotalCount += verseInfo[1];
        }
        //Check order here
        let thisBookString = "<i>" + thisBookName + "</i> ("
        thisBookString += thisBookTotalCount.toString() + "): ";

        let thisBookSpan = document.createElement("span");
        thisBookSpan.innerHTML = thisBookString;

        let verseContainer = document.createElement("div");
        //HELL NO verseContainer.style.display = "inline-block";

        for (let i=0; i < allVerseSpanList.length; i++) {
            verseContainer.appendChild(allVerseSpanList[i]);
            if (i != allVerseSpanList.length - 1) {
                verseContainer.innerHTML += ", "
            }
        }
        hasTriangleList.push(allAddresses.length > 30);
        allBookDivs.push(thisBookSpan);
        allVerseContainers.push(verseContainer);
        console.log(thisBookSpan);
        console.log(verseContainer);
    }
    return [allBookDivs, allVerseContainers, hasTriangleList]; 
}
*/

/*
function getVerseCodeSpan(verseList, verseCount, word) {
    let verseCodeText = "";
    let dictOfDicts = {};
    let allBookList = [];
    
    for (let i = 0; i < verseList.length; i++) {
        let verseDict = decodeVerseCode(verseList[i], verseCount[i], word);
        let bookNum = verseDict["bookNum"];
        
        if (dictOfDicts[bookNum] === undefined) {
            dictOfDicts[bookNum] = [verseDict];
            allBookList.push(bookNum);
        } else {
            dictOfDicts[bookNum].push(verseDict);
        }
    }
    allBookList.sort((a, b) => a - b);
    for (let j=0; j < allBookList.length; j++) {
        let thisBookDictList = dictOfDicts[allBookList[j]];

        let thisBookName = topBookList[allBookList[j] - 1];       

        let verseAddressDict = {};
        let verseCountDict = {};
        let dbCodeDict = {};
        
        let allAddresses = [];
        for (let k=0; k < thisBookDictList.length; k++) {
            let thisVerseDict = thisBookDictList[k];
            let thisVerseEdition = thisVerseDict["editionNum"];
            let thisVerseAddress = thisVerseDict["addressNum"];
            let thisVerseCount = thisVerseDict["verseCount"];
            let dbVerseCode = thisVerseDict["dbVerseCode"];

            if (verseAddressDict[thisVerseAddress] === undefined) {
                verseAddressDict[thisVerseAddress] = [thisVerseEdition];
                verseCountDict[thisVerseAddress] = [thisVerseCount];
                dbCodeDict[thisVerseAddress] = dbVerseCode;
                allAddresses.push(thisVerseAddress);
            } else {
                verseAddressDict[thisVerseAddress].push(thisVerseEdition);
                verseCountDict[thisVerseAddress].push(thisVerseCount);
            }
        }

        let bookString = "<span style='margin-left:4em; display:inline-block'><i>" + thisBookName + "</i> (";
        let allVersesSpan = document.createElement("span");
        let totalBookCount = 0;
        allAddresses.sort();
        for (let l=0; l < allAddresses.length; l++) {
            let thisAddress = allAddresses[l];
            if (thisAddress == undefined) {
                console.log(allAddresses);
                console.log("undefined address: " + word);
                console.log(verseAddressDict);
                console.log(verseCountDict);
                console.log(thisBookDictList)
            }

            let thisEditionList = verseAddressDict[thisAddress];
            let thisCountList = verseCountDict[thisAddress];
            let thisDBCode = dbCodeDict[thisAddress];

            let verseInfo = processVerseCite(thisAddress, thisEditionList, thisCountList, thisDBCode, thisBookName);

            allVersesSpan.appendChild(verseInfo[0]);
            totalBookCount += verseInfo[1];
        }
        bookString += totalBookCount.toString() + "): " + verseCiteString.slice(0, -2) + "</span><br>";
        verseCodeText += bookString;
    }
    return verseCodeText;
}
*/


//Do this tomorrow. As far as I can tell, we're going to have to go bottom-up. First get the verse cites and check if there are too many of them to display without a triangle; if so, add the triangle. Then do the same with books. Because we want this to be fairly flexible it is probably best to rewrite it as a function that just takes lists of stuff to make spans and divs out of and then adds triangles to the parent if need be.
function appendToContainer(parentContainer, childContainer, useTriangle, triangleClickColor, alwaysAddBreak) {

    if (useTriangle) {
        let clickableTriangle = addClickableTriangle("gray", triangleClickColor, childContainer, true);
        parentContainer.appendChild(clickableTriangle);
        childContainer.hidden = true;
    } else if (alwaysAddBreak) {
        parentContainer.innerHTML += "<br>";
    }

    parentContainer.appendChild(childContainer);
}

function triangleSandwich(grandparentContainer, parentContainer, childContainer, useTriangle, triangleClickColor) {
    appendToContainer(parentContainer, childContainer, useTriangle, triangleClickColor);
    grandparentContainer.appendChild(parentContainer);
}


function processWordCites(word, totalCount, verseList, verseCountList) {
    let ligaturedWord = word.split('8').join('ꝏ̄');
    let topString = `<b>${ligaturedWord}</b> (${totalCount}): `

    let wordDiv = document.createElement("div");
    wordDiv.innerHTML = topString;

    let books = getBooks(verseList, verseCountList, word);
    let bookList = books[0];

    let useTriangle = bookList.length > 5;


    let spanContainer = document.createElement("div");
    let spanList = [];
    for (let i=0; i < bookList.length; i++) {
        let thisSpan = document.createElement("span");
        thisSpan.innerHTML = bookList[i];
        spanContainer.appendChild(thisSpan);
        if (i != bookList.length - 1) {
            spanContainer.innerHTML += ", ";
        }
    }

    appendToContainer(wordDiv, spanContainer, useTriangle, "blue");

    return wordDiv;
}

    /*
    for (let i = 0; i < allBookDivs.length; i++) {
        let thisBookDiv = allBookDivs[i];
        if (allHasTriangle[i]) {
            let clickableTriangle = addClickableTriangle("gray", "#FF0000", allVerseContainers[i], true);
            thisBookDiv.appendChild(clickableTriangle);
            allVerseContainers[i].hidden = true;
            thisBookDiv.innerHTML += "<br>";
        }
        thisBookDiv.appendChild(allVerseContainers[i]);
        thisBookDiv.innerHTML += "<br>";
    }

    

    for (let i = 0; i < allBookDivs.length; i++) {
        let thisBookDiv = allBookDivs[i];
        topOutputSpan.appendChild(thisBookDiv);
        console.log(thisBookDiv);
    }
    */

function getHeaderText(wordCount, tokenCount, useToken, initialLetter) {
    if (initialLetter == "8") {
        initialLetter = "ꝏ̄";
    }

    if (wordCount == undefined) {
        wordCount = 0;
    }

    let wordOrWords = "words";
    if (wordCount == 1) {
        wordOrWords = "word";
    }

    if (useToken) {
        if (tokenCount == undefined) {
            tokenCount = 0;
        }

        let tokenOrTokens = "tokens";
        if (tokenCount == 1) {
            tokenOrTokens = "token";
        }

        return "<u><b><i>" + initialLetter + "</i></b></u> (" + wordCount.toString() + " " + wordOrWords + ", " + tokenCount.toString() + " total " + tokenOrTokens + ")";
    } else {
        return "<u><i><b>" + wordCount.toString() + "</b> tokens</i></u> ("  + wordCount.toString() + " " + wordOrWords + ")";
    }
}

function changeSectionBool (useAlphabetical, thisWord, thisWordCount, currentFirstLetter, lastWordCount) {
    let changeHeader = false;
    if (useAlphabetical) {
        let cleanedFirstLetter = cleanDiacritics(thisWord[0]);
        if (cleanedFirstLetter != currentFirstLetter) {
            changeHeader = true;
        }
    }
    else {
        if (lastWordCount != thisWordCount) {
            changeHeader = true;
        }
    }
    return changeHeader;
}

function sectionHeader(useAlphabetical, thisWord, thisWordCount, currentFirstLetter, lastWordCount, resultDiv, wordsWithThisHeader, headerToWordListDict, headerToTokenListDict, childDiv) {
    let changeHeader = false;
    let tokenCount = 0;
    let wordCount = 0;
    let cleanedFirstLetter = cleanDiacritics(thisWord[0]);
    //console.log(showSpanList);
    if (useAlphabetical) {
        wordCount = headerToWordListDict[cleanedFirstLetter];
        tokenCount = headerToTokenListDict[cleanedFirstLetter];

        let firstLetterDiv = document.createElement("div");
        firstLetterDiv.style.fontSize = "24px";

        firstLetterDiv.innerHTML = getHeaderText(wordCount, tokenCount, true, cleanedFirstLetter);
        
        let clickableTriangle = addClickableTriangle("gray", "blue", childDiv, true);

        firstLetterDiv.appendChild(clickableTriangle);
        resultDiv.appendChild(firstLetterDiv);
        
    } else {
        wordCount = headerToWordListDict[thisWordCount];
        tokenCount = headerToTokenListDict[thisWordCount];

        let countDiv = document.createElement("div");
        countDiv.style.fontSize = "24px";

        countDiv.innerHTML = getHeaderText(thisWordCount, tokenCount, false, thisWord[0]);

        let clickableTriangle = addClickableTriangle("gray", "blue", childDiv, true);

        countDiv.appendChild(clickableTriangle);

        resultDiv.appendChild(countDiv);
    }

    return [thisWordCount, cleanedFirstLetter];   
}

function sendSpanToCorrectPlace(span, word, wordTotalCount, useAlphabetical, spanDict) {
    if (useAlphabetical) {
        let key = cleanDiacritics(word[0]);
        if (word[0] == "8") {
            key = "ꝏ̄";
        }
        if (spanDict[key] === undefined) {
            spanDict[key] = [span];
        } else {
            spanDict[key].push(span);
        }
        return key;
    } else {
        let key = wordTotalCount;
        if (spanDict[key] === undefined) {
            spanDict[key] = [span];
        } else {
            spanDict[key].push(span);
        }
        return key;
    }
}


/*
//wordList comes presorted
function processAllWordCites(wordList, dictOfDicts, sortAlphabetical, resultDiv) {
    resultDiv.hidden = true;
    let totalWords = wordList.length;
    let totalTokens = 0;

    let topDiv = document.getElementById("headline-container");
    topDiv.innerHTML = "";

    let topSpan = document.createElement("span");

    let lastWordCount = 0;
    let currentFirstLetter = "";
    let wordsWithThisHeader = 0;

    let headerToWordListDict = {};
    let headerToTokenListDict = {};

    for (let i=0; i < wordList.length; i++) {
        let thisWord = wordList[i];
        let wordCount = dictOfDicts[thisWord]["totalCount"];

        if (sortAlphabetical) {
            let cleanedFirstLetter = cleanDiacritics(thisWord[0]);
            if (headerToWordListDict[cleanedFirstLetter] === undefined) 
            {
                headerToWordListDict[cleanedFirstLetter] = 0;
                headerToTokenListDict[cleanedFirstLetter] = 0;
            } 
            headerToWordListDict[cleanedFirstLetter] += 1;
            headerToTokenListDict[cleanedFirstLetter] += wordCount;
        } else {
            if (headerToWordListDict[wordCount] === undefined) {
                headerToWordListDict[wordCount] = 0;
                headerToTokenListDict[wordCount] = 0;
            } 
            headerToWordListDict[wordCount] += 1;
            headerToTokenListDict[wordCount] += wordCount;
        }
    }


    let outputDivDict = {};
    for (let j=0; j < wordList.length; j++) {
        let word = wordList[j];
        let wordDict = dictOfDicts[word];
        let totalCount = wordDict["totalCount"];
        let allVerses = wordDict["allVerses"];
        let allCounts = wordDict["allVerseCounts"];

        totalTokens += totalCount;
        let outputDiv = processWordCites(word, totalCount, allVerses, allCounts);

        outputDiv.id = "word-" + word;
        
        let dictKey = sendSpanToCorrectPlace(outputDiv, word, totalCount, sortAlphabetical, outputDivDict);

        let changeSection = changeSectionBool(sortAlphabetical, word, totalCount, currentFirstLetter, lastWordCount);

        if (changeSection) {
            let thisLetterDiv = document.createElement("div");
            thisLetterDiv.id = "container-" + dictKey;

            for (let i = 0; i < outputDivDict[dictKey].length; i++) {
                thisLetterDiv.appendChild(outputDivDict[dictKey][i]);
                thisLetterDiv.innerHTML += "<br>";
            }

            let updatedHeaderList = sectionHeader(sortAlphabetical, word, totalCount, currentFirstLetter, lastWordCount, resultDiv, wordsWithThisHeader, headerToWordListDict, headerToTokenListDict, thisLetterDiv);

            lastWordCount = updatedHeaderList[0];
            currentFirstLetter = updatedHeaderList[1];

            wordsWithThisHeader = 0;
        }
        resultDiv.appendChild(thisLetterDiv);
        wordsWithThisHeader += 1; 
    }

    topSpan.innerHTML = `Found <b><u>${totalTokens}</u></b> tokens, representing <b><u>${totalWords}</u></b> distinct words.`;
    topSpan.style.fontSize = "32px";
    topDiv.appendChild(topSpan);

    resultDiv.hidden = false;
}
*/

function getCountDictionaries(wordList, dictOfDicts, sortAlphabetical) {
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
        allHeaders.sort((a, b) => a - b);
    }

    return [allHeaders, headerToWordListDict, headerToWordCountDict, headerToTokenCountDict, totalWords, totalTokens];
}

function processAllWordCites(wordList, dictOfDicts, sortAlphabetical) {
    let totalWords = wordList.length;
    let totalTokens = 0;

    let topDiv = document.getElementById("headline-container");
    topDiv.innerHTML = "";

    let lastWordCount = 0;
    let currentFirstLetter = "";
    let wordsWithThisHeader = 0;

    let currentHeader;
    // wordList comes pre-sorted.
    let countData = getCountDictionaries(wordList, dictOfDicts, sortAlphabetical);

    let allHeaders = countData[0];
    let headerToWordListDict = countData[1];
    let headerToWordCountDict = countData[2];
    let headerToTokenCountDict = countData[3];

    let wordToCiteDict = {};

    for (let i=0; i < allHeaders.length; i++) {
        let thisHeaderDiv = document.createElement("div");
        let thisHeader = allHeaders[i].toString();

        let headerText = getHeaderText(headerToWordCountDict[thisHeader], headerToTokenCountDict[thisHeader], sortAlphabetical, thisHeader[0]);

        thisHeaderDiv.id = "header-" + thisHeader;
        thisHeaderDiv.innerHTML = headerText;
        thisHeaderDiv.style = "font-size: 24px;";
    
        let headerResultsDiv = document.createElement("div");
        headerResultsDiv.id = "header-results-" + thisHeader;
        headerResultsDiv.hidden = true;
        
        for (let j=0; j < wordList.length; j++) {
            let thisWord = wordList[j];
            let thisWordDataDict = dictOfDicts[thisWord];

            let bookData = getBooks(thisWordDataDict["allVerses"], thisWordDataDict["allVerseCounts"], thisWord);
            console.log(thisWord);

            let allBookNums = bookData[0];
            let allBookToVerseDict = bookData[1];

            let totalCount = thisWordDataDict["totalCount"];
            let ligaturedWord = thisWord.split('8').join('ꝏ̄');

            let thisWordDiv = document.createElement("div");

            thisWordDiv.innerHTML = `<b>${ligaturedWord}</b> (${totalCount}): `;
            
            thisWordDiv.style = "indent: 4em; font-size: 16px;";

            let allBooksContainer = document.createElement("span");
            allBooksContainer.id = thisWord + "-books-span";

            allBooksContainer.style = "indent: 4em;";
            
            let bookCountDict = {};
            for (let k=0; k < allBookNums.length; k++) {
                let thisBookSpan = document.createElement("span");
                let thisBookNum = allBookNums[k];
                let thisBookName = topBookList[thisBookNum - 1];

                thisBookSpan.id = "word-" + thisWord + "-book-" + thisBookName;
                //thisBookSpan.innerHTML = "<i>" + thisBookName + "</i> (" + thisWordDataDict["totalCount"] + "): ";
                thisBookSpan.innerHTML = "<i>" + thisBookName + "</i> ("

                let thisBookData = allBookToVerseDict[thisBookNum];
                
                thisBookData.sort((a, b) => a["dbVerseCode"] - b["dbVerseCode"]
                );
                //console.log(thisBookData);

                

                let verseToStringDict = {};


                /*Example of book data: {
                    addressNum: 3003,
                    bookNum: 66,
                    dbVerseCode: 166003003,
                    editionNum: 2,
                    verseCount: 2
                }*/

                let allVerses = [];
                let redoneDictionaries = {};
                let thisBookCount = 0;
                for (let l=0; l < thisBookData.length; l++) {
                    let thisVerseData = thisBookData[l];
                    let thisDBCode = thisVerseData["dbVerseCode"];
                    let thisAddress = getAddressString(thisDBCode);
                    let thisEdition = thisVerseData["editionNum"];
                    let thisCount = thisVerseData["verseCount"];
                    thisBookCount += thisCount;

                    if (l == 0 || allVerses.slice(-1)[0] != thisAddress) {
                        allVerses.push(thisAddress);
                        redoneDictionaries[thisAddress] = {"allEditions": 1};
                    }

                    redoneDictionaries[thisAddress]["allEditions"] *= thisEdition;
                    redoneDictionaries[thisAddress][thisEdition] = thisCount;
                }

                thisBookSpan.innerHTML += thisBookCount.toString() + "): ";

                let allVerseTextList = [];
                for (let m=0; m < allVerses.length; m++) {
                    let thisVerse = allVerses[m];
                    let thisVerseData = redoneDictionaries[thisVerse];

                    let editionNum = thisVerseData["allEditions"];
                    if (thisBookName == "Genesis") {
                        editionNum *= 11;
                    } else if (thisBookName == "Psalms (prose)" || thisBookName == "John") {
                        editionNum *= 13;
                    }
                    let prefix = editionToSuperscriptDict[editionNum];

                    let allEditionPrimes = [2, 3, 5, 7];
                    let thisVersePrimes = [];
                    let thisVerseCounts = [];
                    let pastOneVerse = false;

                    //Turn this into a function later lol
                    let everythingEqualsOne = true;
                    let allCountsEqual = true;
                    let mostRecentCount = 0;
                    for (let n=0; n < allEditionPrimes.length; n++) {
                        if (thisVerseData[allEditionPrimes[n]] != undefined) {
                            let thisCount = thisVerseData[allEditionPrimes[n]];
                            thisVersePrimes.push(allEditionPrimes[n]);
                            thisVerseCounts.push(thisCount);
                            if (thisCount != 1) {
                                everythingEqualsOne = false;
                            }
                            if (n != 0) {
                                pastOneVerse = true;
                                if (thisCount != mostRecentCount) {
                                    allCountsEqual = false;
                                }
                            }
                            mostRecentCount = thisCount;
                        }
                    }

                    let suffix = "";
                    if (allCountsEqual && everythingEqualsOne) {
                        suffix == "";
                    } else if (allCountsEqual) {
                        suffix = "(" + mostRecentCount.toString() + ")";
                    } else {
                        for (let o=0; o < thisVersePrimes.length; o++) {   
                            suffix = "(";
                            suffix += editionToSuperscriptDict[thisVersePrimes[o]];
                            suffix += thisVerseCounts[o].toString();
                            if (o != thisVersePrimes.length -1) {
                                suffix += "/";
                            }
                            suffix += ")"
                        }                      
                    }

                    let finalString = prefix + thisVerse + suffix;
                    allVerseTextList.push(finalString);
                }

                let thisBookVerseCiteContainer = document.createElement("span");
                for (let p=0; p < allVerseTextList.length; p++) {
                    let thisVerseSpan = document.createElement("span");
                    thisVerseSpan.innerHTML = allVerseTextList[p];
                    thisVerseSpan.classList.add("dotted-underline");
                    thisBookVerseCiteContainer.appendChild(thisVerseSpan);
                    if (p != allVerseTextList.length - 1) {
                        thisBookVerseCiteContainer.innerHTML += ", ";
                    }
                }
                appendToContainer(thisBookSpan, thisBookVerseCiteContainer, allVerseTextList.length > 30, "blue", false);
                allBooksContainer.appendChild(thisBookSpan);
            }
            appendToContainer(thisWordDiv, allBooksContainer, allBookNums.length > 5, "blue", true);
            headerResultsDiv.appendChild(thisWordDiv);
        }
        appendToContainer(thisHeaderDiv, headerResultsDiv, true, "blue", true);
        document.getElementById("results-container").appendChild(thisHeaderDiv);
    }
    let totalWordCount = countData[4];
    let totalTokenCount = countData[5];

    topDiv.style.fontSize = "30px";
    topDiv.innerHTML = `Found <b><u>${totalTokenCount}</u></b> tokens, representing <b><u>${totalWordCount}</u></b> distinct words.`;
}

function getDictFromSearchOutput(searchOutput, resultDiv, sortAlphabetical, sortByBook) {

    let allWords = [];
    let allTotalCounts = [];
    let allVerseLists = [];
    let allVerseCounts = [];

    let dictOfDicts = {};
    for (let i = 0; i < searchOutput.length; i++) {
        let rawDict = searchOutput[i];

        let word = rawDict["word"];
        allWords.push(word);

        let processedDict = {};
        processedDict["word"] = word;
        processedDict["totalCount"] = rawDict["totalCount"];
        processedDict["allVerses"] = rawDict["allVerses"];
        processedDict["allVerseCounts"] = rawDict["allVerseCounts"];
        dictOfDicts[word] = processedDict;
    }

    let newWordList = [];
    
    if (sortAlphabetical) {
        newWordList = alphabetizeWords(allWords);
    } else {
        let frequencyList = [];
        let frequencyToWordDict = {};
        for (let i = 0; i < allWords.length; i++) {
            let thisWord = allWords[i];
            let thisCount = dictOfDicts[thisWord]["totalCount"];

            if (frequencyToWordDict[thisCount] === undefined) {
                frequencyToWordDict[thisCount] = [thisWord];
                frequencyList.push(thisCount);
            } else {
                frequencyToWordDict[thisCount].push(thisWord);
            }
        }
        frequencyList.sort((a, b) => b - a);
        for (let j = 0; j < frequencyList.length; j++) {
            let thisFrequency = frequencyList[j];
            let thisWordList = frequencyToWordDict[thisFrequency];
            thisWordList = alphabetizeWords(thisWordList);
            for (let k = 0; k < thisWordList.length; k++) {
                newWordList.push(thisWordList[k]);
            }
        }
    }

    processAllWordCites(newWordList, dictOfDicts, sortAlphabetical);
}

async function seeAllWords(fetchString, resultDiv, sortAlphabetical, sortByBook) {
    resultDiv.innerHTML = "";
    fetch(fetchString, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {    
        if (res.length == 0) {
            let wrongSpan = document.createElement("span");
            wrongSpan.style.fontSize = "20px";
            wrongSpan.innerHTML = "No words found, and/or you tried to search for fewer than three letters (restricted for now to prevent overloading the server).";
            resultDiv.appendChild(wrongSpan);
        } else {
            getDictFromSearchOutput(res, resultDiv, sortAlphabetical, sortByBook);
        }
    }).catch(err => console.error(err))
}

document.getElementById("searchButton").addEventListener("click", async function() {
    let searchSetting = 1;

    if (document.getElementById("searchMassachusett").checked) {
        searchSetting *= 11;
    }
    if (document.getElementById("searchEnglish").checked) {
        searchSetting *= 13;
    }

    let otherSearchSetting = document.getElementById("searchWordDropdown").value;

    if (otherSearchSetting == "exact") {
        searchSetting *= 2;
    } else if (otherSearchSetting == "contains") {
        searchSetting *= 3;
    } else if (otherSearchSetting == "starts") {
        searchSetting *= 5;
    } else if (otherSearchSetting == "ends") {
        searchSetting *= 7;
    }

    let query = document.getElementById("search_bar").value;

    if (document.getElementById("diacriticsLax").checked) {
        searchSetting *= 17;
        query = cleanDiacritics(query);
    }

    let sortAlphabetical = document.getElementById("sortAlph").checked;

    let sortByBook = document.getElementById("sortBookFirst").checked;

   
    let fetchString = "/getWords/" + query + "/" + searchSetting.toString();

    let resultDiv = document.getElementById("results-container");

    await seeAllWords(fetchString, resultDiv, sortAlphabetical, sortByBook);

});
