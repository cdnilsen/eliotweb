function processTextPopulateHTML() {
    let actionChoicesDiv = document.getElementById("action-choices");

    let whichSectionDropdown = document.createElement('select');
    whichSectionDropdown.id = "which-section-dropdown";
    let blankOption = document.createElement('option');
    blankOption.text = "";
    blankOption.value = "";
    whichSectionDropdown.add(blankOption);

    let bookSectionList = [pentateuchList, historicalList, wisdomList, prophetsList, otherNTList, epistlesList];
    let sectionNameList = ["Pentateuch", "Historical", "Wisdom", "Prophets", "New Testament (not epistles)", "New Testament (epistles)"];

    for (let i = 0; i < 6; i++) {
        let sectionName = sectionNameList[i];
        let bookSection = bookSectionList[i];
        let sectionOption = document.createElement('option');
        sectionOption.text = sectionName;
        sectionOption.value = sectionName;
        whichSectionDropdown.add(sectionOption);
        actionChoicesDiv.appendChild(whichBookDropdown);
    }
}

function getRadioSelection() {
    let radioList = document.getElementsByName("action");
    for (let i = 0; i < radioList.length; i++) {
        if (radioList[i].checked) {
            return radioList[i].value;
        }
    }
}

function addSelectionParams() {
    if (whichAction == "processAText") {
        processTextPopulateHTML();
    }
}

function addActionButtonLegend() {
    let whichAction = getRadioSelection();

    let actionToButtonLegendDict = {
        "processAText": "Process a Text",
        "compareWords": "Compare Verses",
        "processWordsOneText": "Process Words in a Text",
        "runWordCounts": "Run All Word Counts"
    };

    document.getElementById("pickActionLegend").innerHTML = actionToButtonLegendDict[whichAction];
}

window.addEventListener("DOMContentLoaded", () => {
    addActionButtonLegend();
});

document.getElementById('pickAction').addEventListener("click", function() {
    addSelectionParams();
});