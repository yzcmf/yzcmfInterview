'''

                动态规划 (DP)
                   │
    ┌──────────────┼──────────────┐
线性DP        区间DP        背包DP (0/1/完全)
   │              │              │
状态压缩     树形DP        二维/分组背包
   │              │
数位DP       记忆化DFS
   │
区间优化 / 斜率优化（进阶）

'''

def concept2():
    '''
📘 动态规划八大类题型总结笔记

---

## ✅ 1. 背包问题（Knapsack Problems）

### 🍰 模板代码（0-1 背包）

```python
for i in range(1, len(items) + 1):
    for w in range(capacity, items[i-1].weight - 1, -1): # w=capacity only once;
        dp[w] = max(dp[w], dp[w - items[i-1].weight] + items[i-1].value)
```

### 🍰 模板代码（完全背包）

```python
for i in range(1, len(items) + 1):
    for w in range(items[i-1].weight, capacity + 1): # w=items[i-1].weight,  items[i-1].weight * 2, ... , items[i-1].weight * k
        dp[w] = max(dp[w], dp[w - items[i-1].weight] + items[i-1].value)
```

### 🍰 模板代码（多重背包）

```python
for i in range(len(items)):
    for k in range(1, count[i]+1):  # k time usage
        for w in range(capacity, items[i].weight * k - 1, -1):  # w=capacity only once;
            dp[w] = max(dp[w], dp[w - items[i].weight * k] + items[i].value * k)
```

### 🍰 模板代码（一维滚动数组）

```python
dp = [0] * (capacity + 1)
for item in items:
    for w in range(capacity, item.weight - 1, -1):
        dp[w] = max(dp[w], dp[w - item.weight] + item.value)
```

### 🍰 模板代码（组合数问题）

```python
dp = [0] * (amount + 1)
dp[0] = 1
for coin in coins:
    for i in range(coin, amount + 1):
        dp[i] += dp[i - coin]
```

### 📌 刷题路径

* Leetcode 416. 分割等和子集
* Leetcode 322. 零钱兑换
* Leetcode 518. 零钱兑换 II
* Leetcode 474. 一和零
* Leetcode 139. 单词拆分

---


## ✅ 2. 子序列 / 子数组类

### 🍰 模板代码（LIS）

```python
for i in range(len(nums)):
    for j in range(i):
        if nums[j] < nums[i]:
            dp[i] = max(dp[i], dp[j] + 1)
```

### 🍰 模板代码（LCS）

```python
for i in range(1, len(text1)+1):
    for j in range(1, len(text2)+1):
        if text1[i-1] == text2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

### 🍰 模板代码（最大子数组和）

```python
cur = res = nums[0]
for num in nums[1:]:
    cur = max(num, cur + num)
    res = max(res, cur)
```

### 🍰 模板代码（最长回文子序列）

```python
for l in range(2, n+1):
    for i in range(n-l+1):
        j = i+l-1
        if s[i] == s[j]:
            dp[i][j] = dp[i+1][j-1] + 2
        else:
            dp[i][j] = max(dp[i+1][j], dp[i][j-1])
```

### 🍰 模板代码（编辑距离）

```python
for i in range(1, m+1):
    for j in range(1, n+1):
        if word1[i-1] == word2[j-1]:
            dp[i][j] = dp[i-1][j-1]
        else:
            dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
```

### 📌 刷题路径

* Leetcode 300. 最长递增子序列
* Leetcode 1143. 最长公共子序列
* Leetcode 516. 最长回文子序列
* Leetcode 53. 最大子数组和
* Leetcode 72. 编辑距离

---

## ✅ 3. 区间 DP

### 🍰 模板代码（戳气球）

```python
for length in range(2, n+2):
    for left in range(0, n+2-length):
        right = left + length
        for i in range(left+1, right):
            dp[left][right] = max(dp[left][right],
                                   dp[left][i] + dp[i][right] + nums[left]*nums[i]*nums[right])
```

### 🍰 模板代码（矩阵链乘）

```python
for l in range(2, n+1):
    for i in range(n-l+1):
        j = i + l - 1
        for k in range(i, j):
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + cost(i,k,j))
```

### 🍰 模板代码（合并石子）

```python
for l in range(2, n+1):
    for i in range(n - l + 1):
        j = i + l - 1
        for k in range(i, j):
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j]) + sum[i][j]
```

### 📌 刷题路径

* Leetcode 312. 戳气球
* Leetcode 1000. 合并石头的最低成本
* Leetcode 664. 奇怪的打印机
* 洛谷 P1880 石子合并
* 洛谷 P1514 引水入城

---

## ✅ 4. 树形 DP

### 🍰 模板代码（树上最大权重独立集）

```python
def dfs(u, parent):
    for v in tree[u]:
        if v == parent: continue
        dfs(v, u)
        dp[u][0] += max(dp[v][0], dp[v][1])
        dp[u][1] += dp[v][0]
```

### 🍰 模板代码（树上路径最大和）

```python
def dfs(u, parent):
    for v in tree[u]:
        if v == parent: continue
        dfs(v, u)
        dp[u] = max(dp[u], dp[v] + weight(u,v))
```

### 🍰 模板代码（树上背包）

```python
def dfs(u):
    for v in tree[u]:
        dfs(v)
        for j in range(m, -1, -1):
            for k in range(0, j+1):
                dp[u][j] = max(dp[u][j], dp[u][j-k] + dp[v][k])
```

### 📌 刷题路径

* 洛谷 P2016 战略游戏
* AcWing 285 没有上司的舞会
* Leetcode 337. 打家劫舍 III
* 洛谷 P1273 有线电视网
* AcWing 95 费解的开关

---

## ✅ 5. 状态压缩 DP

### 🍰 模板代码（旅行商 TSP）

```python
for s in range(1 << n):
    for u in range(n):
        if not (s >> u) & 1: continue
        for v in range(n):
            if (s >> v) & 1: continue
            dp[s | (1<<v)][v] = min(dp[s | (1<<v)][v], dp[s][u] + dist[u][v])
```

### 🍰 模板代码（染色方案）

```python
for mask in range(1 << n):
    for color in range(k):
        for i in range(n):
            if mask & (1 << i): continue
            dp[mask | (1<<i)] += dp[mask]
```

### 🍰 模板代码（集合划分）

```python
for mask in range(1 << n):
    for subset in get_subsets(mask):
        dp[mask] = min(dp[mask], dp[mask ^ subset] + cost[subset])
```

### 📌 刷题路径

* Leetcode 847. 访问所有节点的最短路径
* Leetcode 691. 贴纸拼词
* AcWing 91 扩展欧拉定理
* 洛谷 P1896 小Z的袜子
* AtCoder DP V题集

---

### ✅ 6. **树形 DP（Tree DP）**

**核心思想**：在树上自底向上/自顶向下递归处理状态。

| 类型     | 典型问题            |
| ------ | --------------- |
| 树上打家劫舍 | 337. 打家劫舍 III   |
| 树路径和   | 124. 二叉树中的最大路径和 |
| 树上资源调度 | 979. 分发硬币       |

---

### ✅ 7. **记忆化搜索 / DFS + Memo**

**核心思想**：用 DFS 遍历 + 缓存重复子问题。

| 类型       | 典型问题                    |
| -------- | ----------------------- |
| 记忆化路径数目  | 62. 不同路径数               |
| 图/树记忆化走法 | 329. 矩阵中最长递增路径          |
| 交错字符串判断  | 97. Interleaving String |


### ✅ 8. **计数类 DP（排列 / 组合 / 路径）**

**核心思想**：某目标下方案数多少，通常和背包、子序列有关。

| 类型    | 典型问题                       |
| ----- | -------------------------- |
| 走法计数  | 62. Unique Paths           |
| 排列计数  | 70. Climbing Stairs        |
| 子序列计数 | 115. Distinct Subsequences |
| 字符组合数 | 96. 不同的二叉搜索树（Catalan 数）    |


    '''
    pass

def concept1():
    '''
    ### ✅ 1. **背包问题（Knapsack Problems）**

**核心思想**：选不选、装不装、取舍最优。

| 类型      | 特征说明          | 常见题目         |
| ------- | ------------- | ------------ |
| 0-1 背包  | 每个物品只能选一次     | 416. 分割等和子集  |
| 完全背包    | 每个物品可以无限选     | 322. 零钱兑换    |
| 多重背包    | 每个物品最多选 k 次   | 518. 零钱兑换 II |
| 二维/多维背包 | 限制多个维度（体积、重量） | 474. 一和零     |
| 分组背包    | 每组选一个         | -            |

---

### ✅ 2. **子序列 / 子数组类**

**核心思想**：比较和选择最优子结构。

| 类型           | 典型问题                                        |
| ------------ | ------------------------------------------- |
| 最长公共子序列 LCS  | 1143. Longest Common Subsequence            |
| 最长递增子序列 LIS  | 300. Longest Increasing Subsequence         |
| 最大子数组和       | 53. Maximum Subarray                        |
| 最长回文子串 / 子序列 | 5. Longest Palindromic Substring / 516. LPS |

---

### ✅ 3. **区间型 DP（Interval DP）**

**核心思想**：枚举区间分割点，组合子区间。

| 类型     | 典型问题                     |
| ------ | ------------------------ |
| 区间合并   | 312. 戳气球（Burst Balloons） |
| 区间切割   | 1000. 合并石头的最低成本（K段合并）    |
| 区间三角划分 | 1039. 多边形三角形化最小得分        |

---

### ✅ 4. **划分型 DP（切割 / 分段）**

**核心思想**：将字符串或数组切割为若干段的最优方式。

| 类型       | 典型问题                         |
| -------- | ---------------------------- |
| 字符串切割    | 139. Word Break              |
| 回文切割     | 132. 最少回文切割次数                |
| 所有回文切割方案 | 131. Palindrome Partitioning |

---

### ✅ 5. **状态压缩 DP（Bitmask DP）**

**核心思想**：用二进制掩码压缩状态空间（一般用于排列 / 子集问题）。

| 类型             | 典型问题                  |
| -------------- | --------------------- |
| 子集选择           | 698. 拆分为 k 个等和子集      |
| 最短 Hamilton 路径 | 847. 访问所有节点的最短路径（TSP） |
| 子集构造           | 691. 用最少的贴纸拼出单词       |

---

### ✅ 6. **树形 DP（Tree DP）**

**核心思想**：在树上自底向上/自顶向下递归处理状态。

| 类型     | 典型问题            |
| ------ | --------------- |
| 树上打家劫舍 | 337. 打家劫舍 III   |
| 树路径和   | 124. 二叉树中的最大路径和 |
| 树上资源调度 | 979. 分发硬币       |

---

### ✅ 7. **记忆化搜索 / DFS + Memo**

**核心思想**：用 DFS 遍历 + 缓存重复子问题。

| 类型       | 典型问题                    |
| -------- | ----------------------- |
| 记忆化路径数目  | 62. 不同路径数               |
| 图/树记忆化走法 | 329. 矩阵中最长递增路径          |
| 交错字符串判断  | 97. Interleaving String |


### ✅ 8. **计数类 DP（排列 / 组合 / 路径）**

**核心思想**：某目标下方案数多少，通常和背包、子序列有关。

| 类型    | 典型问题                       |
| ----- | -------------------------- |
| 走法计数  | 62. Unique Paths           |
| 排列计数  | 70. Climbing Stairs        |
| 子序列计数 | 115. Distinct Subsequences |
| 字符组合数 | 96. 不同的二叉搜索树（Catalan 数）    |
    '''
    pass


