import { PentateuchList, HistoricalBooksList, WisdomBooksList, MajorProphetsList, MinorProphetsList, gospelsList, restOfNTList, mishnaicList, bookToNumberDict, allBookList, bookToChapterDict, bookToChapterVerseDict, NTBookList, bookToActiveEditionsDict, psalmsWithVerseZero} from "./bookdata.js";

let sectionToBooksDict = {
    "pentateuch": PentateuchList,
    "history": HistoricalBooksList,
    "wisdom": WisdomBooksList,
    "major_prophets": MajorProphetsList,
    "minor_prophets": MinorProphetsList,
    "gospels": gospelsList,
    "other_nt": restOfNTList,
    "mishnaic": mishnaicList
}

let sectionDropdown = document.getElementById("sectionDropdown");

let bookDropdown = document.getElementById("searchBookDropdown");
sectionDropdown.addEventListener("change", function() {
    let selectedSection = sectionDropdown.value;
    let bookList = sectionToBooksDict[selectedSection];
    bookDropdown.innerHTML = "";
    for (let i = 0; i < bookList.length; i++) {
        let book = bookList[i];
        if (bookToActiveEditionsDict[book] > 1) {
            let bookOption = document.createElement('option');
            bookOption.text = book;
            bookOption.value = book;
            bookDropdown.add(bookOption);
        }
    }

    let firstBook = bookList[0];
    bookDropdown.hidden = false;
    updateChapterDropdown(firstBook);
    revealCheckboxes(firstBook);
    document.getElementById('searchChapterLegend').innerHTML = "Chapter";
    document.getElementById('verseDropdown').hidden = true;
});

//Seems to be necessary for it to show anything
let chapterDropdown = document.getElementById("chapterSelectionDropdown");
let chapterLegend = document.getElementById("searchChapterLegend");
function updateChapterDropdown(whichBook) {
    chapterDropdown.innerHTML = "";
    let chapter1option = document.createElement("option");
    chapter1option.text = 1;
    chapter1option.value = 1;
    chapterDropdown.add(chapter1option);
    if (bookToChapterDict[whichBook] > 1) {
        for (let i = 2; i <= bookToChapterDict[whichBook]; i++) {
            let option = document.createElement("option");
            option.text = i;
            option.value = i;
            chapterDropdown.add(option);
        }
    }
}

function revealCheckboxes(book) {
    document.getElementById('differenceSelection').hidden = true;

    let activeEditionsNumber = bookToActiveEditionsDict[book];
    let editionContainerDict = {
        2: document.getElementById('firstEditionContainer'),
        3: document.getElementById('secondEditionContainer'),
        5: document.getElementById('mayhewContainer'),
        7: document.getElementById('zerothContainer'),
        13: document.getElementById('grebrewContainer')
    }

    let editionCheckboxDict = {
        2: document.getElementById('useFirstEdition'),
        3: document.getElementById('useSecondEdition'),
        5: document.getElementById('useMayhew'),
        7: document.getElementById('useZerothEdition'),
        13: document.getElementById('useGrebrew')
    }

    let originalLanguage = "";
    if (NTBookList.includes(book)) {
        originalLanguage = "Greek";
    } else {
        originalLanguage = "Hebrew";
    }

    let numMassEditions = 0;
    let whichPrimesList = [2, 3, 5, 7, 13];
    for (let i = 0; i < whichPrimesList.length; i++) {
        let p = whichPrimesList[i];
        if (activeEditionsNumber % p == 0) {
            editionContainerDict[p].hidden = false;
            editionCheckboxDict[p].checked = true;
            if (p == 13) {
                document.getElementById('grebrewLabel').innerHTML = "Show " + originalLanguage;
            } else {
                numMassEditions += 1;
            }
        } else {
            editionContainerDict[p].hidden = true;
            editionCheckboxDict[p].checked = false;
        }
    }

    if (numMassEditions > 1) {
        document.getElementById('differenceSelection').hidden = false;
    }
}

updateChapterDropdown('Genesis');
revealCheckboxes('Genesis');

//Returns a unique integer for the combo of editions that the user wants to view; can be decomposed in the backend by modularity testing.
function getEditionCompositeNumber(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew) {
    let editionQueryNumber = 1;

    if (useFirst) {
        editionQueryNumber *= 2;
    }
    if (useSecond) {
        editionQueryNumber *= 3;
    }
    if (useMayhew) {
        editionQueryNumber *= 5;
    }
    if (useZeroth) {
        editionQueryNumber *= 7;
    }
    if (useKJV) {
        editionQueryNumber *= 11;
    }
    if (useGrebrew) {
        editionQueryNumber *= 13;
    }
    return editionQueryNumber;
}

function appendNumberToIDString(IDString, number) {
    let finalString = IDString;
    if (number < 10) {
        finalString += "00" + number.toString();
    } else if (number < 100) {
        finalString += "0" + number.toString();
    }
    return finalString;
}

function getEditionName(book, editionNumber) {
    let originalLanguage = "";
    if (NTBookList.includes(book)) {
        originalLanguage = "Greek";
    } else {
        originalLanguage = "Hebrew";
    }

    let primeToEditionDict = {
        2: "First Edition",
        3: "Second Edition",
        5: "Mayhew",
        7: "Zeroth Edition",
        11: "KJV",
        13: originalLanguage,
        43: "Verse"
    }

    return primeToEditionDict[editionNumber];
}

function getUsefulPrimes(compositeEditionNumber, listOfPrimes, bookName) {
    let usefulPrimeList = [];
    let editionNameList = [];
    let addedVerseColumn = false;
    for (let i = 0; i < listOfPrimes.length; i++) {
        if (compositeEditionNumber % listOfPrimes[i] == 0) {
            let thisPrime = listOfPrimes[i];
            if (!addedVerseColumn && thisPrime > 3) {
                usefulPrimeList.push(43);
                editionNameList.push("Verses");
                addedVerseColumn = true;
            }
            usefulPrimeList.push(thisPrime);
            editionNameList.push(getEditionName(bookName, thisPrime));
        }
    }
    return [usefulPrimeList, editionNameList];
}

function columnHeaderPopulator(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, bookName) {
    let numLeftColumns = 0;
    let numRightColumns = 0;

    let leftColumnList = [];
    let rightColumnList = [];

    let leftColumnIndexList = [];
    let rightColumnIndexList = [];

    let useHebrew = false;

    let useOther = useMayhew || useZeroth;
    let otherEditionNumber = 1;

    if (useMayhew) {
        otherEditionNumber *= 5;
    } else if (useZeroth) {
        otherEditionNumber *= 7;
    }
    
    let otherName = "";
    if (useMayhew) {
        otherName = "Mayhew";
    } else if (useZeroth) {
        otherName = "Zeroth Edition";
    }

    if (useFirst) {
        numLeftColumns += 1;
        leftColumnList.push("First Edition");
        leftColumnIndexList.push(2);
    }

    if (useSecond) {
        numLeftColumns += 1;
        leftColumnList.push("Second Edition");
        leftColumnIndexList.push(3);
    }

    if (!useFirst && !useSecond && useOther) {
        numLeftColumns += 1;
        leftColumnList.push(otherName);
        leftColumnIndexList.push(otherEditionNumber);
    } else if (useOther) {
        numRightColumns += 1;
        rightColumnList.push(otherName);
        rightColumnIndexList.push(otherEditionNumber);
    }
    
    if (useKJV) {
        numRightColumns += 1;
        rightColumnList.push("KJV");
        rightColumnIndexList.push(11);
    }

    if (useGrebrew) {
        numRightColumns += 1;
        let nameString = "";
        if (NTBookList.includes(bookName)) {
            nameString = "Greek";
        } else {
            nameString = "Hebrew";
            useHebrew = true;
        }
        rightColumnList.push(nameString);
        rightColumnIndexList.push(13);
    }

    return [numLeftColumns, numRightColumns, leftColumnList, rightColumnList, leftColumnIndexList, rightColumnIndexList, useHebrew];
}

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

function processSnippets(dict1, dict2, snippet1, snippet2, sharedString, key) {

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

    if (noMismatches) {
        in1ButNot2List = keyList1;
        in2ButNot1List = keyList2;
    }

    let listsNotSameLength = (in1ButNot2List.length != in2ButNot1List.length);

    return [in1ButNot2List, in2ButNot1List, noMismatches, listsNotSameLength];
}

//I don't like this much (it's kludgy) but it seems to work. When I checked against the texts it appears to be accurate.
function fixMissingBs(dict1, dict2, chapter, verse) {
    let mismatchingKeys = checkForKeyMismatch(dict1, dict2);

    let canProcess = true;
    if (mismatchingKeys[2]) {
        // If there aren't any mismatches, quit. Could put a single return after the whole if-else thing but this makes things more explicit
        return [mismatchingKeys[0], mismatchingKeys[1], canProcess, "no mismatches"];
    } else if (mismatchingKeys[3]) {
        // If there are mismatches but the lists aren't the same length, flag it
        console.log("Mismatching keys are not the same length at " + chapter.toString() + ":"+ verse.toString());
        console.log(mismatchingKeys[0]);
        console.log(mismatchingKeys[1]);
        
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

    if (dict1[key] == "$") {
        dict1[key] = " ";
    }

    if (dict2[key] == "$") {
        dict2[key] = " ";
    }

    let verseSnippet1 = dict1[key];
    let verseSnippet2 = dict2[key];

    let sharedString = findLongestCommonSubstring(verseSnippet1, verseSnippet2);
    
    processSnippets(dict1, dict2, verseSnippet1, verseSnippet2, sharedString, key);
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
    //console.log(markCasing);
    let completeMatch = (substring1 == substring2);

    if (completeMatch) {
        finalString1 += substring1;
        finalString2 += substring2;
        return [finalString1, finalString2];
    }

    let lowered1 = substring1.toLowerCase();
    let lowered2 = substring2.toLowerCase();

    let matchLower = (lowered1 == lowered2);

    let smallCapDifference = smallCapsCompare(substring1, substring2);

    let finalSubstring1 = "";
    let finalSubstring2 = "";
    if (matchLower || smallCapDifference) {
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

//All lists in the list of key lists must be the same length as the values list.
function listToListDictionary(listOfKeyLists, valuesList) {
    let dict = {};
    for (let i = 0; i < listOfKeyLists.length; i++) {
        let thisList = listOfKeyLists[i];
        for (let j = 0; j < thisList.length; j++) {
            dict[thisList[j]] = valuesList[j];
        }
    }
    return dict;
}

// Needed to ensure that small caps in the second edition are interpreted as *casing* differences (in blue), not as 'real' differences (in red).
function smallCaps(string) {
    let smallCapsList = ["ᴀ",  "ʙ",  "ᴄ",  "ᴅ",  "ᴇ",  "ꜰ",  "ɢ",  "ʜ",  "ɪ",  "ᴊ",  "ᴋ",  "ʟ",  "ᴍ",  "ɴ",  "ᴏ",  "ᴘ",  "ꞯ",  "ʀ",  "ꜱ",  "ᴛ",  "ᴜ",  "ᴠ",  "ᴡ",  "ʏ",  "ᴢ"]
    let normalLowercase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "y", "z"]
    let normalUppercase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "Y", "Z"]

    let normalToSmallCapsDict = listToListDictionary([normalLowercase, normalUppercase, smallCaps], smallCapsList);
    
    let returnString = "";
    for (let i = 0; i < string.length; i++){
        let char = string[i];
        if (normalToSmallCapsDict[char] != undefined) {
            returnString += normalToSmallCapsDict[char];
        } else {
            returnString += char;
        }
    }
    return returnString;
}

function smallCapsCompare(string1, string2) {
    if (smallCaps(string1) == string2 || smallCaps (string2) == string1) {
        return true;
    } else {
        return false;
    }
}

//This is always called, so why does it sometimes not compare verses?
function compareVerses(verse1, verse2, chapterNum, verseNum, useCasing, proofreading) {
    //Will need to change how this works once verses are stored as lists rather than a single blob of text
    verse1 = verse1.split(" ").join("$");
    verse2 = verse2.split(" ").join("$");

    let verseAddress = chapterNum.toString() + ":" + verseNum.toString(); //useful for debugging
    //console.log(chapterNum.toString() + ":" + verseNum.toString() + " is being processed.");

    let hasBlanks = (verse1 == "" || verse2 == "");


    if (hasBlanks){
        console.log("Blank verse at " + verseAddress);
    }

    let hasUndefined = (verse1 == undefined || verse2 == undefined);

    if (hasUndefined) {
        console.log("Undefined verse at " + verseAddress);
    }

    let processedVerses = [];
    if (hasBlanks || hasUndefined) {
        processedVerses = [verse1, verse2];
    } else {
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

        if (canProcess) {
            let allKeys1 = fixedBsList[0];
            let allKeys2 = fixedBsList[1];

            processedVerses = addDifferenceTags(verse1Dict, verse2Dict, allKeys1, useCasing);
        } else {
            console.log("Can't process " + chapterNum.toString() + "." + verseNum.toString() + ": " + fixedBsList[3] + "\n Showing raw text instead.");
            processedVerses = [verse1, verse2];
        }
    }

    let finalVerses = [];
    for (let i = 0; i < processedVerses.length; i++) {
        if (processedVerses[i] == undefined) {
            console.log("Undefined verse at " + chapterNum.toString() + ":" + verseNum.toString());
            finalVerses.push("");
        } else if (processedVerses == "") {
            console.log("Blank verse at " + chapterNum.toString() + ":" + verseNum.toString());
            finalVerses.push("");
        } else {
            //...but it sometimes passes this:
            //console.log(processedVerses[i]);
            finalVerses.push(processedVerses[i]);
        }
    }
    return finalVerses;
}

function addVersesToDict(dict, chapterNum, verseNum, markCasing, proofreading, editionNumber) {

    if (editionNumber % 6 == 0) {

        let firstEditionText = dict[2];
        let secondEditionText = dict[3];

        let comparedVerseList = compareVerses(firstEditionText, secondEditionText, chapterNum, verseNum, markCasing, proofreading);

        if (dict[2].length <= comparedVerseList[0].length) {
            dict[2] = comparedVerseList[0];
        }
        if (dict[3].length <= comparedVerseList[1].length) {
            dict[3] = comparedVerseList[1];
        }
    }

    //The zeroth edition Genesis's differences are wrt the first edition, although the first edition's are still vs. the 2nd. Once the first- and zeroth-edition Geneses are done we can simplify much of this
    if (editionNumber % 14 == 0) {
        let zerothComparedList = compareVerses(dict[7], dict[2], markCasing, proofreading);

        if (dict[7].length <= zerothComparedList[0].length) {
            dict[7] = zerothComparedList[0];
        }
    }
}

function columnMeasurePopulator(numLeftColumns, numRightColumns) {
    let allColumnMeasures = "";
    //let rightColumnMeasure = "10%";
    let verseColumnMeasure = "10%"
    if (numLeftColumns == 1) {
        allColumnMeasures += "45% ";
    } else if (numLeftColumns == 2) {
        allColumnMeasures += "22.5% ";
        allColumnMeasures += "22.5% ";
    }

    allColumnMeasures += verseColumnMeasure + " ";
    
    if (numRightColumns == 3) {
        allColumnMeasures += "15% ";
        allColumnMeasures += "15% ";
        allColumnMeasures += "15% ";
    } else if (numRightColumns == 2) {
        //rightColumnMeasure = "22.5%";
        allColumnMeasures += "22.5% ";
        allColumnMeasures += "22.5% ";
    } else {
        //rightColumnMeasure = "45%";
        allColumnMeasures += "45% ";
    }
    return allColumnMeasures.trim();
}

function processCurlyBrackets(string, useRawText) {
    if (!useRawText) {
        string = string.split('<span style="color:red"><b>{</b></span>').join('<i>');
        string = string.split('<span style="color:red"><b>}</b></span>').join('</i>');
      }
      string = string.split("{").join("<i>");
      string = string.split("}").join("</i>");
      return string;
}

function dealWithDollarSigns(string, useRawText) {
    string = string.split("$").join(" ");

    if (!useRawText) {
        string = string.split('<span style="color:red"><b> </b></span>').join('<span style="color:red"><b>˙</b></span>');
      }
      return string;
}

function processFinalText(string, useRawText) {
    string = processCurlyBrackets(string, useRawText);
    string = dealWithDollarSigns(string, useRawText);

    string = string.split("8").join("ꝏ̄");
    return string;
}

async function displayChapterText(book, chapter, useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, showTextDifferences, markCasing, proofreading, textContainer) {
    let chapterNum = parseInt(chapter);

    //Ugly but one line. If the book in question is the prose Psalms and the chapter is one of the chapters that has a superscription, then this affects the verse number.
    let verseAddition = Number(!(psalmsWithVerseZero.includes(chapterNum) && book == "Psalms (prose)"));

    textContainer.innerHTML = "";

    let editionNumber = getEditionCompositeNumber(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew);

    //For now, don't count Mayhew
    let canCompareEditions = false;
    
    let comparableComposites = [6, 21, 42];
    for (let i = 0; i < comparableComposites.length; i++) {
        if (editionNumber % comparableComposites[i] == 0) {
            canCompareEditions = true;
            break;
        }
    }
    
    let useRawText = !showTextDifferences && !markCasing;

    let useRawString = useRawText.toString();

    let columnHeads = columnHeaderPopulator(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, book);
    let firstIndex = columnHeads[4][0];
    let verseRowStyleString = "grid-template-columns: " + columnMeasurePopulator(columnHeads[0], columnHeads[1]) + ";";

    let headerDiv = document.getElementById("editionHeaders");
    headerDiv.innerHTML = "";

    fetch('/fetchChapter/' + book + '/' + chapter + '/' + editionNumber.toString(), {
        method: 'GET',
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        
        let numOfVerses = parseInt(res[101]);
        let primeNumbers = [2, 3, 5, 7, 11, 13];
        let fetchedEditions = getUsefulPrimes(editionNumber, primeNumbers);
        let usefulPrimes = fetchedEditions[0];
        let editionNameList = fetchedEditions[1];
        
        //Debug this section early in the morning tomorrow...?

        headerDiv.style = "text-align: center; " + verseRowStyleString; 
        for (let i = 0; i < usefulPrimes.length; i++) {
            let divClass = "";
            if (i == 0) {
                divClass = "firstColumnHeader";
            } else {
                divClass = "columnHeader";
            }
            let editionHeadDiv = document.createElement('div');
            editionHeadDiv.classList.add(divClass);
            editionHeadDiv.style = "grid-column: " + (i + 1).toString() + ";";
            editionHeadDiv.innerHTML = "<h1><u>" + editionNameList[i] + "</u></h1>";
            headerDiv.appendChild(editionHeadDiv);
        }

        for (let j = 0; j < numOfVerses; j++) {
            let verseNum = j + verseAddition;
            let verseTextDict = {};
        
            let thisVerseRow = document.createElement('div');
            thisVerseRow.classList.add("verseRow");
            thisVerseRow.id = "verse " + verseNum.toString();
            thisVerseRow.style = "grid-row: " + verseNum.toString() + "; " + verseRowStyleString;

            let addedVerseNumber = false;

            //Populate the verseTextDict with the text of each verse in each edition
            for (let k = 0; k < usefulPrimes.length; k++) {
                let p = usefulPrimes[k];
                if (p != 43) {
                    let rawVerseText = res[p][j].toString();
                    verseTextDict[p] = rawVerseText;
                }
            }

            //Run comparisons if need be. Not for Mayhew at this time.
            if (showTextDifferences && canCompareEditions) {
                addVersesToDict(verseTextDict, chapterNum, verseNum, markCasing, proofreading, editionNumber);
            }

            for (let k = 0; k < usefulPrimes.length; k++) {
                let p = usefulPrimes[k];
                if (p == 43 && !addedVerseNumber) {
                    let verseNumColumn = document.createElement('div');
                    verseNumColumn.classList.add("verseColumn");
                    verseNumColumn.style = 'grid-column: ' + (k + 1).toString() + '; text-align: center; font-weight: bold; font-size: 20px';
                    
                    verseNumColumn.innerHTML = parseInt(chapter) + ':' + (verseNum).toString();
                    thisVerseRow.appendChild(verseNumColumn);
                    addedVerseNumber = true;
                    continue;
                }

                let thisVerseColumn = document.createElement('div');
                if (p == firstIndex) {
                    thisVerseColumn.classList.add("firstVerseColumn");
                } else {
                    thisVerseColumn.classList.add("verseColumn");
                }
                thisVerseColumn.style = "grid-column: " + (k + 1).toString() + "; font-size: 16px;";

                let thisVerseText = processFinalText(verseTextDict[p], useRawText);

                thisVerseColumn.innerHTML = thisVerseText;
                thisVerseRow.appendChild(thisVerseColumn);
            }
            textContainer.appendChild(thisVerseRow);
        }
    }).catch(err => console.error(err));

}

/*
async function getOneVerseText(book, chapter, verse, useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, useRawText, textContainer, showTextDifferences, markCasing) {
    textContainer.innerHTML = "";

    let editionNumber = getEditionCompositeNumber(useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew);

    let IDString = "1" + bookToNumberDict[book];

    IDString = appendNumberToIDString(IDString, chapter);
    IDString = appendNumberToIDString(IDString, verse);

    let useRawString = ""
    if (useRawText) {
        useRawString = 'true';
    } else {
        useRawString = 'false';
    }

    fetch('/fetchVerse/' + IDString + '/' + editionNumber.toString() + '/' + useRawString, {
        method: 'GET',
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => {
        let primeNumbers = [2, 3, 5, 7, 11, 13];
        let usefulPrimes = getUsefulPrimes(editionNumber, primeNumbers);
        let verseTextList = [];
        for (let i = 0; i < usefulPrimes.length; i++) {
            let p = usefulPrimes[i];
            if (editionNumber % p == 0) {
                let verseColumnDiv = document.createElement('div');
                div.style = "grid-column: " + (i + 1).toString() + ";";
                let verseText = res[p].toString();
                verseText = cleanProcessedString(verseText, showTextDifferences, markCasing);
                let span = document.createElement('span');
                span.innerHTML = verseText;
                textContainer.appendChild(span);
            }
        }
    }).catch(err => console.error(err));
}
*/

function resetCheckboxes() {
    let allContainerList = [
        document.getElementById('firstEditionContainer'),
        document.getElementById('secondEditionContainer'),
        document.getElementById('mayhewContainer'),
        document.getElementById('zerothContainer'),
        document.getElementById('grebrewContainer')
    ];

    let allCheckboxList = [
        document.getElementById('useFirstEdition'),
        document.getElementById('useSecondEdition'),
        document.getElementById('useMayhew'),
        document.getElementById('useZerothEdition'),
        document.getElementById('useGrebrew')
    ];

    document.getElementById('grebrewLabel').innerHTML = "";

    for (let i = 0; i < 5; i++) {
        allCheckboxList[i].checked = false;
        allContainerList[i].hidden = true;
    }
}

bookDropdown.addEventListener('change', async function() {
    resetCheckboxes();
    let book = bookDropdown.value;
    updateChapterDropdown(book);
    revealCheckboxes(book);
});

chapterDropdown.addEventListener('change', async function() {
    //document.getElementById("verseSelectionDropdown").hidden = false;
    //document.getElementById("searchVerseLegend").hidden = false;
    /*
    for (let i = 0; i < bookToChapterVerseDict[bookDropdown.value][chapterDropdown.value - 1]; i++) {
        let verseOption = document.createElement('option');
        verseOption.text = i + 1;
        verseOption.value = i + 1;
        document.getElementById("verseSelectionDropdown").add(verseOption);
    }
    */
});

function createNavButtons(currentChapter, isLastChapter, book) {
    document.getElementById("navButtonGrid").innerHTML = "";
    document.getElementById("navButtonGrid").style.background = "white";

    var buttonDivNames = ["firstChapterButtonDiv", "prevChapterButtonDiv", "nextChapterButtonDiv", "lastChapterButtonDiv"];

    var buttonDivList = []

    for (var i = 0; i < buttonDivNames.length; i++) {
        var thisDiv = document.createElement("div");
        thisDiv.id = buttonDivNames[i];
        thisDiv.style.gridRow = "1";
        thisDiv.style.gridColumn = (i + 1).toString();
        buttonDivList.push(thisDiv);
    }
    
    let allButtonList = [];

    if (currentChapter > 1) {
        var firstChapterButton = document.createElement("button");
        firstChapterButton.innerHTML = "↞ <i>First chapter</i>";
        firstChapterButton.id = "firstChapterButton";

        firstChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = 1;
            document.getElementById("submitBookQuery").click();
        });

        var prevChapterButton = document.createElement("button");
        prevChapterButton.innerHTML = "← <i>Previous chapter</i>";
        prevChapterButton.id = "prevChapterButton";

        prevChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = parseInt(currentChapter) - 1;
            document.getElementById("submitBookQuery").click();
        });

    } else {
        var firstChapterButton = document.createElement("span");
        var prevChapterButton = document.createElement("span");
    }

    allButtonList.push(firstChapterButton);
    allButtonList.push(prevChapterButton);

    if (! isLastChapter) {
        var nextChapterButton = document.createElement("button");
        nextChapterButton.innerHTML = "<i>Next chapter</i> →";
        nextChapterButton.id = "nextChapterButton";

        nextChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = parseInt(currentChapter) + 1;
            document.getElementById("submitBookQuery").click();
        });
        
        var lastChapterButton = document.createElement("button");
        lastChapterButton.innerHTML = "<i>Last chapter</i> ↠";
        lastChapterButton.id = "lastChapterButton";

        lastChapterButton.addEventListener("click", function() {
            document.getElementById("chapterSelectionDropdown").value = bookToChapterDict[book];
            document.getElementById("submitBookQuery").click();
        });
    } else {
        var nextChapterButton = document.createElement("span");
        var lastChapterButton = document.createElement("span");
    }

    allButtonList.push(nextChapterButton);
    allButtonList.push(lastChapterButton);

    for (var i = 0; i < allButtonList.length; i++) {
        buttonDivList[i].appendChild(allButtonList[i]);
        document.getElementById("navButtonGrid").appendChild(buttonDivList[i]);
    }
}


document.getElementById("submitBookQuery").addEventListener('click', async function() {
    window.scrollTo(0, 0);
    let url = window.location.href;
    //TODO: Add params to URL bar (check old version for how to do this)
    let params = new URLSearchParams(url.search);

    let myQueryOptions = document.getElementById("queryOptions");

    for (let i = 0; i < myQueryOptions.length; i++) {
        myQueryOptions[i].defaultChecked = myQueryOptions[i].checked; // Does this do anything?
    }

    //let searchInfo = searchInfoGetter(params);

    let book = bookDropdown.value;
    let chapter = chapterDropdown.value;

    let isLastChapter = (chapter == bookToChapterDict[book]);

    let useFirst = document.getElementById("useFirstEdition").checked;
    let useSecond = document.getElementById("useSecondEdition").checked;
    let useMayhew = document.getElementById("useMayhew").checked;
    let useZeroth = document.getElementById("useZerothEdition").checked;
    let useKJV = true;
    let useGrebrew = false;

    let showTextDifferences = document.getElementById("no_show").checked == false;
    let markCasing = document.getElementById("include_casing").checked || document.getElementById("proofreading").checked;

    let proofreadingMode = document.getElementById("proofreading").checked;
    //let useKJV = document.getElementById("useKJV").checked;
    //let useGrebrew = document.getElementById("useGrebrew").checked;
    //let useRawText = document.getElementById("useRawText").checked;

    createNavButtons(chapter, isLastChapter, book);

    let columnContainer = document.getElementById("textColumns");

    await displayChapterText(book, chapter, useFirst, useSecond, useMayhew, useZeroth, useKJV, useGrebrew, showTextDifferences, markCasing, proofreadingMode, columnContainer);

});
