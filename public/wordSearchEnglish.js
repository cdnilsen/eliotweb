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

function cleanPunctuation(word) {
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