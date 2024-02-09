//A program to process the Hebrew text from the XML files

let xmlFolder = './Hebrew XML/';
let jsonFolder = './Hebrew JSON/';

async function processBook(bookName) {
    let bookXML = await fetch(xmlFolder + bookName + '.xml');
    let bookXMLText = await bookXML.text();
    let bookLines = bookXMLText.split('\n');
    for (let i = 0; i < bookLines.length; i++) {
        let xmlLine = bookLines[i];
        console.log(xmlLine.strip());
    }
}

document.getElementById("dropdown").addEventListener("change", async function() {
    let bookName = this.value;

    await processBook(bookName);
});