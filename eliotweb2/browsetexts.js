/*
const http = require('http');
const host = 'localhost';
const port = 8000;

const fs = require('fs').promises;

const requestListener = function (req, res) {
    fs.readFile(__dirname + "/browsetexts.html")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    });
};
*/

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
    "Psalms (metrical)",
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

const OTBookList = [
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
    "Psalms (metrical)",
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
    "Malachi"
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

function updateChapterDropdown(whichBook) {
    var chapterDropdown = document.getElementById("chapterSelectionDropdown");
    chapterDropdown.innerHTML = "";
    for (var i = 1; i <= bookToChapterDict[whichBook]; i++) {
        var option = document.createElement("option");
        option.text = i;
        chapterDropdown.add(option);
    }
}

var bookDropdown = document.getElementById("bookSelectionDropdown");
for (var i = 0; i < allBookList.length; i++) {
    var option = document.createElement("option");
    option.text = allBookList[i];
    bookDropdown.add(option);
    updateChapterDropdown(option.text);
}

bookDropdown.addEventListener("change", function() {
    updateChapterDropdown(bookDropdown.value);
    if (bookDropdown.value == "Psalms (prose)" || bookDropdown.value == "John") {
        var mayhewCheckbox = document.createElement("input");
        const label = document.createElement("label");
        label.htmlFor = "mayhewCheckbox";
        label.innerHTML = "Mayhew (1709)";

        mayhewCheckbox.type = "checkbox";
        mayhewCheckbox.id = "mayhewCheckbox";
        mayhewCheckbox.value = "mayhewCheckbox";
        mayhewCheckbox.name = "mayhewCheckbox";

        mayhewCheckbox.checked = true;
        document.getElementById("otherEditions").appendChild(mayhewCheckbox);
        document.getElementById("otherEditions").appendChild(label);
    } 
    
    else if (bookDropdown.value == "Genesis") {
        var zerothEditionCheckbox = document.createElement("input");
        const label = document.createElement("label");
        label.htmlFor = "zerothEditionCheckbox";
        label.innerHTML = "Zeroth Edition (1655)";

        zerothEditionCheckbox.type = "checkbox";
        zerothEditionCheckbox.id = "zerothEditionCheckbox";
        zerothEditionCheckbox.value = "zerothEditionCheckbox";
        zerothEditionCheckbox.name = "zerothEditionCheckbox";

        zerothEditionCheckbox.checked = true;
        document.getElementById("otherEditions").appendChild(zerothEditionCheckbox);
        document.getElementById("otherEditions").appendChild(label);
    }
    else {
        document.getElementById("otherEditions").innerHTML = "";
    }
});

function printVersesToColumn(myJSON, editionKey, tableRow, hapaxMode="none", isVerseNumber=false, ignoreCase=false) {
    var editionText = myJSON[editionKey];
    var editionCell = document.createElement("td");
    if (ignoreCase) {
        editionText = editionText.replace(/([A-Z])/g, '<span style="color: red;">$1</span>')
    }
    //editionText = editionText.replaceAll("</H><H>", "</H> <H>");
    if (hapaxMode == "lax") {
        editionText = editionText.replaceAll('‹', '');
        editionText = editionText.replaceAll('›', '');
        editionText = editionText.replaceAll('«', '<u>');
        editionText = editionText.replaceAll('»', '</u>');
        editionText = editionText.replaceAll('<H>', '<span style="color: blue">');
        editionText = editionText.replaceAll('</H>', '</span>');
    } else if (hapaxMode == "strict") {
        editionText = editionText.replaceAll('‹', '<u>');
        editionText = editionText.replaceAll('›', '</u>');
        editionText = editionText.replaceAll('«', '<u>');
        editionText = editionText.replaceAll('»', '</u>');
        editionText = editionText.replaceAll('<H>', '<span style="color: blue">');
        editionText = editionText.replaceAll('</H>', '</span>');
    } else {
        editionText = editionText.replaceAll('‹', '');
        editionText = editionText.replaceAll('›', '');
        editionText = editionText.replaceAll('«', '');
        editionText = editionText.replaceAll('»', '');
        editionText = editionText.replaceAll('<u>', '');
        editionText = editionText.replaceAll('</u>', '');
        editionText = editionText.replaceAll('<H>', '');
        editionText = editionText.replaceAll('</H>', '');
    }
    
    if (editionText.includes("׃")) {
        console.log(editionText);
        editionCell.style.textAlign = "right";
        editionCell.style.direction = "rtl";
        editionCell.style.fontSize = "1.4em";
    }
    /*
        
    }
    */

    if (isVerseNumber) {
        editionCell.style.textAlign = "center";
        editionCell.style.fontWeight = "bold";
        editionCell.style.fontSize = "1.2em";
        editionCell.style.verticalAlign = "center";
    }
    editionCell.innerHTML = editionText;
    tableRow.appendChild(editionCell);
}

function printVerses(JSONBlob, chapter, useFirst, useSecond, useMayhew, useZeroth, useGrebrew, markTextDifferences, hapaxMode) {

    if (markTextDifferences == "none") {
        JSONKeys = ["rawFirstEdition", "rawSecondEdition"];
    } else if (markTextDifferences == "excludeCasing") {
        JSONKeys = ["caseInsensitiveFirst", "caseInsensitiveSecond"]
    } else {
        JSONKeys = ["comparedFirstEdition", "comparedSecondEdition"];
    }

    if (useMayhew) {
        JSONKeys.push("rawMayhew");
    }

    if (useZeroth) {
        JSONKeys.push("rawZeroth");
    }

    mayhewOnLeft = useMayhew && useFirst && useSecond;
    zerothOnLeft = useZeroth && useFirst && useSecond;

    mayhewOnRight = useMayhew && (! mayhewOnLeft);
    zerothOnRight = useZeroth && (! zerothOnLeft);

    for (var i = 0; i < JSONBlob.length; i++) {
        var thisVerseDict = JSONBlob[i];
        if (thisVerseDict["chapter"] == chapter) {
            var thisVerse = thisVerseDict["verse"];
            
            document.getElementById("tableBody").appendChild(document.createElement("tr")).id = "row" + thisVerse;

            thisRow = document.getElementById("row" + thisVerse);
            
            if (useFirst) {
                printVersesToColumn(thisVerseDict, JSONKeys[0], thisRow, hapaxMode);
            }
            if (useSecond) {
                printVersesToColumn(thisVerseDict, JSONKeys[1], thisRow, hapaxMode);
            }
            if (mayhewOnRight) {
                printVersesToColumn(thisVerseDict, "rawMayhew", thisRow, hapaxMode);
            }
            if (zerothOnRight) {
                printVersesToColumn(thisVerseDict, "rawZeroth", thisRow, hapaxMode);
            }

            printVersesToColumn(thisVerseDict, "fullverse", thisRow, "none", true);

            if (mayhewOnLeft) {
                printVersesToColumn(thisVerseDict, "rawMayhew", thisRow, hapaxMode);
            }
            if (zerothOnLeft) {
                printVersesToColumn(thisVerseDict, "rawZeroth", thisRow, hapaxMode);
            }
            printVersesToColumn(thisVerseDict, "rawKJV", thisRow);

            if (useGrebrew) {
                printVersesToColumn(thisVerseDict, "grebrew", thisRow, hapaxMode);
            }
        }
    }
}

document.getElementById("submitBookQuery").addEventListener("click", function() {
    // Clears the columns
    document.getElementById("tableHead").innerHTML = "";
    document.getElementById("colgroup").innerHTML = "";
    document.getElementById("tableBody").innerHTML = "";


    var myQueryOptions = document.getElementById("queryOptions");
    for (var i = 0; i < myQueryOptions.length; i++) {
        myQueryOptions[i].defaultChecked = myQueryOptions[i].checked; // Does this do anything?
        }
    var myBook = document.getElementById("bookSelectionDropdown").value;

    var leftColumns = 0; 
    var rightColumns = 1; // KJV has to be included

    var useFirstEdition = document.getElementById("include_first_edition").checked;
    var useSecondEdition = document.getElementById("include_second_edition").checked;
    var useGrebrew = document.getElementById("includeGrebrew").checked;

    var hapaxMode = "none";
    if (document.getElementById("hapaxes_lax").checked) {
        hapaxMode = "lax";
    } else if (document.getElementById("hapaxes_strict").checked) {
        hapaxMode = "strict";
    }
    
    var leftColumnList = [];
    var rightColumnList = [];
    
    if (useFirstEdition) {
        leftColumns++;
        leftColumnList.push("First Edition");
    }
    if (useSecondEdition) {
        leftColumns++;
        leftColumnList.push("Second Edition");
    }

    if (myBook == "Psalms (prose)" || myBook == "John") {
        var useMayhew = document.getElementById("mayhewCheckbox").checked;
        if (useMayhew && leftColumns == 2) {
            rightColumns++;
            rightColumnList.push("Mayhew");
        } else if (useMayhew) {
            leftColumns++;
            leftColumnList.push("Mayhew");
        }
    } else {
        var useMayhew = false;
    }

    if (myBook == "Genesis") {
        var useZerothEdition = document.getElementById("zerothEditionCheckbox").checked;
        if (useZerothEdition && leftColumns == 2) {
            rightColumns++;
            rightColumnList.push("Zeroth Edition");
        } else if (useZerothEdition) {
            leftColumns++;
            leftColumnList.push("Zeroth Edition");
        }
    } else {
        var useZerothEdition = false;
    }

    rightColumnList.push("KJV");

    if (useGrebrew) {
        nameString = ""
        if (NTBookList.includes(myBook)) {
            nameString = "Greek";
        } else {
            nameString = "Hebrew";
        }
        rightColumns++;
        rightColumnList.push(nameString);
    }

    var leftColumnMeasure = ""
    var rightColumnMeasure = ""
    var verseColumnMeasure = "10%"

    if (leftColumns == 2) {
        leftColumnMeasure = "22.5%"
    } else {
        leftColumnMeasure = "22.5%"
    }

    if (rightColumns == 3) {
        rightColumnMeasure = "15%"
    } else if (rightColumns == 2) {
        rightColumnMeasure = "22.5%"
    } else {
        rightColumnMeasure = "45%"
    }

    for (var i = 0; i < leftColumnList.length; i++) {
        var leftColumn = document.createElement("col");
        leftColumn.style.width = leftColumnMeasure;
        
        document.getElementById("colgroup").appendChild(leftColumn);
    }

    document.getElementById("colgroup").appendChild(document.createElement("col")).style.width = verseColumnMeasure;
    

    for (var i = 0; i < rightColumnList.length; i++) {
        var rightColumn = document.createElement("col");
        rightColumn.style.width = rightColumnMeasure;
        document.getElementById("colgroup").appendChild(rightColumn);
    }

    for (var i = 0; i < leftColumnList.length; i++) {
        var leftColumnHeader = document.createElement("th");
        leftColumnHeader.innerHTML = "<u>" + leftColumnList[i] + "</u>";
        leftColumnHeader.style.width = leftColumnMeasure;
        document.getElementById("tableHead").appendChild(leftColumnHeader);
    }

    var verseColumnHeader = document.createElement("th");
    verseColumnHeader.style.width = verseColumnMeasure;
    verseColumnHeader.innerHTML = "<u>Verse</u>";
    document.getElementById("tableHead").appendChild(verseColumnHeader);

    for (var i = 0; i < rightColumnList.length; i++) {
        var rightColumnHeader = document.createElement("th");
        rightColumnHeader.style.width = rightColumnMeasure;
        rightColumnHeader.innerHTML = "<u>" + rightColumnList[i] + "</u>";
        document.getElementById("tableHead").appendChild(rightColumnHeader);
    }

    var whichChapter = document.getElementById("chapterSelectionDropdown").value;
    
    var markTextDifferences = "none";
    if (document.getElementById("include_casing").checked) {
        markTextDifferences = "includeCasing";
    } else if (document.getElementById("exclude_casing").checked) {
        markTextDifferences = "excludeCasing";
    }


    fetch('./textJSON/' + myBook + '.json')
        .then(res =>  {
            return res.json();
        })
        .then((data) => {
            printVerses(data, whichChapter, useFirstEdition, useSecondEdition, useMayhew, useZerothEdition, useGrebrew, markTextDifferences, hapaxMode);
        })
    });