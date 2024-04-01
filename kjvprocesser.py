import json

allBookList = [
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
    "Psalms (prose)",
    #"Psalms (metrical)", Will require a separate process
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
    "Malachi", 
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

bookToFinishedDict = {
    "Genesis": True,
    "Exodus": True,
    "Leviticus": True,
    "Numbers": True,
    "Deuteronomy": True,
    "Joshua": False,
    "Judges": False,
    "Ruth": True,
    "1 Samuel": False,
    "2 Samuel": False,
    "1 Kings": False,
    "2 Kings": False,
    "1 Chronicles": False,
    "2 Chronicles": False,
    "Ezra": False,
    "Nehemiah": False,
    "Esther": False,
    "Job": True,
    "Psalms (prose)": True,
    #"Psalms (metrical)": False, Will require a separate process
    "Proverbs": True,
    "Ecclesiastes": True,
    "Song of Songs": True,
    "Isaiah": False,
    "Jeremiah": False,
    "Lamentations": True,
    "Ezekiel": False,
    "Daniel": False,
    "Hosea": False,
    "Joel": False,
    "Amos": False,
    "Obadiah": True,
    "Jonah": True,
    "Micah": False,
    "Nahum": True,
    "Habakkuk": True,
    "Zephaniah": True,
    "Haggai": True,
    "Zechariah": False,
    "Malachi": False, 
    "Matthew": True,
    "Mark": True,
    "Luke": True,
    "John": True,
    "Acts": True,
    "Romans": True,
    "1 Corinthians": True,
    "2 Corinthians": True,
    "Galatians": True,
    "Ephesians": True,
    "Philippians": True,
    "Colossians": True,
    "1 Thessalonians": True,
    "2 Thessalonians": True,
    "1 Timothy": True,
    "2 Timothy": True,
    "Titus": True,
    "Philemon": True,
    "Hebrews": True,
    "James": True,
    "1 Peter": True,
    "2 Peter": True,
    "1 John": True,
    "2 John": True,
    "3 John": True,
    "Jude": True,
    "Revelation": True
}

allPunctuation = [".", ",", "!", "?", ":", ";", "(", ")", "[", "]", "{", "}", "<", ">", "\"", "\'", "/", "\\"]

def getBookToNumDict(bookList):
    finalDict = {}
    i = 1
    for book in bookList:
        finalDict[book] = i
        i += 1
    return finalDict

def chapterString(chapter):
    finalString = str(chapter)
    if len(finalString) == 1:
        finalString = "00" + finalString
    elif len(finalString) == 2:
        finalString = "0" + finalString
    return finalString

def verseString(verse):
    finalString = str(verse)
    if len(finalString) == 1:
        finalString = "00" + finalString
    elif len(finalString) == 2:
        finalString = "0" + finalString
    return finalString

def bookNumberString(book, address):
    bookIDNum = str(getBookToNumDict(allBookList)[book])
    if len(bookIDNum) == 1:
        bookIDNum = "0" + bookIDNum
    finalString = "1" + bookIDNum

    splitAddress = address.split(".")
    chapter = splitAddress[0]
    verse = splitAddress[1]

    finalString = finalString + chapterString(chapter) + verseString(verse)
    return int(finalString)

def killPunctuationMarks(word):
    word = word.lower()
    newWord = ""
    for letter in word:
        if letter not in allPunctuation:
            newWord += letter
    return newWord

wordToVerseDict = {}
wordToCountDict = {}

def addBookWordsToDict(book, verseListDict, verseCountDict):
    allWords = [];
    try:
        bookFile = open("./texts/" + book + ".KJV.txt", "r", encoding = "utf-8")
        bookText = bookFile.read()
        bookLines = bookText.split("\n")
        #bookFile.close()

        for line in bookLines:
            splitLine = line.split(" ")
            #print(splitLine)
            if splitLine != [""]:
                address = splitLine[0]
                verseID = bookNumberString(book, address)                
                for word in splitLine[1:]:
                    word = killPunctuationMarks(word)
                    if word == "":
                        continue
                    if word not in verseListDict:
                        verseListDict[word] = [verseID]
                        wordToCountDict[word] = 1
                    else:
                        if verseListDict[word][-1] != verseID:
                            verseListDict[word].append(verseID)
                            wordToCountDict[word] += 1
                    if word not in allWords:
                        allWords.append(word)
        print(book + " has " + str(len(allWords)) + " unique words.")
           
    except:
        print("Error with " + book)
    
for book in allBookList:
    addBookWordsToDict(book, wordToVerseDict, wordToCountDict)

allWords = wordToVerseDict.keys()
allWords = sorted(allWords)

allWordDicts = []
for word in allWords:
    thisWordDict = {}
    thisWordDict["word"] = word
    thisWordDict["verses"] = wordToVerseDict[word]
    thisWordDict["count"] = wordToCountDict[word]
    allWordDicts.append(thisWordDict)

def createWordJSON(wordDictList):
    wordJSON = open("./KJV JSONs/words.json", "w")
    
    jsonObject = json.dumps(wordDictList, indent = 2)
    wordJSON.write(jsonObject)
    wordJSON.close()

def createTextJSON(book):
    bookText = open("./texts/" + book + ".KJV.txt", "r", encoding = "utf-8")
    bookText = bookText.read()
    bookText = bookText.split("\n")




createWordJSON(allWordDicts)

'''
wordToVerseFile = open("wordToVerseDict.txt", "w")
wordKeys = wordToVerseDict.keys()
wordKeys = sorted(wordKeys)

for word in wordKeys:
    if (word != ""):
        wordToVerseFile.write(word + " (" + str(len(wordToVerseDict[word])) + "): " + str(wordToVerseDict[word]) + "\n")
'''