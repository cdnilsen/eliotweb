firstEdLines = open("./Psalms (prose).First Edition.txt", "r", encoding="utf-8")

firstEdSplitLines = firstEdLines.readlines()
allIntros = []
for line in firstEdSplitLines:
    splitLine = line.split(" ")
    if splitLine[0].split(".")[-1] == "0":
        allIntros.append(splitLine[0])


mayhewFile = open("./Psalms (prose).Mayhew.txt", "r")
mayhewSplitLines = mayhewFile.readlines()
allMayhewIntros = []
for line in mayhewSplitLines:
    splitLine = line.split(" ")
    if splitLine[0].split(".")[-1] == "0":
        allMayhewIntros.append(splitLine[0])

for i in range(len(allIntros)):
    if (allIntros[i] != allMayhewIntros[i]):
        print(allIntros[i] + "/" + allMayhewIntros[i])
        