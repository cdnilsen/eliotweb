import unicodedata
import re

xmlFolder = './Hebrew XML/'
textFolder = './Hebrew Raw Text/'

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
    return newWord



def processBook(book):
    bookXML = xmlFolder + book + '.xml'
    xmlLines = open(bookXML, 'r', encoding = 'utf-8').readlines()

    bookText = textFolder + book + '.txt'

    with open(bookText, 'w', encoding = 'utf-8') as f:
        chapterCounter = 0
        verseCounter = 0
        wordCounter = 0
        for line in xmlLines:
            line = line.strip()
            line = unicodedata.normalize('NFKD', line)
            line = killCantillationMarks(line)
            if (line.startswith('<c n="')):
                chapterCounter += 1
                verseCounter = 0
                f.write('<C>' + str(chapterCounter) + '</C>\n')
            if (line.startswith('<v n="')):
                verseCounter += 1
                wordCounter = 0
                f.write('<V>' + str(verseCounter) + '</V>\n')
            if line.startswith('<w>') or line.startswith('<q>') or line.startswith('<k>'):
                wordCounter += 1
                line = re.sub('<x>.*</x>', '', line)
                outputString = line + ' (' + str(chapterCounter) + ':' + str(verseCounter) + ':' + str(wordCounter) + ')'
                f.write(outputString + '\n')
            if line == "<samekh/>" or line == "<pe/>":
                f.write(line + '\n')
        f.close()

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
        
'''
for book in allOTBookListPsalmsNormal:
    processBook(book)
    print(book + ' processed')
'''
def replaceFinalForms(char):
    if char == "ך":
        return "כ"
    elif char == "ם":
        return "מ"
    elif char == "ן":
        return "נ"
    elif char == "ף":
        return "פ"
    elif char == "ץ":
        return "צ"
    else:
        return char

def consonantsOnly(word):
    consonantList = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת", "ך", "ם", "ן", "ף", "ץ"]

    finalWordCharList = []
    for char in word:
        if char in consonantList:
            finalWordCharList.append(replaceFinalForms(char))
    return "".join(finalWordCharList)


def getRelevantHapaxes(book):
    hapaxFile = open('OT Hapaxes.txt', 'r', encoding = 'utf-8')

    hapaxLines = hapaxFile.readlines()
    hapaxFile.close()


    dict = {}
    for line in hapaxLines:
        if line.startswith('[' + book):
            splitLine = line.split('\t')
            address = splitLine[0][1:-1]
            address = address.split(" ")[-1]
            word = killCantillationMarks(splitLine[1])
            if address not in dict:
                dict[address] = [word]
            else:
                dict[address].append(word)
    return dict


def getWordFromLine(line):
    word = line.split(' ')[0]
    word = word[3:-4]
    return word


def checkHapaxes(hapaxDict, verseToWordDict, verseToTagDict, book):
    allHapaxVerses = hapaxDict.keys()
    

    unfinishedHapaxes = []
    unfinishedHapaxKeys = []

    
    for key in allHapaxVerses:
        allHapaxes = hapaxDict[key]

        numHapaxes = len(allHapaxes)

        verseList = verseToWordDict[key]
        tagList = verseToTagDict[key]

        hapaxesLeft = numHapaxes

        for hapax in allHapaxes:
            hapaxSkeleton = consonantsOnly(hapax)
            
            indexList = []
            for word in verseList:
                listIndex = verseList.index(word)
                
                if hapaxSkeleton in consonantsOnly(word):
                    indexList.append(listIndex)
                
            if len(indexList) != 1:
                print("ERROR: " + hapax + " found " + str(len(indexList)) + " times in " + book + " " + key)
                unfinishedHapaxes.append(hapax)
                unfinishedHapaxKeys.append(key)
            else:
                numHapaxes -= 1
                wordIndex = indexList[0]
                if tagList[wordIndex] == 'w':
                    tagList[wordIndex] = 'h'
                elif tagList[wordIndex] == 'k':
                    tagList[wordIndex] = 'hk'
                elif tagList [wordIndex] == 'q':
                    tagList[wordIndex] = 'hq'
                else:
                    print(tagList[wordIndex]);


    if len(unfinishedHapaxes) != 0:
        errorString = "ERROR: " + book + " has " + str(len(unfinishedHapaxes)) + " hapaxes left:\n"
        print(errorString)
        for i in range(len(unfinishedHapaxes)):
            errorString += unfinishedHapaxes[i] + " at " + unfinishedHapaxKeys[i] + "\n"
            

    return (unfinishedHapaxes == [])


def markHapaxes(book):
    processedFile = open(textFolder + book + '.txt', 'r', encoding = 'utf-8')
    processedLines = processedFile.readlines()
    processedFile.close()


    hapaxDict = getRelevantHapaxes(book)

    currentChapter = 0
    currentVerse = 0
    currentAddress = ""
    currentVerseWords = {}
    currentVerseTags = {}
    for line in processedLines:
        if line.startswith('<C>'):
            currentChapter = int(line[3:-5])
        elif line.startswith('<V>'):
            currentVerse = int(line[3:-5])
            currentAddress = str(currentChapter) + ':' + str(currentVerse)
            currentVerseWords[currentAddress] = []
            currentVerseTags[currentAddress] = []

        elif line.strip() == "<samekh/>":
            currentVerseWords[currentAddress].append('ס')
            currentVerseTags[currentAddress].append('s')
        elif line.strip() == "<pe/>":
            currentVerseWords[currentAddress].append('פ')
            currentVerseTags[currentAddress].append('p')
        else:
            tag = line[1]
            thisWord = getWordFromLine(line)
            
            currentVerseWords[currentAddress].append(thisWord)
            currentVerseTags[currentAddress].append(tag)

    hapaxesWorked = checkHapaxes(hapaxDict, currentVerseWords, currentVerseTags, book)

    if (not hapaxesWorked):
        print("ERROR: " + book + " hapaxes not marked correctly")

    allVerseList = currentVerseWords.keys()
    writeToFileChapter = 0

    reprocessedFile = open(textFolder + book + '.txt', 'w', encoding = 'utf-8')

    for key in allVerseList:
        address = key.split(':')
        chapter = int(address[0])
        verse = int(address[1])

        if chapter != writeToFileChapter:
            reprocessedFile.writelines('<C>' + str(chapter) + '</C>\n')
        writeToFileChapter = chapter

        reprocessedFile.writelines('<V>' + str(verse) + '</V>\n')
        for i in range(len(currentVerseWords[key])):
            word = currentVerseWords[key][i]

            if word == "<pe/>" or word == "<samekh/>":
                print(word)
                reprocessedFile.writelines(word + '\n')
                continue
            
            else:
                tag1 = "<" + currentVerseTags[key][i] + ">"
                tag2 = "</" + currentVerseTags[key][i] + ">"

                newLine = tag1 + word + tag2

                newLine = newLine.replace(('׃' + tag2), (tag2 + '׃'))

                reprocessedFile.writelines(newLine + '\n')

def redoBook(book):
    processBook(book)
    markHapaxes(book)
         
for book in allOTBookListPsalmsNormal:
    redoBook(book)

    

