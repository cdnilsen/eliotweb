import os

bookName = input("Name of book to thread: ")

firstEditionExists = os.path.isfile('./texts/' + bookName + ".First Edition.txt")
secondEditionExists = os.path.isfile('./texts/' + bookName + ".Second Edition.txt")
kjvExists = os.path.isfile('./texts/' + bookName + ".KJV.txt")
mayhewExists = os.path.isfile('./texts/' + bookName + ".Mayhew.txt")

allPaths = []

pathToLetterDict = {}

if firstEditionExists:
    path = './texts/' + bookName + ".First Edition.txt"
    allPaths.append(path)
    pathToLetterDict[path] = "α"
    
if secondEditionExists:
    path = './texts/' + bookName + ".Second Edition.txt"
    allPaths.append(path)
    pathToLetterDict[path] = "β"
if kjvExists:
    path = './texts/' + bookName + ".KJV.txt"
    allPaths.append(path)
    pathToLetterDict[path] = "E"
if mayhewExists:
    path = './texts/' + bookName + ".Mayhew.txt"
    allPaths.append(path)
    pathToLetterDict[path] = "M"

if len(allPaths) == 0:
    print("No texts found for " + bookName)
else:
    outputFile = open('./output.txt', 'w', encoding='utf-8')
    pathToLineDict = {}


    for path in allPaths:
        pathToLineDict[path] = []
        with open(path, 'r', encoding='utf-8') as file:
            for line in file:
                finalLine = pathToLetterDict[path] + "." + line
                pathToLineDict[path].append(finalLine)
    for i in range(len(pathToLineDict[allPaths[0]])):
        for path in allPaths:
            outputFile.write(pathToLineDict[path][i])
        outputFile.write("\n")