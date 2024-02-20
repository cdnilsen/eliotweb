allBookList = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    #"Judges",
    "Ruth",
    #"1 Samuel",
    #"2 Samuel",
    #"1 Kings",
    #"2 Kings",
    #"1 Chronicles",
    #"2 Chronicles",
    #"Ezra",
    #"Nehemiah",
    #"Esther",
    "Job",
    "Psalms (prose)",
    #"Psalms (metrical)", Will require a separate process
    "Proverbs",
    "Ecclesiastes",
    "Song of Songs",
    #"Isaiah",
    #"Jeremiah",
    "Lamentations",
    #"Ezekiel",
    #"Daniel",
    #"Hosea",
    #"Joel",
    #"Amos",
    "Obadiah",
    "Jonah",
    #"Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    #"Zechariah",
    #"Malachi", 
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

def addBookWordsToDict(book, dict):
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
                    if word not in dict:
                        dict[word] = [verseID]
                    else:
                        if dict[word][-1] != verseID:
                            dict[word].append(verseID)
                    if word not in allWords:
                        allWords.append(word)
        print(book + " has " + str(len(allWords)) + " unique words.")
           
    except:
        print("Error with " + book)
    
for book in allBookList:
    addBookWordsToDict(book, wordToVerseDict)

#addBookWordsToDict("Genesis", wordToVerseDict)

wordToVerseFile = open("wordToVerseDict.txt", "w")
wordKeys = wordToVerseDict.keys()
wordKeys = sorted(wordKeys)

for word in wordKeys:
    if (word != ""):
        wordToVerseFile.write(word + " (" + str(len(wordToVerseDict[word])) + "): " + str(wordToVerseDict[word]) + "\n")
#print(len(wordToVerseDict["the"]))