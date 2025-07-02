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



def lengthOfLongestSubstring(S: str) -> int:
    if not S: return 0
    N = len(S)
    res = 0
    l = r = 0
    d = {}
    for r in range(N):
        if S[r] in d and d[S[r]] >= l : # 对于 "abba"：遍历到第二个 b 时，S[r] in d 为真；move l 为 第一个b的index + 1
                l = d[S[r]] + 1
        res = max(res, r - l + 1)
        d[S[r]] = r
    return res

print('\n')
print(lengthOfLongestSubstring("abcabcbb")) # 3
print(lengthOfLongestSubstring("bbbbb")) # 1
print(lengthOfLongestSubstring("pwwkew")) # 3


# 字符范围从 ASCII 变成 Unicode 怎么优化; from 128 to 1,114,112
def lengthOfLongestSubstring(S: str) -> int:
    if not S: return 0
    N = len(S)
    res = 0
    l = r = 0
    d = set()
    for r in range(N):
        while S[r] in d: # 对于 "abba"：遍历到第二个 b 时，S[r] in d 为真；remove(S[l]) 直到跳过重复的 b；
            d.remove(S[l])
            l += 1
        res = max(res, r - l + 1)
        d.add(S[r])
    return res

print('\n')
print(lengthOfLongestSubstring("abcabcbb")) # 3
print(lengthOfLongestSubstring("bbbbb")) # 1
print(lengthOfLongestSubstring("pwwkew")) # 3


'''

✅ 基础模板类：LC 3 → 567 → 438 → 76

✅ 替换容错类：424 → 487 → 1004 → 2024

✅ 限定种类类：159 → 340 → 992

✅ 固定窗口类：1456 → 5671

✅ 前缀和混合类：930 → 862 → 1423

✅ 变形技巧类：1358 → 1234 → 1438

✅ 升级难度类：680 → 30 → 239


| 题号       | 标题                                                      | 分类     | 核心思路                      |
| -------- | ------------------------------------------------------- | ------ | ------------------------- |
| **3**    | Longest Substring Without Repeating Characters          | 基础模板类  | 滑窗 + `HashSet`，窗口内无重复字符   |
| **76**   | Minimum Window Substring                                | 基础模板类  | 双指针滑窗 + 频率映射 + 收缩窗口       |
| **567**  | Permutation in String                                   | 基础模板类  | 固定窗口 + `Counter`，滑窗频率比较   |
| **438**  | Find All Anagrams in a String                           | 基础模板类  | 滑窗 + 异位词频率统计，返回所有起点       |
| **424**  | Longest Repeating Character Replacement                 | 替换容错类  | 滑窗 + 最频字符统计 + 替换次数约束      |
| **487**  | Max Consecutive Ones II                                 | 替换容错类  | 滑窗容错 1 次，将 0 当作可翻转        |
| **1004** | Max Consecutive Ones III                                | 替换容错类  | 容错 K 次，滑窗控制翻转次数           |
| **2024** | Maximize the Confusion of an Exam                       | 替换容错类  | 滑窗替换 T 或 F，找最大一致区间        |
| **159**  | Longest Substring with At Most Two Distinct Characters  | 类别限制类  | 滑窗 + 哈希，维护 ≤ 2 个不同字符      |
| **340**  | Longest Substring with At Most K Distinct Characters    | 类别限制类  | 通解版，滑窗 + `Map` 限定种类 ≤ K   |
| **992**  | Subarrays with K Different Integers                     | 类别限制类  | 双滑窗：最多 K - 最多 (K-1) 的差值   |
| **1456** | Maximum Number of Vowels in a Substring of Given Length | 固定窗口类  | 固定大小滑窗 + 元音数统计            |
| **5671** | Minimum Swaps to Group All 1’s Together                 | 固定窗口类  | 固定窗口找最大 1 数量，最少替换         |
| **930**  | Binary Subarrays With Sum                               | 前缀和混合类 | 前缀和 + Hash 记录满足 sum=k 的数量 |
| **862**  | Shortest Subarray with Sum at Least K                   | 前缀和混合类 | 前缀和 + 单调队列找最短长度           |
| **1423** | Maximum Points You Can Obtain from Cards                | 前缀和混合类 | 总分 - 固定窗口内最小分数            |
| **1358** | Number of Substrings Containing All Three Characters    | 计数与变形类 | 滑窗统计满足包含 a,b,c 的子串数       |
| **1234** | Replace the Substring for Balanced String               | 计数与变形类 | 滑窗中非平衡字符 ≤ 替换字符数          |
| **1438** | Longest Continuous Subarray with Abs Diff ≤ Limit       | 计数与变形类 | 单调队列维护最大最小值之差             |
| **680**  | Valid Palindrome II                                     | 替换删除类  | 双指针 + 容错 1 次删除，回文判断       |
| **30**   | Substring with Concatenation of All Words               | 难度升级类  | 滑窗跳跃步长 + Hash 词频比较        |
| **239**  | Sliding Window Maximum                                  | 难度升级类  | 单调队列维护滑窗最大值，O(n)          |

'''