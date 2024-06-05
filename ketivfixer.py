import os
from pathlib import Path

textFolder = './Hebrew Raw Text/'

allFiles = os.listdir(textFolder)

def getFileData(fileName):
    filePath = textFolder + fileName

    fileData = Path(filePath).read_text(encoding='utf-8')

    return fileData


def fixKetivs(fileName):
    filePath = textFolder + fileName

    fileData = getFileData(fileName)

    newFileData = fileData.replace("</hk>\n<q>", "</hk><q>")

    with open(filePath, 'w', encoding='utf-8') as write_file:
        write_file.write(newFileData)

def findWeirdKetivs(fileName):
    filePath = textFolder + fileName

    fileData = Path(filePath).read_text(encoding='utf-8')

    if '</q>׃' in fileData:
        print("WOOPS")

def getLines(fileName):

    fileData = open(textFolder + fileName, 'r', encoding = 'utf-8')

    return fileData.readlines()

def createHTMLOld(fileName):
    lines = getLines(fileName)

    weirdLines = 0

    verse = ""
    allTags = ["w>", "h>", "q>", "V>", "hk>"]
    exemptLines = ["<p>פ</p>", "<s>ס</s>"]
    for line in lines:
        if line.startswith("<V>"):
            verse = line.replace("<V>", "").replace("</V>", "").strip()
        line = line.strip()
        originalLine = line
        line = line.split("{")[0]
        line = line.replace("</k><q>", "Ž")
        line = line.replace("</hk><q>", "Ŝ")
        splitLine = line.split("</")
        lineEnd = splitLine[1].strip()
        if lineEnd not in allTags and lineEnd.replace("׃", "") not in allTags and originalLine not in exemptLines:
            weirdLines += 1
            print(line + " (" + fileName.replace(".txt", "") + " " + verse + ")")

def getVerseJSON(verseNumString):
    chapter = verseNumString.split(":")[0]
    verse = verseNumString.split(":")[1]
    string = "{\n"

def getVerseNum(rawLine):
    return rawLine.replace("<V>", "").replace("</V>", "").strip()


def qereSpanLine(ketiv, qere, hapax, hasSofPasuk, hasMaqaf):
    spanClass = "K"
    if hapax:
        spanClass = "HK"
    string = "<span title='" + qere + "'><" + spanClass + ">" + ketiv + "</" + spanClass + "></span>"
    if hasSofPasuk:
        string = string + "׃"

    if not hasMaqaf and not hasSofPasuk:
        string = string + " "

    return string

def ketivOnlyLine(line):
    newLine = '<'
    hasSofPasuk = False
    ketivIsHapax = False
    if line[-1] == "׃":
        hasSofPasuk = True
        ketiv = ketiv.replace("׃", "")
    if line.startswith("<hk"):
        ketivIsHapax = True
        ketiv = line.split("</hk>")[0].replace("<hk>", "")
        newLine += 'HK">'

    else:
        ketiv = line.split("</k>")[0].replace("<k>", "")
        newLine += 'K">'

    newLine += ketiv

    endSpan = "<"
    if ketivIsHapax:
        endSpan += "/HK>"
    else:
        endSpan += "/K>"
    newLine += endSpan

    if ketiv[-1] == "־":
        return newLine
    elif hasSofPasuk:
        return newLine + "׃"
    else:
        return newLine + " "



def qereOnlyLine(line):
    hasSofPasuk = False
    
    line = line.replace("<q>", "").replace("</q>", "")
    hasMaqaf = line[-1] == "־"
    if line[-1] == "׃":
        line = line.replace("׃", "")
        hasSofPasuk = True

    line = '<Q>' + line + "</Q>"

    if hasSofPasuk:
        line += "׃"

    if not hasMaqaf:
        line += " "

    return line

def qereKetivLineHTML(line):
    hasSofPasuk = False
    qere = ""
    if "<q>" in line and ("<k>" in line or "<hk>" in line):
        qere = line.split("<q>")[1].replace("</q>", "")
    elif "<q>" in line:
        return qereOnlyLine(line)
    else:
        return ketivOnlyLine(line)

    if qere[-1] == "׃":
        hasSofPasuk = True
        qere = qere.replace("׃", "")

    ketivIsHapax = False
    ketiv = ""
    if line.startswith("<hk"):
        ketivIsHapax = True
        ketiv = line.split("</hk>")[0].replace("<hk>", "")
    else:
        ketiv = line.split("</k>")[0].replace("<k>", "")
    hasMaqaf = False

    if ketiv[-1] == "־":
        hasMaqaf = True

    return qereSpanLine(ketiv, qere, ketivIsHapax, hasSofPasuk, hasMaqaf)

def normalWordHTML(line):
    hasSofPasuk = False

    isHapax = line.startswith("<h>")

    line = line.replace("<w>", "").replace("</w>", "").replace("<h>", "").replace("</h>", "")

    hasMaqaf = False
    if line[-1] == "־":
        hasMaqaf = True
    if line[-1] == "׃":
        hasSofPasuk = True
        line = line.replace("׃", "")

    if isHapax:
        line = '<Ĥ>' + line + "</Ĥ>"

    if hasSofPasuk:
        line += "׃"
    elif not hasMaqaf:
        line += " "
    return line

def initialLineProcessing(line):
    if "{" in line:
        line = line.split("{")[0]

    return line.strip()

def samechPe(line):
    if line == "<p>פ</p>":
        return " <sup>פ</sup>"
    else:
        return " <sup>ס</sup>"

def createHTML(fileName):
    lines = getLines(fileName)

    verseTextDict = {}
    verseNums = []

    for line in lines:
        if line.startswith("<V>"):
            thisVerseNum = getVerseNum(line)
            verseTextDict[thisVerseNum] = ""
            verseNums.append(thisVerseNum)

    
    thisVerseNum = "1:1"
    thisVerseText = ""
    for line in lines:
        line = initialLineProcessing(line)
        if line.startswith("<V>") and line != "<V>1:1</V>":
            verseTextDict[thisVerseNum] = thisVerseText
            thisVerseNum = getVerseNum(line)
            thisVerseText = ""
        elif line.startswith("<w>") or line.startswith("<h>"):
            thisVerseText += normalWordHTML(line)
        elif line.startswith("<k>") or line.startswith("<hk>"):
            thisVerseText += qereKetivLineHTML(line)
        elif line.startswith("<s>") or line.startswith("<p>"):
            thisVerseText += samechPe(line)
        elif line == "<r>versednu</r>":
            thisVerseText += " ׆"
        elif line.startswith("<q>"):
            thisVerseText += qereOnlyLine(line)
        elif line != "<V>1:1</V>":
            print(line + " (" + fileName.replace(".txt", "") + " " + thisVerseNum + ")")

    htmlPath = './Hebrew HTML/' + fileName #fileName.replace(".txt", '.html')
    with open(htmlPath, 'w', encoding = 'utf-8') as newFile:
        newFile.write('<link rel="stylesheet" type="text/css" href="styles.css">\n<body>')
        for verse in verseNums:
            if verse not in verseTextDict:
                print(verse)
                print(fileName)
            else:
                newFile.write(verseTextDict[verse])
                newFile.write('<br>')
        newFile.write('</body>')

for file in allFiles:
    createHTML(file)
    