class TreeNode(object):
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

def builder(A):
    if not A: return None
    root = TreeNode(A[0])
    q = [root]
    i = 1
    while q:
        for _ in range(len(q)):
            node = q.pop(0)

            if A[i] is not None:
                node.left = TreeNode(A[i])
                q.append(node.left)
            i += 1
            if i == len(A): return root

            if A[i] is not None:
                node.right = TreeNode(A[i])
                q.append(node.right)
            i += 1
            if i == len(A): return root

    return root


def getChild(root, val):
    if not root: return
    if root.val == val:
        return root
    return getChild(root.left, val) or getChild(root.right, val)


# get one-side root-node path
def getPath(root, node, path):
    if not root: return False
    if root == node: return True
    # if getPath(root.left, node, path[:] + [root]) or getPath(root.right, node, path[:] + [root]):
    #     return path[:] + [root]
    # else:
    #     return []
    path.append(root.val)
    if getPath(root.left, node, path) or getPath(root.right, node, path):
        return True
    path.pop()
    return False

# get one-side root-node path's number of node
def getPathNodeNumber(root, node):
    if not root: return -1
    if root == node: return 0
    lc = getPathNodeNumber(root.left, node)
    rc = getPathNodeNumber(root.right, node)
    return -1 if lc == -1 and rc == -1 else 1 + max(lc, rc)


def getLCA(r, p1, p2):
    if not r or r == p1 or r == p2: return r
    left = getLCA(r.left, p1, p2)
    right = getLCA(r.right, p1, p2)
    if left and right: return r
    return left if left else right

# M1 -- diameter = rp1 + rp2 - rlca * 2; M2 -- diameter = lcap1 + lcap2
def BinaryTreeDiameter(root, p1, p2):
    lca = getLCA(root, p1, p2)

    # rp1 = getPath(root, p1, [])
    # rp2 = getPath(root, p2, [])
    rlca, lcap1P, lcap2P = [], [], []
    getPath(root, lca, rlca)
    getPath(lca, p1, lcap1P)
    getPath(lca, p2, lcap2P)

    rp1 = getPathNodeNumber(root, p1)
    rp2 = getPathNodeNumber(root, p2)
    rlca = getPathNodeNumber(root, lca)

    lcap1 = getPathNodeNumber(lca, p1)
    lcap2 = getPathNodeNumber(lca, p2)

    return rp1+rp2-rlca*2, lcap1+lcap2, 'lcap1 : ' ,  lcap1P, 'lcap2 : ' ,  lcap2P, 'rlca : ' ,  rlca


# def BinaryTreeDiameter(root, p1, p2):
#     if not root: return 0
#     cnt = [0, -1, -1]
#     def dfs(node, cur, res): pass
#     def dfs(node, cur, cnt):
#         if not node:
#             return
#         if node == p1: cnt[1] = 1
#         if node == p2: cnt[2] = 1
#
#         if cnt[1] == 1 and cnt[2] == 1:
#             cnt[0] = max(cnt[0], cur)
#             return
#         else:
#             if cnt[1] == 1 or cnt[2] == 1:
#                 cur += 1
#             dfs(node.left, cur, cnt)
#             dfs(node.right, cur, cnt)
#
#     dfs(root, 2, cnt)
#     return cnt


L = [1, 2, 3, 4, 5, 6, None, 7, None]
'''
         1
     2        3
  4    5   6    N
7   N
'''
root = builder(L) # level order builder
p1 = getChild(root, 2)
p2 = getChild(root, 3)
p3 = getChild(root, 7)
print (p1, p2, p3)
print(BinaryTreeDiameter(root, p1, p2))
print(BinaryTreeDiameter(root, p2, p3))
print(BinaryTreeDiameter(root, p1, p3))