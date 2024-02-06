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
    outputDict["chapterNums"] = [];
    outputDict["verseText1"] =[];
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
        let chapterNums = [];

        for (let j = 0; j < verseList1.length; j++) {
            let verseNum1 = chapter.toString()+ "." + verseList1[j];
            let verseNum2 = chapter.toString()+ "." + verseList2[j];

            verseNumList.push(verseNum1);
            verseText1.push(firstEditionDict[verseList1[j]]);
            verseText2.push(secondEditionDict[verseList1[j]]);
            chapterNums.push(chapter);

            if (verseNum1 != verseNum2) {
                console.log("Verse numbers don't match in " + book + " " + chapter + ":" + verseNum1 + "/" + verseNum2);
            }
     
        }

        outputDict["verseNums"] = outputDict["verseNums"].concat(verseNumList);
        outputDict["chapterNums"] = outputDict["chapterNums"].concat(chapterNums);
        outputDict["verseText1"] = outputDict["verseText1"].concat(verseText1);
        outputDict["verseText2"] = outputDict["verseText2"].concat(verseText2);
        
    }
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

    let outputText1 = "";
    let outputText2 = "";

    let commonSubstringLength = commonSubstring.length;

    if (text1.startsWith(commonSubstring)) {
        outputText1 = 'ǀ‹' + index.toString() + '›ǀ' + text1.slice(commonSubstringLength);
        //console.log(outputText1);
    } else {
        outputText1 = text1Split.join('ǀ‹' + index.toString() + '›ǀ');
    }
    
    if (text2.startsWith(commonSubstring)) {
        outputText2 = '|«' + index.toString() + '»|' + text2.slice(commonSubstringLength);
        //console.log(outputText2);
    } else {
        outputText2 = text2Split.join('|«' + index.toString() + '»|');
    }


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

function turnListEntryIntoString(entry, guillemet) {
}
 
function putSubstringsBackIn(text1Split, text2Split, indexToSubstringDict) {

    console.log(indexToSubstringDict);

    let finalString1 = "";
    let finalString2 = "";
    //console.log(text1Split);
    //console.log(text2Split);

    for (let i = 0; i < text1Split.length; i++) {
        if (stringIsShared(text1Split[i], "‹") && stringIsShared(text2Split[i], "«")) {
            let text1Index = getIndexFromGuillemetString(text1Split[i], "‹");
            let text2Index = getIndexFromGuillemetString(text2Split[i], "«");

            //console.log(text1Index);
            //console.log(text2Index);

            let substring1 = indexToSubstringDict[text1Index];
            let substring2 = indexToSubstringDict[text2Index];
            //console.log(substring1);
            //console.log(substring2);

            if (substring1 == substring2) {
                finalString1 += substring1;
                finalString2 += substring2;
            } else if (substring1.toLowerCase() != substring2.toLowerCase()) {
                finalString1 += "Ř" + substring1 + "ř";
                finalString2 += "Ř" + substring2 + "ř";
            } else {
                finalString1 += "Ƀ" + substring1 + "ƀ";
                finalString2 += "Ƀ" + substring2 + "ƀ";
            }
        } else if (text1Split[i].toLowerCase() == text2Split[i].toLowerCase() && text1Split[i] != text2Split[i]) {
            finalString1 += "Ƀ" + text1Split[i] + "ƀ";
            finalString2 += "Ƀ" + text2Split[i] + "ƀ";
        } else {
            finalString1 += "Ř" + text1Split[i] + "ř";
            finalString2 += "Ř" + text2Split[i] + "ř";
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


function substringPopulationChecker(text1Split, text2Split, indexToSubstringDict, chapter, verse) {

    let listsAreSameLength = text1Split.length == text2Split.length;

    let finalStringList = [];

    if (!listsAreSameLength) {
        console.log(text1Split);
        console.log(text2Split);
        console.log("Lists are not the same length.");
    } else {
        finalStringList = putSubstringsBackIn(text1Split, text2Split, indexToSubstringDict);
    }
    for (let i = 0; i < finalStringList.length; i++) {
        console.log(chapter.toString() + ":" + verse.toString());
        console.log(finalStringList[i]);
    }
    return finalStringList;
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
    finalText1 = currentText1;
    finalText2 = currentText2;

    let text1SplitList = finalText1.split("ǀ");
    let text2SplitList = finalText2.split("ǂ");
    
    let replacementList1 = addDummyListEntries(text1SplitList, '‹');
    let replacementList2 = addDummyListEntries(text2SplitList, '«');

    //console.log(replacementList1);
    //console.log(replacementList2);

    //console.log(replacementList1);
    //console.log(replacementList2);

    let finalStringList = substringPopulationChecker(replacementList1, replacementList2, indexToSubstringDict, chapter, verse);
    /*
    if (text1SplitList.length != text2SplitList.length) {
        let div1 = document.createElement('div');
        div1.innerHTML = replacementList1.join("|") + "<br>"
        outerDiv.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = replacementList2.join("|") + "<br>"
        outerDiv.appendChild(div2);

        console.log("Do " + chapter.toString() + ":" + verse.toString() + " manually.");
        console.log("Replacement list identical: " + (replacementList1.length == replacementList2.length).toString());

    } else {
        let div1 = document.createElement('div');
        div1.innerHTML = replacementList1.join("|") + "<br>"
        outerDiv.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = replacementList2.join("|") + "<br>"
        outerDiv.appendChild(div2);
    }
    */
    return finalStringList;
}

function replaceDummiesWithTags(string) {
    let finalString = string.split("Ř").join("<span style='color:red'>");
    finalString = finalString.split("ř").join("</span>");
    finalString = finalString.split("Ƀ").join("<span style='color:blue'>");
    finalString = finalString.split("ƀ").join("</span>");
    return finalString;
}

submitButton.addEventListener("click", async function(event) {
    outputDiv.innerHTML = "";
    event.preventDefault(); // Prevents the default form submission behavior

    let selectedBook = bookDropdown.value;
    let outputDict = await grabBook(selectedBook);
    
    let allVerses = outputDict["verseNums"];
    let chapterList = outputDict["chapterNums"];
    let verseText1 = outputDict["verseText1"];
    let verseText2 = outputDict["verseText2"];


    for (let i = 0; i < 20; i++) {
        let verseNum = allVerses[i];
        let chapterNum = chapterList[i];
        let firstEdText = verseText1[i];
        let secondEdText = verseText2[i];

        let finalStrings = getDifferences(firstEdText, secondEdText, chapterNum, verseNum);

        let div1 = document.createElement('div');
        div1.innerHTML = firstEdText + "<br>" + finalStrings[0];

        let div2 = document.createElement('div');
        div2.innerHTML = secondEdText + "<br>" + finalStrings[1];

        let verseSpan = document.createElement("span");
        verseSpan.innerHTML = "<u>" + verseNum.toString() + "</u><br>";
        outputDiv.appendChild(verseSpan);
        outputDiv.appendChild(div1);
        outputDiv.appendChild(div2);
        outputDiv.appendChild(document.createElement('br'));

        /*
        let verseSpan = document.createElement("span");
        verseSpan.innerHTML = "<u>" + verseNum.toString() + "</u><br>" + verseText1 + "<br>" + verseText2 + '<br><br>';
        outputDiv.appendChild(verseSpan);
        */    
    }
    
});