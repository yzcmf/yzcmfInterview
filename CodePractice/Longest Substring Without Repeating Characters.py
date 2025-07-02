'''

Given a string s, find the length of the longest substring without duplicate characters.



Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.


Constraints:

0 <= s.length <= 5 * 104
s consists of English letters, digits, symbols and spaces.

'''
def lengthOfLongestSubstring(S: str) -> int:
    if not S: return 0
    N = len(S)
    res = 0
    l = r = 0
    d = {}
    for r in range(N):
        if S[r] in d:
            while l < r and S[r] in d:
                del d[S[l]]
                l += 1
        res = max(res, r - l + 1)
        d[S[r]] = 1
    return res


print(lengthOfLongestSubstring("abcabcbb")) # 3
print(lengthOfLongestSubstring("bbbbb")) # 1
print(lengthOfLongestSubstring("pwwkew")) # 3


'''
def lengthOfLongestSubstring(S: str) -> int:
    if not S: return 0
    N = len(S)
    res = 0
    l = r = 0
    d = {}
    for r in range(N):
        if S[r] in d:
            while l < r and S[r] in d:
                del d[S[l]]
                l += 1
        res = max(res, r - l + 1)
        d[S[r]] = 1
    return res
'''
