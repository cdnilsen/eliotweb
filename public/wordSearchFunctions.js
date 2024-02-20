export const topBookList = [
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

function createTriangle(unclickedColor, clickedColor) {
    let triangle = document.createElement('span');
    triangle.name = "triangle";
    triangle.innerHTML = " ▶";
    triangle.style.color = unclickedColor;
    triangle.style.cursor = "pointer";
    triangle.addEventListener('click', function() {
        if (triangle.innerHTML === " ▶") {
            triangle.innerHTML = " ▼";
            triangle.style.color = clickedColor;
        } else {
            triangle.innerHTML = " ▶";
            triangle.style.color = unclickedColor;
        }
    });
    return triangle;
}

export function addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak=true) {
    let triangle = createTriangle(unclickedColor, clickedColor);
    parentContainer.appendChild(triangle);
    if (addBreak) {
        let breakSpan = document.createElement('br');
        parentContainer.appendChild(breakSpan);
    }
    return triangle;
}

export function zip(list1, list2) {
    let zipped = {};
    for (let i = 0; i < list1.length; i++) {
        zipped[list1[i]] = list2[i];
    }
    return zipped;
}

export function resetResults() {
    let allVerseSpans = document.getElementsByClassName('cite-span');
    for (let i = 0; i < allVerseSpans.length; i++) {
        allVerseSpans[i].classList.remove('active');
        allVerseSpans[i].style.color = "black";
        allVerseSpans[i].style.fontWeight = "normal";
    }
    
    //Probably inefficient as it requires another check to the database. However, it looks like things work!
    let allPopups = document.getElementsByClassName('show-verse');
    for (let i = 0; i < allPopups.length; i++) {
        allPopups[i].remove();
    }
}