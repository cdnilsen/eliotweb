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

document.getElementById("searchButton").addEventListener("click", ev => {
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

    if (document.getElementById("diacriticsLax").checked) {
        searchSetting *= 17;
    }
    if (document.getElementById("diacriticsStrict").checked) {
        searchSetting *= 19;
    }

    let searchString = document.getElementById("searchBar").value;

    console.log(searchSetting);
    console.log(searchString);


});
