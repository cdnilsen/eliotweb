
//Function that turns a list into a string with spaces between the elements, for readability when logging. Not a great pick for lists that have spaces or null elements within them.
function stringOfList(list, useBrackets=true) {
    let finalString = "";
    for (let i = 0; i < list.length; i++) {
        finalString += list[i].toString();
        finalString += ", "
    }
    if (finalString.endsWith(", ")) {
        finalString = finalString.slice(0, -2);
    }
    if (useBrackets) {
        return "[" + finalString + "]";
    } else {
        return finalString;
    }
}

function getDifferenceOfTwoArrays(arr1, arr2) {
    let set1 = new Set(arr1);
    let set2 = new Set(arr2);

    let notInSet1 = new Set([...set2].filter(x => !set1.has(x)));
    let notInSet2 = new Set([...set1].filter(x => !set2.has(x)));

    let notInSet1List = Array.from(notInSet1);
    let notInSet2List = Array.from(notInSet2);

    return [notInSet1List, notInSet2List];
}


function findLongestCommonSubstring(str1, str2) {
    //(courtesy of GeeksForGeeks) 
    let longestSubstring = ""; 
    for (let i = 0; i < str1.length; i++) { 
        for (let j = 0; j < str2.length; j++) { 
            let substring = ""; 
            let x = i; 
            let y = j; 
            while (x < str1.length &&  
                   y < str2.length &&  
                   str1[x] === str2[y]) { 
                substring += str1[x]; 
                x++;
                y++;
            } 
            if (substring.length > longestSubstring.length) { 
                longestSubstring = substring; 
            } 
        } 
    } 
    return longestSubstring; 
}

function postSnippetsToDict(snippetList, verseDict, oldKey, sharedStringIsZero) {

    if (sharedStringIsZero) {
        let newKey = oldKey + "B";
        verseDict[newKey] = snippetList[0];
        delete(verseDict[oldKey]);
    } else {
        let newKeyList = [];
        let keySuffixList = ["A", "B", "C"];
        for (let i = 0; i < 3; i++) {
            let newKey = oldKey + keySuffixList[i];
            if (snippetList[i] == "") {
                newKey = newKey + "B";
            }
            newKeyList.push(newKey);
        }

        delete(verseDict[oldKey]);

        for (let j = 0; j < 3; j++) {
            verseDict[newKeyList[j]] = snippetList[j];
        }
    }
}

function getSnippetTuples(dict1, dict2, snippet1, snippet2, sharedString, key) {

    if (sharedString == "" || snippet1 == "" || snippet2 == "") {
        let verse1List = [snippet1, "", ""];
        let verse2List = [snippet2, "", ""];

        postSnippetsToDict(verse1List, dict1, key, true);
        postSnippetsToDict(verse2List, dict2, key, true);

    } else {
        let verse1Split = snippet1.split(sharedString);
        let verse2Split = snippet2.split(sharedString);
        
        let verse1Prologue = verse1Split[0];
        let verse2Prologue = verse2Split[0];

        let verse1Epilogue = verse1Split[1];
        let verse2Epilogue = verse2Split[1];

        let verse1ProcessingList = [verse1Prologue, sharedString, verse1Epilogue];
        let verse2ProcessingList = [verse2Prologue, sharedString, verse2Epilogue];

        postSnippetsToDict(verse1ProcessingList, dict1, key, false);
        postSnippetsToDict(verse2ProcessingList, dict2, key, false);
    }
}

function checkForKeyMismatch(dict1, dict2) {
    let keyList1 = Object.keys(dict1).sort();
    let keyList2 = Object.keys(dict2).sort();

    let in1ButNot2List = [];
    let in2ButNot1List = [];

    if (keyList1 != keyList2) {
        let keysDifference = getDifferenceOfTwoArrays(keyList1, keyList2);

        in2ButNot1List = keysDifference[0];
        in1ButNot2List = keysDifference[1];

    }
    in2ButNot1List = in2ButNot1List.sort();
    in1ButNot2List = in1ButNot2List.sort();

    let noMismatches = (in1ButNot2List.length == 0 && in2ButNot1List.length == 0);

    let listsNotSameLength = (in1ButNot2List.length != in2ButNot1List.length);

    return [in1ButNot2List, in2ButNot1List, noMismatches, listsNotSameLength];
}

//I don't like this much (it's kludgy) but it seems to work. When I checked against the texts it appears to be accurate.
function fixMissingBs(dict1, dict2, chapter, verse) {
    let mismatchingKeys = checkForKeyMismatch(dict1, dict2);

    let canProcess = true;
    if (mismatchingKeys[2]) {
        // If there aren't any mismatches, quit. Could put a single return after the whole if-else thing but this makes things more explicit
        return [[], [], canProcess, "no mismatches"];
    } else if (mismatchingKeys[3]) {
        // If there are mismatches but the lists aren't the same length, flag it
        console.log("Mismatching keys are not the same length at " + chapter.toString() + ":"+ verse.toString());
        console.log(mismatchingKeys1);
        console.log(mismatchingKeys2);
        
        canProcess = false;
        return [[], [], canProcess, "lists aren't the same length (find the bug)"];
    } else {
        let mismatchingKeys1 = mismatchingKeys[0];
        let mismatchingKeys2 = mismatchingKeys[1];

        for (let i = 0; i < mismatchingKeys1.length; i++) {

            let firstKey = mismatchingKeys1[i];
            let secondKey = mismatchingKeys2[i];

            if (firstKey.endsWith("B") && firstKey.slice(0, -1) == secondKey) {
                let newSecondKey = secondKey + "B";
                dict2[newSecondKey] = dict2[secondKey];
                delete(dict2[secondKey]);
            }

            if (secondKey.endsWith("B") && secondKey.slice(0, -1) == firstKey) {
                let newFirstKey = firstKey + "B";
                dict1[newFirstKey] = dict1[firstKey];
                delete(dict1[firstKey]);
            }
        }
        // Pre-sort for safety
        let newSortedKeys1 = Object.keys(dict1).sort();
        let newSortedKeys2 = Object.keys(dict2).sort();
        
        let failureReason = "";
        let differentLengths = (newSortedKeys1.length != newSortedKeys2.length);

        //The machine sometimes thinks that sorted key lists that are actually the same...aren't. This can flag them to console (currently commented out), but also has the machine make sure there's really a difference. We could also call the difference array function for an extra check, though it's probably not necessary.
        if (newSortedKeys1 != newSortedKeys2) {
            //console.log("Thinks it can't process " + chapter.toString() + ":" + verse.toString());
            if (differentLengths) {
                failureReason = "different lengths";
                canProcess = false;
            } else {
                let mismatchExists = false;
                for (let i = 0; i < newSortedKeys1.length; i++) {
                    if (newSortedKeys1[i] != newSortedKeys2[i]) {
                        console.log("First edition: " + newSortedKeys1[i]);
                        console.log("Second edition: " + newSortedKeys2[i]);
                        failureReason = "sorted keys, but weren't the same";
                        mismatchExists = true;
                    }
                }
                if (mismatchExists) {
                    canProcess = false;
                }
            }
        }
        return [newSortedKeys1, newSortedKeys2, canProcess, failureReason];
    }
}

function processDictKeys(dict1, dict2, key) {
    if (dict1[key] == undefined) {
        dict1[key] = "";
    }
    if (dict2[key] == undefined) {
        dict2[key] = "";
    }

    let verseSnippet1 = dict1[key];
    let verseSnippet2 = dict2[key];

    let sharedString = findLongestCommonSubstring(verseSnippet1, verseSnippet2);
    
    getSnippetTuples(dict1, dict2, verseSnippet1, verseSnippet2, sharedString, key);
}

function processVerseDictionaries(dict1, dict2) {
    let allKeys = Object.keys(dict1);

    let relevantKeys = [];
    
    for (let i = 0; i < allKeys.length; i++) {
        if (!allKeys[i].endsWith("B")) {
            relevantKeys.push(allKeys[i]);
        }
    }

    for (let j = 0; j < relevantKeys.length; j++) {
        let key = relevantKeys[j];
        processDictKeys(dict1, dict2, key);
    }

    return (relevantKeys.length > 0);
}

function castColor(string, color) {
    return '<span style="color:' + color + '"><b>' + string + '</b></span>';
}

function antiCastColor(string, color) {
    return '</b></span>' + string + '<span style="color:' + color + '"><b>';
}

function getSlicedListAtIndex(word, index) {
    return [word.slice(0, index), word.slice(index + 1)]
}

function scrapSpuriousTags (string) {
    let colorList = ['blue', 'red'];
    for (let i = 0; i < colorList.length; i++) {
      let spuriousTag = '<span style="color:' + colorList[i] + '"><b></b></span>'
  
      string = string.split(spuriousTag).join('')
    }
    return string;
}

function unwrapDummyChars(wrappedString1, wrappedString2, unwrapDict1, unwrapDict2, markCasing) {
    let unwrapDictList = [unwrapDict1, unwrapDict2];

    let intermediateStringList = [wrappedString1, wrappedString2];

    let nearFinalStringList = [];
    for (let i = 0; i < 2; i++) {
        let unwrapDict = unwrapDictList[i];
        let allKeys = Object.keys(unwrapDict);
        let intermediateString = intermediateStringList[i];
        for (let j = 0; j < allKeys.length; j++){
            let k = allKeys[j];
            let wrap = unwrapDict[k];

            let unwrappedString = wrap;

            if (markCasing) {
                unwrappedString = castColor(unwrappedString, "blue");
            }

            unwrappedString = antiCastColor(unwrappedString, "red");

            intermediateString = intermediateString.split(k).join(unwrappedString);
        }
        nearFinalStringList.push(intermediateString);
    }

    let finalStringList = [];
    for (let z = 0; z < 2; z++) {
        let thisString = nearFinalStringList[z];
        thisString = castColor(thisString, "red");
        thisString = scrapSpuriousTags(thisString);
        finalStringList.push(thisString);
    }

    return finalStringList;
}

function fixSecretCasingDifference(substring1, substring2, loweredString1, loweredString2, markCasing) {
    let finalSubstring1 = "";
    let finalSubstring2 = "";

    let sharedLowerSubstring = findLongestCommonSubstring(loweredString1, loweredString2);

    if (sharedLowerSubstring == "") {
        finalSubstring1 = castColor(substring1, "red");
        finalSubstring2 = castColor(substring2, "red");
        return [finalSubstring1, finalSubstring2];
    }

    let newSubstring1 = substring1;
    let newSubstring2 = substring2;

    let newLowered1 = loweredString1;
    let newLowered2 = loweredString2;
    
    let counterCharDict1 = {};
    let counterCharDict2 = {};

    let counter = 0;
    while (sharedLowerSubstring != "") {
        let substring1Index = newLowered1.indexOf(sharedLowerSubstring);
        let substring2Index = newLowered2.indexOf(sharedLowerSubstring);

        let originalChar1 = newSubstring1[substring1Index];
        let originalChar2 = newSubstring2[substring2Index];

        let substringList1 = getSlicedListAtIndex(newSubstring1, substring1Index);
        let substringList2 = getSlicedListAtIndex(newSubstring2, substring2Index);

        let guillemetedCounter = "‹" + counter.toString() + "›";

        newSubstring1 = substringList1[0] + guillemetedCounter + substringList1[1];
        newSubstring2 = substringList2[0] + guillemetedCounter + substringList2[1];

        counterCharDict1[guillemetedCounter] = originalChar1;
        counterCharDict2[guillemetedCounter] = originalChar2;

        let numDummies = guillemetedCounter.length

        let slicedLowerList1 = newLowered1.split(sharedLowerSubstring);
        let slicedLowerList2 = newLowered2.split(sharedLowerSubstring);

        //now go through and for every digit in the counter, plus two (for the guillemets), throw a *separate* dummy char into the lowers

        newLowered1 = slicedLowerList1[0] +  "α".repeat(numDummies) +  slicedLowerList1[1];
        newLowered2 = slicedLowerList2[0] + "β".repeat(numDummies) + slicedLowerList2[1];

        sharedLowerSubstring = findLongestCommonSubstring(newLowered1, newLowered2);

        counter += 1;
    }

    return unwrapDummyChars(newSubstring1, newSubstring2, counterCharDict1, counterCharDict2, markCasing);
}

// To be called when the substrings *don't* match.
function finalMismatchCheck(substring1, substring2, finalString1, finalString2, markCasing) {
    let completeMatch = (substring1 == substring2);

    if (completeMatch) {
        finalString1 += substring1;
        finalString2 += substring2;
        return [finalString1, finalString2];
    }

    let lowered1 = substring1.toLowerCase();
    let lowered2 = substring2.toLowerCase();

    let matchLower = (lowered1 == lowered2);

    let finalSubstring1 = "";
    let finalSubstring2 = "";
    if (matchLower) {
        if (markCasing) {
            finalSubstring1 = castColor(substring1, "blue");
            finalSubstring2 = castColor(substring2, "blue");
        } else {
            finalSubstring1 = substring1;
            finalSubstring2 = substring2;
        }
    } else {
        let finalList = fixSecretCasingDifference(substring1, substring2, lowered1, lowered2, markCasing);

        finalSubstring1 = finalList[0];
        finalSubstring2 = finalList[1];
    }
    finalString1 += finalSubstring1;
    finalString2 += finalSubstring2;

    return [finalString1, finalString2];
}

function addDifferenceTags(verse1Dict, verse2Dict, sortedKeys, useCasing) {
    let finalVerse1 = "";
    let finalVerse2 = "";

    for (let i = 0; i < sortedKeys.length; i++) {
        let k = sortedKeys[i];
        let subverse1 = verse1Dict[k];
        let subverse2 = verse2Dict[k];
        
        let newVerses = finalMismatchCheck(subverse1, subverse2, finalVerse1, finalVerse2, useCasing);

        finalVerse1 = newVerses[0];
        finalVerse2 = newVerses[1];
    }
    return [finalVerse1, finalVerse2];
}

function compareVerses(verse1, verse2, chapterNum, verseNum, useCasing) {
    let verse1Dict = {
        "": verse1
    };

    let verse2Dict = {
        "": verse2
    };

    let keepGoing = true;
    let safetyCounter = 0;
    while(keepGoing && safetyCounter < 100) {
        keepGoing = processVerseDictionaries(verse1Dict, verse2Dict);
        safetyCounter += 1;
    }

    if (safetyCounter == 100) {
        console.log("Endless loop!");
    }

    let fixedBsList = fixMissingBs(verse1Dict, verse2Dict, chapterNum, verseNum);

    let canProcess = fixedBsList[2];

    let processedVerses = [];

    if (canProcess) {
        let allKeys1 = fixedBsList[0];
        let allKeys2 = fixedBsList[1];

        processedVerses = addDifferenceTags(verse1Dict, verse2Dict, allKeys1, useCasing);
    } else {
        console.log("Can't process " + chapterNum.toString() + "." + verseNum.toString() + ": " + fixedBsList[3] + "\n Showing raw text instead.");
        processedVerses = [verse1, verse2];
    }
    return processedVerses;
}

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

async function grabBook(book) {
    event.preventDefault(); // Prevents the default form submission behavior
    let firstEditionAddress = "./texts/" + book + ".First Edition.txt";
    let secondEditionAddress = "./texts/" + book + ".Second Edition.txt";

    let firstEditionRaw = await fetch(firstEditionAddress);
    let secondEditionRaw = await fetch(secondEditionAddress);

    let firstEditionText = await firstEditionRaw.text();
    let secondEditionText = await secondEditionRaw.text();

    let firstEditionLines = firstEditionText.split("\n");
    let secondEditionLines = secondEditionText.split("\n");

    let outputDict = {};

    outputDict["verseNums"] = [];
    outputDict["chapterNums"] = [];
    outputDict["verseText1"] =[];
    outputDict["verseText2"] = [];

    for (let i = 1; i < bookToChapterDict[book] + 1; i++) {
        let chapter = i;
        //These have been logged to console, and work:
        let firstEditionDict = grabRightLines(firstEditionLines, chapter);
        let secondEditionDict = grabRightLines(secondEditionLines, chapter);
        
        let verseList1 = Object.keys(firstEditionDict);
        let verseList2 = Object.keys(secondEditionDict);

        verseList1.sort(function (a, b) { return a - b; });
        verseList2.sort(function (a, b) { return a - b; });

        let verseNumList = [];
        let verseText1 = [];
        let verseText2 = [];
        let chapterNums = [];

        for (let j = 0; j < verseList1.length; j++) {
            let verseNum1 = chapter.toString()+ "." + verseList1[j];
            let verseNum2 = chapter.toString()+ "." + verseList2[j];

            verseNumList.push(verseNum1);
            verseText1.push(firstEditionDict[verseList1[j]]);
            verseText2.push(secondEditionDict[verseList1[j]]);
            chapterNums.push(chapter);

            if (verseNum1 != verseNum2) {
                console.log("Verse numbers don't match in " + book + " " + chapter + ":" + verseNum1 + "/" + verseNum2);
            }
     
        }

        outputDict["verseNums"] = outputDict["verseNums"].concat(verseNumList);
        outputDict["chapterNums"] = outputDict["chapterNums"].concat(chapterNums);
        outputDict["verseText1"] = outputDict["verseText1"].concat(verseText1);
        outputDict["verseText2"] = outputDict["verseText2"].concat(verseText2);
        
    }
    return outputDict;
}

function processBookDict(bookDict) {
    for (let j = 0; j < bookDict["verseNums"].length; j++) {
        let verse1 = bookDict["verseText1"][j];
        let verse2 = bookDict["verseText2"][j];
        let chapterNum = bookDict["chapterNums"][j];
        let verseNum = bookDict["verseNums"][j];
        
        compareVerses(verse1, verse2, chapterNum, verseNum);
    }
}

let verse1 = "Onk woh wunnamptamwog Jehovah ummanitt8m8oh wut8shinneunk, Ummanitt8moh Abraham, Ummanitt8moh Isaak kah Ummanitt8moh Jakob kemnaéhtunk."

let verse2 = "Onk woh wunnamptamwog Jehovah um-Manitt8m8oh wut8shinneunk, um-Manitt8moh Abraham, um-Manitt8moh Isaak, kah um-Manitt8moh Jakob kenaéhtunk."

let submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", async function(event) {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    event.preventDefault();
    
    let comparedWithCasing = compareVerses(verse1, verse2, 4, 5, true);
    let comparedWithoutCasing = compareVerses(verse1, verse2, 4, 5, false);

    let allExamples = [comparedWithCasing, comparedWithoutCasing];

    for (let i = 0; i < 2; i++) {
        let editionList = allExamples[i];

        let verseDiv = document.createElement("div");
        verseDiv.innerHTML = '<u>4.5</u><br>';
        for (let j = 0; j < editionList.length; j++) {
            let edition = editionList[j];
            let textSpan = document.createElement("span");
            textSpan.innerHTML += edition;
            textSpan.innerHTML += "<br>";
            verseDiv.appendChild(textSpan);
        }
        verseDiv.innerHTML += "<br>";
        outputDiv.appendChild(verseDiv);
    }
    
    //let ruthDict = await grabBook("Ruth");
    //processBookDict(ruthDict);
});


/*

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

const bookToChapterDict = {
    "": 0,
    "Genesis": 50,
    "Exodus": 40,
    "Leviticus": 27,
    "Numbers": 36,
    "Deuteronomy": 34,
    "Joshua": 24,
    "Judges": 21,
    "Ruth": 4,
    "1 Samuel": 31,
    "2 Samuel": 24,
    "1 Kings": 22,
    "2 Kings": 25,
    "1 Chronicles": 29,
    "2 Chronicles": 36,
    "Ezra": 10,
    "Nehemiah": 13,
    "Esther": 10,
    "Job": 42,
    "Psalms (prose)": 150,
    "Psalms (metrical)": 150,
    "Proverbs": 31,
    "Ecclesiastes": 12,
    "Song of Songs": 8,
    "Isaiah": 66,
    "Jeremiah": 52,
    "Lamentations": 5,
    "Ezekiel": 48,
    "Daniel": 12,
    "Hosea": 14,
    "Joel": 3,
    "Amos": 9,
    "Obadiah": 1,
    "Jonah": 4,
    "Micah": 7,
    "Nahum": 3,
    "Habakkuk": 3,
    "Zephaniah": 3,
    "Haggai": 2,
    "Zechariah": 14,
    "Malachi": 4,
    "Matthew": 28,
    "Mark": 16,
    "Luke": 24,
    "John": 21,
    "Acts": 28,
    "Romans": 16,
    "1 Corinthians": 16,
    "2 Corinthians": 13,
    "Galatians": 6,
    "Ephesians": 6,
    "Philippians": 4,
    "Colossians": 4,
    "1 Thessalonians": 5,
    "2 Thessalonians": 3,
    "1 Timothy": 6,
    "2 Timothy": 4,
    "Titus": 3,
    "Philemon": 1,
    "Hebrews": 13,
    "James": 5,
    "1 Peter": 5,
    "2 Peter": 3,
    "1 John": 5,
    "2 John": 1,
    "3 John": 1,
    "Jude": 1,
    "Revelation": 22
};

let bookDropdown = document.getElementById("bookDropdown");

let outputDiv = document.getElementById("output");
let submitButton = document.getElementById("submitButton");

function addBooks() {
    let blankOption = document.createElement("option");
    blankOption.text = "";
    blankOption.value = "";
    bookDropdown.add(blankOption);
    for (let i = 0; i < allBookList.length; i++) {
        let option = document.createElement("option");
        option.text = allBookList[i];
        option.value = allBookList[i];
        bookDropdown.add(option);
    }
}

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

async function grabBook(book) {
    let firstEditionAddress = "./texts/" + book + ".First Edition.txt";
    let secondEditionAddress = "./texts/" + book + ".Second Edition.txt";

    let firstEditionRaw = await fetch(firstEditionAddress);
    let secondEditionRaw = await fetch(secondEditionAddress);

    let firstEditionText = await firstEditionRaw.text();
    let secondEditionText = await secondEditionRaw.text();

    let firstEditionLines = firstEditionText.split("\n");
    let secondEditionLines = secondEditionText.split("\n");

    let outputDict = {};

    outputDict["verseNums"] = [];
    outputDict["chapterNums"] = [];
    outputDict["verseText1"] =[];
    outputDict["verseText2"] = [];
   
    for (let i = 1; i < bookToChapterDict[book] + 1; i++) {
        let chapter = i;
        //These have been logged to console, and work:
        let firstEditionDict = grabRightLines(firstEditionLines, chapter);
        let secondEditionDict = grabRightLines(secondEditionLines, chapter);

        let verseList1 = Object.keys(firstEditionDict);
        let verseList2 = Object.keys(secondEditionDict);

        verseList1.sort(function (a, b) { return a - b; });
        verseList2.sort(function (a, b) { return a - b; });

        let verseNumList = [];
        let verseText1 = [];
        let verseText2 = [];
        let chapterNums = [];

        for (let j = 0; j < verseList1.length; j++) {
            let verseNum1 = chapter.toString()+ "." + verseList1[j];
            let verseNum2 = chapter.toString()+ "." + verseList2[j];

            verseNumList.push(verseNum1);
            verseText1.push(firstEditionDict[verseList1[j]]);
            verseText2.push(secondEditionDict[verseList1[j]]);
            chapterNums.push(chapter);

            if (verseNum1 != verseNum2) {
                console.log("Verse numbers don't match in " + book + " " + chapter + ":" + verseNum1 + "/" + verseNum2);
            }
     
        }

        outputDict["verseNums"] = outputDict["verseNums"].concat(verseNumList);
        outputDict["chapterNums"] = outputDict["chapterNums"].concat(chapterNums);
        outputDict["verseText1"] = outputDict["verseText1"].concat(verseText1);
        outputDict["verseText2"] = outputDict["verseText2"].concat(verseText2);
        
    }
    return outputDict;
}

addBooks();

function findLongestCommonSubstring(str1, str2) {
    let longestSubstring = ""; 
    for (let i = 0; i < str1.length; i++) { 
        for (let j = 0; j < str2.length; j++) { 
            let substring = ""; 
            let x = i; 
            let y = j; 
            while (x < str1.length &&  
                   y < str2.length &&  
                   str1[x] === str2[y]) { 
                substring += str1[x]; 
                x++;
                y++;
            } 
            if (substring.length > longestSubstring.length) { 
                longestSubstring = substring; 
            } 
        } 
    } 
    return longestSubstring; 
}

//This is mildly bugged, in that if one of the mismatched parts of a string is mismatched due to casing, then it will still color it red
function replaceMiniSharedStrings(string, sharedString, matchesCase) {
    let finalString = "";
    let bracketDict = {};

    if (matchesCase) {
        bracketDict["start"] = "Ƀ";
        bracketDict["end"] = "ƀ";
    } else {
        bracketDict["start"] = "Ř";
        bracketDict["end"] = "ř";
    }

    if (sharedString != "" && string != sharedString) {
        if (string.startsWith(sharedString)){
            finalString = sharedString + bracketDict["start"] + string.slice(sharedString.length) + bracketDict["end"];
        } else if (string.endsWith(sharedString)){
            finalString = bracketDict["start"]+ string.slice(0, -sharedString.length) + bracketDict["end"] + sharedString;
        } else if (string != sharedString) {
            finalString = bracketDict["start"] + string.split(sharedString).join(bracketDict["end"] + sharedString + bracketDict["start"]) + bracketDict["end"];
        }
    } else if (string != sharedString) {
        finalString = bracketDict["start"] + string + bracketDict["end"];
    } else {
        finalString = string;
    }
    return finalString;
}

function replaceCommonSubstrings(text1, text2, index) {
    let commonSubstring = "";

    if (text1 == text2) {
        commonSubstring = text1;
    } else {
        commonSubstring = findLongestCommonSubstring(text1, text2);
    }

    let text1Split = text1.split(commonSubstring);
    let text2Split = text2.split(commonSubstring);

    let outputText1 = "";
    let outputText2 = "";

    let commonSubstringLength = commonSubstring.length;

    let commonSubstringFirst = false;

    if (text1.startsWith(commonSubstring)) {
        outputText1 = 'ǀ‹' + index.toString() + '›ǀ' + text1.slice(commonSubstringLength);
        commonSubstringFirst = true;
    } else {
        outputText1 = text1Split.join('ǀ‹' + index.toString() + '›ǀ');
    }
    
    if (text2.startsWith(commonSubstring)) {
        outputText2 = 'ǂ«' + index.toString() + '»ǂ' + text2.slice(commonSubstringLength);
    } else {
        outputText2 = text2Split.join('ǂ«' + index.toString() + '»ǂ');
    }


    let outputDict = {
        "processedText1" : outputText1,
        "processedText2" : outputText2,
        "commonSubstring" : commonSubstring,
        "startsWithShared": commonSubstringFirst
    }

    return outputDict;
}

function stringIsShared(string, guillemet){
    let answer = false;
    if (string[0] == guillemet) {
        answer = true;
    }
    return answer;
}

function addDummyListEntries(splitList, guillemet) {

    let rightGuillemetDict = {
        "‹" : "›",
        "«" : "»"
    }

    let rightGuillemet = rightGuillemetDict[guillemet];
    let intermediateList = [];

    for (let i = 0; i < splitList.length - 1; i++) {
        let thisElement = splitList[i];
        let nextElement = splitList[i+1];

        if (stringIsShared(thisElement, guillemet) && stringIsShared(nextElement, guillemet)) {
            intermediateList.push(thisElement);
            intermediateList.push("");
            intermediateList.push(nextElement);
        } else {
            intermediateList.push(thisElement);
            intermediateList.push(nextElement);
        }
        i += 1;
    }

    let finalList = [];
    for (let j = 0; j < intermediateList.length; j++) {
        if (intermediateList[j] != guillemet && intermediateList[j] != rightGuillemet) {
            finalList.push(intermediateList[j]);
        }
    }

    return finalList;
}

function getIndexFromGuillemetString(string, guillemet) {
    let rightGuillemetDict = {
        "‹" : "›",
        "«" : "»"
    }
    let rightGuillemet = rightGuillemetDict[guillemet];

    return parseInt(string.slice(1, -1));
}
 
function putSubstringsBackIn(text1Split, text2Split, indexToSubstringDict) {
    let finalString1 = "";
    let finalString2 = "";
    for (let i = 0; i < text1Split.length; i++) {
        if (stringIsShared(text1Split[i], "‹") && stringIsShared(text2Split[i], "«")) {
            let text1Index = getIndexFromGuillemetString(text1Split[i], "‹");
            let text2Index = getIndexFromGuillemetString(text2Split[i], "«");

            let substring1 = indexToSubstringDict[text1Index];
            let substring2 = indexToSubstringDict[text2Index];

            if (substring1 == substring2) {
                finalString1 += substring1;
                finalString2 += substring2;
            } else if (substring1.toLowerCase() != substring2.toLowerCase()) {
                let commonSubstring = findLongestCommonSubstring(substring1, substring2);

                let addString1 = replaceMiniSharedStrings(substring1, commonSubstring, false);
                let addString2 = replaceMiniSharedStrings(substring2, commonSubstring, false);

                finalString1 += addString1;
                finalString2 += addString2;
            } else {
                let commonSubstring = findLongestCommonSubstring(substring1, substring2);

                let addString1 = replaceMiniSharedStrings(substring1, commonSubstring, true);
                let addString2 = replaceMiniSharedStrings(substring2, commonSubstring, true);

                finalString1 += addString1;
                finalString2 += addString2;
            }
        } else if (text1Split[i].toLowerCase() == text2Split[i].toLowerCase() && text1Split[i] != text2Split[i]) {
            let commonSubstring = findLongestCommonSubstring(text1Split[i], text2Split[i]);

            let addString1 = replaceMiniSharedStrings(text1Split[i], commonSubstring, true);
            let addString2 = replaceMiniSharedStrings(text2Split[i], commonSubstring, true);

            finalString1 += addString1;
            finalString2 += addString2;

        } else {
            let commonSubstring = findLongestCommonSubstring(text1Split[i], text2Split[i]);

            let addString1 = replaceMiniSharedStrings(text1Split[i], commonSubstring, false);
            let addString2 = replaceMiniSharedStrings(text2Split[i], commonSubstring, false);

            finalString1 += addString1;
            finalString2 += addString2;
        } 
    }
    let listOfStrings = [finalString1, finalString2];
    let finalStringList = [];
    for (let j = 0; j < 2; j++) {
        let thisString = listOfStrings[j];
        thisString = thisString.split("Řř").join("");
        thisString = thisString.split("Ƀƀ").join("");
        finalStringList.push(thisString);
    }
    return finalStringList;
}

function isDigit(char) {
    return Boolean([true, true, true, true, true, true, true, true, true, true][char]);
}

//Horrible little Macgyvered solution
function replaceInitialDigits(string, startingSubstring) {
    if(!isDigit(string[0])) {
        return string;
    }
    else {
        let finalString = startingSubstring;
        let digitsStopped = false;
        for (let i = 0; i < string.length; i++) {
            if (!isDigit(string[i])) {
                digitsStopped = true
            }
            if (digitsStopped) {
                finalString += string[i];
            }
        }
        return finalString;
    }
}

function substringPopulationChecker(text1Split, text2Split, indexToSubstringDict) {

    let listsAreSameLength = text1Split.length == text2Split.length;

    let finalStringList = [];

    if (!listsAreSameLength) {
        console.log("Lists are not the same length.");
    } else {
        finalStringList = putSubstringsBackIn(text1Split, text2Split, indexToSubstringDict);
    }
    return finalStringList;
}

function replaceDummiesWithTags(string, showCasing) {
    let finalString = string.split("Ř").join("<span style='color:red'><b>");
    finalString = finalString.split("ř").join("</b></span>");
    if (showCasing) {
        finalString = finalString.split("Ƀ").join("<span style='color:blue'><b>");
        finalString = finalString.split("ƀ").join("</b></span>");
    } else {
        finalString = finalString.split("Ƀ").join("");
        finalString = finalString.split("ƀ").join("");
    }
    return finalString;
}

function getDifferences(text1, text2, showCasing) {
    let commonSubstringLengthMoreThan1 = true;
    let currentSubstringIndex = 0;

    let indexToSubstringDict = {};

    let currentText1 = text1;
    let currentText2 = text2;

    let outerDiv = document.createElement('div');

    let finalText1 = "";
    let finalText2 = "";

    let startsWithShared = false;
    let startingCommon = "";
    while (commonSubstringLengthMoreThan1 && currentSubstringIndex < 50) {
        let processedTextDict = replaceCommonSubstrings(currentText1, currentText2, currentSubstringIndex);

        indexToSubstringDict[currentSubstringIndex] = processedTextDict["commonSubstring"];

        if (processedTextDict["startsWithShared"]) { 
            startingCommon = processedTextDict["commonSubstring"];
            startsWithShared = true;
        }

        currentText1 = processedTextDict["processedText1"];

        currentText2 = processedTextDict["processedText2"];

        currentSubstringIndex += 1;

        if (processedTextDict["commonSubstring"].length < 2) {
            commonSubstringLengthMoreThan1 = false;
        }
    finalText1 = currentText1;
    finalText2 = currentText2;
    }

    if (finalText1.startsWith("ǀ‹ǀ‹")) {
        finalText1 = finalText1.slice(2);
    }

    if (finalText2.startsWith("ǂ«ǂ«")) {
        finalText2 = finalText2.slice(2);
    }


    if (finalText1.endsWith("›ǀ›ǀ")) {
        finalText1 = finalText1.slice(0, -2);
    }

    if (finalText2.endsWith("»ǂ»ǂ")) {
        finalText2 = finalText2.slice(0, -2);
    }

    finalText1 = finalText1.split("ǀ‹ǀ‹").join("ǀ‹");
    finalText2 = finalText2.split("ǂ«ǂ«").join("ǂ«");
    finalText1 = finalText1.split("›ǀ›ǀ").join("›ǀ");
    finalText2 = finalText2.split("»ǂ»ǂ").join("»ǂ");
    
    let text1SplitList = finalText1.split("ǀ");
    let text2SplitList = finalText2.split("ǂ");
    
    let replacementList1 = addDummyListEntries(text1SplitList, '‹');
    let replacementList2 = addDummyListEntries(text2SplitList, '«');

    let finalStringList = substringPopulationChecker(replacementList1, replacementList2, indexToSubstringDict);

    let newStringList = [];

    if (startsWithShared) {
        let firstEditionText = replaceInitialDigits(finalStringList[0], startingCommon);

        let secondEditionText = replaceInitialDigits(finalStringList[1], startingCommon);

        newStringList.push(replaceDummiesWithTags(firstEditionText, showCasing));
        newStringList.push(replaceDummiesWithTags(secondEditionText, showCasing));
    } else {
        newStringList = finalStringList;
    }
    /*
    if (text1SplitList.length != text2SplitList.length) {
        let div1 = document.createElement('div');
        div1.innerHTML = replacementList1.join("|") + "<br>"
        outerDiv.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = replacementList2.join("|") + "<br>"
        outerDiv.appendChild(div2);

        console.log("Do " + chapter.toString() + ":" + verse.toString() + " manually.");
        console.log("Replacement list identical: " + (replacementList1.length == replacementList2.length).toString());

    } else {
        let div1 = document.createElement('div');
        div1.innerHTML = replacementList1.join("|") + "<br>"
        outerDiv.appendChild(div1);

        let div2 = document.createElement('div');
        div2.innerHTML = replacementList2.join("|") + "<br>"
        outerDiv.appendChild(div2);
    }
    
    return newStringList;
}

submitButton.addEventListener("click", async function(event) {
    outputDiv.innerHTML = "";
    event.preventDefault(); // Prevents the default form submission behavior

    let selectedBook = bookDropdown.value;
    let outputDict = await grabBook(selectedBook);
    
    let allVerses = outputDict["verseNums"];
    let chapterList = outputDict["chapterNums"];
    let verseText1 = outputDict["verseText1"];
    let verseText2 = outputDict["verseText2"];


    for (let i = 0; i < allVerses.length; i++) {
        let verseNum = allVerses[i];
        let chapterNum = chapterList[i];
        let firstEdText = verseText1[i];
        let secondEdText = verseText2[i];

        let finalStrings = getDifferences(firstEdText, secondEdText, chapterNum, verseNum);

        let div1 = document.createElement('div');
        div1.innerHTML = replaceDummiesWithTags(finalStrings[0]);

        let div2 = document.createElement('div');
        div2.innerHTML = replaceDummiesWithTags(finalStrings[1]);

        let verseSpan = document.createElement("span");
        verseSpan.innerHTML = "<u>" + verseNum.toString() + "</u><br>";
        outputDiv.appendChild(verseSpan);
        outputDiv.appendChild(div1);
        outputDiv.appendChild(div2);
        outputDiv.appendChild(document.createElement('br'));
    }    
});
*/
