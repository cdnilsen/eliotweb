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

bookDropdown.addEventListener("change", function() {
    let editionDropdownContainer = document.getElementById("edition-dropdown-container");
    editionDropdownContainer.innerHTML = "";

    let editionDropdownLegend = document.createElement('span');
    
    editionDropdownLegend.innerHTML = "Edition: ";
    editionDropdownContainer.appendChild(editionDropdownLegend);

    let editionDropdown = document.createElement('select');
    editionDropdown.id = "searchEditionDropdown";
    editionDropdownContainer.appendChild(editionDropdown);
    let blankOption = document.createElement('option');
    blankOption.text = "";
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
        editionDropdown.add(editionOption);
    }
    editionDropdownContainer.hidden = false;
});