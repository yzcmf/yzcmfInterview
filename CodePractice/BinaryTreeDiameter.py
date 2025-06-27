class TreeNode(object):
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

def builder(A):
    if not A: return None
    root = TreeNode(A[0])
    q = [root]
    i = 1
    while q and i < len(A):
        for _ in range(len(q)):
            node = q.pop(0)
            if node.left:
                node.left = TreeNode(A[i])
                i += 1
                q.append(node.left)
            if node.right:
                node.right = TreeNode(A[i])
                i += 1
                q.append(node.right)
    return root


def getChild(root, val):
    if not root: return
    if root.val == val:
        return root
    return getChild(root.left, val) or getChild(root.right, val)


def BinaryTreeDiameter(root, p1, p2):
    if not root: return 0
    cnt = [0, -1, -1]
    def dfs(node, cur, res): pass
    def dfs(node, cur, cnt):
        if not node:
            return
        if node == p1: cnt[1] = 1
        if node == p2: cnt[2] = 1

        if cnt[1] == 1 and cnt[2] == 1:
            cnt[0] = max(cnt[0], cur)
            return
        else:
            if cnt[1] == 1 or cnt[2] == 1:
                cur += 1
            dfs(node.left, cur, cnt)
            dfs(node.right, cur, cnt)

    dfs(root, 0, cnt)
    return cnt


L = [1, 2, 3, 4, 5, 6, None, 7, None]
root = builder(L) # level order builder
p1 = getChild(root, 2)
p2 = getChild(root, 3)
p3 = getChild(root, 7)
print (p1, p2, p3)
print(BinaryTreeDiameter(root, p1, p2))
print(BinaryTreeDiameter(root, p2, p3))
print(BinaryTreeDiameter(root, p1, p3))