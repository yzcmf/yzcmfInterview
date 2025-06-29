'''
给定一个二维 grid（只有 0 和 1），返回其中不同形状的岛屿数量。
两个岛屿的形状相同，必须在平移后完全重合（旋转或翻转不算相同）。
'''

from typing import List

class Solution:
    def numDistinctIslands(self, A: List[List[int]]) -> int:
        if not A or not A[0]: return 0
        N, M = len(A), len(A[0])
        res = set()
        def dfs(x, y, v, land):
            if not (0<=x<N and 0<=y<M) or (x, y) in v or not A[x][y] : return ""
            v.add((x, y))
            land += dfs(x+1, y, v, 'D')
            land += dfs(x, y+1, v, 'R')
            land += dfs(x, y-1, v, 'L')
            land += dfs(x-1, y, v, 'U')
            # land += 'B' # no need to add in this example
            return land

        seen = set()
        for i in range(N):
            for j in range(M):
                if (i, j) in seen or not A[i][j]:
                    continue
                cur = dfs(i, j, seen, 'O')
                print((i,j), cur)
                res.add(cur)

        print(res)
        return len(res)

    def numDistinctIslands2(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]: return 0
        n, m = len(grid), len(grid[0])
        seen = set()
        shapes = set()

        def dfs(x, y, pos):
            if 0 <= x < n and 0 <= y < m and grid[x][y] == 1 and (x, y) not in seen:
                seen.add((x, y))
                pos.append((x, y))
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    dfs(x + dx, y + dy, pos)

        def normalize(shape):
            transforms = [[] for _ in range(8)]
            for x, y in shape:
                transforms[0].append((x, y))  # identity
                transforms[1].append((-x, y))  # reflect x
                transforms[2].append((x, -y))  # reflect y
                transforms[3].append((-x, -y))  # reflect x & y
                transforms[4].append((y, x))  # transpose
                transforms[5].append((-y, x))  # rotate 90
                transforms[6].append((y, -x))  # rotate -90
                transforms[7].append((-y, -x))  # rotate 180

            normalized = []
            for trans in transforms:
                trans.sort()
                base_x, base_y = trans[0]
                normalized.append(tuple((x - base_x, y - base_y) for x, y in trans))
            return min(normalized)

        for i in range(n):
            for j in range(m):
                if grid[i][j] == 1 and (i, j) not in seen:
                    shape = []
                    dfs(i, j, shape)
                    shape = normalize(shape)
                    shapes.add(shape)

        return len(shapes)


grid = [
    [1, 1, 0, 0, 0],
    [1, 0, 0, 1, 1],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0]
]

s = Solution()
print(s.numDistinctIslands(grid))  # Output: 2
print(s.numDistinctIslands2(grid))  # Output: 2

grid = [
    [1, 1, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0]
]
print(s.numDistinctIslands(grid))  # Output: 3
print(s.numDistinctIslands2(grid))  # Output: 2