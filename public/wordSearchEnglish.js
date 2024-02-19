const topBookList = [
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

function cleanPunctuation(word) {
    let allChars = ['.', ',', '!', '?', ';', ':', '[', ']', '(', ')', '\'', '"', '{', '}'];
    let cleanedWord = "";
    for (let i = 0; i < word.length; i++) {
        if (allChars.includes(word[i])) {
            cleanedWord += "";
        } else {
            cleanedWord += word[i];
        }
    }
    return cleanedWord;
}

function getTestWord(word, diacriticsLax=false) {
    let cleanedWord = word.toLowerCase();
    cleanedWord = cleanPunctuation(cleanedWord);
    if (diacriticsLax) {
        cleanedWord = cleanDiacritics(cleanedWord);
    }
    return cleanedWord;
}

function highlightSearchedWord(testWord, text, diacriticsLax=false) {
    let textWordList = text.split(" ");
    let finalWordList = [];
    for (let i = 0; i < textWordList.length; i++) {
        let thisWord = textWordList[i];
        if (getTestWord(thisWord, diacriticsLax) == testWord) {
            finalWordList.push('<span style="color:red; text-decoration:underline;">' + thisWord + '</span>');
        } else if (getTestWord(thisWord, true) == getTestWord(testWord, true)) {
            finalWordList.push('<span style="color:blue;">' + thisWord + '</span>');
        } else {
            finalWordList.push(thisWord);
        }
    }
    return finalWordList.join(" ");
}