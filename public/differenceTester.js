
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

            console.log(lineVerse.toString() + ": " + lineText)
        }
    }
    return rightLineDict;
}

async function grabChapter(book, chapter) {
    let firstEditionAddress = "./texts/" + book + ".First Edition.txt";
    let secondEditionAddress = "./texts/" + book + ".Second Edition.txt";

    let firstEditionText = await fetch(firstEditionAddress);
    let secondEditionText = await fetch(secondEditionAddress);
    console.log(firstEditionText.text());
    /*
    let firstEditionLines = (await firstEditionText.text()).split("\n");
    console.log(firstEditionLines);
    let secondEditionLines = (await secondEditionText.text()).split("\n");

    let firstEditionDict = grabRightLines(firstEditionLines, chapter);
    let secondEditionDict = grabRightLines(secondEditionLines, chapter);

    let verseList1 = Object.keys(firstEditionDict);
    let verseList2 = Object.keys(secondEditionDict);

    verseList1.sort();
    verseList2.sort();

    console.log(verseList1);
    console.log(verseList2);

    if (verseList1 == verseList2) {
        for (let i = 0; i < verseList1.length; i++) {
            let verse = verseList1[i];
            let line1 = firstEditionDict[verse];
            let line2 = secondEditionDict[verse];
            let newDiv = document.createElement("div");
            newDiv.innerHTML = "<u>" + verse + "</u><br>" + line1 + "<br>" + line2;
            outputDiv.appendChild(newDiv);
        }
    }
    return "Done";
    */
    return "Done";
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
    let firstAddress = await grabChapter(selectedBook, selectedChapter);
});