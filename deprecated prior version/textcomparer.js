//This programs takes the raw text from the first and second edition, compares them, and returns them as HTML strings with the differences marked.

function cleanDiacritics(word) {
    var charReplacementDict = {
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
        "ã": "a",
        "õ": "o",
        "ñ": "nn",
        "m̃": "mm",
        "ũ": "u",
        "ẽ": "e",
        "ĩ": "i",
        "ā": "an",
        "ē": "en",
        "ī": "in",
        "ō": "on",
        "ū": "un"
    }

    var cleanedWord = "";
    for (var i = 0; i < word.length; i++) {
        if (word[i] in charReplacementDict) {
            cleanedWord += charReplacementDict[word[i]];
        } else {
            cleanedWord += word[i];
        }
    }
    return cleanedWord;
}

function getCleanedWord(word) {
    let punctuationReplacementList = ["!", "?", ",", ".", ":", ";", "(", ")", "[", "]", "{", "}", "-"];

    let cleanedWord = ""
    for (let i = 0; i < word.length; i++) {
        if (!punctuationReplacementList.includes(word[i])) {
            cleanedWord += word[i];
        }
    }
    return cleanedWord;
}

function isHapax(word, hapaxList) {
    return (hapaxList.includes(getCleanedWord(word)));
}

function markHapaxes(verse, hapaxList) {
    let verseList = verse.split(" ").slice(1);

    console.log(verseList);

}

markHapaxes("1.21 Onk n$nih newutche widwifesog quosháog Goduh, 8wékikaúuh.");

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

function findDifferences(string1, string2) {
    let longestSubstringMoreThanOne = false;

    while (longestSubstringMoreThanOne == false) {
        let longestSubstring = findLongestCommonSubstring(string1, string2);
        if (longestSubstring.length == 1) {
            longestSubstringMoreThanOne = true;
            break;
        }

        let shreddedSubstring1 = "";
        let shreddedSubstring2 = "";

        for (let i = 0; i < longestSubstring.length; i++) {
            shreddedSubstring1 += longestSubstring[i] + "ϥ";
            shreddedSubstring2 += longestSubstring[i] + "ϣ";
        }
        shreddedSubstring1 = "›" + shreddedSubstring1.slice(0, -1) + "‹";
        shreddedSubstring2 = "»" + shreddedSubstring2.slice(0, -1) + "«";

        string1 = string1.replace(longestSubstring, shreddedSubstring1);
        string2 = string2.replace(longestSubstring, shreddedSubstring2);
    }
    return [string1, string2];
}

function cleanProcessedString(string, showDifferences, showCasing, dummyChar) {
    string = string.replaceAll("Ƀβ", "");
    string = string.replaceAll("Řř", "");
    
    
    string = string.replaceAll("Ř ř", "Ř˙ř");
    string = string.replaceAll("Ř$ř", "Ř˙ř");
    string = string.replaceAll("$", " ");

    if (showCasing) {
        string = string.replaceAll("Ƀ", '<span style="color: blue">');
        string = string.replaceAll("β", "</span>");
    } else {
        string = string.replaceAll("Ƀ", "");
        string = string.replaceAll("β", "");
    }

    if (showDifferences) {
        string = string.replaceAll("Ř", '<span style="color: red">');
        string = string.replaceAll("ř", "</span>");
    } else {
        string = string.replaceAll("Ř", "");
        string = string.replaceAll("ř", "");
    }

    string = string.replaceAll(dummyChar, "");

    return string;
}

function getDifferenceList(string, bracketList) {
    let leftBracket = bracketList[0];
    let rightBracket = bracketList[1];

    let newString = leftBracket + string + rightBracket;

    newString = newString.replaceAll(leftBracket, leftBracket + "¡");
    newString = newString.replaceAll(rightBracket, "¡" + rightBracket);

    return newString.split("¡");
}

function getSharedSubstrings(string1, string2) {
    let processedStrings = findDifferences(string1, string2);

    let string1List = getDifferenceList(processedStrings[0], ["‹", "›"]);
    let string2List = getDifferenceList(processedStrings[1], ["«", "»"]);

    let finalStringList1 = [];
    let finalStringList2 = [];

    for (let i = 0; i < string1List.length; i++) {
        let substring1 = string1List[i];
        let substring2 = string2List[i];

        let testSubstring1 = substring1.replaceAll("‹", "");
        testSubstring1 = testSubstring1.replaceAll("›", "");

        let testSubstring2 = substring2.replaceAll("«", "");
        testSubstring2 = testSubstring2.replaceAll("»", "");

        if (testSubstring1 != testSubstring2 && testSubstring1.toLowerCase() == testSubstring2.toLowerCase()) {
            substring1 = substring1.replaceAll("‹", 'Ƀ');
            substring1 = substring1.replaceAll("›", "β");

            substring2 = substring2.replaceAll("«", 'Ƀ');
            substring2 = substring2.replaceAll("»", "β");
        } else {
            substring1 = substring1.replaceAll("‹", 'Ř');
            substring1 = substring1.replaceAll("›", "ř");

            substring2 = substring2.replaceAll("«", 'Ř');
            substring2 = substring2.replaceAll("»", "ř");
        }
        finalStringList1.push(substring1);
        finalStringList2.push(substring2);
    }

    let finalString1 = "";
    let finalString2 = "";
    for (let i = 0; i < finalStringList1.length; i++) {
        finalString1 += finalStringList1[i];
        finalString2 += finalStringList2[i];
    }

    finalString1 = cleanProcessedString(finalString1, true, true, "ϥ");
    finalString2 = cleanProcessedString(finalString2, true, true, "ϣ");
    
    return [finalString1, finalString2];
}


/*

function cleanProcessedString(string, color) {
    string = string.replaceAll("ϥ", "");
    string = string.replaceAll("ϣ", "");
    string = string.replaceAll("‹›", "");
    string = string.replaceAll("‹", '<span style="color: ' + color +  '">');
    string = string.replaceAll("›", "</span>");
    return string;
}

function cleanProcessedStrings(string1, string2, color) {
    string1 = "‹" + string1 + "›";
    string2 = "‹" + string2 + "›";
    //Inefficient but works?
    string1 = cleanProcessedString(string1, color);
    string2 = cleanProcessedString(string2, color);

    return [string1, string2];
}

function findDifferences(string1, string2) {
    let longestSubstringMoreThanOne = false;

    while (longestSubstringMoreThanOne == false) {
        let longestSubstring = findLongestCommonSubstring(string1, string2);
        if (longestSubstring.length == 1) {
            longestSubstringMoreThanOne = true;
            break;
        }

        let shreddedSubstring1 = "";
        let shreddedSubstring2 = "";

        for (let i = 0; i < longestSubstring.length; i++) {
            shreddedSubstring1 += longestSubstring[i] + "ϥ";
            shreddedSubstring2 += longestSubstring[i] + "ϣ";
        }
        shreddedSubstring1 = "›" + shreddedSubstring1.slice(0, -1) + "‹";
        shreddedSubstring2 = "›" + shreddedSubstring2.slice(0, -1) + "‹";

        string1 = string1.replace(longestSubstring, shreddedSubstring1);
        string2 = string2.replace(longestSubstring, shreddedSubstring2);
    }
    return [string1, string2];
}

function allDifferences(string1, string2) {
    
    let processedUpperStrings = findDifferences(string1, string2);
    let processedLowerStrings = findDifferences(string1.toLowerCase(), string2.toLowerCase());

    let lowerString1 = cleanProcessedString(processedLowerStrings[0], "red");
    let lowerString2 = cleanProcessedString(processedLowerStrings[1], "red");
    let upperString1 = cleanProcessedString(processedUpperStrings[0], "red");
    let upperString2 = cleanProcessedString(processedUpperStrings[1], "red");

    let string1CaseDifferences = findDifferences(lowerString1, upperString1);
    let string2CaseDifferences = findDifferences(lowerString2, upperString2);
 
    return cleanProcessedStrings(string1CaseDifferences[0], string2CaseDifferences[1], "blue");
}

let string1 = "Ohkasoh unnauon wuttinneumoh, uttoh anukquéog, ussek."
let string2 = "Ohkasoh unnauoh wuttinneumoh, Uttoh anukqueog, ussek"
let myProcessedString = allDifferences(string1, string2);
let parentDiv = document.getElementById("comparedVerses");

let span1String = "<i>Verse 1:</i> " + myProcessedString[1];

let span1 = document.createElement("span");
let span2 = document.createElement("span");

span1.innerHTML = span1String;

parentDiv.appendChild(span1);
parentDiv.appendChild(document.createElement("br"));
parentDiv.appendChild(span2);

*/