// Allows the user to search for matching words in the Massachusett texts and outputs a list of all their cites.
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

editionToSuperscriptDict = {
    "2": "<sup>α</sup>",
    "3": "<sup>β</sup>",
    "5": "<sup>M</sup>",
    "7": "<sup>א</sup>",
}


//This function is an attempt to deal with the macra and tildes that Eliot uses to represent a following nasal
function processEngma(word) {

    let wordCopy = word;
    //These will need to be dealt with manually, but we'll need to do that later
    if (word.endsWith('ŋ')) {
        //let chapterString = chapter.toString();
        //let verseString = verse.toString();
        wordCopy = word.slice(0, -1);
        wordCopy = wordCopy + "Ŋ";
    }
    
    let labialEngmaClusters = ['ŋb', 'ŋp', 'ŋm', 'ŋf'];

    let replacementClusters = ['mb', 'mp', 'mm', 'mf'];

    for (let i = 0; i < 4; i++) {
        wordCopy = wordCopy.split(labialEngmaClusters[i]).join(replacementClusters[i]);
    }

    wordCopy = wordCopy.split('ŋ').join('n');

    return wordCopy;
}

function cleanDiacritics(word) {

    let charReplacementDict = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "à": "a",
        "è": "e",
        "ì": "i",
        "ò": "o",
        "ù": "u",
        "â": "a",
        "ê": "e",
        "î": "i",
        "ô": "o",
        "û": "u",
        "ä": "a",
        "ë": "e",
        "ï": "i",
        "ö": "o",
        "ü": "u",
        "ã": "aN",
        "õ": "oN",
        "ñ": "nn",
        "m̃": "mm",
        "ũ": "uN",
        "ẽ": "eN",
        "ĩ": "iN",
        "ā": "aN",
        "ē": "eN",
        "ī": "iN",
        "ō": "oN",
        "ū": "uN"
    };

    let cleanedWord = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i] in charReplacementDict) {
            cleanedWord += charReplacementDict[word[i]];
        } else {
            cleanedWord += word[i];
        }
    }
    return processEngma(cleanedWord);
}

//Returns a dictionary with the info about this verse
function decodeVerseCode(verseCode, verseCount) {
    //Examples of verse codes: 225003010, 325003010, 219104022. The first digit is the edition number, the next two are the book number, the next three are the chapter number, and the last three are the verse number. Note that both verseCode and verseCount are lists of strings.
    
    let finalDict = {};
    finalDict["verseCount"] = parseInt(verseCount);
    finalDict["editionNum"] = parseInt(verseCode[0]);
    finalDict["bookNum"] = parseInt(verseCode.slice(1, 3));
    finalDict["addressNum"] = parseInt(verseCode.slice(3, 9));
    return finalDict;

}

function getVerseCodeSpan(verseList, verseCount) {
    console.log(verseList);
    console.log(verseCount);
    let verseCodeText = "";
    let dictOfDicts = {};
    let allBookList = [];
    for (let i = 0; i < verseList.length; i++) {
        let verseDict = decodeVerseCode(verseList[i], verseCount[i]);

        if (dictOfDicts[verseDict["bookNum"]] === undefined) {
            dictOfDicts[verseDict["bookNum"]] = [verseDict];
            allBookList.push(verseDict["bookNum"]);
        } else {
            dictOfDicts[verseDict["bookNum"]].push(verseDict);
        }
    }
    allBookList.sort();
    for (let j=0; j < allBookList.length; j++) {
        
    
    }
    return verseCodeText;
}

function processWordCites(word, totalCount, verseList, verseCount) {
    let outputSpan = document.createElement("span");
    let outputText = `<b>${word}</b> (${totalCount}):<br>`

    let verseCodeSpan = getVerseCodeSpan(verseList, verseCount);

    outputSpan.innerHTML = outputText + verseCodeSpan + "<br>";
    outputSpan.classList.add("wordResult");
    return outputSpan;
}

function getDictFromSearchOutput(searchOutput, resultDiv, sortAlphabetical, sortByBook) {

    let allWords = [];
    let allTotalCounts = [];
    let allVerseLists = [];
    let allVerseCounts = [];

    let dictOfDicts = {};
    for (let i = 0; i < searchOutput.length; i++) {
        let rawDict = searchOutput[i];

        let word = rawDict["word"].split("8").join("ꝏ̄");
        allWords.push(word);

        let processedDict = {};
        processedDict["word"] = word;
        processedDict["totalCount"] = rawDict["totalCount"];
        processedDict["allVerses"] = rawDict["allVerses"];
        processedDict["allVerseCounts"] = rawDict["allVerseCounts"];
        dictOfDicts[word] = processedDict;
    }

    if (sortAlphabetical) {
        allWords.sort();
    } else {
        allWords.sort((a, b) => dictOfDicts[b]["totalCount"] - dictOfDicts[a]["totalCount"]);
    }

    for (let j = 0; j < allWords.length; j++) {
        let word = allWords[j];
        let wordDict = dictOfDicts[word];
        outputSpan = processWordCites(allWords[j], wordDict["totalCount"], wordDict["allVerses"], wordDict["allVerseCounts"]);

        resultDiv.appendChild(outputSpan);
    }
}

async function seeAllWords(fetchString, resultDiv, sortAlphabetical, sortByBook) {
    resultDiv.innerHTML = "";
    fetch(fetchString, {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        getDictFromSearchOutput(res, resultDiv, sortAlphabetical, sortByBook);
    }).catch(err => console.error(err))
}

document.getElementById("searchButton").addEventListener("click", async function() {
    let searchSetting = 1;

    if (document.getElementById("searchMassachusett").checked) {
        searchSetting *= 11;
    }
    if (document.getElementById("searchEnglish").checked) {
        searchSetting *= 13;
    }

    let otherSearchSetting = document.getElementById("searchWordDropdown").value;

    if (otherSearchSetting == "exact") {
        searchSetting *= 2;
    } else if (otherSearchSetting == "contains") {
        searchSetting *= 3;
    } else if (otherSearchSetting == "starts") {
        searchSetting *= 5;
    } else if (otherSearchSetting == "ends") {
        searchSetting *= 7;
    }

    

    let query = document.getElementById("search_bar").value;

    if (document.getElementById("diacriticsLax").checked) {
        searchSetting *= 17;
        query = cleanDiacritics(query);
    }

    let sortAlphabetical = document.getElementById("sortAlph").checked;

    let sortByBook = document.getElementById("sortBookFirst").checked;

   
    let fetchString = "/getWords/" + query + "/" + searchSetting.toString();

    let resultDiv = document.getElementById("results-container");
    await seeAllWords(fetchString, resultDiv, sortAlphabetical, sortByBook);

});
