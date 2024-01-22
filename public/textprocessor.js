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
bookDropdown.add(blankOption);

for (let i = 0; i < allBookList; i++) {
    let book = allBookList[i];
    let bookOption = document.createElement('option');
    bookOption.text = book;
    bookDropdown.add(bookOption);
}

bookDropdown.addEventListener("change", function() {
    let editionDropdownContainer = document.getElementById("edition-dropdown-container");

    let editionDropdown = document.createElement('select');
    editionDropdown.id = "searchEditionDropdown";
    editionDropdownContainer.appendChild(editionDropdown);
    let blankOption = document.createElement('option');
    blankOption.text = "";
    editionDropdown.add(blankOption);

    let editionList = ["First Edition", "Second Edition"];

    if (bookDropdown.text == "Genesis") {
        editionList.push("Zeroth Edition");
    }
    if (bookDropdown.text == "Psalms (prose)" || bookDropdown.text == "John") {
        editionList.push("Mayhew");
    }

    for (let i = 0; i < editionList.length; i++) {
        let edition = editionList[i];
        let editionOption = document.createElement('option');
        editionOption.text = edition;
        editionDropdown.add(editionOption);
    }
    editionDropdownContainer.hidden = false;
});