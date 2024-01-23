const fs = require('fs');

export function writeToFile(fileName, text) {
    let file = fs.open(fileName, 'w');
    file.write(text);
    file.close();
}