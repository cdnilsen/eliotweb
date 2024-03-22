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

    fetch('/addRawVerse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({book: book, chapter: chapter, verse: verse, edition: edition, verseID: verseID, text: text})
    })
}