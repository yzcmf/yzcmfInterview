def ThreeSum(A):
    N = len(A)
    if N <= 2: return A
    A.sort()
    mx = 0
    for i in range(N-2):
        if A[i] == A[i+1]: continue
        sum = A[i]
        # 2 pointer O(N) or hashmap O(N) O(1)
        j = i+1
        k = N-1
        while j < k:
            mx = max(mx, sum + A[j] + A[k])
            while j<k and A[j+1] == A[j]: j += 1
            while j<k and A[k-1] == A[k]: k -= 1
            j += 1
            k -= 1
    return mx

def ThreeSumT(A, T=0):
    N = len(A)
    if N <= 2: return A
    A.sort() # O(NlogN)
    res = []
    for i in range(N-2):
        if A[i] == A[i+1]: continue
        # 2 pointer O(N) O(1)
        j = i+1
        k = N-1
        while j < k:
            while j < k and A[j + 1] == A[j]: j += 1
            while j < k and A[k - 1] == A[k]: k -= 1
            s = A[i] + A[j] + A[k]
            if s == T:
                res.append([A[i], A[j], A[k]])
                j += 1
                k -= 1
            elif s < T:
                j += 1
            else:
                k -=1
    return res

def ThreeSumT2(A, T=0):
    N = len(A)
    if N <= 2: return A
    A.sort() # O(NlogN)
    res = []
    for i in range(N-2):
        if A[i] == A[i+1]: continue
        # hashmap O(1) O(N)
        j = i+1
        d = {}
        while j < N: # hashmap j to the last one
            while j < N-1 and A[j + 1] == A[j]: j += 1
            if T-A[j]-A[i] in d:
                res.append([A[i], A[d[T-A[j]-A[i]]], A[j]])
            d[A[j]] = j
            j += 1
    return res


AA = [[1, 99, 3, 5, 4, 5, 6, 7], [1, 3, 4, 4, 4, 5, 6, 7], [1, -3, 4, -45, 69, -70, 0, 1, 0, 0]]

for A in AA:
    print(ThreeSum(A), end = "\n")

for A in AA:
    print(ThreeSumT(A), end="\n")

for A in AA:
    print(ThreeSumT2(A), end="\n")