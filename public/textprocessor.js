
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

let bookDropdown = document.getElementById("searchBookDropdown");
let blankOption = document.createElement('option');
blankOption.text = "";
blankOption.value = "";
bookDropdown.add(blankOption);

for (let i = 0; i < allBookList.length; i++) {
    let book = allBookList[i];
    let bookOption = document.createElement('option');
    bookOption.text = book;
    bookOption.value = book;
    bookDropdown.add(bookOption);
}

let editionDropdownContainer = document.getElementById("edition-dropdown-container");

bookDropdown.addEventListener("change", function() {

    //editionDropdownContainer.innerHTML = "";

    let editionDropdown = document.getElementById('searchEditionDropdown');
    editionDropdown.innerHTML = "";
    document.getElementById("searchEditionLegend").hidden = false;
    editionDropdown.hidden = false;

    let blankOption = document.createElement('option');
    blankOption.text = "";
    blankOption.value = "";
    editionDropdown.add(blankOption);

    let editionList = ["First Edition", "Second Edition"];

    if (bookDropdown.value == "Genesis") {
        editionList.push("Zeroth Edition");
    }

    if (bookDropdown.value == "Psalms (prose)" || bookDropdown.value == "John") {
        editionList.push("Mayhew");
    }

    for (let i = 0; i < editionList.length; i++) {
        let edition = editionList[i];
        let editionOption = document.createElement('option');
        editionOption.text = edition;
        editionOption.value = edition;
        editionDropdown.add(editionOption);
    }
    editionDropdownContainer.hidden = false;
});

document.getElementById('searchEditionDropdown').addEventListener("change", function() {
    document.getElementById("submit").hidden = false;
});


async function processText(whichBook, whichEdition) {
    const reader = new FileReader();
    let textAddress = "./texts/" + whichBook + "." + whichEdition + ".txt";

    let lineObject = await fetch(textAddress);
    let lineObjectText = await lineObject.text();
    let lineList = lineObjectText.split("\n");

    for (let i = 0; i < lineList.length; i++) {
        let line = lineList[i];
        document.getElementById("text-container").innerHTML += line + "<br>";
    }
    /*
    for (let i = 0; i < lineObject.length; i++) {
        allLines.push(lineObject[i]);
    }

    for (let j = 0; j < allLines.length; j++) {
        console.log(allLines[j]);
    }
    */
    //Each verse's ID key should be a numerical string generated from its book. The metrical psalms are just weird and will need to be treated separately.
    //E.g., Exodus 12.13 will be 102012013: dummy 1, followed by 02 (Exodus), followed by 012 (chapter 12), followed by 013 (verse 13).

    //TODO for other texts like Mayhew's translation of Cotton. Those'll probably be e.g. 201, 202...
    /*
    fetch('/processText').then(res => res.json()).then(res => {

    }).catch(err => console.error(err));
    */
}

document.getElementById('submit').addEventListener("click", function() {
    let whichBook = bookDropdown.value;
    //clean this up later
    let whichEdition = document.getElementById('searchEditionDropdown').value;

    processText(whichBook, whichEdition);
});
    