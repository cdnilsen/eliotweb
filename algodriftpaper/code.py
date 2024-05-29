
fileName = '../../PA Headwords (DO NOT CIRCULATE).txt'

file = open(fileName, 'r', encoding="utf-8")

headwordList = []

nasalClusters = ["mp", "nt", "nč", "nk", "nθ", "ns", "nš", "nl"]
hClusters = ["hp", "ht", "hč", "hk", "hθ", "hs", "hš", "hl"]
glottalClusters = ["xp", "ʔt", "ʔč", "xk", "ʔθ", "ʔs", "ʔš", "ʔl"]
singletons = ["p", "t", "č", "k", "θ", "s", "š", "l"]

for line in file.readlines():
    if line.startswith('\\pa'):
        splitLine = line.split(" ")
        headword = "#" + splitLine[1].strip() + "#"
        if headword[-2] == "-":
            headwordList.append(headword)


def countMergers(mergerDict, oldMergersNum, thisMergerNum, change):
    string = change[0][0] + " > " + change[1][0]
    mergerDict[string] = thisMergerNum
    return oldMergersNum + thisMergerNum

def applyChange(word, changeTuple):
    protoSegments = changeTuple[0]
    reflexes = changeTuple[1]
    outcome = word
    for i in range(len(protoSegments)):
        source = protoSegments[i]
        reflex = reflexes[i]
        outcome = outcome.replace(source, reflex)
    return outcome

def changeLexicon(lexicon, changeTuple, changeDict):
    newLexicon = {}
    lexiconWords = list(lexicon.keys())
    string = changeTuple[0][0] + " > " + changeTuple[1][0]

    if string not in changeDict:
        changeDict[string] = []

    reflexToAncestorDict = {}

    for word in lexiconWords:
        ancestors = lexicon[word]
        reflex = applyChange(word, changeTuple)
        reflexSame = (reflex == word)
        if not reflexSame:
            if reflex not in reflexToAncestorDict:
                reflexToAncestorDict[reflex] = [word]
            else:
                reflexToAncestorDict[reflex].append(word)
            print(word + " > " + reflex + "(" + string + ")")
            print(str(reflexToAncestorDict[reflex]) + "\n")
           
                
        if reflex not in newLexicon:
            newLexicon[reflex] = ancestors
                
        else:
            for ancestor in ancestors:  
                if ancestor not in newLexicon[reflex]:
                    newLexicon[reflex].append(ancestor)
            
    allReflexes = list(reflexToAncestorDict.keys())

    for reflex in allReflexes:
        if len(reflexToAncestorDict[reflex]) > 1:
            mergeString = ""
            for ancestor in reflexToAncestorDict[reflex]:
                mergeString += ancestor + ", "
            mergeString = mergeString[0:-2] + " > " + reflex
            print(mergeString)
            changeDict[string].append(mergeString)           
    return newLexicon

def applyHistoricalPhonology(lexicon, changes, changeDict):
    newLexicon = lexicon

    for change in changes:
        newLexicon = changeLexicon(newLexicon, change, changeDict)

    return newLexicon

def findMergers(lexicon, changes):
    changeDict = {}
    outputLexicon = applyHistoricalPhonology(lexicon, changes, changeDict)

    allReflexes = list(outputLexicon.keys())

    numMergers = 0

    for reflex in allReflexes:
        if len(outputLexicon[reflex]) > 1:            
            numMergers += len(outputLexicon[reflex]) - 1
            outputString = reflex.replace("#", "") + ": "
            for ancestor in outputLexicon[reflex]:
                outputString += ancestor.replace("#", "") + ", "
            #print(outputString[0:-2])
    
    for change in changes:
        changeString = change[0][0] + " > " + change[1][0]
        print(str(len(changeDict[changeString])) + " mergers from " + changeString + ":")
        for mergeString in changeDict[changeString]:
            print(mergeString.replace("#", ""))
        print("\n")
    print(str(numMergers) + " mergers total")

testLexicon = {}
for word in headwordList:
    testLexicon[word] = [word]


unmergedWeList = ["-we", "#we", "hwe"]
mergedWeList = ["-o", "#o", "ho"]

for consonant in singletons:
    unmergedWeList.append(consonant + "we")
    mergedWeList.append(consonant + "o")

meskwakiHistory = [
    (["ʷ"], ["w"]),
    (["ewe"], ["o·"]),
    (["e·"], ["ē"]),
    (unmergedWeList, mergedWeList),
    (["ti", "ty"], ["či", "čy"]),
    (["šy", "čy"], ["š", "č"]),
    (["yi"], ["i"]),
    (["#e"], ["#i"]),
    (["ē"], ["e·"]),
    (["nθ"], ["nt"]),
    (["θk", "θp"], ["hk", "hp"]),
    (["šp"], ["hp"]),
    (["θ"], ["l"]),
    (nasalClusters, singletons),
    (glottalClusters, hClusters),
    (["hl"], ["hs"]),
    (["hš", "hs"], ["š", "s"]),
    (["ç"], ["š"]),
    (["l"], ["n"]),
    (["ʔm"], ["p"])
]

testHistory = [
    (["ʷ"], ["w"]),
    (["ewe"], ["o·"]),
    (["e·"], ["ē"]),
    (unmergedWeList, mergedWeList),
    (["ē"], ["e·"]),
    (["ti", "ty"], ["či", "čy"]),
    (["θ"], ["l"]),
    (["ʔ", "x"], ["h", "h"]),
    (["hl"], ["hs"]),
    (nasalClusters, singletons),

]
findMergers(testLexicon, meskwakiHistory)



arapahoHistory = [
    (["ti"], ["či"]),
    (["ty"], ["čy"]),
    (["θk", "θp"], ["šk", "šp"]),
    (["ʔθ", "hθ", "nθ"], ["ʔš", "hš", "nš"]),
    (nasalClusters, glottalClusters),
    (["x"], ["ʔ"]),
    (["o·"], ["i·"]),
    (["o"], ["i"]),
    (["#we"], ["#i"]),
    (["#s"], ["#n"]),
    (hClusters, singletons),
    (["l"], ["n"]),
    (["kʷ"], ["w"]),
    (["k"], [""]),
    (["p"], ["k"]),
    (["w"], ["y"]),
    (["#y", "ay", "ey", "iy", "·y", "-y"], ["#n", "an", "en", "in", "·n", "-n"]),
    (["č"], ["θ"]),
    (["a"], ["o"]),
    (["me", "mi", "my"], ["be", "bi", "b"]),
    (["mo"], ["wo"]),
    
]
