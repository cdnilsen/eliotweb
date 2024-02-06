const bookToNumberDict = {
    "Genesis": "01",
    "Exodus": "02",
    "Leviticus": "03",
    "Numbers": "04",
    "Deuteronomy": "05",
    "Joshua": "06",
    "Judges": "07",
    "Ruth": "08",
    "1 Samuel": "09",
    "2 Samuel": "10",
    "1 Kings": "11",
    "2 Kings": "12",
    "1 Chronicles": "13",
    "2 Chronicles": "14",
    "Ezra": "15",
    "Nehemiah": "16",
    "Esther": "17",
    "Job": "18",
    "Psalms (prose)": "19",
    //"Psalms (metrical)", Will require a separate process
    "Proverbs": "20",
    "Ecclesiastes": "21",
    "Song of Songs": "22",
    "Isaiah": "23",
    "Jeremiah": "24",
    "Lamentations": "25",
    "Ezekiel": "26",
    "Daniel": "27",
    "Hosea": "28",
    "Joel": "29",
    "Amos": "30",
    "Obadiah": "31",
    "Jonah": "32",
    "Micah": "33",
    "Nahum": "34",
    "Habakkuk": "35",
    "Zephaniah": "36",
    "Haggai": "37",
    "Zechariah": "38",
    "Malachi": "39",
    "Matthew": "40",
    "Mark": "41",
    "Luke": "42",
    "John": "43",
    "Acts": "44",
    "Romans": "45",
    "1 Corinthians": "46",
    "2 Corinthians": "47",
    "Galatians": "48",
    "Ephesians": "49",
    "Philippians": "50",
    "Colossians": "51",
    "1 Thessalonians": "52",
    "2 Thessalonians": "53",
    "1 Timothy": "54",
    "2 Timothy": "55",
    "Titus": "56",
    "Philemon": "57",
    "Hebrews": "58",
    "James": "59",
    "1 Peter": "60",
    "2 Peter": "61",
    "1 John": "62",
    "2 John": "63",
    "3 John": "64",
    "Jude": "65",
    "Revelation": "66"
};

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

const NTBookList = [
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

const bookToChapterVerseDict = {
    //Some of these are going to be off, especially in the Psalms
    "Genesis": [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 54, 33, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
    "Exodus": [22, 25, 22, 31, 23, 30, 29, 28, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 37, 30, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
    "Leviticus": [17, 16, 17, 35, 26, 23, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
    "Numbers": [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 35, 28, 32, 22, 29, 35, 41, 30, 25, 19, 65, 23, 31, 39, 17, 54, 42, 56, 29, 34, 13],
    "Deuteronomy": [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 31, 19, 29, 23, 22, 20, 22, 21, 20, 23, 29, 26, 22, 19, 19, 26, 69, 28, 20, 30, 52, 29, 12, ],
    "Joshua": [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33],
    "Judges": [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25],
    "Ruth": [22, 23, 18, 22, ],
    "1 Samuel": [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 16, 23, 28, 23, 43, 25, 12, 25, 11, 31, 13, ],
    "2 Samuel": [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 32, 44, 26, 22, 51, 39, 25],
    "1 Kings": [53, 46, 28, 20, 32, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 54],
    "2 Kings": [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 20, 22, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30, ],
    "1 Chronicles": [54, 55, 24, 43, 41, 66, 40, 40, 44, 14, 47, 41, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30],
    "2 Chronicles": [18, 17, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 23, 14, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 26, 23],
    "Ezra": [11, 70, 13, 24, 17, 22, 28, 36, 15, 44, ],
    "Nehemiah": [11, 20, 38, 17, 19, 19, 72, 18, 37, 40, 36, 47, 31],
    "Esther": [22, 23, 15, 17, 14, 14, 10, 17, 32, 3, 17, 8, 30, 16, 24, 10],
    "Job": [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 21, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 32, 26, 17, ],
    "Psalms (prose)": [6, 11, 9, 9, 13, 11, 18, 10, 21, 18, 7, 9, 6, 7, 5, 11, 15, 51, 15, 10, 14, 32, 6, 10, 22, 11, 14, 9, 11, 13, 25, 11, 22, 23, 28, 13, 40, 23, 14, 18, 14, 12, 5, 27, 18, 12, 10, 15, 21, 23, 21, 11, 7, 9, 24, 14, 12, 12, 18, 14, 9, 13, 12, 11, 14, 20, 8, 36, 37, 6, 24, 20, 28, 23, 11, 13, 21, 72, 13, 20, 17, 8, 19, 13, 14, 17, 7, 19, 53, 17, 16, 16, 5, 23, 11, 13, 12, 9, 9, 5, 8, 29, 22, 35, 45, 48, 43, 14, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 14, 10, 8, 12, 15, 21, 10, 20, 14, 9, 6],
    "Proverbs": [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31, ],
    "Ecclesiastes": [18, 26, 22, 17, 19, 12, 29, 17, 18, 20, 10, 14, ],
    "Song of Songs": [17, 17, 11, 16, 16, 12, 14, 14],
    "Isaiah": [31, 22, 26, 6, 30, 13, 25, 23, 20, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 11, 25, 24, ],
    "Jeremiah": [19, 37, 25, 31, 31, 30, 34, 23, 25, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34],
    "Lamentations": [22, 22, 66, 22, 22],
    "Ezekiel": [8, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 44, 37, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35],
    "Daniel": [21, 49, 100, 34, 30, 29, 28, 27, 27, 21, 45, 13, 64, 42, ],
    "Hosea": [9, 25, 5, 19, 15, 11, 16, 14, 17, 15, 11, 15, 15, 10, ],
    "Joel": [20, 27, 5, 21, ],
    "Amos": [15, 16, 15, 13, 27, 14, 17, 14, 15],
    "Obadiah": [21],
    "Jonah": [16, 11, 10, 11],
    "Micah": [16, 13, 12, 13, 15, 16, 20],
    "Nahum": [14, 14, 19],
    "Habakkuk": [17, 20, 19],
    "Zephaniah": [18, 15, 20],
    "Haggai": [15, 23],
    "Zechariah": [17, 17, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21, ],
    "Malachi": [14, 17, 18, 6],
    "Matthew": [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20],
    "Mark": [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
    "Luke": [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53],
    "John": [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
    "Acts": [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 40, 38, 40, 30, 35, 27, 27, 32, 44, 31],
    "Romans": [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
    "1 Corinthians": [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
    "2 Corinthians": [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13],
    "Galatians": [24, 21, 29, 31, 26, 18],
    "Ephesians": [23, 22, 21, 32, 33, 24],
    "Philippians": [30, 30, 21, 23],
    "Colossians": [29, 23, 25, 18],
    "1 Thessalonians": [10, 20, 13, 18, 28],
    "2 Thessalonians": [12, 17, 18],
    "1 Timothy": [20, 15, 16, 16, 25, 21],
    "2 Timothy": [18, 26, 17, 22],
    "Titus": [16, 15, 15],
    "Philemon": [25],
    "Hebrews": [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
    "James": [27, 26, 18, 17, 20],
    "1 Peter": [25, 25, 22, 19, 14],
    "2 Peter": [21, 22, 18],
    "1 John": [10, 29, 24, 21, 21],
    "2 John": [13],
    "3 John": [15],
    "Jude": [25],
    "Revelation": [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21]
};

//Needs to be updated manually.
const bookToActiveEditionsDict = {
    "Genesis": 3,
    "Exodus": 6,
    "Leviticus": 6,
    "Numbers": 3,
    "Deuteronomy": 3,
    "Joshua": 3, 
    "Judges": 1,
    "Ruth": 6,
    "1 Samuel": 1,
    "2 Samuel": 1,
    "1 Kings": 1,
    "2 Kings": 1,
    "1 Chronicles": 1,
    "2 Chronicles": 1,
    "Ezra": 1,
    "Nehemiah": 1,
    "Esther": 1,
    "Job": 2,
    "Psalms (prose)": 10,
    //"Psalms (metrical)", Will require a separate process
    "Proverbs": 2, 
    "Ecclesiastes": 2,
    "Song of Songs": 6,
    "Isaiah": 1,
    "Jeremiah": 1,
    "Lamentations": 6,
    "Ezekiel": 1,
    "Daniel": 1,
    "Hosea": 1, 
    "Joel": 1, 
    "Amos": 1,
    "Obadiah": 6, 
    "Jonah": 6,
    "Micah": 1,
    "Nahum": 6,
    "Habakkuk": 6,
    "Zephaniah": 6,
    "Haggai": 6, 
    "Zechariah": 6,
    "Malachi": 1,
    "Matthew": 6,
    "Mark": 6, 
    "Luke": 6,
    "John": 30,
    "Acts": 6,
    "Romans": 6,
    "1 Corinthians": 6,
    "2 Corinthians": 6,
    "Galatians": 6,
    "Ephesians": 6,
    "Philippians": 6,
    "Colossians": 6,
    "1 Thessalonians": 6,
    "2 Thessalonians": 6,
    "1 Timothy": 6,
    "2 Timothy": 6,
    "Titus": 6,
    "Philemon": 6,
    "Hebrews": 6,
    "James": 6,
    "1 Peter": 6,
    "2 Peter": 6,
    "1 John": 6,
    "2 John": 6,
    "3 John": 6,
    "Jude": 6,
    "Revelation": 6
};

//Seems to be necessary for it to show anything
let bookDropdown = document.getElementById("searchBookDropdown");
let genesisOption = document.createElement('option');
genesisOption.text = "Genesis";
genesisOption.value = "Genesis";
bookDropdown.add(genesisOption);

for (let i = 1; i < allBookList.length; i++) {
    let book = allBookList[i];
    if (bookToActiveEditionsDict[book] > 1) {
        let bookOption = document.createElement('option');
        bookOption.text = book;
        bookOption.value = book;
        bookDropdown.add(bookOption);
    }
}

let chapterDropdown = document.getElementById("chapterSelectionDropdown");
let chapterLegend = document.getElementById("searchChapterLegend");
function updateChapterDropdown(whichBook) {
    chapterDropdown.innerHTML = "";
    let chapter1option = document.createElement("option");
    chapter1option.text = 1;
    chapter1option.value = 1;
    chapterDropdown.add(chapter1option);
    if (bookToChapterDict[whichBook] > 1) {
        for (let i = 2; i <= bookToChapterDict[whichBook]; i++) {
            let option = document.createElement("option");
            option.text = i;
            option.value = i;
            chapterDropdown.add(option);
        }
    }
}

function revealCheckboxes(book) {
    let activeEditionsNumber = bookToActiveEditionsDict[book];
    let editionContainerDict = {
        2: document.getElementById('firstEditionContainer'),
        3: document.getElementById('secondEditionContainer'),
        5: document.getElementById('mayhewContainer'),
        7: document.getElementById('zerothContainer'),
        13: document.getElementById('grebrewContainer')
    }

    let editionCheckboxDict = {
        2: document.getElementById('useFirstEdition'),
        3: document.getElementById('useSecondEdition'),
        5: document.getElementById('useMayhew'),
        7: document.getElementById('useZerothEdition'),
        13: document.getElementById('useGrebrew')
    }

    let originalLanguage = "";
    if (NTBookList.includes(book)) {
        originalLanguage = "Greek";
    } else {
        originalLanguage = "Hebrew";
    }

    let whichPrimesList = [2, 3, 5, 7, 13];
    for (let i = 0; i < whichPrimesList.length; i++) {
        let p = whichPrimesList[i];
        if (activeEditionsNumber % p == 0) {
            editionContainerDict[p].hidden = false;
            editionCheckboxDict[p].checked = true;
        }
    }
    document.getElementById('grebrewLabel').innerHTML = "Show " + originalLanguage;
}

updateChapterDropdown('Genesis');
revealCheckboxes('Genesis');

//Returns a unique integer for the combo of editions that the user wants to view; can be decomposed in the backend by modularity testing.
function getEditionCompositeNumber(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew) {
    let editionQueryNumber = 1;

    if (useFirst) {
        editionQueryNumber *= 2;
    }
    if (useSecond) {
        editionQueryNumber *= 3;
    }
    if (useMayhew) {
        editionQueryNumber *= 5;
    }
    if (useZeroth) {
        editionQueryNumber *= 7;
    }
    if (useKJV) {
        editionQueryNumber *= 11;
    }
    if (useGrebrew) {
        editionQueryNumber *= 13;
    }
    return editionQueryNumber;
}

function appendNumberToIDString(IDString, number) {
    let finalString = IDString;
    if (number < 10) {
        finalString += "00" + number.toString();
    } else if (number < 100) {
        finalString += "0" + number.toString();
    }
    return finalString;
}

function getEditionName(book, editionNumber) {
    let originalLanguage = "";
    if (NTBookList.includes(book)) {
        originalLanguage = "Greek";
    } else {
        originalLanguage = "Hebrew";
    }

    let primeToEditionDict = {
        2: "First Edition",
        3: "Second Edition",
        5: "Mayhew",
        7: "Zeroth Edition",
        11: "KJV",
        13: originalLanguage,
        43: "Verse"
    }

    return primeToEditionDict[editionNumber];
}

function getUsefulPrimes(compositeEditionNumber, listOfPrimes, bookName) {
    let usefulPrimeList = [];
    let editionNameList = [];
    let addedVerseColumn = false;
    for (let i = 0; i < listOfPrimes.length; i++) {
        if (compositeEditionNumber % listOfPrimes[i] == 0) {
            let thisPrime = listOfPrimes[i];
            if (!addedVerseColumn && thisPrime > 3) {
                usefulPrimeList.push(43);
                editionNameList.push("Verses");
                addedVerseColumn = true;
            }
            usefulPrimeList.push(thisPrime);
            editionNameList.push(getEditionName(bookName, thisPrime));
        }
    }
    return [usefulPrimeList, editionNameList];
}

function columnHeaderPopulator(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, bookName) {
    let numLeftColumns = 0;
    let numRightColumns = 0;

    let leftColumnList = [];
    let rightColumnList = [];

    let leftColumnIndexList = [];
    let rightColumnIndexList = [];

    let useHebrew = false;

    let useOther = useMayhew || useZeroth;
    let otherEditionNumber = 1;

    if (useMayhew) {
        otherEditionNumber *= 5;
    } else if (useZeroth) {
        otherEditionNumber *= 7;
    }
    
    let otherName = "";
    if (useMayhew) {
        otherName = "Mayhew";
    } else if (useZeroth) {
        otherName = "Zeroth Edition";
    }

    if (useFirst) {
        numLeftColumns += 1;
        leftColumnList.push("First Edition");
        leftColumnIndexList.push(2);
    }

    if (useSecond) {
        numLeftColumns += 1;
        leftColumnList.push("Second Edition");
        leftColumnIndexList.push(3);
    }

    if (!useFirst && !useSecond && useOther) {
        numLeftColumns += 1;
        leftColumnList.push(otherName);
        leftColumnIndexList.push(otherEditionNumber);
    } else if (useOther) {
        numRightColumns += 1;
        rightColumnList.push(otherName);
        rightColumnIndexList.push(otherEditionNumber);
    }
    
    if (useKJV) {
        numRightColumns += 1;
        rightColumnList.push("KJV");
        rightColumnIndexList.push(11);
    }

    if (useGrebrew) {
        numRightColumns += 1;
        let nameString = "";
        if (NTBookList.includes(bookName)) {
            nameString = "Greek";
        } else {
            nameString = "Hebrew";
            useHebrew = true;
        }
        rightColumnList.push(nameString);
        rightColumnIndexList.push(13);
    }

    return [numLeftColumns, numRightColumns, leftColumnList, rightColumnList, leftColumnIndexList, rightColumnIndexList, useHebrew];
}

// Backend "Ƀβ" get turned into blue tags (for differences in case), "Řř" get turned into red tags (for actual differences in the text)
function cleanProcessedString(myString, showDifferences, showCasing) {

    // Not *really* necessary, but speeds up processing by checking whether all this replacement needs to be done
    if (showDifferences || showCasing) {

        myString = myString.split("Ƀβ").join("");
        myString = myString.split("Řř").join("");
        
        myString = myString.split("Ƀ{β").join("{");
        myString = myString.split("Ř{ř").join("{");
        myString = myString.split("Ƀ}").join("}");
        myString = myString.split("Ř}ř").join("}");
        // Even if difference marking isn't chosen we still want to make it easier to see e.g. <nnih> vs. <n($)nih>
        myString = myString.split("Ř ř").join("Ř˙ř");
        myString = myString.split("Ř$ř").join("Ř˙ř");
        myString = myString.split("$").join(" ");

        if (showCasing) {
            myString = myString.split("Ƀ").join('<span style="color: blue"><b>');
            myString = myString.split("β").join("</b></span>");
        } else {
            myString = myString.split("Ƀ").join("");
            myString = myString.split("β").join("");
        }

        myString = myString.split("Ř").join('<span style="color: red"><b>');
        myString = myString.split("ř").join("</b></span>");
        
    } else {
        myString = myString.split('$').join(' ');
        myString = myString.split("Ř").join("");
        myString = myString.split("ř").join("");
    }

    myString = myString.split('8').join('ꝏ̄');
    myString = myString.split('{').join('<i>');
    myString = myString.split('}').join('</i>');

    return myString;
}

function findLongestCommonSubstring(str1, str2) {
    let longestSubstring = ""; 
    for (let i = 0; i < str1.length; i++) { 
        for (let j = 0; j < str2.length; j++) { 
            let substring = ""; 
            let x = i; 
            let y = j; 
            while (x < str1.length &&  
                   y < str2.length &&  
                   str1[x] === str2[y]) { 
                substring += str1[x]; 
                x++;
                y++;
            } 
            if (substring.length > longestSubstring.length) { 
                longestSubstring = substring; 
            } 
        } 
    } 
    return longestSubstring; 
}

//This is mildly bugged, in that if one of the mismatched parts of a string is mismatched due to casing, then it will still color it red
function replaceMiniSharedStrings(string, sharedString, matchesCase) {
    let finalString = "";
    let bracketDict = {};

    if (matchesCase) {
        bracketDict["start"] = "Ƀ";
        bracketDict["end"] = "ƀ";
    } else {
        bracketDict["start"] = "Ř";
        bracketDict["end"] = "ř";
    }

    if (sharedString != "" && string != sharedString) {
        if (string.startsWith(sharedString)){
            finalString = sharedString + bracketDict["start"] + string.slice(sharedString.length) + bracketDict["end"];
        } else if (string.endsWith(sharedString)){
            finalString = bracketDict["start"]+ string.slice(0, -sharedString.length) + bracketDict["end"] + sharedString;
        } else if (string != sharedString) {
            finalString = bracketDict["start"] + string.split(sharedString).join(bracketDict["end"] + sharedString + bracketDict["start"]) + bracketDict["end"];
        }
    } else if (string != sharedString) {
        finalString = bracketDict["start"] + string + bracketDict["end"];
    } else {
        finalString = string;
    }
    return finalString;
}

function replaceCommonSubstrings(text1, text2, index) {
    let commonSubstring = "";

    if (text1 == text2) {
        commonSubstring = text1;
    } else {
        commonSubstring = findLongestCommonSubstring(text1, text2);
    }

    let text1Split = text1.split(commonSubstring);
    let text2Split = text2.split(commonSubstring);

    let outputText1 = "";
    let outputText2 = "";

    let commonSubstringLength = commonSubstring.length;

    let commonSubstringFirst = false;

    if (text1.startsWith(commonSubstring)) {
        outputText1 = 'ǀ‹' + index.toString() + '›ǀ' + text1.slice(commonSubstringLength);
        commonSubstringFirst = true;
    } else {
        outputText1 = text1Split.join('ǀ‹' + index.toString() + '›ǀ');
    }
    
    if (text2.startsWith(commonSubstring)) {
        outputText2 = 'ǂ«' + index.toString() + '»ǂ' + text2.slice(commonSubstringLength);
    } else {
        outputText2 = text2Split.join('ǂ«' + index.toString() + '»ǂ');
    }


    let outputDict = {
        "processedText1" : outputText1,
        "processedText2" : outputText2,
        "commonSubstring" : commonSubstring,
        "startsWithShared": commonSubstringFirst
    }

    return outputDict;
}

function stringIsShared(string, guillemet){
    let answer = false;
    if (string[0] == guillemet) {
        answer = true;
    }
    return answer;
}

function addDummyListEntries(splitList, guillemet) {

    let rightGuillemetDict = {
        "‹" : "›",
        "«" : "»"
    }

    let rightGuillemet = rightGuillemetDict[guillemet];
    let intermediateList = [];

    for (let i = 0; i < splitList.length - 1; i++) {
        let thisElement = splitList[i];
        let nextElement = splitList[i+1];

        if (stringIsShared(thisElement, guillemet) && stringIsShared(nextElement, guillemet)) {
            intermediateList.push(thisElement);
            intermediateList.push("");
            intermediateList.push(nextElement);
        } else {
            intermediateList.push(thisElement);
            intermediateList.push(nextElement);
        }
        i += 1;
    }

    let finalList = [];
    for (let j = 0; j < intermediateList.length; j++) {
        if (intermediateList[j] != guillemet && intermediateList[j] != rightGuillemet) {
            finalList.push(intermediateList[j]);
        }
    }

    return finalList;
}

function getIndexFromGuillemetString(string, guillemet) {
    let rightGuillemetDict = {
        "‹" : "›",
        "«" : "»"
    }
    let rightGuillemet = rightGuillemetDict[guillemet];

    return parseInt(string.slice(1, -1));
}
 
function putSubstringsBackIn(text1Split, text2Split, indexToSubstringDict) {
    let finalString1 = "";
    let finalString2 = "";
    for (let i = 0; i < text1Split.length; i++) {
        if (stringIsShared(text1Split[i], "‹") && stringIsShared(text2Split[i], "«")) {
            let text1Index = getIndexFromGuillemetString(text1Split[i], "‹");
            let text2Index = getIndexFromGuillemetString(text2Split[i], "«");

            let substring1 = indexToSubstringDict[text1Index];
            let substring2 = indexToSubstringDict[text2Index];

            if (substring1 == substring2) {
                finalString1 += substring1;
                finalString2 += substring2;
            } else if (substring1.toLowerCase() != substring2.toLowerCase()) {
                let commonSubstring = findLongestCommonSubstring(substring1, substring2);

                let addString1 = replaceMiniSharedStrings(substring1, commonSubstring, false);
                let addString2 = replaceMiniSharedStrings(substring2, commonSubstring, false);

                finalString1 += addString1;
                finalString2 += addString2;
            } else {
                let commonSubstring = findLongestCommonSubstring(substring1, substring2);

                let addString1 = replaceMiniSharedStrings(substring1, commonSubstring, true);
                let addString2 = replaceMiniSharedStrings(substring2, commonSubstring, true);

                finalString1 += addString1;
                finalString2 += addString2;
            }
        } else if (text1Split[i].toLowerCase() == text2Split[i].toLowerCase() && text1Split[i] != text2Split[i]) {
            let commonSubstring = findLongestCommonSubstring(text1Split[i], text2Split[i]);

            let addString1 = replaceMiniSharedStrings(text1Split[i], commonSubstring, true);
            let addString2 = replaceMiniSharedStrings(text2Split[i], commonSubstring, true);

            finalString1 += addString1;
            finalString2 += addString2;

        } else {
            let commonSubstring = findLongestCommonSubstring(text1Split[i], text2Split[i]);

            let addString1 = replaceMiniSharedStrings(text1Split[i], commonSubstring, false);
            let addString2 = replaceMiniSharedStrings(text2Split[i], commonSubstring, false);

            finalString1 += addString1;
            finalString2 += addString2;
        } 
    }
    let listOfStrings = [finalString1, finalString2];
    let finalStringList = [];
    for (let j = 0; j < 2; j++) {
        let thisString = listOfStrings[j];
        thisString = thisString.split("Řř").join("");
        thisString = thisString.split("Ƀƀ").join("");
        finalStringList.push(thisString);
    }
    return finalStringList;
}

function isDigit(char) {
    return Boolean([true, true, true, true, true, true, true, true, true, true][char]);
}

//Horrible little Macgyvered solution
function replaceInitialDigits(string, startingSubstring) {
    if(!isDigit(string[0])) {
        return string;
    }
    else {
        let finalString = startingSubstring;
        let digitsStopped = false;
        for (let i = 0; i < string.length; i++) {
            if (!isDigit(string[i])) {
                digitsStopped = true
            }
            if (digitsStopped) {
                finalString += string[i];
            }
        }
        return finalString;
    }
}

function substringPopulationChecker(text1Split, text2Split, indexToSubstringDict) {

    let listsAreSameLength = text1Split.length == text2Split.length;

    let finalStringList = [];

    if (!listsAreSameLength) {
        console.log("Lists are not the same length.");
    } else {
        finalStringList = putSubstringsBackIn(text1Split, text2Split, indexToSubstringDict);
    }
    return finalStringList;
}

function replaceDummiesWithTags(string, showCasing) {
    let finalString = string.split("Ř").join("<span style='color:red'><b>");
    finalString = finalString.split("ř").join("</b></span>");
    if (showCasing) {
        finalString = finalString.split("Ƀ").join("<span style='color:blue'><b>");
        finalString = finalString.split("ƀ").join("</b></span>");
    } else {
        finalString = finalString.split("Ƀ").join("");
        finalString = finalString.split("ƀ").join("");
    }
    return finalString;
}

function compareVerses(text1, text2, showCasing) {
    let commonSubstringLengthMoreThan1 = true;
    let currentSubstringIndex = 0;

    let indexToSubstringDict = {};

    let currentText1 = text1;
    let currentText2 = text2;

    let outerDiv = document.createElement('div');

    let finalText1 = "";
    let finalText2 = "";

    let startsWithShared = false;
    let startingCommon = "";
    while (commonSubstringLengthMoreThan1 && currentSubstringIndex < 50) {
        let processedTextDict = replaceCommonSubstrings(currentText1, currentText2, currentSubstringIndex);

        indexToSubstringDict[currentSubstringIndex] = processedTextDict["commonSubstring"];

        if (processedTextDict["startsWithShared"]) { 
            startingCommon = processedTextDict["commonSubstring"];
            startsWithShared = true;
        }

        currentText1 = processedTextDict["processedText1"];

        currentText2 = processedTextDict["processedText2"];

        currentSubstringIndex += 1;

        if (processedTextDict["commonSubstring"].length < 2) {
            commonSubstringLengthMoreThan1 = false;
        }
    finalText1 = currentText1;
    finalText2 = currentText2;
    }

    if (finalText1.startsWith("ǀ‹ǀ‹")) {
        finalText1 = finalText1.slice(2);
    }

    if (finalText2.startsWith("ǂ«ǂ«")) {
        finalText2 = finalText2.slice(2);
    }


    if (finalText1.endsWith("›ǀ›ǀ")) {
        finalText1 = finalText1.slice(0, -2);
    }

    if (finalText2.endsWith("»ǂ»ǂ")) {
        finalText2 = finalText2.slice(0, -2);
    }

    finalText1 = finalText1.split("ǀ‹ǀ‹").join("ǀ‹");
    finalText2 = finalText2.split("ǂ«ǂ«").join("ǂ«");
    finalText1 = finalText1.split("›ǀ›ǀ").join("›ǀ");
    finalText2 = finalText2.split("»ǂ»ǂ").join("»ǂ");
    
    let text1SplitList = finalText1.split("ǀ");
    let text2SplitList = finalText2.split("ǂ");
    
    let replacementList1 = addDummyListEntries(text1SplitList, '‹');
    let replacementList2 = addDummyListEntries(text2SplitList, '«');

    let finalStringList = substringPopulationChecker(replacementList1, replacementList2, indexToSubstringDict);

    let newStringList = [];

    if (startsWithShared) {
        let firstEditionText = replaceInitialDigits(finalStringList[0], startingCommon);

        let secondEditionText = replaceInitialDigits(finalStringList[1], startingCommon);

        newStringList.push(replaceDummiesWithTags(firstEditionText, showCasing));
        newStringList.push(replaceDummiesWithTags(secondEditionText, showCasing));
    } else {
        newStringList = finalStringList;
    }
    return newStringList;
}

function addComparedVersesToDict(dict, modInt, showCasing, editionNumber) {
    let useZeroth = (editionNumber % 7 == 0);

    let firstEditionText = dict[2];
    let secondEditionText = dict[3];

    let comparedVerseList = compareVerses(firstEditionText, secondEditionText, showCasing);
    dict[2] = comparedVerseList[0];
    dict[3] = comparedVerseList[1];

    //The zeroth edition Genesis's differences are wrt the first edition, although the first edition's are still vs. the 2nd
    if (useZeroth) {
        let zerothComparedList = compareVerses(dict[7], dict[2], showCasing);
        dict[7] = zerothComparedList[0];
    }
}

function columnMeasurePopulator(numLeftColumns, numRightColumns) {
    let allColumnMeasures = "";
    //let rightColumnMeasure = "10%";
    let verseColumnMeasure = "10%"
    if (numLeftColumns == 1) {
        allColumnMeasures += "45% ";
    } else if (numLeftColumns == 2) {
        allColumnMeasures += "22.5% ";
        allColumnMeasures += "22.5% ";
    }

    allColumnMeasures += verseColumnMeasure + " ";
    
    if (numRightColumns == 3) {
        allColumnMeasures += "15% ";
        allColumnMeasures += "15% ";
        allColumnMeasures += "15% ";
    } else if (numRightColumns == 2) {
        //rightColumnMeasure = "22.5%";
        allColumnMeasures += "22.5% ";
        allColumnMeasures += "22.5% ";
    } else {
        //rightColumnMeasure = "45%";
        allColumnMeasures += "45% ";
    }
    return allColumnMeasures.trim();
}

async function displayChapterText(book, chapter, useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, showTextDifferences, showCasing, textContainer) {

    textContainer.innerHTML = "";

    let editionNumber = getEditionCompositeNumber(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew);

    let useRawText = !showTextDifferences && !showCasing;

    let useRawString = ""
    if (useRawText) {
        useRawString = 'true';
    } else {
        useRawString = 'false';
    }

    let columnHeads = columnHeaderPopulator(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, book);
    let firstIndex = columnHeads[4][0];
    let verseRowStyleString = "grid-template-columns: " + columnMeasurePopulator(columnHeads[0], columnHeads[1]) + ";";

    let headerDiv = document.getElementById("editionHeaders");
    headerDiv.innerHTML = "";

    fetch('/fetchChapter/' + book + '/' + chapter + '/' + editionNumber.toString() + '/' + useRawString, {
        method: 'GET',
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        
        let numOfVerses = parseInt(res[101]);
        let primeNumbers = [2, 3, 5, 7, 11, 13];
        let fetchedEditions = getUsefulPrimes(editionNumber, primeNumbers);
        let usefulPrimes = fetchedEditions[0];
        let editionNameList = fetchedEditions[1];
        
        //Debug this section early in the morning tomorrow...?

        headerDiv.style = "text-align: center; " + verseRowStyleString; 
        for (let i = 0; i < usefulPrimes.length; i++) {
            let divClass = "";
            if (i == 0) {
                divClass = "firstColumnHeader";
            } else {
                divClass = "columnHeader";
            }
            let editionHeadDiv = document.createElement('div');
            editionHeadDiv.classList.add(divClass);
            editionHeadDiv.style = "grid-column: " + (i + 1).toString() + ";";
            editionHeadDiv.innerHTML = "<h1><u>" + editionNameList[i] + "</u></h1>";
            headerDiv.appendChild(editionHeadDiv);
        }

        for (let j = 0; j < numOfVerses; j++) {
            let verseTextDict = {};
        
            let thisVerseRow = document.createElement('div');
            thisVerseRow.classList.add("verseRow");
            thisVerseRow.id = "verse " + (j + 1).toString();
            thisVerseRow.style = "grid-row: " + (j + 1).toString() + "; " + verseRowStyleString;

            let addedVerseNumber = false;

            //Populate the verseTextDict with the text of each verse in each edition
            for (let k = 0; k < usefulPrimes.length; k++) {
                let p = usefulPrimes[k];
                if (p != 43) {
                    let rawVerseText = res[p][j].toString();
                    verseTextDict[p] = rawVerseText;
                }
            }

            //Run comparisons if need be. Not for Mayhew at this time.

            if (!useRawText) {
                addComparedVersesToDict(verseTextDict, editionNumber, showCasing, editionNumber);
            }

            for (let k = 0; k < usefulPrimes.length; k++) {
                let p = usefulPrimes[k];
                if (p == 43 && !addedVerseNumber) {
                    let verseNumColumn = document.createElement('div');
                    verseNumColumn.classList.add("verseColumn");
                    verseNumColumn.style = 'grid-column: ' + (k + 1).toString() + '; text-align: center; font-weight: bold; font-size: 1.3em';
                    verseNumColumn.innerHTML = parseInt(chapter) + ':' + (j + 1).toString();
                    thisVerseRow.appendChild(verseNumColumn);
                    addedVerseNumber = true;
                    continue;
                }

                let thisVerseColumn = document.createElement('div');
                if (p == firstIndex) {
                    thisVerseColumn.classList.add("firstVerseColumn");
                } else {
                    thisVerseColumn.classList.add("verseColumn");
                }
                thisVerseColumn.style = "grid-column: " + (k + 1).toString() + ";";

                let thisVerseText = verseTextDict[p];

                thisVerseColumn.innerHTML = thisVerseText;
                thisVerseRow.appendChild(thisVerseColumn);
            }
            textContainer.appendChild(thisVerseRow);
        }
    }).catch(err => console.error(err));

}

async function getOneVerseText(book, chapter, verse, useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, useRawText, textContainer, showTextDifferences, showCasing) {
    textContainer.innerHTML = "";

    let editionNumber = getEditionCompositeNumber(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew);

    let IDString = "1" + bookToNumberDict[book];

    IDString = appendNumberToIDString(IDString, chapter);
    IDString = appendNumberToIDString(IDString, verse);

    let useRawString = ""
    if (useRawText) {
        useRawString = 'true';
    } else {
        useRawString = 'false';
    }

    fetch('/fetchVerse/' + IDString + '/' + editionNumber.toString() + '/' + useRawString, {
        method: 'GET',
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        let primeNumbers = [2, 3, 5, 7, 11, 13];
        let usefulPrimes = getUsefulPrimes(editionNumber, primeNumbers);
        let verseTextList = [];
        for (let i = 0; i < usefulPrimes.length; i++) {
            let p = usefulPrimes[i];
            if (editionNumber % p == 0) {
                let verseColumnDiv = document.createElement('div');
                div.style = "grid-column: " + (i + 1).toString() + ";";
                let verseText = res[p].toString();
                verseText = cleanProcessedString(verseText, showTextDifferences, showCasing);
                let span = document.createElement('span');
                span.innerHTML = verseText;
                textContainer.appendChild(span);
            }
        }
    }).catch(err => console.error(err));
}

function resetCheckboxes() {
    let allContainerList = [
        document.getElementById('firstEditionContainer'),
        document.getElementById('secondEditionContainer'),
        document.getElementById('mayhewContainer'),
        document.getElementById('zerothContainer'),
        document.getElementById('grebrewContainer')
    ];

    let allCheckboxList = [
        document.getElementById('useFirstEdition'),
        document.getElementById('useSecondEdition'),
        document.getElementById('useMayhew'),
        document.getElementById('useZerothEdition'),
        document.getElementById('useGrebrew')
    ];

    document.getElementById('grebrewLabel').innerHTML = "";

    for (let i = 0; i < 5; i++) {
        allCheckboxList[i].checked = false;
        allContainerList[i].hidden = true;
    }
}

bookDropdown.addEventListener('change', async function() {
    resetCheckboxes();
    let book = bookDropdown.value;
    updateChapterDropdown(book);
    revealCheckboxes(book);
});

chapterDropdown.addEventListener('change', async function() {
    //document.getElementById("verseSelectionDropdown").hidden = false;
    //document.getElementById("searchVerseLegend").hidden = false;
    /*
    for (let i = 0; i < bookToChapterVerseDict[bookDropdown.value][chapterDropdown.value - 1]; i++) {
        let verseOption = document.createElement('option');
        verseOption.text = i + 1;
        verseOption.value = i + 1;
        document.getElementById("verseSelectionDropdown").add(verseOption);
    }
    */
});

function createNavButtons(currentChapter, isLastChapter, book) {
    document.getElementById("navButtonGrid").innerHTML = "";
    document.getElementById("navButtonGrid").style.background = "white";

    var buttonDivNames = ["firstChapterButtonDiv", "prevChapterButtonDiv", "nextChapterButtonDiv", "lastChapterButtonDiv"];

    var buttonDivList = []

    for (var i = 0; i < buttonDivNames.length; i++) {
        var thisDiv = document.createElement("div");
        thisDiv.id = buttonDivNames[i];
        thisDiv.style.gridRow = "1";
        thisDiv.style.gridColumn = (i + 1).toString();
        buttonDivList.push(thisDiv);
    }
    
    let allButtonList = [];

    if (currentChapter > 1) {
        var firstChapterButton = document.createElement("button");
        firstChapterButton.innerHTML = "↞";
        firstChapterButton.id = "firstChapterButton";

        firstChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = 1;
            document.getElementById("submitBookQuery").click();
        });

        var prevChapterButton = document.createElement("button");
        prevChapterButton.innerHTML = "←";
        prevChapterButton.id = "prevChapterButton";

        prevChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = parseInt(currentChapter) - 1;
            document.getElementById("submitBookQuery").click();
        });

    } else {
        var firstChapterButton = document.createElement("span");
        var prevChapterButton = document.createElement("span");
    }

    allButtonList.push(firstChapterButton);
    allButtonList.push(prevChapterButton);

    if (! isLastChapter) {
        var nextChapterButton = document.createElement("button");
        nextChapterButton.innerHTML = "→";
        nextChapterButton.id = "nextChapterButton";

        nextChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = parseInt(currentChapter) + 1;
            document.getElementById("submitBookQuery").click();
        });
        
        var lastChapterButton = document.createElement("button");
        lastChapterButton.innerHTML = "↠";
        lastChapterButton.id = "lastChapterButton";

        lastChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = bookToChapterDict[book];
            document.getElementById("submitBookQuery").click();
        });
    } else {
        var nextChapterButton = document.createElement("span");
        var lastChapterButton = document.createElement("span");
    }

    allButtonList.push(nextChapterButton);
    allButtonList.push(lastChapterButton);

    for (var i = 0; i < allButtonList.length; i++) {
        buttonDivList[i].appendChild(allButtonList[i]);
        document.getElementById("navButtonGrid").appendChild(buttonDivList[i]);
    }
}


document.getElementById("submitBookQuery").addEventListener('click', async function() {
    window.scrollTo(0, 0);
    let url = window.location.href;
    //TODO: Add params to URL bar (check old version for how to do this)
    let params = new URLSearchParams(url.search);

    let myQueryOptions = document.getElementById("queryOptions");

    for (let i = 0; i < myQueryOptions.length; i++) {
        myQueryOptions[i].defaultChecked = myQueryOptions[i].checked; // Does this do anything?
    }

    //let searchInfo = searchInfoGetter(params);

    let book = bookDropdown.value;
    let chapter = chapterDropdown.value;

    let isLastChapter = (chapter == bookToChapterDict[book]);

    let useFirst = document.getElementById("useFirstEdition").checked;
    let useSecond = document.getElementById("useSecondEdition").checked;
    let useMayhew = document.getElementById("useMayhew").checked;
    let useZeroth = document.getElementById("useZerothEdition").checked;
    let useKJV = true;
    let useGrebrew = false;

    let showTextDifferences = document.getElementById("exclude_casing").checked;
    let showCasing = document.getElementById("include_casing").checked;
    //let useKJV = document.getElementById("useKJV").checked;
    //let useGrebrew = document.getElementById("useGrebrew").checked;
    //let useRawText = document.getElementById("useRawText").checked;

    createNavButtons(chapter, isLastChapter, book);

    let columnContainer = document.getElementById("textColumns");

    await displayChapterText(book, chapter, useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, showTextDifferences, showCasing, columnContainer);

});
