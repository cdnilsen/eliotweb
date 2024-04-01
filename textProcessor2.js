import { PentateuchList, HistoricalBooksList, WisdomBooksList, MajorProphetsList, MinorProphetsList, gospelsList, restOfNTList, mishnaicList, bookToNumberDict, allBookList, bookToChapterDict, bookToChapterVerseDict, NTBookList, bookToActiveEditionsDict, psalmsWithVerseZero} from "./bookdata.js";

async function addRawVerse(book, text, edition) {
    let bookNumber = bookToNumberDict[book];
    let splitText = text.split(" ");
    let address = splitText[0];
    let splitAddress = address.split(".");
    let chapter = splitAddress[0];
    let verse = splitAddress[1];

    while (verse.length < 3) {
        verse = "0" + verse;
    }

    while (chapter.length < 3) {
        chapter = "0" + chapter;
    }
    
    while (bookNumber.length < 2) {
        bookNumber = "0" + bookNumber;
    }

    let verseID = edition + bookNumber + chapter + verse;

    fetch('/addRaw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({book: book, chapter: chapter, verse: verse, edition: edition, verseID: verseID, text: text})
    }).then(response => response.json()).then(data => {
        console.log(data);
    });
}

let bookSectionDropdown = document.getElementById("bookSectionDropdown");
let bookDropdown = document.getElementById("bookDropdown");

bookSectionDropdown.addEventListener("change", function() {
    console.log("Hello!");
    let bookSection = bookSectionDropdown.value;
    let bookList = [];

    if (bookSection == "Pentateuch") {
        bookList = PentateuchList;
    } else if (bookSection == "Historical Books") {
        bookList = HistoricalBooksList;
    } else if (bookSection == "Wisdom Books") {
        bookList = WisdomBooksList;
    } else if (bookSection == "Major Prophets") {
        bookList = MajorProphetsList;
    } else if (bookSection == "Minor Prophets") {
        bookList = MinorProphetsList;
    } else if (bookSection == "Gospels") {
        bookList = gospelsList;
    } else if (bookSection == "Rest of NT") {
        bookList = restOfNTList;
    } else if (bookSection == "Mishnaic") {
        bookList = mishnaicList;
    }

    bookDropdown.innerHTML = "";
    let nullOption = document.createElement("option");
    nullOption.text = "";
    nullOption.value = "";
    bookDropdown.add(nullOption);

    for (let i = 0; i < bookList.length; i++) {
        let option = document.createElement("option");
        option.text = bookList[i];
        option.value = bookList[i];
        bookDropdown.add(option);
    }
});

let editionDropdown = document.getElementById("editionDropdown");
bookDropdown.addEventListener("change", function() {
    let book = bookDropdown.value;
    if (book != "") {
        let editionNumber = bookToActiveEditionsDict[book];
        let editionDropdown = document.getElementById("editionDropdown");
        let allEditions = ["First Edition", "Second Edition", "Mayhew", "Zeroth Edition"];
        let editionNums = [2, 3, 5, 7];
        for (let i =0 ; i < editionNums.length; i++) {
            if (editionNumber % editionNums[i] == 0) {
                let option = document.createElement("option");
                option.text = allEditions[i];
                option.value = allEditions[i];
                editionDropdown.add(option);
            }
        }
    }
});

function getEditionNum(edition) {
    if (edition == "First Edition") {
        return "2";
    } else if (edition == "Second Edition") {
        return "3";
    } else if (edition == "Mayhew") {
        return "5";
    } else if (edition == "Zeroth Edition") {
        return "7";
    }
}


let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", async function() {
    let book = bookDropdown.value;
    let edition = editionDropdown.value;
    let editionNum = getEditionNum(edition);
    let textName = ".texts/" + book + "." + edition + ".txt";

    let text = await fetch(textName).then(response => response.text());

    let splitText = text.split("\n");
    for (let i = 0; i < splitText.length; i++) {
        await addRawVerse(book, splitText[i], editionNum);
    }
});

