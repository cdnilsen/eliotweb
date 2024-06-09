greekLines = open("./greekfinal.txt", 'r', encoding='utf8').readlines()

for line in greekLines:
    if "color:blue" in line and "<span" not in line:
        print(line)