

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
    NTLines = open("./allGreekText.txt", "r", encoding="utf-8").readlines()

    allVerseDict = {}
    currentBook = ""
    for line in NTLines:
        line = line.strip()
        if line.startswith("=="):
            currentBook = line.replace("==", "")
        elif len(line) > 0:
            splitLine = line.split(" ")
            allVerseDict[currentBook + " " + splitLine[0]] = " ".join(splitLine[1:])
    return allVerseDict

hapaxDict = getHapaxes()

hapaxList = list(hapaxDict.keys())
verseDict = getVerseDict()

hapaxesNotPresent = 0
print(hapaxList[0])
print(hapaxDict[hapaxList[0]])
for hapax in hapaxList:
    thisHapaxVerse = hapaxDict[hapax]
    if hapax not in verseDict[thisHapaxVerse]:
        print(hapax)
        print(thisHapaxVerse)
        hapaxesNotPresent += 1

print(str(hapaxesNotPresent) + " hapaxes not in the text")    