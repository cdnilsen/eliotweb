// Allows the user to search for matching words in the Massachusett texts and outputs a list of all their cites

function getAllWordTokens(searchString, word, totalCount, citeList, tokenList) {
    const it = document.createElement('div');

    const headword = document.createElement('span');
    
    headword.innerHTML = "<b>" + word.split(searchString).join("<u>" + searchString + "</u>") + "</b> (" + totalCount + "):<br>&emsp;"
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
        console.log(book);
        console.log(book, chapter, verse);
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
        headword.innerHTML += "<i>" + book + "</i>: " + bookToCiteDict[book].slice(0, -2) + "<br>";
        if (j < allBookList.length - 1) {
            headword.innerHTML += "&emsp;";
        }
    }
    console.log(headword.innerHTML);
    headword.innerHTML = headword.innerHTML.slice(0, -2);
    console.log(headword.innerHTML);

    it.appendChild(headword);
    return it;
}

function seeAllWords(el) {
    el.innerText = "Loading words..."

    fetch("/words").then(res => res.json()).then(res => {
        el.innerText = ""
        for (let item of res) {
            el.appendChild(getAllWordTokens("k", item.word, item.total_count, item.verse_addresses, item.verse_tokens));
        }
    }).catch(err => console.error(err))
}