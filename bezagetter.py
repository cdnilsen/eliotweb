from bs4 import BeautifulSoup
import urllib3

chapNumbers = [28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22]
bookNames = [
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1_Corinthians",
    "2_Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1_Thessalonians",
    "2_Thessalonians",
    "1_Timothy",
    "2_Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1_Peter",
    "2_Peter",
    "1_John",
    "2_John",
    "3_John",
    "Jude",
    "Revelation"
]


bookToChapterNumDict = {}

for i in range(len(bookNames)):
    book = bookNames[i]
    chapters = chapNumbers[i]

    bookToChapterNumDict[book] = chapters

def getChapterURL(book, chapter):
    return "https://textus-receptus.com/wiki/" + book + "_" + str(chapter) + "_Greek_NT:_Beza%27s_Textus_Receptus_%281598%29"

def getChapterText(book, chapterNum):
    allDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    url = getChapterURL(book, chapterNum)

    http = urllib3.PoolManager()
    page = http.request('GET', url)
    soup = BeautifulSoup(page.data, "html.parser")
    allParagraphs = soup.find_all('p')

    textList = []

    for paragraph in allParagraphs:
        text = paragraph.get_text()
        if len(text) > 0 and text[0] in allDigits:
            isVerse = True
            hasDigits = True
            for digit in allDigits:
                if digit in text:
                    hasDigits = True
                if (digit + " ·" in text):
                    isVerse = False
            if isVerse and hasDigits and ("Urdu" not in text):
                textList.append(str(chapterNum) + ":" + text)
    
    return textList



def getBookText(book):
    numChapters = bookToChapterNumDict[book]
    bookText = open('./allGreekText.txt', 'a', encoding='utf-8')
    bookText.write("==" + book + "==")
    for i in range(1, numChapters + 1):
        allVerses = getChapterText(book, i)

        bookText.writelines(allVerses)

        print("Finished " + book + " " + str(i))


remainingList = [
    "1_Thessalonians",
    "2_Thessalonians",
    "1_Timothy",
    "2_Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1_Peter",
    "2_Peter",
    "1_John",
    "2_John",
    "3_John",
    "Jude",
    "Revelation"
]

for book in remainingList:
    getBookText(book)
