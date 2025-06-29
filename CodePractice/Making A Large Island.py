'''
题意：
给定一个只有 0 和 1 的 n x n 的 grid，你最多只能把一个 0 改成 1，
求修改之后最大的岛屿面积是多少。岛屿定义为上下左右相连的 1。
'''


def markIsland(A):
    if not A or not A[0]: return -1
    N, M = len(A), len(A[0])
    def dfs(x, y, v):
        if not (0<=x<N and 0<=y<M) or (x, y) in v: return
        if A[x][y]:
            S[0] += 1
            v.add((x, y))
            dfs(x+1, y, v)
            dfs(x, y+1, v)
            dfs(x-1, y, v)
            dfs(x, y-1, v)

    def dfs2(x, y, v):
        if not (0<=x<N and 0<=y<M) or (x, y) in v: return
        if A[x][y]:
            A[x][y] = (S[0], ind[0])
            v.add((x, y))
            dfs2(x + 1, y, v)
            dfs2(x, y + 1, v)
            dfs2(x - 1, y, v)
            dfs2(x, y - 1, v)

    v = set()
    S = [0]
    ind = [0]
    for i in range(N):
        for j in range(M):
            if (i, j) in v:
                continue
            if A[i][j]:
                v.add((i, j))
                dfs(i, j, set())
                dfs2(i, j, set())
                S[0] = 0
                ind[0] += 1

def largestIsland(A):
    if not A or not A[0]: return -1
    N, M = len(A), len(A[0])
    markIsland(A)
    # print(A)
    v = set()
    mx = 0
    for i in range(N):
        for j in range(M):
            if A[i][j]:
                mx = max(mx, A[i][j][0])

    for i in range(N):
        for j in range(M):
            if (i, j) in v:
                continue
            if not A[i][j]:
                cur = 0
                lsland = set()
                v.add((i, j))
                if i+1<N and A[i+1][j]:
                    if A[i+1][j] not in lsland:
                        lsland.add(A[i+1][j])
                        cur += A[i+1][j][0]
                if j+1<M and A[i][j+1]:
                    if A[i][j+1] not in lsland:
                        lsland.add(A[i][j+1])
                        cur += A[i][j+1][0]
                if i>0 and A[i-1][j] :
                    if A[i-1][j] not in lsland:
                        lsland.add(A[i-1][j])
                        cur += A[i-1][j][0]
                if j>0 and A[i][j-1]:
                    if A[i][j-1] not in lsland:
                        lsland.add(A[i][j-1])
                        cur += A[i][j-1][0]

                mx = max(mx, cur+1)

    return mx

def largestIsland2(grid):
    from collections import defaultdict

    if not grid or not grid[0]:
        return 0

    N = len(grid)
    island_id = 2  # 从2开始编号，避免与1混淆
    island_area = defaultdict(int)

    def dfs(x, y, id):
        if 0 <= x < N and 0 <= y < N and grid[x][y] == 1:
            grid[x][y] = id
            area = 1
            for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                area += dfs(x+dx, y+dy, id)
            return area
        return 0

    # 1. 染色所有岛屿并记录每块岛屿的面积
    for i in range(N):
        for j in range(N):
            if grid[i][j] == 1:
                area = dfs(i, j, island_id)
                island_area[island_id] = area
                island_id += 1

    # 2. 尝试将每个 0 改为 1，并计算最大面积
    max_area = max(island_area.values() or [0])  # island_area.value() is None; 全 0 情况
    for i in range(N):
        for j in range(N):
            if grid[i][j] == 0:
                seen = set()
                area = 1
                for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                    ni, nj = i + dx, j + dy
                    if 0 <= ni < N and 0 <= nj < N and grid[ni][nj] > 1:
                        island = grid[ni][nj]
                        if island not in seen:
                            seen.add(island)
                            area += island_area[island]
                max_area = max(max_area, area)

    return max_area

def largestIsland_BFS(A):
    pass

def largestIsland_UF(A):
    pass

print(largestIsland([[1,0],[0,1]]))                     # Expected: 3
print(largestIsland([[1,1],[1,0]]))                     # Expected: 4
print(largestIsland([[1,1],[1,1]]))                     # Expected: 4
print(largestIsland([[1,0,1,0],
                     [0,1,1,0],
                     [1,0,0,1],
                     [0,1,1,0]]))            # Expected: 7
print(largestIsland([[1, 1, 1],
                     [1, 1, 1],
                     [0, 1, 0]]))            # Expected: 8
print(largestIsland([[1, 0, 1, 0, 0],
                    [1, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [0, 0, 1, 1, 1],
                    [0, 0, 0, 1, 1]]))          # Expected: 14
print(largestIsland([[1, 0, 0, 1, 0, 0],
                     [0, 0, 0, 1, 1, 1],
                     [0, 0, 1, 1, 1, 0],
                     [1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1],
                     [1, 0, 1, 1, 0, 1]]))          # Expected: 22


print(largestIsland2([[1,0],[0,1]]))                     # Expected: 3
print(largestIsland2([[1,1],[1,0]]))                     # Expected: 4
print(largestIsland2([[1,1],[1,1]]))                     # Expected: 4
print(largestIsland2([[1,0,1,0],
                     [0,1,1,0],
                     [1,0,0,1],
                     [0,1,1,0]]))            # Expected: 7
print(largestIsland2([[1, 1, 1],
                     [1, 1, 1],
                     [0, 1, 0]]))            # Expected: 8
print(largestIsland2([[1, 0, 1, 0, 0],
                    [1, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [0, 0, 1, 1, 1],
                    [0, 0, 0, 1, 1]]))          # Expected: 14
print(largestIsland2([[1, 0, 0, 1, 0, 0],
                     [0, 0, 0, 1, 1, 1],
                     [0, 0, 1, 1, 1, 0],
                     [1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1],
                     [1, 0, 1, 1, 0, 1]]))          # Expected: 22
