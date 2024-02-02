// Allows the user to search for matching words in the Massachusett texts and outputs a list of all their cites

function checkWord(word, searchString, searchSetting) {
    let returnWord = false;
    let finalWord = ""
    if (searchSetting == "contains" && word.includes(searchString)) {
        returnWord = true;
        finalWord = word.split(searchString).join('<u><span style="color: red">' + searchString + '</u>');

    } else if (searchSetting == "starts" && word.startsWith(searchString)) {
        returnWord = true;
        finalWord = word.split(searchString).join('Ž' + searchString + 'ž')
        finalWord = finalWord.replace("Ž", "<u><span style='color: red'>");
        finalWord = finalWord.replace("ž", "</span></u>");
        finalWord = finalWord.split("Ž").join("");
        finalWord = finalWord.split("ž").join("");
    } else if (searchSetting == "ends" && word.endsWith(searchString)) {
        returnWord = true;
        let lastStringIndex = word.lastIndexOf(searchString);
        finalWord = word.slice(0, lastStringIndex) + "<u><span style='color: red'>" + searchString + "</span></u>";
    } else if (searchSetting == "exact" && word == searchString) {
        returnWord = true;
        finalWord = word;
    }
    return [returnWord, finalWord];
}

function getAllWordTokens(searchString, word, totalCount, citeList, tokenList) {
    const wordDiv = document.createElement('div');

    const headword = document.createElement('span');
    
    headword.innerHTML = "<b>" + word + "</b> (" + totalCount + "):<br>&emsp;"
    const bookList = document.createElement('div');
    bookList.innerHTML = citeList.join(", ");
    let allBookList = [];
    let bookToCiteDict = {};
    for (let i = 0; i < citeList.length; i++) {
        let thisCite = citeList[i];
        let tokenCount = tokenList[i];
        let splitCite = thisCite.split('.');
        let edition = splitCite[0];
        let book = splitCite[1];
        let chapter = splitCite[2];
        let verse = splitCite[3];
        
        let address = chapter + '.' + verse;

        if (! bookToCiteDict.hasOwnProperty(book)) {
            bookToCiteDict[book] = "";
            allBookList.push(book);
        }

        let tokenString = ""
        if (tokenCount > 1) {
            tokenString = " (" + tokenCount + ")";
        }

        bookToCiteDict[book] += address + tokenString + ", ";
    }

    for (let j = 0; j < allBookList.length; j++) {
        let book = allBookList[j];
        headword.innerHTML += "<i>" + book + "</i>: " + bookToCiteDict[book].slice(0, -2);
        if (j < allBookList.length - 1) {
            headword.innerHTML += "<br>&emsp;";
        }
    }

    headword.innerHTML = headword.innerHTML.split("8").join("ꝏ̄");
    
    wordDiv.appendChild(headword);
    return wordDiv;
}

function seeAllWords(resultDiv, searchString, searchSetting) {
    resultDiv.innerText = "Loading words..."

    fetch("/words").then(res => res.json()).then(res => {
        resultDiv.innerText = ""
        for (let item of res) {
            let wordCheck = checkWord(item.word, searchString, searchSetting);
            if (wordCheck[0] && searchString != "") {
                if (wordCheck[1].length == 0) {
                    resultDiv.append("No results found.")
                } else {
                    resultDiv.appendChild(getAllWordTokens(searchString, wordCheck[1], item.total_count, item.verse_addresses, item.verse_tokens));
                }
            }
        }
    }).catch(err => console.error(err))
}

function cleanExtraTags(myString, showDifferences, showCasing) {

}

// Backend "Ƀβ" get turned into blue tags (for differences in case), "Řř" get turned into red tags (for actual differences in the text)
function cleanProcessedString(myString, showDifferences, showCasing) {

    // Not *really* necessary, but speeds up processing by checking whether all this replacement needs to be done
    if (showDifferences || showCasing) {

        // Even if difference marking isn't chosen we still want to make it easier to see e.g. <nnih> vs. <n($)nih>
        myString = myString.split("Ř ř").join("Ř˙ř");
        myString = myString.split("Ř$ř").join("Ř˙ř");
        myString = myString.split("$").join(" ");

        if (showCasing) {
            myString = myString.split("Ƀ").join('<span style="color: blue">');
            myString = myString.split("β").join("</span>");
        } else {
            myString = myString.split("Ƀ").join("");
            myString = myString.split("β").join("");
        }

        if (showDifferences) {
            myString = myString.split("Ř").join('<span style="color: red">');
            myString = myString.split("ř").join("</span>");
        } else {
            myString = myString.split("Ř").join("");
            myString = myString.split("ř").join("");
        }
    } else {
        myString = myString.split('$').join(' ');
    }

    myString = myString.split('8').join('ꝏ̄');
    myString = myString.split('{').join('<i>');
    myString = myString.split('}').join('</i>');

    return myString;
}

//this is a dummy function that won't end up here in the end
async function getComparedText(verseID, parentDiv) {
    fetch("/compareWords/" + verseID.toString()).then(res => res.json()).then(res => {
        for (let i = 0; i < res.length; i++) {
            let thisWord = res[i].toString();
            thisWord = cleanProcessedString(thisWord, true, true);
            let wordSpan = document.createElement('span');
            wordSpan.innerHTML = thisWord;
            parentDiv.appendChild(wordSpan);
        }
        parentDiv.appendChild('<br>');
        /*
        let outputText = res.toString();
        let newSpan = document.createElement('span');
        newSpan.innerHTML = outputText;
        document.getElementById("results-container").appendChild(newSpan);
        */
    }).catch(err => console.error(err))
}

document.getElementById("submit").addEventListener("click", async function () {
            await getComparedText(102037013, document.getElementById("results-container"));
})
