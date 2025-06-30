# 将单词进行左右对齐，填充空格，每行正好 maxWidth 长度。

def fullJustify(words, maxWidth):
    L = 0
    N = len(words)
    for word in words:
        L += len(word)
    res = []
    cur = []
    tlw = 0
    for word in words:
        lw, lc = len(word), len(cur)
        if  lw + tlw + lc <= maxWidth:
            # print('@@@@ ' + word)
            cur.append(word)
            tlw += lw
        else:
            if lc == 1:
                # print('!!!! ' + word)
                res.append(cur[0] + (maxWidth - tlw) * ' ')
                cur = [word]
                tlw = lw
                continue

            # print('---- ' + word)
            sl, rl = (maxWidth - tlw) // (lc-1), (maxWidth - tlw) % (lc-1)
            line = ''
            for w in cur:
                if rl:
                    line += w + (sl + 1) * ' '
                    rl -=1
                    lc -= 1
                else:
                    if lc > 1:
                        line += w + sl * ' '
                        lc -= 1
                    else:
                        line += w
            res.append(line)
            cur = [word]
            tlw = lw

    last_line = ' '.join(cur)
    res.append(last_line + ' ' * (maxWidth - len(last_line)))
    return res

words = ["This", "is", "an", "example", "of", "text", "justification."]
maxWidth = 16
res = fullJustify(words, maxWidth)
for line in res:
    print(f"'{line}'")

# Output:
# 'This    is    an'
# 'example  of text'
# 'justification.  '

words = ["What", "must", "be", "acknowledgment", "shall", "be"]
maxWidth = 16
res = fullJustify(words, maxWidth)
for line in res:
    print(f"'{line}'")

# Output:
# [
#  "What   must   be",
#  "acknowledgment  ",
#  "shall be        "
# ]