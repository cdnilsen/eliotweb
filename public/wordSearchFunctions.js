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
    1: "", // for the KJV
    2: "<sup>α</sup>",
    3: "<sup>β</sup>",
    5: "<sup>M</sup>",
    6: "",
    7: "<sup>א</sup>",
    11: "",
    13: ""
}
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

export function alphabetizeWords(wordList) {
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

export function cleanPunctuation(word) {
    let allChars = ['.', ',', '!', '?', ';', ':', '[', ']', '(', ')', '\'', '"', '{', '}'];
    let cleanedWord = "";
    for (let i = 0; i < word.length; i++) {
        if (allChars.includes(word[i])) {
            cleanedWord += "";
        } else {
            cleanedWord += word[i];
        }
    }
    return cleanedWord;
}

export function cleanDiacritics(word) {
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
    console.log(wordCount);
    if (useToken) {
        return "<u><b><i>" + headerString + "</i></b></u> (" + wordCount.toString() + " " + wordOrWords + ", " + tokenCount + " total " + tokenOrTokens + ")";
    } else {
        return "<u><i><b>" + headerString + "</b> " + tokenOrTokens + "</i></u> ("  + wordCount.toString() + " " + wordOrWords + ")";
    }
}

export function getVerseAddress(dbCode) {
    let stringAddress = dbCode.toString().slice(3);
  
    let chapter = parseInt(stringAddress.slice(0, 3));
    let verse = parseInt(stringAddress.slice(3));

    return chapter.toString() + "." + verse.toString();

}

function decodeVerseCode(verseCode, verseCount) {
    //Examples of verse codes: 225003010, 325003010, 219104022. The first digit is the edition number, the next two are the book number, the next three are the chapter number, and the last three are the verse number. Note that both verseCode and verseCount are lists of strings.
    
    let finalDict = {};
    finalDict["verseCount"] = parseInt(verseCount);
    finalDict["editionNum"] = parseInt(verseCode[0]);
    finalDict["bookNum"] = parseInt(verseCode.slice(1, 3));

    finalDict["addressNum"] = parseInt(verseCode.slice(3, 9));

    finalDict["dbVerseCode"] = parseInt("1" + verseCode.toString().slice(1));
    return finalDict;

}

export function getBooks(verseList, verseCount, word, castVerses=false) {
    let allBooks = [];
    let dictOfDicts = {};
    for (let i = 0; i < verseList.length; i++) {
        let thisVerse = "";
        if (castVerses) {
            thisVerse = verseList[i].toString();
        } else {
            thisVerse = verseList[i];
        }
        let thisVerseDict = decodeVerseCode(thisVerse, verseCount[i], word);
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
        let wordCount = dictOfDicts[thisWord]["totalCount"].length;

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