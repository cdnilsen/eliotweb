


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

def applyChange(word, changeTuple, oldDict, newDict):
    protoSegments = changeTuple[0]
    outcomes = changeTuple[1]
    reflex = word

    for i in range(len(protoSegments)):
        sourceSegment = protoSegments[i]
        outcome = outcomes[i]
        reflex = reflex.replace(sourceSegment, outcome)

    if reflex in newDict:
        for oldWord in oldDict[word]:
            newDict[reflex].append(oldWord)
    else:
        newDict[reflex] = oldDict[word]
    return reflex

def changeLexicon(lexicon, changeTupleList):
    dict = {}

    for protoWord in lexicon:
        dict[protoWord] = [protoWord]

    for changeTuple in changeTupleList:
        intermediateLexicon = list(dict.keys())
        newDict = {}
        for lemma in intermediateLexicon:
            applyChange(lemma, changeTuple, dict, newDict)
        dict = newDict

    return dict


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

#print(testLexicon)
modernDict = changeLexicon(headwordList, meskwakiHistory)

#print(modernDict)

allWords = list(modernDict.keys())


totalMergers = 0

mergeToWordDict = {}
for modernWord in allWords:
    numMergers = len(modernDict[modernWord])
    if numMergers > 1:
        totalMergers += numMergers - 1
    if numMergers in mergeToWordDict:
        mergeToWordDict[numMergers].append(modernWord)
    else:
        mergeToWordDict[numMergers] = [modernWord]

for mergeNumber in mergeToWordDict:
    print(str(mergeNumber) + ": " +  str(len(mergeToWordDict[mergeNumber])))
    if mergeNumber > 2:
        for word in mergeToWordDict[mergeNumber]:
            outputString = word.replace("#", "") + ": "
            for ancestor in modernDict[word]:
                outputString += "*" + ancestor.replace("#", "") + ", "
            print(outputString[0:-2])
        print(str(mergeNumber) + ": " + str(mergeToWordDict[mergeNumber]))