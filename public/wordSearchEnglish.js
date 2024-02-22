import { addTriangleToParent, topBookList, resetResults, getCountDictionaries, addChildToExistingTriangle, getHeaderText, getBooks, processBookData, zip, alphabetizeWords, cleanDiacritics, cleanPunctuation } from "./wordSearchFunctions.js";

function getTestWord(word, diacriticsLax=false) {
    let cleanedWord = word.toLowerCase();
    cleanedWord = cleanPunctuation(cleanedWord);
    if (diacriticsLax) {
        cleanedWord = cleanDiacritics(cleanedWord);
    }
    return cleanedWord;
}

function highlightSearchedWord(testWord, text, diacriticsLax=false) {
    let textWordList = text.split(" ");
    let finalWordList = [];
    for (let i = 0; i < textWordList.length; i++) {
        let thisWord = textWordList[i];
        if (getTestWord(thisWord, diacriticsLax) == testWord) {
            finalWordList.push('<span style="color:red; text-decoration:underline;">' + thisWord + '</span>');
        } else if (getTestWord(thisWord, true) == getTestWord(testWord, true)) {
            finalWordList.push('<span style="color:blue;">' + thisWord + '</span>');
        } else {
            finalWordList.push(thisWord);
        }
    }
    return finalWordList.join(" ");
}

function processVerseText(rawText, editionPrime, activeWord, laxDiacritics=false) {
    if (editionPrime < 11) {
        rawText = highlightSearchedWord(activeWord, rawText, laxDiacritics);
        rawText = rawText.split('8').join('ꝏ̄');
        rawText = rawText.split('$').join(' ');
        rawText = rawText.split('{').join('<i>');
        rawText = rawText.split('}').join('</i>');
    } else {
        rawText = highlightSearchedWord(activeWord, rawText, laxDiacritics);
    }
    return rawText;
}

function generateTable(headerList, verseTextList, activePrimeList, activeWord, laxDiacritics=false) {
    let finalTableWidth = 0;
    let cellWidths = [];
    for (let i = 0; i < verseTextList.length; i++) {
        let thisColumnLongestWord= 0;
        let splitText = verseTextList[i].split(" ");
        for (let j = 0; j < splitText.length; j++) {
            if (splitText[j].length > thisColumnLongestWord) {
                thisColumnLongestWord = splitText[j].length;
            }
        }
        let cellWidth = 0;
        if (activePrimeList[i] < 11) {
            cellWidth = thisColumnLongestWord * 15;
        } else {
            cellWidth = thisColumnLongestWord * 21;
        }
        cellWidths.push(cellWidth);
        finalTableWidth += cellWidth;
        finalTableWidth += 6; //padding
    }

    let table = document.createElement('table');
    let headerRow = document.createElement('tr');
    for (let i = 0; i < headerList.length; i++) {
        let thisHeader = document.createElement('th');
        thisHeader.style.width = cellWidths[i].toString() + "px";

        thisHeader.innerHTML = headerList[i];
        thisHeader.style.textDecoration = "underline";
        thisHeader.style.paddingLeft = "10px";
        thisHeader.style.paddingRight = "10px";
        if (i > 0) {
            thisHeader.style.borderLeft = "1px solid rgba(255, 0, 0)";
        }
        headerRow.appendChild(thisHeader);
    }
    table.appendChild(headerRow);
    let thisRow = document.createElement('tr');
    for (let j = 0; j < verseTextList.length; j++) {
        let p = activePrimeList[j];
        let thisData = document.createElement('td');
        thisData.style.width = cellWidths[j].toString() + "px";

        thisData.innerHTML = processVerseText(verseTextList[j], p, activeWord, laxDiacritics);
        thisData.style.textAlign = "left";
        thisData.style.verticalAlign = "top";
        thisData.style.paddingLeft = "10px";
        thisData.style.paddingRight = "10px";
        if (j > 0) {
            thisData.style.borderLeft = "1px solid rgba(255, 0, 0, 0.4)";
        }

        thisRow.appendChild(thisData);
    }
    table.appendChild(thisRow);
    return [table, finalTableWidth];
}

function getOtherEdition(book) {
    if (book == "Genesis") {
        return "Zeroth Edition"
    } else if (book == "Psalms (prose)" || book == "John") {
        return "Mayhew";
    } else {
        return "";
    }
}

async function showVersesInBox(popupContainer, dbCode, book, activeWord, laxDiacritics=false) {
    //why do we need to do this...?
    let allPopups = document.getElementsByClassName('show-verse');
    for (let i = 0; i < allPopups.length; i++) {
        allPopups[i].classList.toggle('active');
    }

    let otherEdition = getOtherEdition(book);
    popupContainer.innerHTML = "";
    
    let fetchString = "/fetchVerse/" + dbCode.toString();
    fetch(fetchString, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        popupContainer.innerHTML = "";
        let primeKeys = [2, 3, 5, 11, 13];
        let headerList = ["First Edition (α)", "Second Edition (β)", otherEdition, "KJV", "Greek/Hebrew"];
        let activeVerseTitles = [];
        let activeVerseText = [];
        let activePrimes = [];
        for (let i = 0; i < primeKeys.length; i++) {
            let p = primeKeys[i];
            if (res[p] != "") {
                activeVerseTitles.push(headerList[i]);
                activeVerseText.push(res[p]);
                activePrimes.push(p);
            }
        }
        let tableData = generateTable(activeVerseTitles, activeVerseText, activePrimes, activeWord, laxDiacritics);
        let table = tableData[0];
        let popupWidth = tableData[1];

        popupContainer.style.width = (popupWidth + 100).toString() + "px";
        popupContainer.appendChild(table);
    });

    popupContainer.style.position = "absolute";
    popupContainer.style.left = "10%";
    popupContainer.display = "inline";
    popupContainer.style.color = "black";

    let wordDivID = "word-" + activeWord + "-book-" + book + "-cites";
    let thisWordDiv = document.getElementById(wordDivID);
    thisWordDiv.style.width = "40%";

    popupContainer.classList.add("show-verse");
    popupContainer.classList.add("active");
    thisWordDiv.appendChild(popupContainer);
}

function addVersesToContainer(verseTextList, dbCodeList, word, book, laxDiacritics) {
    let verseCiteContainer = document.createElement("span");   
    verseCiteContainer.id = "word-" + word + "-book-" + book + "-cites";
    verseCiteContainer.style.width = "40%";
    for (let i=0; i < verseTextList.length; i++) {
        let thisDBCode = dbCodeList[i];

        let thisVerseSpan = document.createElement("span");
        

        thisVerseSpan.innerHTML = verseTextList[i];
        thisVerseSpan.style.textDecoration = "underline dot";
        thisVerseSpan.classList.add("cite-span");

        let popupContainer = document.createElement("span");
        
        thisVerseSpan.addEventListener("click", async function() {
            resetResults();

            thisVerseSpan.classList.toggle('active');
            await showVersesInBox(popupContainer, thisDBCode, book, word, laxDiacritics);
            thisVerseSpan.style.color = "blue";
            thisVerseSpan.style.fontWeight = "bold";
        });

        verseCiteContainer.appendChild(thisVerseSpan);
        if (i != verseTextList.length - 1) {
            let commaSpan = document.createElement("span");
            commaSpan.innerHTML = ",&nbsp;";
            commaSpan.textDecoration = "underline none";
            verseCiteContainer.appendChild(commaSpan);
        } else {
            if (verseTextList.length > 1) {
                let verseCountSpan = document.createElement("span");
                verseCountSpan.innerHTML = ` (${verseTextList.length} vv.)`;
                verseCountSpan.textDecoration = "underline none";
                verseCiteContainer.appendChild(verseCountSpan);
            }
        }
    }
    return verseCiteContainer;
}

document.addEventListener("click", function(event) {
    if (event.target.classList.contains('verse-click') || event.target.classList.contains('cite-span')) {
        return;
    } else {
        resetResults();
    }
});

function processAllWordCites(allWordList, dictOfDicts, sortAlphabetical, laxDiacritics) {
    let resultDiv = document.getElementById("results-container");
    let totalTokens = 0;

    let topDiv = document.getElementById("headline-container");
    topDiv.innerHTML = "";

    // wordList comes pre-sorted.
    let countData = getCountDictionaries(allWordList, dictOfDicts, sortAlphabetical);

    let allHeaders = 0;
    if (sortAlphabetical) {
        allHeaders = countData[0];
    } else {
        console.log(countData[0]);
        allHeaders = countData[0].length;
    }
    let headerToWordListDict = countData[1];
    let headerToWordCountDict = countData[2];
    let headerToTokenCountDict = countData[3];

    for (let i=0; i < allHeaders.length; i++) {
        let thisHeaderDiv = document.createElement("div");
        if (allHeaders[i] == undefined) {
            continue;
        }
        let thisHeader = "";
        if (sortAlphabetical) {
            thisHeader = allHeaders[i].toString();
        } else {
            thisHeader = allHeaders[i].length.toString();
        }
        let headerString = "";
        if (sortAlphabetical) {
            headerString = thisHeader[0];
        } else {
            console.log(thisHeader);
            headerString = thisHeader.toString();
        }

        let headerText = getHeaderText(headerToWordCountDict[thisHeader], headerToTokenCountDict[thisHeader].length.toString(), sortAlphabetical, headerString);

        thisHeaderDiv.id = "header-" + thisHeader;
        thisHeaderDiv.innerHTML = headerText;
        thisHeaderDiv.style = "font-size: 24px;";

        let wordList = headerToWordListDict[thisHeader];

        let headerTriangle = addTriangleToParent(thisHeaderDiv, "gray", "blue", true);
        
        for (let j=0; j < wordList.length; j++) {
            let thisWord = wordList[j];
            let thisWordDataDict = dictOfDicts[thisWord];

            let bookData = getBooks(thisWordDataDict["allVerses"], thisWordDataDict["allVerseCounts"], thisWord, true);

            let allBookNums = bookData[0];
            let allBookToVerseDict = bookData[1];

            let totalCount = thisWordDataDict["totalCount"].length.toString();
            //console.log(thisWordDataDict["totalCount"]);

            let ligaturedWord = thisWord.split('8').join('ꝏ̄');

            let thisWordDiv = document.createElement("div");

            thisWordDiv.innerHTML = `<b>${ligaturedWord}</b> (${totalCount}): `;
            
            
            thisWordDiv.style.fontSize = "16px";
            thisWordDiv.id = "headword-" + thisWord;

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
                
                let verseCiteContainer = addVersesToContainer(verseTextList, allDBCodes, thisWord, thisBookName, laxDiacritics);

                if (verseTextList.length > 25) {           
                    let bookTriangle = addTriangleToParent(thisBookSpan, "gray", "red", true);

                    let breakSpan1 = document.createElement("br");
                    verseCiteContainer.appendChild(breakSpan1);

                    let breakSpan2 = document.createElement("br");

                    addChildToExistingTriangle(thisBookSpan, bookTriangle, verseCiteContainer);
               
                    addChildToExistingTriangle(thisBookSpan, bookTriangle, breakSpan2);
                                        
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

                    bookContainer.appendChild(document.createElement("br"));
                }
            }
            addChildToExistingTriangle(thisHeaderDiv, headerTriangle, thisWordDiv); 
        }
        resultDiv.appendChild(thisHeaderDiv);
    }
    let totalWordCount = countData[4];
    let totalTokenCount = countData[5];

    topDiv.style.fontSize = "30px";
    topDiv.innerHTML = `Found <b><u>${totalTokens}</u></b> verses, representing <b><u>${totalWordCount}</u></b> distinct words.`;
}

function getRightWordList(sortAlphabetical, wordList, dictOfDicts) {
    let newWordList = [];
    if (sortAlphabetical) {
        return wordList.sort();
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
            thisWordList = thisWordList.sort();
            for (let k = 0; k < thisWordList.length; k++) {
                newWordList.push(thisWordList[k]);
            }
        }
    }
    return newWordList;
}

function getDictFromSearchOutput(output, sortAlphabetical) {
    let wordToVerseCitesDict = output[0];
    let wordToTokensDict = output[1];

    let allWords = Object.keys(wordToTokensDict);
    let dictOfDicts = {};
    for (let i = 0; i < allWords.length; i++) {
        let word = allWords[i];
        let totalCount = wordToTokensDict[word];
        let allVerseList = wordToVerseCitesDict[word];

        let dummyVerseCountList = [];
        for (let j = 0; j < allVerseList.length; j++) {
            dummyVerseCountList.push(1);
        }

        let processedDict = {};
        processedDict["word"] = word;
        processedDict["totalCount"] = totalCount;
        processedDict["allVerses"] = allVerseList;
        processedDict["allVerseCounts"] = dummyVerseCountList;
        dictOfDicts[word] = processedDict;
    }

    let newWordList = getRightWordList(sortAlphabetical, allWords, dictOfDicts);

    processAllWordCites(newWordList, dictOfDicts, sortAlphabetical, true);
}

function checkIfWordMatches(word, searchString, searchSetting) {
    if (searchSetting == "exact") {
        return (searchString == word);
    } else if (searchSetting == "contains") {
        return (word.includes(searchString));
    } else if (searchSetting == "starts") {
        return (word.startsWith(searchString));
    } else if (searchSetting == "ends") {
        return (word.endsWith(searchString));
    }
}

function getMatchingDicts(allArrays, searchString, searchSetting) {
    let finalVerseDict = {};
    let finalTokenDict = {};
    for (let i=0; i < allArrays.length; i++) {
        let thisDict = allArrays[i];
        let fullWord = thisDict["word"];
        if (checkIfWordMatches(fullWord, searchString, searchSetting)) {
            finalVerseDict[fullWord] = thisDict["verses"];
            finalTokenDict[fullWord] = thisDict["count"];
        }
    }
    return [finalVerseDict, finalTokenDict];
}

async function getEnglishWordData(searchSetting, searchString) {
    let englishDataFile = await fetch("./KJV JSONs/words.json");
    let englishData = await englishDataFile.json();

    let allMatchingDicts = getMatchingDicts(englishData, searchString, searchSetting);
    let wordVersesDict = allMatchingDicts[0];
    let wordTokensDict = allMatchingDicts[0];

    return [wordVersesDict, wordTokensDict];
}

async function runSearch() {
    let searchSetting = document.getElementById("searchWordDropdown").value;
    let searchString = document.getElementById("search_bar").value;

    let output = await getEnglishWordData(searchSetting, searchString.toLowerCase())
    
    let sortAlphabetical = document.getElementById("sortAlph").checked;
    
    let resultDiv = document.getElementById("results-container");
    resultDiv.innerHTML = "";

    getDictFromSearchOutput(output, sortAlphabetical);

    for (let i = 0; i < 25; i++) {
        let breakSpan = document.createElement("br");
        resultDiv.appendChild(breakSpan);
    }
}

document.getElementById("search_bar").addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        runSearch();
    }
});
document.getElementById("searchButton").addEventListener("click", runSearch);