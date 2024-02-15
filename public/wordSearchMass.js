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

function toggleCSS(elementProperty, option1, option2) {
    if (elementProperty == option1) {
        elementProperty = option2;
    } else {
        elementProperty = option1;
    }
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

async function showVersesInBox(popupContainer, dbCode) {
    popupContainer.innerHTML = "";
    popupContainer.classList.toggle('active');
    console.log("Show verses in box was called!");
    let fetchString = "/fetchVerse/" + dbCode.toString();
    fetch(fetchString, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        popupContainer.innerHTML = "";
        let primeKeys = [2, 3, 5, 11, 13];
        console.log(res);
        for (let i = 0; i < primeKeys.length; i++) {
            let p = primeKeys[i];
            if (res[p] != "") {
                popupContainer.innerHTML += editionToSuperscriptDict[p] + res[p];
            }
            popupContainer.innerHTML += "<br>";
        }
        popupContainer.classList.toggle('active');
    });
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

function addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak=true) {
    let triangle = createTriangle(unclickedColor, clickedColor);
    parentContainer.appendChild(triangle);
    if (addBreak) {
        let breakSpan = document.createElement('br');
        parentContainer.appendChild(breakSpan);
    }
    return triangle;
}

function addChildToExistingTriangle(parentContainer, parentTriangle, childContainer) {
    parentContainer.appendChild(childContainer);
    childContainer.hidden = true;
    parentTriangle.addEventListener('click', function() {
        childContainer.hidden = !childContainer.hidden;
    });
}

function appendChildTriangleOptional(useTriangle, parentContainer, childContainer, unclickedColor, clickedColor, addBreak=true, parentTriangle=undefined) {
    if (useTriangle) {
        if (parentTriangle == undefined) {
            parentTriangle = addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak);
        }
        addChildToExistingTriangle(parentContainer, parentTriangle, childContainer, unclickedColor, clickedColor, addBreak);
        return parentTriangle;
    } else {
        parentContainer.appendChild(childContainer);
        if (addBreak) {
            let breakSpan = document.createElement('br');
            parentContainer.appendChild(breakSpan);
        }
        return undefined;
    }
}

function addChildrenWithTriangle(parentContainer, childrenContainers, unclickedColor, clickedColor, addBreak=true) {
    let parentTriangle = addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak);
    childrenContainers.forEach(function(childContainer) {
        parentContainer.appendChild(childContainer);
        childContainer.hidden = true;
    });

    parentTriangle.addEventListener('click', function() {
        childrenContainers.forEach(function(childContainer) {
            childContainer.hidden = !childContainer.hidden;
        });
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

function getHeaderText(wordCount, tokenCount, sortAlphabetical, headerString) {

    let useToken = sortAlphabetical;
    if (headerString == "8" && sortAlphabetical) {
        initialLetter = "ꝏ̄";
    }

    let wordOrWords = rightPlural(wordCount, "word");

    let tokenOrTokens = rightPlural(tokenCount, "token");

    if (useToken) {
        return "<u><b><i>" + headerString + "</i></b></u> (" + wordCount.toString() + " " + wordOrWords + ", " + tokenCount.toString() + " total " + tokenOrTokens + ")";
    } else {
        return "<u><i><b>" + headerString + "</b> " + tokenOrTokens + "</i></u> ("  + wordCount.toString() + " " + wordOrWords + ")";
    }
}

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
        allHeaders.sort((a, b) => b - a);
    }
    return [allHeaders, headerToWordListDict, headerToWordCountDict, headerToTokenCountDict, totalWords, totalTokens];
}

function getSuffixData(dataDict) {
    let allEditionPrimes = [2, 3, 5, 7];
    let thisVerseCodes = [];
    let thisVerseCounts = [];
    let countsDiffer = false;
    let allCountsOne = true;
    let lastCount = 0;

    for (let i=0; i < 4; i++) {
        let p = allEditionPrimes[i];
        if (dataDict[p] != undefined) {
            let thisCount = dataDict[p];
            let code = editionToSuperscriptDict[p];
            thisVerseCodes.push(code);
            thisVerseCounts.push(thisCount);
            countsDiffer = (countsDiffer && (thisCount == lastCount || i == 0));
            lastCount = thisCount;
            allCountsOne = allCountsOne && (thisCount == 1);
        }
    }

    return {
        "editions": thisVerseCodes,
        "counts": thisVerseCounts,
        "useSuffix": !allCountsOne,
        "useSlash": countsDiffer
    }
}

function getVerseSuffix(dataDict) {
    let suffixDict = getSuffixData(dataDict);

    let suffix = " (";
    if (suffixDict["useSlash"]) {
        for (let i=0; i < suffixDict["editions"].length; i++) {
            suffix += suffixDict["counts"][i] + suffixDict["editions"][i];
            if (i != suffixDict["editions"].length - 1) {
                suffix += "/";
            }
        }
        suffix += ")";
        return suffix;
    } else if (suffixDict["useSuffix"]) {
        return suffix + suffixDict["counts"][0] + ")";
    } else {
        return "";
    }
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

function processBookData(bookDataList, bookHTMLSpan, bookName) {
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
    let verseCountString = allVerses.length.toString();
    let totalCountString = totalCount.toString();

    if (totalCount > 1) {
        bookHTMLSpan.innerHTML += `</i> (${totalCountString}): `;
    } else {
        bookHTMLSpan.innerHTML += ":</i> ";
    }
    //bookHTMLSpan.innerHTML += "<br>";

    return getVerseCiteSpans(allVerses, redoneDictionaries, bookName);
}

function addVersesToContainer(verseTextList, dbCodeList, word, book, topDiv) {
    let verseCiteContainer = document.createElement("span");   
    verseCiteContainer.id = "word-" + word + "-book-" + book + "-cites";
    for (let i=0; i < verseTextList.length; i++) {
        let thisDBCode = dbCodeList[i];
        let thisVerseSpan = document.createElement("span");
        thisVerseSpan.innerHTML = verseTextList[i];
        thisVerseSpan.classList.add("cite-span");
        thisVerseSpan.style.textDecoration = "underline dotted";

        let popupContainer = document.createElement("span");
        popupContainer.classList.add("show-verse");
        

        thisVerseSpan.addEventListener("click", async function() {
            console.log("Hello, you clicked on me!");
            await showVersesInBox(popupContainer, thisDBCode);
        });

        document.addEventListener("click", function(event) {
            //popupContainer.active = false;
            popupContainer.innerHTML = "";
            if (popupContainer.classList.contains('active')) {
                popupContainer.classList.toggle('active');
            }
        });

        /*popupContainer.addEventListener("click", async function() {
            toggleCSS(popupContainer.visible, true, false);
            toggleCSS(popupContainer.opacity, 1, 0); 
        });
        */


        
        thisVerseSpan.appendChild(popupContainer);
        verseCiteContainer.appendChild(thisVerseSpan);
        if (i != verseTextList.length - 1) {
            verseCiteContainer.innerHTML += ", ";
        } else {
            if (verseTextList.length > 1) {
                verseCiteContainer.innerHTML += ` (${verseTextList.length} vv.)`;
            }
            //let breakSpan = document.createElement("br");
            //verseCiteContainer.appendChild(breakSpan);
        }

    }
    return verseCiteContainer;
}

//Note: wordList should come presorted.
function processAllWordCites(allWordList, dictOfDicts, sortAlphabetical) {
    let resultDiv = document.getElementById("results-container");
    let totalWords = allWordList.length;
    let totalTokens = 0;

    let topDiv = document.getElementById("headline-container");
    topDiv.innerHTML = "";

    let lastWordCount = 0;
    let currentFirstLetter = "";
    let wordsWithThisHeader = 0;

    let currentHeader;
    // wordList comes pre-sorted.
    let countData = getCountDictionaries(allWordList, dictOfDicts, sortAlphabetical);

    let allHeaders = countData[0];
    let headerToWordListDict = countData[1];
    let headerToWordCountDict = countData[2];
    let headerToTokenCountDict = countData[3];

    let wordToCiteDict = {};

    for (let i=0; i < allHeaders.length; i++) {
        let thisHeaderDiv = document.createElement("div");
        if (allHeaders[i] == undefined) {
            continue;
        }
        let thisHeader = allHeaders[i].toString();
        let headerString = "";
        if (sortAlphabetical) {
            headerString = thisHeader[0];
        } else {
            headerString = thisHeader.toString();
        }

        let headerText = getHeaderText(headerToWordCountDict[thisHeader], headerToTokenCountDict[thisHeader], sortAlphabetical, headerString);

        thisHeaderDiv.id = "header-" + thisHeader;
        thisHeaderDiv.innerHTML = headerText;
        thisHeaderDiv.style = "font-size: 24px;";

        let wordList = headerToWordListDict[thisHeader];

        let headerTriangle = addTriangleToParent(thisHeaderDiv, "gray", "blue", true);
        
        for (let j=0; j < wordList.length; j++) {
            let thisWord = wordList[j];
            let thisWordDataDict = dictOfDicts[thisWord];

            let bookData = getBooks(thisWordDataDict["allVerses"], thisWordDataDict["allVerseCounts"], thisWord);

            let allBookNums = bookData[0];
            let allBookToVerseDict = bookData[1];


            let totalCount = thisWordDataDict["totalCount"];
            let ligaturedWord = thisWord.split('8').join('ꝏ̄');

            let thisWordDiv = document.createElement("div");

            if (totalCount > 1) {
                thisWordDiv.innerHTML = `<b>${ligaturedWord}</b> (${totalCount}): `;
            } else {
                thisWordDiv.innerHTML = `<b>${ligaturedWord}</b>: `;
            }
            
            thisWordDiv.style.fontSize = "16px";

            let numVerses = thisWordDataDict["allVerses"].length;

            let wordTriangle;

            let bookContainer = document.createElement("span");
            bookContainer.id = "word-" + thisWord + "-books";

            if (allBookNums.length > 5) {
                wordTriangle = addTriangleToParent(thisWordDiv, "gray", "#00FF50", true);
                addChildToExistingTriangle(thisWordDiv, wordTriangle, bookContainer);
            } else {
                let breakSpan = document.createElement("br");
                thisWordDiv.appendChild(breakSpan);
                thisWordDiv.appendChild(bookContainer);
            }

            for (let k=0; k < allBookNums.length; k++) {
                let thisBookSpan = document.createElement("span");
                let thisBookNum = allBookNums[k];
                let thisBookName = topBookList[thisBookNum - 1];

                thisBookSpan.id = "word-" + thisWord + "-book-" + thisBookName;

                let thisBookData = allBookToVerseDict[thisBookNum];
                
                thisBookData.sort((a, b) => a["dbVerseCode"] - b["dbVerseCode"]);

                thisBookSpan.innerHTML = "<i>" + thisBookName

                thisBookSpan.classList.add("textTab2");

                let verseTextList = processBookData(thisBookData, thisBookSpan, thisBookName);

                totalTokens += verseTextList.length;

                let allDBCodes = [];
                for (let l=0; l < thisBookData.length; l++) {
                    allDBCodes.push(thisBookData[l]["dbVerseCode"]);
                }
                
                let verseCiteContainer = addVersesToContainer(verseTextList, allDBCodes, thisWord, thisBookName);

                //let bookTriangle = appendChildTriangleOptional(allBookNums.length > 5, thisWordDiv, thisBookSpan, "gray", "#00ff50", true, wordTriangle);

                if (verseTextList.length > 25) {
                    //verseCiteContainer.classList.add("textTab2");
                    //verseCiteContainer.style.textIndent = "6em";
                    //verseCiteContainer.style.display = "inline-block";

                    

                    let bookTriangle = addTriangleToParent(thisBookSpan, "gray", "red", true);

                    

                    let breakSpan1 = document.createElement("br");
                    verseCiteContainer.appendChild(breakSpan1);

                    let breakSpan2 = document.createElement("br");

                    addChildToExistingTriangle(thisBookSpan, bookTriangle, verseCiteContainer);

                    
                    addChildToExistingTriangle(thisBookSpan, bookTriangle, breakSpan2);
                    
                    //breakSpan2.hidden = false;
                    
                } else {
                    verseCiteContainer.display = "inline-block";
                    

                    let thisBreakSpan = document.createElement("br");
                    verseCiteContainer.appendChild(thisBreakSpan);
                    thisBookSpan.appendChild(verseCiteContainer);
                }

                if (allBookNums.length > 5) {
                    if (k > 0) {
                       bookContainer.appendChild(document.createElement("br"));
                    }
                    addChildToExistingTriangle(bookContainer, wordTriangle, thisBookSpan);
                } else {
                    bookContainer.appendChild(thisBookSpan);

                    //thisWordDiv.appendChild(document.createElement("br"));
                    bookContainer.appendChild(document.createElement("br"));
                }
                

                


                //let citeTriangle = appendChildTriangleOptional(verseTextList.length > 25, thisBookSpan, verseCiteContainer, "gray", "red", true, bookTriangle);
            }
            addChildToExistingTriangle(thisHeaderDiv, headerTriangle, thisWordDiv); 
        }
        resultDiv.appendChild(thisHeaderDiv);
    }
    let totalWordCount = countData[4];
    let totalTokenCount = countData[5];

    topDiv.style.fontSize = "30px";
    topDiv.innerHTML = `Found <b><u>${totalTokenCount}</u></b> tokens, representing <b><u>${totalWordCount}</u></b> distinct words.`;
}

function getRightWordList(sortAlphabetical, wordList, dictOfDicts) {
    let newWordList = [];
    if (sortAlphabetical) {
        return alphabetizeWords(wordList);
    } else {
        let frequencyList = [];
        let frequencyToWordDict = {};
        for (let i = 0; i < wordList.length; i++) {
            let thisWord = wordList[i];
            let thisCount = dictOfDicts[thisWord]["totalCount"];
            if (thisCount == null) {
                continue;
            } 
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
    return newWordList;
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

    let newWordList = getRightWordList(sortAlphabetical, allWords, dictOfDicts);

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
