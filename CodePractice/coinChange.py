'''
给你一个整数数组 coins，表示不同面额的硬币；一个整数 amount，表示总金额。
请你计算并返回 可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成该金额，返回 -1。
你可以认为每种硬币的数量是无限的。

Input: coins = [1,2,5], amount = 11
Output: 3
解释: 11 = 5 + 5 + 1

Input: coins = [2], amount = 3
Output: -1

'''

def coinChange(coins, amount):
    if not coins or amount < 0: return -1
    dp = [float('inf') for _ in range(amount+1)] # the minium coins need for amount = 0...amount
    dp[0] = 0 # the minium coins need for amount = 0 is 0

    # O(amount × C × amount) = O(C × amount²)
    # for a in range(1, amount+1):
    #     for coin in coins:
    #         k = 1
    #         while a - coin * k >= 0 :
    #             dp[a] = min(dp[a], dp[a - coin * k] + k)
    #             k += 1


    # O(amount × C ) = O(C × amount)
    for coin in coins: # for coin in coins[::-1] is the same
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], dp[a - coin] + 1)

    # O(amount × C ) = O(C × amount)
    # right -- we know dp[0] = 0 and so from the begin to end
    # for a in range(1, amount):
    #     for coin in coins:
    #         if a - coin >= 0:
    #             dp[a] = min(dp[a], dp[a - coin] + 1)

    # Wrong -- we know dp[0] = 0 and so from the begin to end
    # for a in range(amount, -1, -1):
    #     for coin in coins:
    #         if a + coin <= amount:
    #             dp[a] = min(dp[a], dp[a + coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

print(coinChange([1, 2, 5], 11))  # Output: 3
print(coinChange([2], 3))        # Output: -1
print(coinChange([1], 0))        # Output: 0
print(coinChange([1], 2))        # Output: 2
print(coinChange([186, 419, 83, 408], 6249))  # Output: 20



