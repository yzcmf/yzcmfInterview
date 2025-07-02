class TreeNode(object):
    def __init__(self, v):
        self.v = v
        self.left = self.right = None

class BinaryIndexTree(object):
    pass

class SegmentTree(object):
    pass

class Trie(object):
    pass

class RedBlackTree(object):
    pass

class MultiTree(object):
    pass

class MiniumSpanningTree(object):
    pass



class Solution(object):
    def isSameTree(self, s, t):
        if s==None and t==None: return True
        elif s==None or t==None: return False
        else:
            return s.v == t.v and self.isSameTree(s.left, t.left) and self.isSameTree(s.right, t.right)

    def isSameTree2(self, s, t):
        # print(self.serialize(t), '  ' , self.serialize(s))
        return self.serialize(t) == self.serialize(s)
    def isSubtree(self, s, t):
        if not s: return False
        return self.isSameTree(s, t) or self.isSubtree(s.left, t) or self.isSubtree(s.right, t)

    def isSubtree2(self, s, t):
        # print(self.serialize(t), '  ', self.serialize(s))
        return self.serialize(t) in self.serialize(s)

    def deepth(self, root):
        if not root: return 0
        return 1 + max(self.deepth(root.left), self.deepth(root.right))

    def serialize(self, root):
        if not root: return "#"
        return str(root.v) +  ',' +self.serialize(root.left)  + ',' + self.serialize(root.right)

    def deserialize(self, S):
        def dfs(S):
            s = S.pop(0)
            if s == '#': return None
            node = TreeNode(int(s))
            node.left = dfs(S)
            node.right = dfs(S)
            return node
        S = S.split(',')
        return dfs(S)

    def LCA(self, root, p1, p2):
        if not root or root == p1 or root == p2: return root # (None, p1, p2)
        left = self.LCA(root.left, p1, p2)
        right = self.LCA(root.right, p1, p2)
        if left and right: return root
        return left if left else right

    def path(self, root, node):
        if not node or not root: return []
        if root == node: return [node.v]
        l = self.path(root.left, node)
        r = self.path(root.right, node)
        return [root.v] + l if l else [root.v] + r if r else []

    def pathNodeCounter(self, root, node):
        if not node or not root: return 0
        if root == node: return 1
        lc = self.pathNodeCounter(root.left, node)
        rc = self.pathNodeCounter(root.right, node)
        return 1 + lc if lc else 1 + rc if rc else 0

    def getNode(self, root, val):
        if not root: return None
        if root.v == val: return root
        return self.getNode(root.left, val) or self.getNode(root.right, val)


L1 = [1, 2, 3, 4, 5, 6, None, 7, None]
L2 = [1, 2, 3, None]
L3 = [2, 4, 5, 7, None]
L4 = [1, 3, 4, 5, 6, None, 7, None]
L5 = [1, 2, 3, 4, 5, 7, None]
L6 = [1, 2, 3, 4, 5, 6, None, 7, None]
'''
         1
     2        3
  4    5   6    N
7   N
'''


def builder(A):
    if not A: return
    root = TreeNode(A[0])
    q = [root]
    N = len(A)
    ind = 1
    while q:
        for _ in range(len(q)):
            node = q.pop(0)
            if ind < N:
                if A[ind] is not None:
                    node.left = TreeNode(A[ind])
                    q.append(node.left)
                ind += 1
            if ind < N:
                if A[ind] is not None:
                    node.right = TreeNode(A[ind])
                    q.append(node.right)
                ind += 1
    return root

r1 = builder(L1) # level order builder
r2 = builder(L2) # level order builder
r3 = builder(L3) # level order builder
r4 = builder(L4) # level order builder
r5 = builder(L5) # level order builder
r6 = builder(L6) # level order builder

mySolution = Solution()
p1 = mySolution.getNode(r1, 6)
print("\n-------------------------\n")
for p in [1, 2, 3, 4, 5, 6, 7]:
    print(mySolution.path(r1, mySolution.getNode(r1, p)))
    print(mySolution.pathNodeCounter(r1, mySolution.getNode(r1, p)))

print("\n-------------------------\n")
print(mySolution.isSameTree(r1, r6))
print(mySolution.isSameTree2(r1, r6))

print("\n------------------------\n")
print(mySolution.isSubtree(r1, r2))
print(mySolution.isSubtree(r1, r3))
print(mySolution.isSubtree(r1, r4))
print(mySolution.isSubtree(r1, r5))

print("\n-------------------------\n")
print(mySolution.isSubtree2(r1, r2))
print(mySolution.isSubtree2(r1, r3))
print(mySolution.isSubtree2(r1, r4))
print(mySolution.isSubtree2(r1, r5))
