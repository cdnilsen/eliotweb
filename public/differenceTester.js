
const basicBookList = [
    "Exodus",
    "Leviticus",
    "Mark"
];

const bookToChapterDict = {
    "Exodus": 40,
    "Leviticus": 27,
    "Mark": 16
};

let bookDropdown = document.getElementById("bookDropdown");
let chapterDroown = document.getElementById("chapterDropdown");

let outputDiv = document.getElementById("output");
let submitButton = document.getElementById("submitButton");

function addBooks() {
    let blankOption = document.createElement("option");
    blankOption.text = "";
    blankOption.value = "";
    bookDropdown.add(blankOption);
    for (let i = 0; i < basicBookList.length; i++) {
        let option = document.createElement("option");
        option.text = basicBookList[i];
        option.value = basicBookList[i];
        bookDropdown.add(option);
    }
}

bookDropdown.addEventListener("change", () => {
    let selectedBook = bookDropdown.value;
    let chapterCount = bookToChapterDict[selectedBook];
    chapterDropdown.innerHTML = "";
    for (let i = 1; i <= chapterCount; i++) {
        let option = document.createElement("option");
        option.text = i;
        chapterDropdown.add(option);
    }
});

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

async function grabChapter(book, chapter) {
    let firstEditionAddress = "./texts/" + book + ".First Edition.txt";
    let secondEditionAddress = "./texts/" + book + ".Second Edition.txt";

    let firstEditionRaw = await fetch(firstEditionAddress);
    let secondEditionRaw = await fetch(secondEditionAddress);

    let firstEditionText = await firstEditionRaw.text();
    let secondEditionText = await secondEditionRaw.text();

    let firstEditionLines = firstEditionText.split("\n");
    let secondEditionLines = secondEditionText.split("\n");
   
    //These have been logged to console, and work:
    let firstEditionDict = grabRightLines(firstEditionLines, chapter);
    let secondEditionDict = grabRightLines(secondEditionLines, chapter);

    let verseList1 = Object.keys(firstEditionDict);
    let verseList2 = Object.keys(secondEditionDict);

    verseList1.sort(function (a, b) { return a - b; });
    verseList2.sort(function (a, b) { return a - b; });

    //console.log(verseList1);
    //console.log(verseList2);

    let verseNumList = [];
    let verseText1 = [];
    let verseText2 = [];


    verseNumList = verseList1;
    for (let i = 0; i < verseList1.length; i++) {
        let verseNum1 = parseInt(verseList1[i]);
        let verseNum2 = parseInt(verseList2[i]);
        verseText1.push(firstEditionDict[verseNum1]);
        verseText2.push(secondEditionDict[verseNum2]);
    }


    
    let outputDict = {};

    outputDict["verseNums"] = verseNumList;
    outputDict["verseText1"] = verseText1;
    outputDict["verseText2"] = verseText2;
    
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
    let outputText2 = text2Split.join('ǀ«' + index.toString() + '»ǀ');
    

    let outputDict = {
        "processedText1" : outputText1,
        "processedText2" : outputText2,
        "commonSubstring" : commonSubstring,
    }
    return outputDict;
}


function getDifferences(text1, text2) {
    let commonSubstringLengthMoreThan2 = true;
    let currentSubstringIndex = 0;

    let indexToSubstringDict = {};

    let currentText1 = text1;
    let currentText2 = text2;

    let outerDiv = document.createElement('div');

    while (commonSubstringLengthMoreThan2) {
        let processedTextDict = replaceCommonSubstrings(currentText1, currentText2, currentSubstringIndex);

        if (processedTextDict["commonSubstring"].length < 2) {
            let finalText1 = currentText1;
            let finalText2 = currentText2;
            commonSubstringLengthMoreThan2 = false;
            break;
        } else {
            console.log(processedTextDict["commonSubstring"]);
            indexToSubstringDict[currentSubstringIndex] = processedTextDict["commonSubstring"];
            currentText1 = processedTextDict["processedText1"];
            currentText2 = processedTextDict["processedText2"];
            currentSubstringIndex += 1;
        }
    }

    let text1SplitList = currentText1.split("ǀ");
    let text2SplitList = currentText2.split("ǀ");

    if (text1SplitList.length != text2SplitList.length) {
        let div1 = document.createElement('div');
        div1.innerHTML = "'" + text1SplitList.join("', ") + "'";
        outerDiv.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = "'" + text2SplitList.join("', ") + "'";
        outerDiv.appendChild(div2);

    }
    return outerDiv;
}

submitButton.addEventListener("click", async function(event) {
    outputDiv.innerHTML = "";
    event.preventDefault(); // Prevents the default form submission behavior

    let selectedBook = bookDropdown.value;
    let selectedChapter = chapterDropdown.value;
    let outputText = await grabChapter(selectedBook, selectedChapter);
    
    let allVerses = outputText["verseNums"];

    allVerses = allVerses.sort(function (a, b) { return a - b; });

    for (let i = 0; i < allVerses.length; i++) {
        let verseNum = allVerses[i];
        let verseText1 = outputText["verseText1"][i];
        let verseText2 = outputText["verseText2"][i];

        let myDiv = getDifferences(verseText1, verseText2)
        outputDiv.appendChild(myDiv);
        /*
        let verseSpan = document.createElement("span");
        verseSpan.innerHTML = "<u>" + verseNum.toString() + "</u><br>" + verseText1 + "<br>" + verseText2 + '<br><br>';
        outputDiv.appendChild(verseSpan);
        */
    }

    return;
});