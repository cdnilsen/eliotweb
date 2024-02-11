

folder = "./Hebrew Processed Text/"

def getVerseAddress(verse):
    verse = verse.replace("<V>", "")
    verse = verse.replace("</V>", "")
    return verse.strip()

def moveLines(book, hebrewTuple, englishTuple):
    allLines = []
    with open(folder + book, "r") as file:
        lines = file.readlines()

        for line in lines:
            if line.startswith("<V>"):
                getVerseAddress(line)


def convertVerseNumbers (book, engStringList, hebStringList):

    hebrewVerses = []
    englishVerses = []

    for i in range(len(hebStringList)):
        hebString = hebStringList[i]
        engString = engStringList[i]

        hebSplit = hebString.split(":")
        engSplit = engString.split(":")

        hebChapter = hebSplit[0]
        engChapter = engSplit[0]

        hebVerseStart = int(hebSplit[1].split("-")[0])
        hebVerseEnd = int(hebSplit[1].split("-")[1])

        engVerseStart = int(engSplit[1].split("-")[0])
        engVerseEnd = int(engSplit[1].split("-")[1])

        for i in range(hebVerseStart, hebVerseEnd + 1):
            hebrewVerses.append(hebChapter + ":" + str(i))
        
        for i in range(engVerseStart, engVerseEnd + 1):
            englishVerses.append(engChapter + ":" + str(i))

    hebrewToEngDict = dict(zip(hebrewVerses, englishVerses))

    originalLines = open(folder + book + ".txt", "r", encoding="utf-8").readlines()

    finalLines = []
    for line in originalLines:
        if line.startswith("<V>") and getVerseAddress(line) in hebrewVerses:
            englishVerse = hebrewToEngDict[getVerseAddress(line)]
            finalLines.append("<V>" + englishVerse + "</V>\n")
        else:
            finalLines.append(line)

    reopenFile = open(folder + book + ".txt", "w", encoding="utf-8")
    for line in finalLines:
        reopenFile.write(line)
        
exodusEnglishList = ['8:1-4', '8:5-32', '22:1', "22:2-31"]
exodusHebrewList = ['7:26-8:4', '8:1-28', '21:37', "22:1-30"]

leviticusEnglishList = ['6:1-7', '6:8-30']
leviticusHebrewList = ['5:20-26', '6:1-23']