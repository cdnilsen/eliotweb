// Allows the user to search for matching words in the Massachusett texts and outputs a list of all their cites

function getAllWordTokens(searchString, word, totalCount, citeList, tokenList) {
    const it = document.createElement('div');

    const headword = document.createElement('span');
    headword.innerText = "<b>" + word.replaceAll(searchString, "<u>" + searchString + "</u>") + "</b> (" + totalCount + "):\n\t"
    it.appendChild(headword)

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

        if (! bookToCiteDict.includes(book)) {
            bookToCiteDict[book] = "";
            allBookList.push(book);
        }

        let tokenString = ""
        if (tokenCount > 1) {
            tokenString = " (" + tokenCount + ")";
        }
        bookToCiteDict[book] += address + tokenString + "," 
    }

    for (let j = 0; j < allBookList.length; j++) {
        let book = allBookList[j];
        let bookEl = document.createElement('span');
        bookEl.innerText = book + ": " + bookToCiteDict[book] + "\n\t";
        it.appendChild(bookEl);
    }

    return it;
}

function seeAllWords(el) {
    el.innerText = "Loading words..."

    fetch("/words").then(res => res.json()).then(res => {
        el.innerText = ""
        for (let item of res) {
            el.appendChild(wordToElement(getAllWordTokens(item.word, item.total_count, item.verse_addresses, item.verse_tokens)));
        }
    }).catch(err => console.error(err))
}