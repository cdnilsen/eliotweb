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
    } else if (searchSetting == "exact" && word == searchString) {
        returnWord = true;
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
            if (wordCheck[0]) {
                resultDiv.appendChild(getAllWordTokens(searchString, wordCheck[1], item.total_count, item.verse_addresses, item.verse_tokens));
            }
        }
    }).catch(err => console.error(err))
}