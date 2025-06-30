def hard():
    '''
    | 类别              | 核心知识点               | 模板与技巧                                | 示例题目（LeetCode编号）           |
| --------------- | ------------------- | ------------------------------------ | -------------------------- |
| 1. 动态规划（DP）     | 区间DP、状态压缩、记忆化搜索     | DP table 初始化 + 状态转移方程                | 312, 87, 10, 44, 72, 375   |
| 2. 图论 & 并查集     | 拓扑排序、Dijkstra、Floyd | visited\[], dfs/bfs, priority\_queue | 329, 743, 1462, 1245, 1192 |
| 3. 贪心 & 区间调度    | 区间覆盖、最早结束先选         | sort + greedy choice                 | 630, 1354, 1326, 402       |
| 4. 数学 & 数论      | 素数筛、快速幂、组合数、博弈论     | 欧几里得、逆元、Catalan                      | 1491, 517, 1359, 50        |
| 5. 单调栈 & 单调队列   | 找最大/最小值、滑动窗口        | Stack 维护单调性                          | 42, 84, 239, 402           |
| 6. 搜索 & 回溯 & 剪枝 | N皇后、数独、排列组合         | visited\[], 剪枝条件                     | 51, 37, 212, 996           |
| 7. 线段树 & 树状数组   | 区间修改/查询             | 自建 TreeNode/数组索引                     | 307, 315, 218, 327         |
| 8. 数据结构设计       | 堆、双向链表、LFU/LRU      | 哈希+堆、哈希+链表组合                         | 460, 588, 895, 432         |

好的，下面是对 LeetCode Hard 八大题型的**详细解释**，包含知识点概述、典型思路、模板技巧，以及适合刷的方向（用于刷题和面试准备）：

---

## 🧠 1. 动态规划（Dynamic Programming, DP）

### 🔍 核心概念：

通过“状态”表示子问题，用“转移方程”推导最终答案。Hard 题中常见 **区间DP、状态压缩DP、多维DP**。

### 💡 应用场景：

* 编辑距离（72）
* 正则匹配（10, 44）
* 猜数字代价最小（375）
* 区间最优（312 戳气球）

### 🧩 模板：

```python
# 二维DP模板
for i in range(n):
    for j in range(m):
        dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + cost[i][j]
```

---

## 🧠 2. 图论 & 并查集（Graph / Union-Find）

### 🔍 核心概念：

涉及节点/边的连通性、路径查找、图的拓扑结构。

### 💡 常见技巧：

* 拓扑排序（课程安排）
* DFS/BFS 遍历（岛屿问题）
* Dijkstra 最短路
* 并查集（连通块）

### 🧩 模板：

```python
# 并查集模板
parent = list(range(n))
def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]
def union(x, y):
    parent[find(x)] = find(y)
```

---

## 🧠 3. 贪心 & 区间调度（Greedy / Interval Scheduling）

### 🔍 核心概念：

局部最优推导全局最优，通常配合排序。Hard题中常考 **区间选择、堆优化**。

### 💡 应用场景：

* 最多选择课程（630）
* 最少水龙头灌溉（1326）
* 移除K位数字（402）

### 🧩 模板：

```python
# 区间按结束时间排序 + 贪心选择
intervals.sort(key=lambda x: x[1])
res, end = 0, -1
for s, e in intervals:
    if s >= end:
        end = e
        res += 1
```

---

## 🧠 4. 数学 & 数论（Math / Number Theory）

### 🔍 核心概念：

Hard题常涉及组合数学、模运算、位运算、数位DP、快速幂等。

### 💡 应用场景：

* 快速幂计算（50）
* 整数划分/排列（1359）
* 连续自然数和（829）

### 🧩 模板：

```python
# 快速幂（modular exponentiation）
def fast_pow(x, n, mod):
    res = 1
    while n:
        if n % 2: res = res * x % mod
        x = x * x % mod
        n //= 2
    return res
```

---

## 🧠 5. 单调栈 & 单调队列（Monotonic Stack / Queue）

### 🔍 核心概念：

用于求最大/最小值、滑动窗口内特定值，维护一个有序结构。

### 💡 应用场景：

* 接雨水（42）
* 最大矩形（84）
* 滑动窗口最大值（239）

### 🧩 模板：

```python
# 单调栈找每个元素左边第一个小于它的
stack = []
for i in range(n):
    while stack and heights[stack[-1]] >= heights[i]:
        stack.pop()
    left[i] = stack[-1] if stack else -1
    stack.append(i)
```

---

## 🧠 6. 搜索 & 回溯 & 剪枝（Search / Backtracking）

### 🔍 核心概念：

递归尝试所有可能 + 剪枝提高效率。Hard题中需配合记忆化、位运算优化。

### 💡 应用场景：

* N皇后（51）
* 解数独（37）
* 单词搜索 II（212）

### 🧩 模板：

```python
def backtrack(path):
    if is_solution(path):
        res.append(path[:])
        return
    for i in range(n):
        if valid(i):
            path.append(i)
            backtrack(path)
            path.pop()
```

---

## 🧠 7. 线段树 & 树状数组（Segment Tree / BIT）

### 🔍 核心概念：

处理 **区间查询 + 单点更新/区间更新**，面试中用于实现平衡/高效结构。

### 💡 应用场景：

* 计算逆序对（315）
* 天际线（218）
* 区间和（327）

### 🧩 模板：

```python
# 树状数组模板（1-indexed）
def update(i, delta):
    while i <= n:
        bit[i] += delta
        i += i & -i

def query(i):
    res = 0
    while i > 0:
        res += bit[i]
        i -= i & -i
    return res
```

---

## 🧠 8. 数据结构设计（Design）

### 🔍 核心概念：

设计一个支持多种操作的数据结构，兼顾时间复杂度和空间复杂度。

### 💡 应用场景：

* LRU/LFU 缓存（146, 460）
* 文件系统设计（588）
* 最大频率栈（895）

### 🧩 技巧：

* 哈希 + 堆
* 哈希 + 双向链表
* OrderedDict（Python）

---

## ✅ 下一步建议

你可以选择：

1. 为每一类我生成 5 道题目的解题讲解（带代码）？
2. 整理为 Notion 笔记 / Excel 刷题打卡表？
3. 出一个每周打卡路径图（8 周刷完 40 道 LeetCode Hard）？

回复你感兴趣的选项，我帮你定制生成！



    '''
    pass
