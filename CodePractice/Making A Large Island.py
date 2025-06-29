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
