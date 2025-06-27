class LRU(object):
  def __init__(self, cap):
      if cap < 1: return None
      self.cap = cap
      self.cache = dict()
      self.head = ListNode(0, 0)
      self.tail = ListNode(0, 0)
      self.head.next = self.tail
      self.tail.pre = self.head

  def get(self, key):
      if key not in self.cache: return -1
      node = self.cache[key]
      self.__remove(node)
      self.__add_to_front(node)
      return node.val

  def put(self, key, val):
      node = ListNode(key, val)
      if key in self.cache:
         self.__remove(node)
      self.cache[key] = node
      self.__add_to_front(node)
      if self.cap < len(self.cache):
         out = self.tail.pre
         self.__remove(out)
         del self.cache[out.key]

  def __add_to_front(self, node):
      nxt = self.head.next
      self.head.next = node
      node.next = nxt
      node.pre = self.head
      nxt.pre = node

  def __remove(self, node):
      pre = node.pre
      nxt = node.next
      pre.next = nxt
      nxt.pre = pre

  def printer(self):
      node = self.head.next
      while node and node != self.tail:
            print("[" + str(node.key) + ":" + str(node.val) + "]" , end= ' ->')
            node = node.next
      print('\n')

class ListNode(object): # double linklist
      def __init__(self, key, val):
        self.key = key
        self.val  = val
        self.pre = None
        self.next = None


lru = LRU(7)
lru.printer()
lru.put('2025-6-25-17-29', '1pointerAcre3')
lru.printer()
lru.put('2025-6-25-17-30', 'github')
lru.printer()
lru.put('2025-6-25-17-31', 'yuxuanzhouo3')
lru.printer()
lru.put('2025-6-25-17-32', 'lru grammer')
lru.printer()
lru.put('2025-6-25-17-33', 'colab')
lru.printer()
lru.put('2025-6-25-17-34', 'leetcode')
lru.printer()
lru.put('2025-6-25-17-35', 'longzhu')
lru.printer()
lru.put('2025-6-25-17-36', 'gdp')
lru.printer()
lru.get('2025-6-25-17-32')
lru.printer()
lru.get('2025-6-25-17-30')
lru.printer()
lru.get('2025-6-25-17-31')
lru.printer()
lru.get('2025-6-25-17-29')
lru.printer()
lru.get('2025-6-25-17-36')
lru.printer()
lru.get('2025-6-25-17-34')
lru.printer()