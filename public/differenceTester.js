
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
let chapterDropdown = document.getElementById("chapterDropdown");

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

    console.log(verseList1);
    console.log(verseList2);

    let verseNumList = [];
    let verseText1 = [];
    let verseText2 = [];

    if (verseList1 == verseList2) {
        verseNumList = verseList1;
        for (let i = 0; i < verseList1.length; i++) {
            let verseNum = verseList1[i];
            console.log(verseNum);
            verseText1.push(firstEditionDict[verseNum]);
            verseText2.push(secondEditionDict[verseNum]);
        }
    }
    
    let outputDict = {};

    outputDict["verseNums"] = verseNumList;
    outputDict["verseText1"] = verseText1;
    outputDict["verseText2"] = verseText2;

    return outputDict;
}
/*
window.addEventListener("DOMContentLoaded", () => {
    addBooks();
});
*/

addBooks();

submitButton.addEventListener("click", async function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    let selectedBook = bookDropdown.value;
    let selectedChapter = chapterDropdown.value;
    let outputText = await grabChapter(selectedBook, selectedChapter);
    /*
    let allVerses = outputText["verseNums"];
    console.log(allVerses);

    allVerses = allVerses.sort(function (a, b) { return a - b; });

    for (let i = 0; i < allVerses.length; i++) {
        let verseNum = allVerses[i];
        let verseText1 = outputText["verseText1"][i];
        let verseText2 = outputText["verseText2"][i];

        let verseSpan = document.createElement("span");
        verseSpan.innerHTML = "<u>" + verseNum.toString() + "</u><br>" + verseText1 + "<br>" + verseText2;
        outputDiv.appendChild(verseSpan);
    }
    */
});