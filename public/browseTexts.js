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

//Function that turns a list into a string with spaces between the elements, for readability when logging. Not a great pick for lists that have spaces or null elements within them.
function stringOfList(list, useBrackets=true) {
    let finalString = "";
    for (let i = 0; i < list.length; i++) {
        finalString += list[i].toString();
        finalString += ", "
    }
    if (finalString.endsWith(", ")) {
        finalString = finalString.slice(0, -2);
    }
    if (useBrackets) {
        return "[" + finalString + "]";
    } else {
        return finalString;
    }
}

function getDifferenceOfTwoArrays(arr1, arr2) {
    let set1 = new Set(arr1);
    let set2 = new Set(arr2);

    let notInSet1 = new Set([...set2].filter(x => !set1.has(x)));
    let notInSet2 = new Set([...set1].filter(x => !set2.has(x)));

    let notInSet1List = Array.from(notInSet1);
    let notInSet2List = Array.from(notInSet2);

    return [notInSet1List, notInSet2List];
}


function findLongestCommonSubstring(str1, str2) {
    //(courtesy of GeeksForGeeks) 
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

function postSnippetsToDict(snippetList, verseDict, oldKey, sharedStringIsZero) {

    if (sharedStringIsZero) {
        let newKey = oldKey + "B";
        verseDict[newKey] = snippetList[0];
        delete(verseDict[oldKey]);
    } else {
        let newKeyList = [];
        let keySuffixList = ["A", "B", "C"];
        for (let i = 0; i < 3; i++) {
            let newKey = oldKey + keySuffixList[i];
            if (snippetList[i] == "") {
                newKey = newKey + "B";
            }
            newKeyList.push(newKey);
        }

        delete(verseDict[oldKey]);

        for (let j = 0; j < 3; j++) {
            verseDict[newKeyList[j]] = snippetList[j];
        }
    }
}

function getSnippetTuples(dict1, dict2, snippet1, snippet2, sharedString, key) {

    if (sharedString == "" || snippet1 == "" || snippet2 == "") {
        let verse1List = [snippet1, "", ""];
        let verse2List = [snippet2, "", ""];

        postSnippetsToDict(verse1List, dict1, key, true);
        postSnippetsToDict(verse2List, dict2, key, true);

    } else {
        let verse1Split = snippet1.split(sharedString);
        let verse2Split = snippet2.split(sharedString);
        
        let verse1Prologue = verse1Split[0];
        let verse2Prologue = verse2Split[0];

        let verse1Epilogue = verse1Split[1];
        let verse2Epilogue = verse2Split[1];

        let verse1ProcessingList = [verse1Prologue, sharedString, verse1Epilogue];
        let verse2ProcessingList = [verse2Prologue, sharedString, verse2Epilogue];

        postSnippetsToDict(verse1ProcessingList, dict1, key, false);
        postSnippetsToDict(verse2ProcessingList, dict2, key, false);
    }
}

function checkForKeyMismatch(dict1, dict2) {
    let keyList1 = Object.keys(dict1).sort();
    let keyList2 = Object.keys(dict2).sort();

    let in1ButNot2List = [];
    let in2ButNot1List = [];

    if (keyList1 != keyList2) {
        let keysDifference = getDifferenceOfTwoArrays(keyList1, keyList2);

        in2ButNot1List = keysDifference[0];
        in1ButNot2List = keysDifference[1];

    }
    in2ButNot1List = in2ButNot1List.sort();
    in1ButNot2List = in1ButNot2List.sort();

    let noMismatches = (in1ButNot2List.length == 0 && in2ButNot1List.length == 0);

    let listsNotSameLength = (in1ButNot2List.length != in2ButNot1List.length);

    return [in1ButNot2List, in2ButNot1List, noMismatches, listsNotSameLength];
}

//I don't like this much (it's kludgy) but it seems to work. When I checked against the texts it appears to be accurate.
function fixMissingBs(dict1, dict2, chapter, verse) {
    let mismatchingKeys = checkForKeyMismatch(dict1, dict2);

    let canProcess = true;
    if (mismatchingKeys[2]) {
        // If there aren't any mismatches, quit. Could put a single return after the whole if-else thing but this makes things more explicit
        return [[], [], canProcess, "no mismatches"];
    } else if (mismatchingKeys[3]) {
        // If there are mismatches but the lists aren't the same length, flag it
        console.log("Mismatching keys are not the same length at " + chapter.toString() + ":"+ verse.toString());
        console.log(mismatchingKeys1);
        console.log(mismatchingKeys2);
        
        canProcess = false;
        return [[], [], canProcess, "lists aren't the same length (find the bug)"];
    } else {
        let mismatchingKeys1 = mismatchingKeys[0];
        let mismatchingKeys2 = mismatchingKeys[1];

        for (let i = 0; i < mismatchingKeys1.length; i++) {

            let firstKey = mismatchingKeys1[i];
            let secondKey = mismatchingKeys2[i];

            if (firstKey.endsWith("B") && firstKey.slice(0, -1) == secondKey) {
                let newSecondKey = secondKey + "B";
                dict2[newSecondKey] = dict2[secondKey];
                delete(dict2[secondKey]);
            }

            if (secondKey.endsWith("B") && secondKey.slice(0, -1) == firstKey) {
                let newFirstKey = firstKey + "B";
                dict1[newFirstKey] = dict1[firstKey];
                delete(dict1[firstKey]);
            }
        }
        // Pre-sort for safety
        let newSortedKeys1 = Object.keys(dict1).sort();
        let newSortedKeys2 = Object.keys(dict2).sort();
        
        let failureReason = "";
        let differentLengths = (newSortedKeys1.length != newSortedKeys2.length);

        //The machine sometimes thinks that sorted key lists that are actually the same...aren't. This can flag them to console (currently commented out), but also has the machine make sure there's really a difference. We could also call the difference array function for an extra check, though it's probably not necessary.
        if (newSortedKeys1 != newSortedKeys2) {
            //console.log("Thinks it can't process " + chapter.toString() + ":" + verse.toString());
            if (differentLengths) {
                failureReason = "different lengths";
                canProcess = false;
            } else {
                let mismatchExists = false;
                for (let i = 0; i < newSortedKeys1.length; i++) {
                    if (newSortedKeys1[i] != newSortedKeys2[i]) {
                        console.log("First edition: " + newSortedKeys1[i]);
                        console.log("Second edition: " + newSortedKeys2[i]);
                        failureReason = "sorted keys, but weren't the same";
                        mismatchExists = true;
                    }
                }
                if (mismatchExists) {
                    canProcess = false;
                }
            }
        }
        return [newSortedKeys1, newSortedKeys2, canProcess, failureReason];
    }
}

function processDictKeys(dict1, dict2, key) {
    if (dict1[key] == undefined) {
        dict1[key] = "";
    }
    if (dict2[key] == undefined) {
        dict2[key] = "";
    }

    let verseSnippet1 = dict1[key];
    let verseSnippet2 = dict2[key];

    let sharedString = findLongestCommonSubstring(verseSnippet1, verseSnippet2);
    
    getSnippetTuples(dict1, dict2, verseSnippet1, verseSnippet2, sharedString, key);
}

function processVerseDictionaries(dict1, dict2) {
    let allKeys = Object.keys(dict1);

    let relevantKeys = [];
    
    for (let i = 0; i < allKeys.length; i++) {
        if (!allKeys[i].endsWith("B")) {
            relevantKeys.push(allKeys[i]);
        }
    }

    for (let j = 0; j < relevantKeys.length; j++) {
        let key = relevantKeys[j];
        processDictKeys(dict1, dict2, key);
    }

    return (relevantKeys.length > 0);
}

function castColor(string, color) {
    return '<span style="color:' + color + '"><b>' + string + '</b></span>';
}

function antiCastColor(string, color) {
    return '</b></span>' + string + '<span style="color:' + color + '"><b>';
}

function getSlicedListAtIndex(word, index) {
    return [word.slice(0, index), word.slice(index + 1)]
}

function scrapSpuriousTags (string) {
    let colorList = ['blue', 'red'];
    for (let i = 0; i < colorList.length; i++) {
      let spuriousTag = '<span style="color:' + colorList[i] + '"><b></b></span>'
  
      string = string.split(spuriousTag).join('')
    }
    return string;
}

function unwrapDummyChars(wrappedString1, wrappedString2, unwrapDict1, unwrapDict2, markCasing) {
    let unwrapDictList = [unwrapDict1, unwrapDict2];

    let intermediateStringList = [wrappedString1, wrappedString2];

    let nearFinalStringList = [];
    for (let i = 0; i < 2; i++) {
        let unwrapDict = unwrapDictList[i];
        let allKeys = Object.keys(unwrapDict);
        let intermediateString = intermediateStringList[i];
        for (let j = 0; j < allKeys.length; j++){
            let k = allKeys[j];
            let wrap = unwrapDict[k];

            let unwrappedString = wrap;

            if (markCasing) {
                unwrappedString = castColor(unwrappedString, "blue");
            }

            unwrappedString = antiCastColor(unwrappedString, "red");

            intermediateString = intermediateString.split(k).join(unwrappedString);
        }
        nearFinalStringList.push(intermediateString);
    }

    let finalStringList = [];
    for (let z = 0; z < 2; z++) {
        let thisString = nearFinalStringList[z];
        thisString = castColor(thisString, "red");
        thisString = scrapSpuriousTags(thisString);
        finalStringList.push(thisString);
    }

    return finalStringList;
}

function fixSecretCasingDifference(substring1, substring2, loweredString1, loweredString2, markCasing) {
    let finalSubstring1 = "";
    let finalSubstring2 = "";

    let sharedLowerSubstring = findLongestCommonSubstring(loweredString1, loweredString2);

    if (sharedLowerSubstring == "") {
        finalSubstring1 = castColor(substring1, "red");
        finalSubstring2 = castColor(substring2, "red");
        return [finalSubstring1, finalSubstring2];
    }

    let newSubstring1 = substring1;
    let newSubstring2 = substring2;

    let newLowered1 = loweredString1;
    let newLowered2 = loweredString2;
    
    let counterCharDict1 = {};
    let counterCharDict2 = {};

    let counter = 0;
    while (sharedLowerSubstring != "") {
        let substring1Index = newLowered1.indexOf(sharedLowerSubstring);
        let substring2Index = newLowered2.indexOf(sharedLowerSubstring);

        let originalChar1 = newSubstring1[substring1Index];
        let originalChar2 = newSubstring2[substring2Index];

        let substringList1 = getSlicedListAtIndex(newSubstring1, substring1Index);
        let substringList2 = getSlicedListAtIndex(newSubstring2, substring2Index);

        let guillemetedCounter = "‹" + counter.toString() + "›";

        newSubstring1 = substringList1[0] + guillemetedCounter + substringList1[1];
        newSubstring2 = substringList2[0] + guillemetedCounter + substringList2[1];

        counterCharDict1[guillemetedCounter] = originalChar1;
        counterCharDict2[guillemetedCounter] = originalChar2;

        let numDummies = guillemetedCounter.length

        let slicedLowerList1 = newLowered1.split(sharedLowerSubstring);
        let slicedLowerList2 = newLowered2.split(sharedLowerSubstring);

        //now go through and for every digit in the counter, plus two (for the guillemets), throw a *separate* dummy char into the lowers

        newLowered1 = slicedLowerList1[0] +  "α".repeat(numDummies) +  slicedLowerList1[1];
        newLowered2 = slicedLowerList2[0] + "β".repeat(numDummies) + slicedLowerList2[1];

        sharedLowerSubstring = findLongestCommonSubstring(newLowered1, newLowered2);

        counter += 1;
    }

    return unwrapDummyChars(newSubstring1, newSubstring2, counterCharDict1, counterCharDict2, markCasing);
}

// To be called when the substrings *don't* match.
function finalMismatchCheck(substring1, substring2, finalString1, finalString2, markCasing) {
    let completeMatch = (substring1 == substring2);

    if (completeMatch) {
        finalString1 += substring1;
        finalString2 += substring2;
        return [finalString1, finalString2];
    }

    let lowered1 = substring1.toLowerCase();
    let lowered2 = substring2.toLowerCase();

    let matchLower = (lowered1 == lowered2);

    let finalSubstring1 = "";
    let finalSubstring2 = "";
    if (matchLower) {
        if (markCasing) {
            finalSubstring1 = castColor(substring1, "blue");
            finalSubstring2 = castColor(substring2, "blue");
        } else {
            finalSubstring1 = substring1;
            finalSubstring2 = substring2;
        }
    } else {
        let finalList = fixSecretCasingDifference(substring1, substring2, lowered1, lowered2, markCasing);

        finalSubstring1 = finalList[0];
        finalSubstring2 = finalList[1];
    }
    finalString1 += finalSubstring1;
    finalString2 += finalSubstring2;

    return [finalString1, finalString2];
}

function addDifferenceTags(verse1Dict, verse2Dict, sortedKeys, useCasing) {
    let finalVerse1 = "";
    let finalVerse2 = "";

    for (let i = 0; i < sortedKeys.length; i++) {
        let k = sortedKeys[i];
        let subverse1 = verse1Dict[k];
        let subverse2 = verse2Dict[k];
        
        let newVerses = finalMismatchCheck(subverse1, subverse2, finalVerse1, finalVerse2, useCasing);

        finalVerse1 = newVerses[0];
        finalVerse2 = newVerses[1];
    }
    return [finalVerse1, finalVerse2];
}

function processCurlyBrackets(string, showRawText) {
    if (!showRawText) {
        string = string.split('<span style="color:red"><b>{</b></span>').join('<i>');
        string = string.split('<span style="color:red"><b>}</b></span>').join('</i>');
      }
      string = string.split("{").join("<i>");
      string = string.split("}").join("</i>");
      return string;
}

function compareVerses(verse1, verse2, chapterNum, verseNum, useCasing, showRawText) {

    let processedVerses = [];
    if (showRawText) {
        let verse1Dict = {
            "": verse1
        };

        let verse2Dict = {
            "": verse2
        };

        let keepGoing = true;
        let safetyCounter = 0;
        while(keepGoing && safetyCounter < 100) {
            keepGoing = processVerseDictionaries(verse1Dict, verse2Dict);
            safetyCounter += 1;
        }

        if (safetyCounter == 100) {
            console.log("Endless loop!");
        }

        let fixedBsList = fixMissingBs(verse1Dict, verse2Dict, chapterNum, verseNum);

        let canProcess = fixedBsList[2];

        if (canProcess) {
            let allKeys1 = fixedBsList[0];
            let allKeys2 = fixedBsList[1];

            processedVerses = addDifferenceTags(verse1Dict, verse2Dict, allKeys1, useCasing);
        } else {
            console.log("Can't process " + chapterNum.toString() + "." + verseNum.toString() + ": " + fixedBsList[3] + "\n Showing raw text instead.");
            processedVerses = [verse1, verse2];
        }
    } else {
        processedVerses = [verse1, verse2];
    }

    let finalVerses = [];
    for (let i = 0; i < processedVerses.length; i++) {
        let italicizedVerse = processCurlyBrackets(processedVerses[i], showRawText);
        finalVerses.push(italicizedVerse);
    }
    
    return finalVerses;
}

function addComparedVersesToDict(dict, chapterNum, verseNum, showCasing, editionNumber, showRawText) {
    let useZeroth = (editionNumber % 7 == 0);

    let firstEditionText = dict[2];
    let secondEditionText = dict[3];

    let comparedVerseList = compareVerses(firstEditionText, secondEditionText, chapterNum, verseNum, showCasing, showRawText);

    if (dict[2].length <= comparedVerseList[0].length) {
        dict[2] = comparedVerseList[0];
    }
    if (dict[3].length <= comparedVerseList[1].length) {
        dict[3] = comparedVerseList[1];
    }

    //The zeroth edition Genesis's differences are wrt the first edition, although the first edition's are still vs. the 2nd
    if (useZeroth) {
        let zerothComparedList = compareVerses(dict[7], dict[2], showCasing);

        if (dict[7].length <= zerothComparedList[0].length) {
            dict[7] = zerothComparedList[0];
        }
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
    let chapterNum = parseInt(chapter);

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

    fetch('/fetchChapter/' + book + '/' + chapter + '/' + editionNumber.toString(), {
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
            let verseNum = j + 1;
            let verseTextDict = {};
        
            let thisVerseRow = document.createElement('div');
            thisVerseRow.classList.add("verseRow");
            thisVerseRow.id = "verse " + verseNum.toString();
            thisVerseRow.style = "grid-row: " + verseNum.toString() + "; " + verseRowStyleString;

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

            addComparedVersesToDict(verseTextDict, chapterNum, verseNum, showCasing, editionNumber, useRawText);

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
