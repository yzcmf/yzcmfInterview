class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None

def reverse(node):
    pre = None
    while node:
        nxt = node.next
        node.next = pre
        pre = node
        node = nxt
    return pre

def reversedKgroup(head, K):
    # Calculate the length of the linked list
    L = 0
    n = head
    while n:
        n = n.next
        L += 1

    N, r = L // K, L % K
    i = 0
    curhead = head
    lastTail = None

    while i < N:
        h = t = curhead
        c = 1
        while t.next and c < K:
            t = t.next
            c += 1

        curhead = t.next
        t.next = None
        prev = reverse(h)

        if i == 0:
            head = prev
        else:
            lastTail.next = prev

        lastTail = h
        i += 1

    if curhead:
        lastTail.next = curhead

    return head

def create_linked_list(values):
    head = ListNode(values[0])
    n = head
    for v in values[1:]:
        n.next = ListNode(v)
        n = n.next
    return head

def print_linked_list(head):
    while head:
        print(head.val, end=" -> ")
        head = head.next
    print("None")

# Test with input [1,2,3,4,5,6,7,8,9]
input_list = [1,2,3,4,5,6,7,8,9]

print("Original:", input_list)

for k in [1, 2, 3, 4, 5]:
    print(f"\nReversing in groups of {k}:")
    head = create_linked_list(input_list)
    new_head = reversedKgroup(head, k)
    print_linked_list(new_head)
