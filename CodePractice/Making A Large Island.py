'''
题意：
给定一个只有 0 和 1 的 n x n 的 grid，你最多只能把一个 0 改成 1，
求修改之后最大的岛屿面积是多少。岛屿定义为上下左右相连的 1。
'''


def largestIsland(A):
    if not A or not A[0]: return -1
    N, M = len(A), len(A[0])






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
