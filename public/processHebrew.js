//A program to process the Hebrew text from the XML files

let xmlFolder = './Hebrew XML/';
let jsonFolder = './Hebrew JSON/';

async function processBook(bookName) {
    let bookXML = await fetch(xmlFolder + bookName + '.xml');
    let bookXMLText = await bookXML.text();
    let bookLines = bookXMLText.split('\n');
    for (let i = 0; i < bookLines.length; i++) {
        let xmlLine = bookLines[i].trim();

        let lineType = xmLLine[1];
        console.log(lineType);
    }
}

document.getElementById("submit").addEventListener("click", async function() {
    event.preventDefault();
    let bookName = document.getElementById("dropdown").value;

    await processBook(bookName);
});