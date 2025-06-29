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



grid = [
    [1, 1, 0, 0, 0],
    [1, 0, 0, 1, 1],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0]
]

s = Solution()
print(s.numDistinctIslands(grid))  # Output: 2