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

from collections import deque, defaultdict

# O(N²)	O(N²)
def largestIsland_BFS(grid):
    n = len(grid)
    island_id = 2
    island_area = defaultdict(int)

    # 1. BFS 标记每块岛屿的编号和面积
    def bfs(x, y, island_id):
        q = deque([(x, y)])
        grid[x][y] = island_id
        area = 1
        while q:
            i, j = q.popleft()
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                ni, nj = i + dx, j + dy
                if 0 <= ni < n and 0 <= nj < n and grid[ni][nj] == 1:
                    grid[ni][nj] = island_id
                    q.append((ni, nj))
                    area += 1
        return area

    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                island_area[island_id] = bfs(i, j, island_id)
                island_id += 1

    # 2. 遍历所有 0 点，试图连接周围不同岛屿
    max_area = max(island_area.values() or [0])
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 0:
                seen = set()
                area = 1
                for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                    ni, nj = i + dx, j + dy
                    if 0 <= ni < n and 0 <= nj < n:
                        id_ = grid[ni][nj]
                        if id_ > 1 and id_ not in seen:
                            seen.add(id_)
                            area += island_area[id_]
                max_area = max(max_area, area)

    return max_area


class UnionFind(object):
    def __init__(self, size):
        self.size = [1] * size
        self.parent = list(range(size))

    # x <- y
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return
        if self.size[px] < self.size[py]:
            px, py = py, px  # always attach smaller tree under larger
        self.size[px] += self.size[py]
        self.parent[py] = px

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def getSize(self, x):
        return self.size[self.find(x)]


# O(N²)	O(N²)
def largestIsland_UF(A):
    if not A or not A[0]: return 0
    N = len(A)
    island_area = {}

    uf = UnionFind(N*N)

    # 1. union 所有岛屿 1 to its ancestor as island_id
    for i in range(N):
        for j in range(N):
            if A[i][j] == 1:
                x = uf.find(i + N * j)
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    ni, nj = i + dx, j + dy
                    if 0 <= ni < N and 0 <= nj < N and A[ni][nj] == 1:
                        y = uf.find(ni + N * nj)
                        uf.union(x, y)
                        # uf.union(i + N * j, ni + N * nj)

    # 2. getsize or getarea from island_id
    for i in range(N):
        for j in range(N):
            if A[i][j] == 1:
                island_id = uf.find(i + N * j)
                if island_id not in island_area:
                    island_area[island_id] = uf.getSize(island_id)

    # 3. max_area
    max_area = max(island_area.values() or [0])

    # 4. mark 0 to 1 and find the max area
    for i in range(N):
        for j in range(N):
            if A[i][j] == 0:
                seen = set()
                area = 1
                for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                    ni, nj = i + dx, j + dy
                    if 0 <= ni < N and 0 <= nj < N:
                        id_ = uf.find(ni + N * nj)
                        if id_ not in seen:
                            seen.add(id_)
                            area += island_area.get(id_, 0)
                max_area = max(max_area, area)

    return max_area


print("\n------DFS-------- \n")
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

print("\n------DFS2-------- \n")
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

print("\n------BFS-------- \n")
print(largestIsland_BFS([[1,0],[0,1]]))                     # Expected: 3
print(largestIsland_BFS([[1,1],[1,0]]))                     # Expected: 4
print(largestIsland_BFS([[1,1],[1,1]]))                     # Expected: 4
print(largestIsland_BFS([[1,0,1,0],
                     [0,1,1,0],
                     [1,0,0,1],
                     [0,1,1,0]]))            # Expected: 7
print(largestIsland_BFS([[1, 1, 1],
                     [1, 1, 1],
                     [0, 1, 0]]))            # Expected: 8
print(largestIsland_BFS([[1, 0, 1, 0, 0],
                    [1, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [0, 0, 1, 1, 1],
                    [0, 0, 0, 1, 1]]))          # Expected: 14
print(largestIsland_BFS([[1, 0, 0, 1, 0, 0],
                     [0, 0, 0, 1, 1, 1],
                     [0, 0, 1, 1, 1, 0],
                     [1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1],
                     [1, 0, 1, 1, 0, 1]]))          # Expected: 22

print("\n------UF-------- \n")
print(largestIsland_UF([[1,0],[0,1]]))                     # Expected: 3
print(largestIsland_UF([[1,1],[1,0]]))                     # Expected: 4
print(largestIsland_UF([[1,1],[1,1]]))                     # Expected: 4
print(largestIsland_UF([[1,0,1,0],
                     [0,1,1,0],
                     [1,0,0,1],
                     [0,1,1,0]]))            # Expected: 7
print(largestIsland_UF([[1, 1, 1],
                     [1, 1, 1],
                     [0, 1, 0]]))            # Expected: 8
print(largestIsland_UF([[1, 0, 1, 0, 0],
                    [1, 1, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [0, 0, 1, 1, 1],
                    [0, 0, 0, 1, 1]]))          # Expected: 14
print(largestIsland_UF([[1, 0, 0, 1, 0, 0],
                     [0, 0, 0, 1, 1, 1],
                     [0, 0, 1, 1, 1, 0],
                     [1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1],
                     [1, 0, 1, 1, 0, 1]]))          # Expected: 22
