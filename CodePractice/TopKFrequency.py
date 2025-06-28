import heapq
import logging as log
from collections import Counter

log.basicConfig(level=log.INFO, format='%(levelname)s: %(message)s')

# HashMap + heapq -- O(N log N); O(N) [Counter] + O(k) [Heap]
def TopK(A, K):
    N = len(A)
    if N < 1 or K <= 0: return -1
    q = []
    for v, f in Counter(A).items():
        heapq.heappush(q, (-f, -v))
        # make the O(N log N) tp O(N log K); while N >> K, it saves time
        # if len(q) > K:
        #     heapq.heappop(q)
    res = []
    while K:
        res.append(-heapq.heappop(q)[1])
        K -=1
    return res


# Bucket Sort -- O(N); O(N)
def TopK2(A, K):
    N = len(A)
    if N < 1 or K <= 0: return []
    buckets = [[] for _ in range(N+1)] # most of N bucket
    for v, f in Counter(A).items():
        buckets[f].append(v)

    log.info("Buckets are %s  ", buckets)

    res = []

    for i in range(N, -1, -1):
        for val in buckets[i]:
            res.append(val)
            if len(res) == K:
                return res

# O(N log k) O(N + k)
def topKFrequent(nums, k):
    freq = Counter(nums)  # O(N)
    return [item for item, _ in heapq.nlargest(k, freq.items(), key=lambda x: x[1])]


# print(TopK([1,2,3,4,5,5,5,6,6,7,7,7,7,7,8,2,9,0,0,0], 2))
# print(TopK2([1,2,3,4,5,5,5,6,6,7,7,7,7,7,8,2,9,0,0,0], 2))
# print(topKFrequent([1,2,3,4,5,5,5,6,6,7,7,7,7,7,8,2,9,0,0,0], 2))

log.info("TopK Freq %s is %s " , 2, TopK([1,2,3,4,5,5,5,6,6,7,7,7,7,7,8,2,9,0,0,0], 2))
log.info("TopK2 Freq %s is %s " , 2, TopK2([1,2,3,4,5,5,5,6,6,7,7,7,7,7,8,2,9,0,0,0], 2))
log.info("topKFrequent Freq %s is %s " , 2, topKFrequent([1,2,3,4,5,5,5,6,6,7,7,7,7,7,8,2,9,0,0,0], 2))