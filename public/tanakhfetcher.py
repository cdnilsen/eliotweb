import os
import unicodedata
import re
import json
from bs4 import BeautifulSoup as bs


allOTBookListPsalmsNormal = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Songs",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi"
]

bookToChapterDict = {
    "": 0,
    "Genesis": 50,
    "Exodus": 40,
    "Leviticus": 27,
    "Numbers": 36,
    "Deuteronomy": 34,
    "Joshua": 24,
    "Judges": 21,
    "Ruth": 4,
    "1 Samuel": 31,
    "2 Samuel": 24,
    "1 Kings": 22,
    "2 Kings": 25,
    "1 Chronicles": 29,
    "2 Chronicles": 36,
    "Ezra": 10,
    "Nehemiah": 13,
    "Esther": 10,
    "Job": 42,
    "Psalms": 150,
    "Psalms (metrical)": 150,
    "Proverbs": 31,
    "Ecclesiastes": 12,
    "Song of Songs": 8,
    "Isaiah": 66,
    "Jeremiah": 52,
    "Lamentations": 5,
    "Ezekiel": 48,
    "Daniel": 12,
    "Hosea": 14,
    "Joel": 3,
    "Amos": 9,
    "Obadiah": 1,
    "Jonah": 4,
    "Micah": 7,
    "Nahum": 3,
    "Habakkuk": 3,
    "Zephaniah": 3,
    "Haggai": 2,
    "Zechariah": 14,
    "Malachi": 4
}

bookToChapterVerseDict = {
    #Some of these are going to be off, especially in the Psalms
    "Genesis": [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 54, 33, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
    "Exodus": [22, 25, 22, 31, 23, 30, 29, 28, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 37, 30, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
    "Leviticus": [17, 16, 17, 35, 26, 23, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
    "Numbers": [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 35, 28, 32, 22, 29, 35, 41, 30, 25, 19, 65, 23, 31, 39, 17, 54, 42, 56, 29, 34, 13],
    "Deuteronomy": [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 31, 19, 29, 23, 22, 20, 22, 21, 20, 23, 29, 26, 22, 19, 19, 26, 69, 28, 20, 30, 52, 29, 12],
    "Joshua": [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33],
    "Judges": [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25],
    "Ruth": [22, 23, 18, 22],
    "1 Samuel": [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 16, 23, 28, 23, 43, 25, 12, 25, 11, 31, 13],
    "2 Samuel": [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 32, 44, 26, 22, 51, 39, 25],
    "1 Kings": [53, 46, 28, 20, 32, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 54],
    "2 Kings": [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 20, 22, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30],
    "1 Chronicles": [54, 55, 24, 43, 41, 66, 40, 40, 44, 14, 47, 41, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30],
    "2 Chronicles": [18, 17, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 23, 14, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 26, 23],
    "Ezra": [11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
    "Nehemiah": [11, 20, 38, 17, 19, 19, 72, 18, 37, 40, 36, 47, 31],
    "Esther": [22, 23, 15, 17, 14, 14, 10, 17, 32, 3, 17, 8, 30, 16, 24, 10],
    "Job": [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 21, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 32, 26, 17],
    "Psalms": [6, 11, 9, 9, 13, 11, 18, 10, 21, 18, 7, 9, 6, 7, 5, 11, 15, 51, 15, 10, 14, 32, 6, 10, 22, 11, 14, 9, 11, 13, 25, 11, 22, 23, 28, 13, 40, 23, 14, 18, 14, 12, 5, 27, 18, 12, 10, 15, 21, 23, 21, 11, 7, 9, 24, 14, 12, 12, 18, 14, 9, 13, 12, 11, 14, 20, 8, 36, 37, 6, 24, 20, 28, 23, 11, 13, 21, 72, 13, 20, 17, 8, 19, 13, 14, 17, 7, 19, 53, 17, 16, 16, 5, 23, 11, 13, 12, 9, 9, 5, 8, 29, 22, 35, 45, 48, 43, 14, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 14, 10, 8, 12, 15, 21, 10, 20, 14, 9, 6],
    "Proverbs": [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31],
    "Ecclesiastes": [18, 26, 22, 17, 19, 12, 29, 17, 18, 20, 10, 14],
    "Song of Songs": [17, 17, 11, 16, 16, 12, 14, 14],
    "Isaiah": [31, 22, 26, 6, 30, 13, 25, 23, 20, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 11, 25, 24],
    "Jeremiah": [19, 37, 25, 31, 31, 30, 34, 23, 25, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34],
    "Lamentations": [22, 22, 66, 22, 22],
    "Ezekiel": [8, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 44, 37, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35],
    "Daniel": [21, 49, 100, 34, 30, 29, 28, 27, 27, 21, 45, 13, 64, 42],
    "Hosea": [9, 25, 5, 19, 15, 11, 16, 14, 17, 15, 11, 15, 15, 10],
    "Joel": [20, 27, 5, 21],
    "Amos": [15, 16, 15, 13, 27, 14, 17, 14, 15],
    "Obadiah": [21],
    "Jonah": [16, 11, 10, 11],
    "Micah": [16, 13, 12, 13, 15, 16, 20],
    "Nahum": [14, 14, 19],
    "Habakkuk": [17, 20, 19],
    "Zephaniah": [18, 15, 20],
    "Haggai": [15, 23],
    "Zechariah": [17, 17, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
    "Malachi": [14, 17, 18, 6]
}

tanakhFolder = "./Hebrew XML/"
kjvFolder = "./texts/"

def getTanakh():
    tanakh = []
    for filename in os.listdir(tanakhFolder):
        if filename.endswith(".xml"):
            tanakh.append(filename)
    return tanakh


def getKJVDict(book):
    openedFile = open("./texts/" + book + ".KJV.txt", "r", encoding="utf-8")
    fileLines = openedFile.readlines()

    outputDict = {}

    for line in fileLines:
        address = line.split(" ")[0]
        if '.' in address:
            chapter = int(address.split(".")[0])
            verse = int(address.split(".")[1])
        else:
            chapter = int(address.split(":")[0])
            verse = int(address.split(":")[1])

        if chapter not in outputDict:
            
            outputDict[chapter] = 0
        else:
            outputDict[chapter] = int(verse)

    return outputDict


def compareVerseNums(outputFile):
    openedFile = open(outputFile, "w", encoding="utf-8")
    for book in allOTBookListPsalmsNormal:

        tanakhLines = open(tanakhFolder + book + ".xml", "r", encoding="utf-8").readlines()

        currentChapter = 1
        currentVerse = 0

        tanakhChapterToVerseDict = {}
        for line in tanakhLines:
            line = line.strip()
            if line.startswith("<c n="):
                currentChapter = int(line.split('"')[1])
                tanakhChapterToVerseDict[currentChapter] = 0
            if line.startswith("<v n="):
                currentVerse = line.split('"')[1]
                tanakhChapterToVerseDict[currentChapter] = int(currentVerse)


        if book == "Psalms":
            kjvChapterToVerseDict = getKJVDict("Psalms (prose)")
        else:
            kjvChapterToVerseDict = getKJVDict(book)

        tanakhChapterKeys = list(tanakhChapterToVerseDict.keys())
        kjvChapterKeys = list(kjvChapterToVerseDict.keys())

        kjvChapterKeys.sort()
        tanakhChapterKeys.sort()
        totalTanakhVerses = 0

        for key in tanakhChapterKeys:
            if key not in kjvChapterKeys:
                kjvChapterToVerseDict[key] = 0
            totalTanakhVerses += tanakhChapterToVerseDict[key]
        
        totalKJVVerses = 0
        for key in kjvChapterKeys:
            if key not in tanakhChapterKeys:
                tanakhChapterToVerseDict[key] = 0
            totalKJVVerses += kjvChapterToVerseDict[key]

        openedFile.write("====" + book + "====\n")

        if tanakhChapterKeys[-1] != kjvChapterKeys[-1]:
            openedFile.write(book + " has " + str(tanakhChapterKeys[-1]) + " chapters in the Tanakh and " + str(kjvChapterKeys[-1]) + " chapters in the KJV" + "\n")
            
        if totalTanakhVerses != totalKJVVerses:
            openedFile.write(book + " has " + str(totalTanakhVerses) + " verses in the Tanakh and " + str(totalKJVVerses) + " verses in the KJV" + "\n")

        newTanakhKeys = list(tanakhChapterToVerseDict.keys())
        newKJVKeys = list(kjvChapterToVerseDict.keys())


        allNormalChapters = []
        for key in newTanakhKeys:
            tanakhVerses = tanakhChapterToVerseDict[key]
            kjvVerses = kjvChapterToVerseDict[key]
            

            if tanakhVerses != kjvVerses:
                if len(allNormalChapters) > 0:
                    writeString = ""
                    for chapter in allNormalChapters:
                        writeString += str(chapter) + ", "
                    writeString = writeString[0:-2] + " are normal"
                    openedFile.write(writeString + "\n")
                openedFile.write("----\n" + str(key) + ": " + str(tanakhVerses) + " in the Tanakh, " + str(kjvVerses) + " in the KJV" + "\n----\n")
                allNormalChapters = []

            else:
                allNormalChapters.append(key)

        if len(allNormalChapters) > 0:
            writeString = ""
            for chapter in allNormalChapters:
                writeString += str(chapter) + ", "
            writeString = writeString[0:-2] + " are normal"
            openedFile.write(writeString + "\n")

        openedFile.write("\n")
    openedFile.close()

#compareVerseNums("verseDiscrepencies.txt")

''' 
allChapters = 0
def compareChapters(book, tanakhFile):
    mismatchedChapterList = []
    numVersesHebrew = []
    numVersesKJV = []
    global allChapters

    if tanakhFile == "Psalms (metrical)":
        return
    
    if tanakhFile == "Psalms (prose)":
        hebrewText = open(tanakhFolder + "Psalms.xml", "r", encoding="utf-8")
    else:
        hebrewText = open(tanakhFolder + tanakhFile + ".xml", "r", encoding="utf-8")
    hebrewLines = hebrewText.readlines()
    hebrewText.close()

    numChaptersHebrew = []
    HebrewChapterVerseNumDict = {}
    currentHebrewChapter = ""
    verseCountHebrew = 0
    for line in hebrewLines:
        line = line.strip()
        if line.startswith("<c n="):
            allChapters += 1
            currentHebrewChapter = line.split('"')[1]
            if currentHebrewChapter != "":
                currentChapter = currentHebrewChapter
                numChaptersHebrew.append(currentHebrewChapter)
        if line.startswith("<v n="):
            verseCountHebrew += 1
            verseNumber = line.split('"')[1]
            HebrewChapterVerseNumDict[currentChapter] = verseNumber
    
    kjvChapters = bookToChapterDict[book]

    if verseCountHebrew != verseCountKJV:
        print(tanakhFile + ": " + str(verseCountHebrew) + " in Hebrew, " + str(verseCountKJV) + " in KJV")
        
    return mismatchedChapterList, numVersesHebrew, numVersesKJV, totalMismatchedChapters > 0


allMismatchedChaptersDict = {}
totalMismatchedChapters = 0

for book in allOTBookListPsalmsNormal:
    allMismatchedChaptersDict[book] = compareChapters(book)
    try:
        if allMismatchedChaptersDict[book][3]:
            mismatchedChapterString = ""
            for mismatchedChapter in allMismatchedChaptersDict[book][0]:
                totalMismatchedChapters += 1
                mismatchedChapterString += mismatchedChapter + " (" + allMismatchedChaptersDict[book][1][allMismatchedChaptersDict[book][0].index(mismatchedChapter)] + "/" + allMismatchedChaptersDict[book][2][allMismatchedChaptersDict[book][0].index(mismatchedChapter)] + "), "
    except:
        continue
'''

cantillationMarksCodePoints = [
    "u0591",
    "u0592",
    "u0593",
    "u0594",
    "u0595",
    "u0596",
    "u0597",
    "u0598",
    "u0599",
    "u059a",
    "u059b",
    "u059c",
    "u059d",
    "u059e",
    "u059f",
    "u05a0",
    "u05a1",
    "u05a2",
    "u05a3",
    "u05a4",
    "u05a5",
    "u05a6",
    "u05a7",
    "u05a8",
    "u05a9",
    "u05aa",
    "u05ab",
    "u05ac",
    "u05ad",
    "u05ae",
    "u05af"
]

def killCantillationMarks(word):
    newWord = ""
    for char in word:
        unicodeChar = char.encode("unicode_escape").decode("utf-8")[1:]
        if unicodeChar not in cantillationMarksCodePoints:
            newWord += char
    
    return unicodedata.normalize('NFC', newWord)

def processOneHebrewWord(line, wordTag):
    line = killCantillationMarks(line).strip().replace("׃", "")

    if wordTag == "k":
        output = '<span class="ketiv" style="color: red; border-bottom: 1px dotted #000;">' + line
    elif wordTag == "q":
        output = '<span class="hover-tooltip">' + line.strip().replace("׃", "") + '</span></span>'
        #output = '<span class="hover-tooltip" title="' + line.strip().replace("׃", "") + '"' + '>'
    elif wordTag == "h":
        output = '<H>' + line + "</H>"
    else:
        output = line

    return (output)

'''
for line in otHapaxFile:
    splitLine = line.split("\t")
    if len(splitLine) == 1 and len(splitLine[0]) > 1:
        currentBook = splitLine[0].strip()
    elif len(splitLine) > 1:
        verseAddress = splitLine[0].split(" ")[-1][0:-1]
        book = " ".join(splitLine[0].split(" ")[0:-1])[1:]

        if book not in bookToHapaxDict:
            bookToHapaxDict[book] = {}
            bookToHapaxDict[book]["hapaxes"] = []
            bookToHapaxDict[book]["addresses"] = []

        hapax = killCantillationMarks(splitLine[1]).strip()
        if len(hapax) > 0:
            bookToHapaxDict[book]["hapaxes"].append(unicodedata.normalize('NFC', hapax))
            bookToHapaxDict[book]["addresses"].append(verseAddress)
'''
'''
def processBookXMLOld(bookName):
    originalName = bookName
    if bookName == "Psalms (metrical)":
        return
    if bookName == "Psalms (prose)":
        bookName = "Psalms"
    
    myXML = open("./hebrewXML/" + bookName + ".xml", "r", encoding="utf-8")

    finalJSONDict = {}
    mySoup = bs(myXML, features="xml")
    for tag in mySoup('x'):
        tag.decompose()
    allChapters = mySoup.find_all('c')
    for chapter in allChapters:
        currentChapter = chapter['n']
        for verse in chapter.find_all('v'):
            currentVerseDict = {}
            processedHapaxes = ""
            currentVerse = verse['n']
            for word in verse:
                try:
                    wordTag = word.name
                    if wordTag in ["w", "k", "q"]:
                        if (currentChapter + ":" + currentVerse) in bookToHapaxDict[bookName]["addresses"]:
                            for i in range(len(bookToHapaxDict[bookName]["addresses"])):
                                if bookToHapaxDict[bookName]["addresses"][i] == (currentChapter + ":" + currentVerse):
                                    myText = unicodedata.normalize('NFC', killCantillationMarks(word.text))

                                    #Fixes, e.g., different ordering of a dagesh and niqqud
                                    myHapax = bookToHapaxDict[bookName]["hapaxes"][i]

                                    # This has already undergone normalization
                                    if myHapax in myText:
                                            wordTag = "h"
                                            
                                    
                        processedHapaxes += processOneHebrewWord(word.text, wordTag)
                        processedHapaxes = processedHapaxes.replace("־ ", "־")
                        processedHapaxes = processedHapaxes.replace("> <", "><")
                        processedHapaxes = processedHapaxes + " "

            
                except:
                    continue

            processedHapaxes = processedHapaxes.replace("><H>", "> <H>")

            currentVerseDict["chapter"] = int(currentChapter)
            currentVerseDict["verse"] = int(currentVerse)
            currentVerseDict["textHapaxes"] = processedHapaxes.strip() + "׃"
            verseAddress = currentChapter + ":" + currentVerse
            finalJSONDict[verseAddress] = currentVerseDict

    openedJSON = open("./textJSON/" + originalName + ".json", "r", encoding="utf-8")
    openedJSONDict = json.load(openedJSON)
    openedJSON.close()

    existingJSONDict = {}
    for dict in openedJSONDict:
        existingJSONDict[str(dict["chapter"]) + ":" + str(dict["verse"])] = dict
    
    for dictAddress in existingJSONDict:
        if not dictAddress in finalJSONDict:
            print(bookName + " " + dictAddress)
            print(dictAddress in finalJSONDict)
        else:
            existingJSONDict[dictAddress]["grebrew"] = finalJSONDict[dictAddress]["textHapaxes"]

    allVerses = []
    for verse in existingJSONDict:
        allVerses.append(existingJSONDict[verse])

    newJSON = open("./textJSON/" + originalName + ".json", "w", encoding="utf-8")
    newJSON.write(json.dumps(allVerses, indent=2))
    newJSON.close()
''' 
def swapQereKetiv(bookName):
    myXML = open("./hebrewXML/" + bookName + ".xml", "r", encoding="utf-8")
    XMLLines = myXML.readlines()

    allLines = []
    for i in range(len(XMLLines) - 1):
        line = XMLLines[i].strip()
        nextLine = XMLLines[i+1].strip()
        if line.startswith("<k") and nextLine.startswith("<q"):
            allLines.append(XMLLines[i+1])
            allLines.append(XMLLines[i])
            i += 1
        elif not line.startswith("<q") and not line.startswith("<k"):
            allLines.append(XMLLines[i])
    allLines.append(XMLLines[-1])
    myXML.close()
    newFile = open("./hebrewXML/" + bookName + ".xml", "w", encoding="utf-8")
    for line in allLines:
        newFile.write(line)
    newFile.close()


def addZeros(numString, numberOfDigits):
    while len(numString) < numberOfDigits:
        numString = "0" + numString

    return numString


def getDictOfWords(lineList):
    dict = {}
    currentChapter = 1
    currentVerse = 0
    currentAddress = ""
    wordCounter = 0
    for line in lineList:
        line = line.strip()
        if line.startswith("<c n="):
            currentChapter = line.split('"')[1]
        if line.startswith("<v n="):
            currentVerse = line.split('"')[1]
            partialAddress = currentChapter + addZeros(currentVerse, 4)
            wordCounter = 0
        if line.startswith("<H"):
            print("Line starts with H: " + line)
        if line.startswith("<w") or line.startswith("<k"):
            # Don't increase the word counter if it's a qere
            wordCounter += 1
        if line.startswith("<w") or line.startswith("<k") or line.startswith("<q"):
            word = killCantillationMarks(line.split(">")[1].split("<")[0])
            
            wordType = line[1]

            wordAddress = partialAddress + addZeros(str(wordCounter), 4)
   
            if wordAddress not in dict:
                dict[wordAddress] = [(word, wordType)]
            else:
                dict[wordAddress].append((word, wordType))
    return dict


def getBookHapaxes(book):
    otHapaxFile = open("./OT Hapaxes.txt", "r", encoding="utf-8")
    hapaxFileLines = otHapaxFile.readlines()

    finalDict = {}
    numHapaxes = 0
    for line in hapaxFileLines:
        if line[0] == "[":
            splitLine = line.split("\t")
            lineAddress = splitLine[0][1:-1]
            splitAddress = lineAddress.split(" ")
            lineBook = ' '.join(splitAddress[0:-1])
            if lineBook == book:
                rawAddress = splitAddress[-1].split(":")
                numHapaxes += 1

                address = int(rawAddress[0] + str(addZeros(rawAddress[1], 4)))
                hapax = killCantillationMarks(splitLine[1].strip())
                finalDict[hapax] = address
                print(address)

    return finalDict
                

def processBookXML(bookName):
    xmlFile = open("./Hebrew XML/" + bookName + ".xml", "r", encoding="utf-8")

    xmlLines = xmlFile.readlines()

    lineDict = getDictOfWords(xmlLines)
    hapaxDict = getBookHapaxes(bookName)

    allHapaxes = list(hapaxDict.keys())
    print('num hapaxes: ' + str(len(allHapaxes)))

    lineKeys = list(lineDict.keys())
    lineKeys.sort()

    allHapaxAddresses = []

    addressToWordsDict = {}
    for hapax in hapaxDict:
        address = hapaxDict[hapax]
        #addressToWordsDict[address] = []
        if address not in allHapaxAddresses:
            allHapaxAddresses.append(address)
            addressToWordsDict[address] = [hapax]
        else:
            addressToWordsDict[address].append(hapax)

    #Some sort of type (?) error around here
    allHapaxAddresses.sort()
    print("hapaxes: " + str(len(allHapaxAddresses)))
    print("list of hapaxdict: " + str(len(list(hapaxDict.keys()))))
    print(hapaxDict)

          
    finalVerseTextDict = {}
    for key in lineKeys:
        verseAddress = key[0:-4]
        if verseAddress not in finalVerseTextDict:
            finalVerseTextDict[verseAddress] = ""

        wordString = ""
        for tuple in lineDict[key]:
            word = tuple[0]
            type = tuple[1]

            hasSofPasuk = word[-1] == "׃"
            if hasSofPasuk:
                word = word[0:-1]
            if word in hapaxDict:
                wordString = "<H>" + word + "</H>"
            elif type == 'k':
                wordString += "<K>" + word
            elif type == 'q':
                wordString += "<Q>" + word + "</Q></K>"
            else: 
                wordString += word

            if hasSofPasuk:
                wordString += "׃"
            else:
                wordString += " "

        finalVerseTextDict[verseAddress] += wordString

    bookJSON = open("./Hebrew JSON/" + bookName + ".json", "w", encoding="utf-8")

    newRawJSON = []

    for address in finalVerseTextDict:
        chapter = int(address[0:-4])
        verse = int(address[-2:])
        newRawJSON.append({
            "chapter": chapter,
            "verse": verse,
            "text": finalVerseTextDict[address]
        })        
        
    bookJSON.write(json.dumps(newRawJSON, indent=2))

processBookXML("Leviticus")

                
           
            
            

            

#getBookHapaxes('Daniel')
#def processBookToEasierXML(bookName):

