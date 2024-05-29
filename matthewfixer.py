file = open('./greekTextFiles/matthew1to9.txt', 'r', encoding='utf-8')

output = open('./greekTextFiles/matthew1to9Fixed.txt', 'w', encoding = 'utf-8')


counter = 0

for line in file.readlines():
    if line.startswith('1 '):
        counter += 1
        output.write("\n")
    if line.strip() != "":
        newLine = str(counter) + ":" + line

        output.write(newLine)