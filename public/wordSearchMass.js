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

//Returns a dictionary with the info about this verse
function decodeVerseCode(verseCode, verseCount) {
    //Examples of verse codes: 225003010, 325003010, 219104022. The first digit is the edition number, the next two are the book number, the next three are the chapter number, and the last three are the verse number. Note that both verseCode and verseCount are lists of strings.
    
    let finalDict = {};
    finalDict["verseCount"] = parseInt(verseCount);
    finalDict["editionNum"] = parseInt(verseCode[0]);
    finalDict["bookNum"] = parseInt(verseCode.slice(1, 3));
    finalDict["addressNum"] = parseInt(verseCode.slice(3, 9));
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

//There is probably a more efficient way to do this
function getAddressString(addressNum) {
    let splitAddress = [];
    //Necessary for the Psalms, where they may be no zero a 0 in the address. Spaghetti as hell so fix later
    if (addressNum.toString().includes("0")) {
        splitAddress = addressNum.toString().split("0");
    } else {
        return addressNum.toString().slice(0, 3) + ":" + (parseInt(addressNum.toString().slice(3, 6))).toString();
    }
        

    let newAddressList = [];
    for (let i = 0; i < splitAddress.length; i++) {
        if (splitAddress[i] != "") {
            newAddressList.push(splitAddress[i]);
        }
    }
    return newAddressList.join(":");
}

function processVerseCite(addressNum, editionList, countList, thisBookName) {
    let editionNum = 1;
    let totalCountVerse = 0;
    for (let i=0; i < editionList.length; i++) {
        editionNum *= editionList[i];
        totalCountVerse += countList[i];
    }

    // This gives a unique prime factorization of all the possibilities. E.g. an edition number of 6 should get no prefix (the book in question is only 1st/2nd edition and so 6 means it exists in both verses), but an edition number of 66 means that the word occurs in both of Eliot's editions of this verse but not Mayhew's (even though an edition of this verse by Mayhew exists).
    if (thisBookName == "Genesis") {
        editionNum *= 11;
    } else if (thisBookName == "Psalms (prose)" || thisBookName == "John") {
        editionNum *= 13;
    }
    let prefix = editionToSuperscriptDict[editionNum];

    let address = getAddressString(addressNum);

    let suffix = getCiteSuffix(editionList, countList);

    let finalString = prefix + address + suffix + ", ";

    return [finalString, totalCountVerse];

}

function getVerseCodeSpan(verseList, verseCount) {
    let verseCodeText = "";
    let dictOfDicts = {};
    let allBookList = [];
    
    for (let i = 0; i < verseList.length; i++) {
        let verseDict = decodeVerseCode(verseList[i], verseCount[i]);

        if (dictOfDicts[verseDict["bookNum"]] === undefined) {
            dictOfDicts[verseDict["bookNum"]] = [verseDict];
            allBookList.push(verseDict["bookNum"]);
        } else {
            dictOfDicts[verseDict["bookNum"]].push(verseDict);
        }
    }
    allBookList.sort();
    for (let j=0; j < allBookList.length; j++) {
        let thisBookDictList = dictOfDicts[allBookList[j]];
        let thisBookName = topBookList[allBookList[j] - 1];       

        let verseAddressDict = {};
        let verseCountDict = {};
        
        let allAddresses = [];
        for (let k=0; k < thisBookDictList.length; k++) {
            let thisVerseDict = thisBookDictList[k];
            let thisVerseEdition = thisVerseDict["editionNum"];
            let thisVerseAddress = thisVerseDict["addressNum"];
            let thisVerseCount = thisVerseDict["verseCount"];
            if (verseAddressDict[thisVerseAddress] === undefined) {
                verseAddressDict[thisVerseAddress] = [thisVerseEdition];
                verseCountDict[thisVerseAddress] = [thisVerseCount];
                allAddresses.push(thisVerseAddress);
            } else {
                verseAddressDict[thisVerseAddress].push(thisVerseEdition);
                verseCountDict[thisVerseAddress].push(thisVerseCount);
            }
        }

        let bookString = "<span style='margin-left:4em; display:inline-block'><i>" + thisBookName + "</i> (";
        let verseCiteString = ""
        let totalBookCount = 0;
        allAddresses.sort();
        for (let l=0; l < allAddresses.length; l++) {
            let thisAddress = allAddresses[l];
            let thisEditionList = verseAddressDict[thisAddress];
            let thisCountList = verseCountDict[thisAddress];
            let verseInfo = processVerseCite(thisAddress, thisEditionList, thisCountList, thisBookName);
            verseCiteString += verseInfo[0];
            totalBookCount += verseInfo[1];
        }

        bookString += totalBookCount.toString() + "): " + verseCiteString.slice(0, -2) + "</span><br><br>";
        verseCodeText += bookString;
    }
    return verseCodeText;
}

function processWordCites(word, totalCount, verseList, verseCountList, sortAlphabetical) {
    let outputSpan = document.createElement("span");
    word = word.split('8').join('ꝏ̄');
    let outputText = `<b>${word}</b> (${totalCount}):<br>`

    let verseCodeSpan = getVerseCodeSpan(verseList, verseCountList);

    //maybe these should be separate divs, who knows
    outputSpan.innerHTML = outputText + verseCodeSpan + "<br>";
    return outputSpan;
}

function sectionHeader(useAlphabetical, thisWord, thisWordCount, currentFirstLetter, lastWordCount, resultDiv, wordsWithThisHeader, headerToWordListDict) {
    let changeHeader = false;
    let tokenCount = 0;


    if (useAlphabetical) {
        tokenCount = headerToWordListDict[thisWord[0]];
        if (thisWord[0] != currentFirstLetter) {
            changeHeader = true;
            let firstLetterDiv = document.createElement("div");
            firstLetterDiv.style.fontSize = "24px";
            firstLetterDiv.innerHTML = "<u><b><i>" + thisWord[0] + "</i></b></u> (" + tokenCount.toString() + " words)<br>";
            resultDiv.appendChild(firstLetterDiv);
        }
    } else if (lastWordCount != thisWordCount) {
        tokenCount = headerToWordListDict[thisWordCount];
        changeHeader = true;
        let countDiv = document.createElement("div");
        countDiv.style.fontSize = "24px";
        countDiv.innerHTML = "<u><i><b>" + thisWordCount + "</b> tokens</i></u> (" + tokenCount.toString() + " words)<br>";
        resultDiv.appendChild(countDiv);
    }

    // For some weird kludge reason, I can update wordCount but not currentFirstLetter from in here, so let's just return them as values
    return [thisWordCount, thisWord[0], changeHeader];   
}


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

    for (let i=0; i < wordList.length; i++) {
        let thisWord = wordList[i];
        let wordCount = dictOfDicts[thisWord]["totalCount"];

        if (sortAlphabetical) {
            let firstLetter = thisWord[0];
            if (headerToWordListDict[firstLetter] === undefined) 
            {
                headerToWordListDict[firstLetter] = 0;
            } 
            headerToWordListDict[firstLetter] += wordCount;
        } else {
            if (headerToWordListDict[thisCount] === undefined) {
                headerToWordListDict[thisCount] = 0;
            } 
            headerToWordListDict[thisCount] += 1;
        }
    }

    for (let j=0; j < wordList.length; j++) {
        let word = wordList[j];
        let wordDict = dictOfDicts[word];
        let totalCount = wordDict["totalCount"];
        let allVerses = wordDict["allVerses"];
        let allCounts = wordDict["allVerseCounts"];

        totalTokens += totalCount;
        outputSpan = processWordCites(word, totalCount, allVerses, allCounts, sortAlphabetical);

        let updatedHeaderList = sectionHeader(sortAlphabetical, word, totalCount, currentFirstLetter, lastWordCount, resultDiv, wordsWithThisHeader, headerToWordListDict);

        lastWordCount = updatedHeaderList[0];
        currentFirstLetter = updatedHeaderList[1];

        if (updatedHeaderList[2]) {
            wordsWithThisHeader = 0;
        }
        wordsWithThisHeader += 1;
        resultDiv.appendChild(outputSpan);  
    }
    topSpan.innerHTML = `Found <b><u>${totalTokens}</u></b> tokens, representing <b><u>${totalWords}</u></b> distinct words.`;
    topSpan.style.fontSize = "32px";
    topDiv.appendChild(topSpan);

    resultDiv.hidden = false;
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

    processAllWordCites(newWordList, dictOfDicts, sortAlphabetical, resultDiv);
}

async function seeAllWords(fetchString, resultDiv, sortAlphabetical, sortByBook) {
    resultDiv.innerHTML = "";
    fetch(fetchString, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        if (res == []) {
            resultDiv.innerHTML = "No words found, and/or you tried to search for fewer than three letters (restricted for now to prevent too much overloading).";
        }
        getDictFromSearchOutput(res, resultDiv, sortAlphabetical, sortByBook);
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
