def builder(pre, In):
    if not pre or not In: return None
    root = TreeNode(pre[0])
    j = In.index(pre[0])
    root.left = builder(pre[1:1+j], In[:j])
    root.right = builder(pre[j+1:], In[j+1:])
    return root

class TreeNode(object):
      def __init__(self, val):
         self.val = val
         self.left = self.right = None

def printer(root):
    if root == None: return
    printer(root.left)
    print(root.val, end = "->")
    printer(root.right)

preorder, inorder = [3,9,20,15,7], [9,3,15,20,7]
printer(builder(preorder, inorder))