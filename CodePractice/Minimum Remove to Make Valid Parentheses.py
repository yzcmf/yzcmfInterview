'''
给定一个字符串 s，只包含小写字母和括号 ()
要求：删除最少数量的括号，使得表达式合法（括号完全匹配）
'''

# 栈 + 集合记录要删除的 index; O(N) + O(N) extra space
def minRemoveToMakeValid(s):
    stack = []
    removeIndex = set()
    N = len(s)
    if N < 1: return s
    for i in range(N):
        if s[i] == ')':
            if not stack:
                stack.append((s[i], i))
                continue
            if stack[-1][0] == '(':
                stack.pop()
            else:
                removeIndex.add(i)
                removeIndex.add(stack.pop()[1])
        elif s[i] == '(':
            stack.append((s[i], i))
    while stack:
        removeIndex.add(stack.pop()[1])
    return ''.join(c for i, c in filter(lambda pair: pair[0] not in removeIndex, enumerate(s)))

# 双遍遍历，仅用字符串数组; No extra space
def minRemoveToMakeValid2(s):
    N = len(s)
    if N < 1: return s
    s = list(s)
    cnt = 0
    i = 0
    ind = 0
    while i < N:
        if s[i] == '(':
            cnt += 1
            s[ind] = s[i]
            ind += 1
        elif s[i] == ')':
            if cnt:
                cnt -= 1
                s[ind] = s[i]
                ind += 1
        else:
            s[ind] = s[i]
            ind += 1
        i += 1

    cnt = 0
    i = ind-1
    ind2 = ind-1
    while i > -1:
        if s[i] == ')':
            cnt += 1
            s[ind2] = s[i]
            ind2 -= 1
        elif s[i] == '(':
            if cnt:
                cnt -= 1
                s[ind2] = s[i]
                ind2 -= 1
        else:
            s[ind2] = s[i]
            ind2 -= 1
        i -= 1

    return ''.join(s[ind2+1:ind])

print(minRemoveToMakeValid("a)b(c)d"))       # ab(c)d
print(minRemoveToMakeValid("))(("))          # ""
print(minRemoveToMakeValid("lee(t(c)o)de)")) # "lee(t(c)o)de"
print(minRemoveToMakeValid("a((b(c)d)"))     # "a(b(c)d)"

print(minRemoveToMakeValid2("a)b(c)d"))       # ab(c)d
print(minRemoveToMakeValid2("))(("))          # ""
print(minRemoveToMakeValid2("lee(t(c)o)de)")) # "lee(t(c)o)de"
print(minRemoveToMakeValid2("a((b(c)d)"))     # "a(b(c)d)"


