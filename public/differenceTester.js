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

let bookDropdown = document.getElementById("bookDropdown");

let outputDiv = document.getElementById("output");
let submitButton = document.getElementById("submitButton");

function addBooks() {
    let blankOption = document.createElement("option");
    blankOption.text = "";
    blankOption.value = "";
    bookDropdown.add(blankOption);
    for (let i = 0; i < allBookList.length; i++) {
        let option = document.createElement("option");
        option.text = allBookList[i];
        option.value = allBookList[i];
        bookDropdown.add(option);
    }
}

function grabRightLines(bookLines, chapter) {
    chapter = parseInt(chapter);
    let rightLineDict = {};
    for (let i = 0; i < bookLines.length; i++) {
        let splitLine = bookLines[i].split(" ");
        let address = splitLine[0].split(".");
        let lineChapter = parseInt(address[0]);
        if (lineChapter === chapter) {
            let lineVerse = parseInt(address[1]);
            let lineText = splitLine.slice(1).join(" ");
            rightLineDict[lineVerse] = lineText;
        }
    }
    return rightLineDict;
}

async function grabBook(book) {
    let firstEditionAddress = "./texts/" + book + ".First Edition.txt";
    let secondEditionAddress = "./texts/" + book + ".Second Edition.txt";

    let firstEditionRaw = await fetch(firstEditionAddress);
    let secondEditionRaw = await fetch(secondEditionAddress);

    let firstEditionText = await firstEditionRaw.text();
    let secondEditionText = await secondEditionRaw.text();

    let firstEditionLines = firstEditionText.split("\n");
    let secondEditionLines = secondEditionText.split("\n");

    let outputDict = {};

    outputDict["verseNums"] = [];
    outputDict["verseText1"] = [];
    outputDict["verseText2"] = [];
   
    for (let i = 1; i < bookToChapterDict[book] + 1; i++) {
        let chapter = i;
        //These have been logged to console, and work:
        let firstEditionDict = grabRightLines(firstEditionLines, chapter);
        let secondEditionDict = grabRightLines(secondEditionLines, chapter);

        let verseList1 = Object.keys(firstEditionDict);
        let verseList2 = Object.keys(secondEditionDict);

        verseList1.sort(function (a, b) { return a - b; });
        verseList2.sort(function (a, b) { return a - b; });

        let verseNumList = [];
        let verseText1 = [];
        let verseText2 = [];

        for (let j = 0; j < verseList1.length; j++) {
            let verseNum1 = chapter.toString()+ "." + verseList1[j];
            let verseNum2 = chapter.toString()+ "." + verseList2[j];

            verseNumList.push(verseNum1);
            verseText1.push(firstEditionDict[verseList1[j]]);
            verseText2.push(secondEditionDict[verseList1[j]]);

            if (verseNum1 != verseNum2) {
                console.log("Verse numbers don't match in " + book + " " + chapter + ":" + verseNum1 + "/" + verseNum2);
            }
        
            if (verseText1.length != verseText2.length) {
                console.log("Do " + chapter.toString() + ":" + verseNum1.toString() + " manually.");
            }
        }

        //console.log(verseNumList);
        //console.log(verseText1);
        //console.log(verseText2);

        outputDict["verseNums"] = outputDict["verseNums"].concat(verseNumList);
        outputDict["verseText1"] = outputDict["verseText1"].concat(verseText1);
        outputDict["verseText2"] = outputDict["verseText2"].concat(verseText2);
        
    }

    console.log(outputDict["verseNums"].length);
    console.log(outputDict["verseText1"].length);
    console.log(outputDict["verseText2"].length);
    return outputDict;
}

addBooks();

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

function replaceCommonSubstrings(text1, text2, index) {
    let commonSubstring = findLongestCommonSubstring(text1, text2);
    let text1Split = text1.split(commonSubstring);
    let text2Split = text2.split(commonSubstring);

    let outputText1 = text1Split.join('ǀ‹' + index.toString() + '›ǀ');
    let outputText2 = text2Split.join('ǂ«' + index.toString() + '»ǂ');
    

    let outputDict = {
        "processedText1" : outputText1,
        "processedText2" : outputText2,
        "commonSubstring" : commonSubstring,
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
    let replacementList = [];

    for (let i = 0; i < splitList.length - 1; i++) {
        let thisElement = splitList[i];
        let nextElement = splitList[i+1];

        if (stringIsShared(thisElement, guillemet) && stringIsShared(nextElement, guillemet)) {
            replacementList.push(thisElement);
            replacementList.push("");
        } else {
            replacementList.push(thisElement);
        }
    }
    return replacementList;
}


function getDifferences(text1, text2, chapter, verse) {
    let commonSubstringLengthMoreThan1 = true;
    let currentSubstringIndex = 0;

    let indexToSubstringDict = {};

    let currentText1 = text1;
    let currentText2 = text2;

    let outerDiv = document.createElement('div');

    let finalText1 = "";
    let finalText2 = "";

    while (commonSubstringLengthMoreThan1 && currentSubstringIndex < 50) {
        let processedTextDict = replaceCommonSubstrings(currentText1, currentText2, currentSubstringIndex);

        indexToSubstringDict[currentSubstringIndex] = processedTextDict["commonSubstring"];

        currentText1 = processedTextDict["processedText1"];

        currentText2 = processedTextDict["processedText2"];

        currentSubstringIndex += 1;

        if (processedTextDict["commonSubstring"].length < 2) {
            commonSubstringLengthMoreThan1 = false;
        }
    }

    let text1SplitList = finalText1.split("ǀ");
    let text2SplitList = finalText2.split("ǂ");
    
    let replacementList1 = addDummyListEntries(text1SplitList, '‹');
    let replacementList2 = addDummyListEntries(text2SplitList, '«');

    if (text1SplitList.length != text2SplitList.length) {
        let div1 = document.createElement('div');
        div1.innerHTML = text1SplitList.join("|") + "<br>" + currentText1;
        outerDiv.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = text2SplitList.join("|") + "<br>" + currentText2;
        outerDiv.appendChild(div2);

        console.log("Do " + chapter.toString() + ":" + verse.toString() + " manually.");
        console.log("Replacement list identical: " + (replacementList1.length == replacementList2.length).toString());

    } else {
        let div1 = document.createElement('div');
        div1.innerHTML = text1SplitList.join("|") + "<br>" + currentText1;
        outerDiv.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = text2SplitList.join("|") + "<br>" + currentText2;
        outerDiv.appendChild(div2);
    }

    console.log(replacementList1.join("/"));
    console.log(replacementList2.join("/"));

    console.log("Calling getDifferences");
    console.log(outerDiv.innerHTML);
    return outerDiv;
}

submitButton.addEventListener("click", async function(event) {
    outputDiv.innerHTML = "";
    event.preventDefault(); // Prevents the default form submission behavior

    let selectedBook = bookDropdown.value;
    let outputDict = await grabBook(selectedBook);
    
    let allVerses = outputDict["verseNums"];
    let verseText1 = outputDict["verseText1"];
    let verseText2 = outputDict["verseText2"];


    for (let i = 0; i < allVerses.length; i++) {
        let verseNum = allVerses[i];
        let firstEdText = verseText1[i];
        let secondEdText = verseText2[i];

        console.log(verseNum);
        console.log(firstEdText);
        console.log(secondEdText);
        

        //let myDiv = getDifferences(firstEdText, secondEdText, selectedChapter, verseNum)
        //outputDiv.appendChild(myDiv);
        /*
        let verseSpan = document.createElement("span");
        verseSpan.innerHTML = "<u>" + verseNum.toString() + "</u><br>" + verseText1 + "<br>" + verseText2 + '<br><br>';
        outputDiv.appendChild(verseSpan);
        */    
    }
    
});