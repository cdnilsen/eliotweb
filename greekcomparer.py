

def gravesToAcutes(word):
    graves = "ἊἂᾊᾂἚἒἪἢᾚᾒἺἲὊὂὛὒὪὢᾪᾢἋἃᾋᾃἛἓἫἣᾛᾓἻἳὋὃὛὓὫὣᾫᾣᾺὰᾲῈὲῊὴῂὶῚῸὸῪὺῺὼῲ"
    acutes = "ἌἄᾌᾄἜἔἬἤᾜᾔἼἴὌὄὝὔὬὤᾬᾤἍἅᾍᾅἝἕἭἥᾝᾕἽἵὍὅὝὕὭὥᾭᾥΆάᾴΈέΉήῄίΊΌόΎύΏώῴ"
    for i in range(len(graves)):
        word = word.replace(graves[i], acutes[i])
    return word.lower()
        
def stripWord(word):
    punctuation = ".,;·()!"
    for char in punctuation:
        word = word.replace(char, "")
    return gravesToAcutes(word)

def getCountDict(inputFile, outputFile):
    dict = {}
    allWords = []
    lines = open(inputFile, 'r', encoding = 'utf-8').readlines()

    for line in lines:
        line = line.strip()
        if line == "":
            continue
        elif line[0] != "=":
            splitLine = line.split(" ")
            for word in splitLine[1:]:
                cleanedWord = stripWord(word)
                if cleanedWord not in dict:
                    dict[cleanedWord] = 1
                    allWords.append(cleanedWord)
                else:
                    dict[cleanedWord] += 1

    allWords.sort()

    with open(outputFile, "w", encoding="utf-8") as output:
        for word in allWords:
            output.write(word + " : " + str(dict[word]) + "\n")


def getHapaxes():
    hapaxLines = open('./nthapaxesraw.txt', 'r', encoding='utf-8').readlines()
    allHapaxDict = {}
    currentHapax = ""
    for i in range(2, len(hapaxLines)):
        line = hapaxLines[i].strip()
        if i % 4 == 3:
            currentHapax = line
        elif i % 4 == 1:
            allHapaxDict[currentHapax] = line
    return allHapaxDict

def getVerseDict():
    NTLines = open("./greekText2.txt", "r", encoding="utf-8").readlines()

    allVerseDict = {}
    currentBook = ""
    for line in NTLines:
        splitLine = line.split("}")
        address = splitLine[0].replace("{", "")
        splitVerse = splitLine[1].split(" ")
        allVerseDict[address] = splitLine[1]
    return allVerseDict

hapaxDict = getHapaxes()

hapaxList = list(hapaxDict.keys())
verseDict = getVerseDict()

def getTextHapaxes(text, hapaxList):
    allLines = open(text, 'r', encoding='utf-8').readlines()
    
    allWords = []
    wordDict = {}
    for line in allLines:
        line = line.strip()
        splitLine = line.split("}")

        address = splitLine[0].replace("{", "").strip()
        verse = splitLine[1].strip()

        for word in verse.split(" "):
            cleanWord = stripWord(word)
            if cleanWord in wordDict:
                wordDict[cleanWord] += 1
            else:
                wordDict[cleanWord] = 1
                allWords.append(cleanWord)
    allWords.sort()

    potentialHapaxes = []
    for word in allWords:
        if wordDict[word] == 1 and word not in hapaxList:
            potentialHapaxes.append(word)

    return len(potentialHapaxes)




print(len(hapaxDict))
print(len(verseDict))
hapaxesNotPresent = 0
outputFile = open("hapaxesNotOnList.txt", "w", encoding="utf-8")
for hapax in hapaxList:
    thisHapaxVerse = hapaxDict[hapax]
    if gravesToAcutes(hapax) not in gravesToAcutes(verseDict[thisHapaxVerse]):
        hapaxString = hapax + " (" + thisHapaxVerse + ")\n"
        outputFile.write(hapaxString)
        print(hapax + " not in " + thisHapaxVerse)

def highlightHapaxes(hapaxList, hapaxDict, sourceText):
    
    outputFile = open("highlightedGreek.txt", 'w', encoding='utf-8')

    sourceLines = open(sourceText, 'r', encoding='utf-8').readlines()

    verseList = []
    verseDict = {}
    for line in sourceLines:
        line = line.strip()
        splitLine = line.split("}")

        address = splitLine[0].replace("{", "").strip()
        verse = splitLine[1].strip()
        verseDict[address] = verse
        verseList.append(address)

    highlightedVerseDict = {}

    strippedHapaxes = []
    for hapax in hapaxList:
        strippedHapaxes.append(stripWord(hapax))

    unfoundHapaxes = []
    for hapax in hapaxList:
        hapaxAddress = hapaxDict[hapax]
        hapaxVerse = verseDict[hapaxAddress]

        highlightedVerse = ""
        foundHapax = False
        for word in hapaxVerse.split(" "):
            if stripWord(word) == stripWord(hapax):
                highlightedVerse += ('<span style="color:blue">' + word + '</span>')
                foundHapax = True
            elif stripWord(word) not in strippedHapaxes:
                highlightedVerse += word
            else:
                highlightedVerse += ('<span style="color:blue">' + word + '</span>')
                foundHapax = True
            highlightedVerse += " "
        if "<span" in highlightedVerse:
            print(highlightedVerse.strip())
        highlightedVerseDict[hapaxAddress] = highlightedVerse.strip()
        if foundHapax == False:
            unfoundHapaxes.append(hapax)

    for address in verseList:
        if address in highlightedVerseDict:
            outputFile.writelines("{" + address + "} " + highlightedVerseDict[address] + "\n")
        else:
            outputFile.writelines( "{" + address + "} " + verseDict[address] + "\n")

    return unfoundHapaxes

unfoundHapaxes = highlightHapaxes(hapaxList, hapaxDict, 'greekText2.txt')


bookNames = [
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation"
]


bookToHapaxDict = {}
for hapax in unfoundHapaxes:
    book = " ".join(hapaxDict[hapax].split(":")[0].split(" ")[0:-1])
    if book not in bookNames:
        print("Error with " + book)
    if book not in bookToHapaxDict:
        bookToHapaxDict[book] = [hapax + " (" + hapaxDict[hapax] + ")"]
    else:
        bookToHapaxDict[book].append(hapax + " (" + hapaxDict[hapax] + ")")

unfoundHapaxesFile = open('./newHapaxesNotOnList.txt', 'w', encoding='utf-8')
for book in bookNames:
    if book in bookToHapaxDict:
        hapaxString = ", ".join(bookToHapaxDict[book])
        unfoundHapaxesFile.write(book + ": " + hapaxString + "\n")

