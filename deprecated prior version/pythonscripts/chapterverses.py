fullKJV = open('kjv text.txt', 'r', encoding='utf-8')
kjvLines = fullKJV.readlines()
fullKJV.close()

outputDict = {}
allChapters = []
relevantLinesList = []

for line in kjvLines:
    if line[0] == "E":
        relevantLinesList.append(line)

for line in relevantLinesList:
    verseAddress = line.split(" ")[0]
    splitAddress = verseAddress.split(".")
    book = splitAddress[1]
    chapter = splitAddress[2]
    verse = int(splitAddress[3][0:-1])

    bookChapter = book + "." + chapter
    if bookChapter not in allChapters:
        allChapters.append(bookChapter)
        outputDict[bookChapter] = 0
    outputDict[bookChapter] = verse

outputFile = open('chapterverses.txt', 'w', encoding='utf-8')
outputFile.writelines("{\n")
for chapter in outputDict:
    outputFile.writelines("\t\"" + chapter + "\": " + str(outputDict[chapter]) + ",\n")
outputFile.writelines("}")
outputFile.close()


