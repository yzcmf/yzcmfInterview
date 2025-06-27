def lcs(A):
    L = [A[0]]
    res = L
    mx = cur = 1
    for i in range(1, len(A)):
        if A[i-1] + 1 == A[i]:
            cur += 1
            L.append(A[i])
        else:
            if mx < cur:
                mx = cur
                res = L
            cur = 1
            L = [A[i]]
    return res, mx

print(lcs([1,2,3,6,7,8,9,192,193]))
