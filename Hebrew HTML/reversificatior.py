# This program 'fixes' the verse numbering in the text of the Tanakh so that it matches the KJV (more or less...)

# Python doesn't have strong typing or the ability to define types, but here is an example of the dictionary you'll need to do a renumbering

GenesisDict = {
    31: 55,
    32: 32,
}

ExodusDict = {
    7:25,
    8:32
}

#print(list(GenesisDict.keys()))

def verseSplitter(verse):
    splitVerse = verse.split("«")
    text = splitVerse[1].strip()
    address = splitVerse[0].strip().replace("{", "").replace("}", "")
    chapterNum = address.split(":")[0]
    verseNum = address.split(":")[1]
    return (int(chapterNum), int(verseNum), text)
    
def chapterCounter(allLines, startsZero, chapterNum, howManyVerses):

    return 3

def renumberVerses(book, dict, startsZeroḶist = []):
    bookLines = open("./" + book + ".txt", "r", encoding="utf-8").readlines()
    chapterToVerseDict = {}
    allVerseText = []

    allLines = []

    for line in bookLines:
        if line.strip() != "":
            allLines.append(line)

    for i in range(len(allLines)):
        verse = verseSplitter(allLines[i])
        allVerseText.append(verse[2])

        if verse[1] == 1 and verse[0] != 1:
            lastVerseSplit = verseSplitter(allLines[i-1])
            chapterToVerseDict[lastVerseSplit[0]] = lastVerseSplit[1]
        if i == len(allLines) - 1:
            chapterToVerseDict[verse[0]] = verse[1]

    chapterList = chapterToVerseDict.keys()

    lastChapter = max(chapterList)

    changedChapters = list(dict.keys())

    totalVerses = 0

    finalList = []
    counter = 0
    for chapter in chapterList:
        verses = 0
        if chapter in changedChapters:
            verses = dict[chapter]
        else:
            verses = chapterToVerseDict[chapter]


        addHowMany = 1
        if chapter in startsZeroḶist:
            addHowMany = 0
        for i in range (0, verses):
            verseNum = i + addHowMany
            tuple = (allVerseText[counter], chapter, verseNum)
            finalList.append(tuple)
            counter += 1
    
    revisedVersion = open(book + ".reversified.txt", "w", encoding = "utf-8")
    for verseTuple in finalList:
        newText = "{" + str(verseTuple[1]) + ":" + str(verseTuple[2]) + "} «" + verseTuple[0]
        revisedVersion.write(newText + "\n")


    