import os

textFolder = './Hebrew Raw Text/'

htmlFolder = './Hebrew HTML/'

allFiles = os.listdir(textFolder)

print(len(allFiles))

for fileName in allFiles:
    print(fileName)


def splitAtTag(line, tag):
    output = ""

    splitLine = line.split('</' + tag + '>')

    word = splitLine[0]

    epilogue = splitLine[1].split(" ")

    return epilogue

testLine = "<w>הֽוּא</w>׃"

print(splitAtTag(testLine, "w"))


'''
for fileName in allFiles:
    file = open(textFolder + fileName, 'r', encoding='utf-8')

    fileLines = file.readlines()

    outputString = ""

    for line in fileLines:
        formattedLine = ""
        if line.startswith("<h>"):
            formattedLine = "<span color='blue'>" + line.replace("<h>", "").replace("</h>", "")
        elif line.startswith("<k>"):
            continue
        elif line.startswith("<q>"):
            continue
        elif line.startswith("<V>"):
            formattedLine = "<br>"
        else:
            formattedLine = line.replace('<w>', "").replace("</w>", "")
        outputString += formattedLine
        if not line.startswith("<V>"):
            outputString += " "

    htmlFileName = htmlFolder + fileName
    htmlFile = open(htmlFileName.replace('.txt', '.html'), 'w', encoding = 'utf-8')
    htmlFile.write(outputString)

'''