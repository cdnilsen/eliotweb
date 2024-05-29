

def gravesToAcutes(word):
    graves = "ἊἂᾊᾂἚἒἪἢᾚᾒἺἲὊὂὛὒὪὢᾪᾢἋἃᾋᾃἛἓἫἣᾛᾓἻἳὋὃὛὓὫὣᾫᾣᾺὰᾲῈὲῊὴῂὶῚῸὸῪὺῺὼῲ"
    acutes = "ἌἄᾌᾄἜἔἬἤᾜᾔἼἴὌὄὝὔὬὤᾬᾤἍἅᾍᾅἝἕἭἥᾝᾕἽἵὍὅὝὕὭὥᾭᾥΆάᾴΈέΉήῄίΊΌόΎύΏώῴ"
    for i in range(len(graves)):
        word = word.replace(graves[i], acutes[i])
    return word.lower()
        
def stripWord(word):
    punctuation = ".,;·()"
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

getCountDict('allGreekText.txt', 'concordanceCount.txt')
    