kjvFile = open("./Psalms (prose) 2.KJV.txt", "r")

kjvSplitLines = kjvFile.readlines()
allIntros = []
for line in kjvSplitLines:
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
        