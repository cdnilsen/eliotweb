// Allows the user to search for matching words in the Massachusett texts and outputs a list of all their cites

function seeAllWords(resultDiv, searchString, searchSetting) {
    resultDiv.innerText = "";

    fetch("/getWords/" + searchString + "/" + searchSetting).then(res => res.json()).then(res => {
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


