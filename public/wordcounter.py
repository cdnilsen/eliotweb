bookToActiveEditionsDict = {
    "Genesis": 3,
    "Exodus": 6,
    "Leviticus": 6,
    "Numbers": 6,
    "Deuteronomy": 3,
    "Joshua": 3, 
    "Judges": 1,
    "Ruth": 6,
    "1 Samuel": 1,
    "2 Samuel": 1,
    "1 Kings": 1,
    "2 Kings": 1,
    "1 Chronicles": 1,
    "2 Chronicles": 1,
    "Ezra": 2,
    "Nehemiah": 1,
    "Esther": 1,
    "Job": 2,
    "Psalms (prose)": 10,
    "Proverbs": 2, 
    "Ecclesiastes": 2,
    "Song of Songs": 6,
    "Isaiah": 1,
    "Jeremiah": 1,
    "Lamentations": 6,
    "Ezekiel": 1,
    "Daniel": 1,
    "Hosea": 1, 
    "Joel": 1, 
    "Amos": 1,
    "Obadiah": 6, 
    "Jonah": 6,
    "Micah": 1,
    "Nahum": 6,
    "Habakkuk": 6,
    "Zephaniah": 6,
    "Haggai": 6, 
    "Zechariah": 1,
    "Malachi": 1,
    "Matthew": 6,
    "Mark": 6, 
    "Luke": 6,
    "John": 30,
    "Acts": 6,
    "Romans": 6,
    "1 Corinthians": 6,
    "2 Corinthians": 6,
    "Galatians": 6,
    "Ephesians": 6,
    "Philippians": 6,
    "Colossians": 6,
    "1 Thessalonians": 6,
    "2 Thessalonians": 6,
    "1 Timothy": 6,
    "2 Timothy": 6,
    "Titus": 6,
    "Philemon": 6,
    "Hebrews": 6,
    "James": 6,
    "1 Peter": 6,
    "2 Peter": 6,
    "1 John": 6,
    "2 John": 6,
    "3 John": 6,
    "Jude": 6,
    "Revelation": 6
}

allBooks = list(bookToActiveEditionsDict.keys())


allWordCount = 0
allWords = []

def cleanPunctuation(word):
    word = word.lower()
    return word.replace(".", "").replace(",", "").replace(";", "").replace(":", "").replace("!", "").replace("?", "").replace("(", "").replace(")", "").replace("[", "").replace("]", "").replace("{", "").replace("}", "").replace("'", "").replace("\"", "")


numToEditionDict = {
    2: "First Edition",
    3: "Second Edition",
    5: "Mayhew"
}

editionList = [2, 3, 5]
wordCountDict = {}
for book in allBooks:
    bookNum = bookToActiveEditionsDict[book]
    for edition in editionList:
        if (bookNum % edition == 0):
            text = "./texts/" + book + "." + numToEditionDict[edition] + ".txt"
            with open(text, "r", encoding="utf-8") as file:
                lines = file.readlines()
                for line in lines:
                    splitLine = line.split(" ")
                    for word in splitLine[1:]:
                        word = cleanPunctuation(word)
                        if word not in allWords:
                            allWords.append(word)
                            allWordCount += 1
                            wordCountDict[word] = 1
                        else:
                            wordCountDict[word] += 1
            print("Finished " + text)


wordCountList = []
wordCountTokensDict = {}
for word in allWords:
    wordCount = wordCountDict[word]
    if wordCount not in wordCountTokensDict:
        wordCountList.append(wordCount)
        wordCountTokensDict[wordCount] = 1
    else:
        wordCountTokensDict[wordCount] += 1

wordCountList.sort()

allCountSum = sum(wordCountList)

for count in wordCountList:
    proportion = ((wordCountTokensDict[count] * count) / allCountSum) * 100
    percent = str(round(proportion, 3)) + "%"
    print(str(count) + ": " + str(wordCountTokensDict[count]) + " (" + percent + ")")

print("Total tokens: " + str(allCountSum) + " (" + str(len(allWords)) + " unique words)")