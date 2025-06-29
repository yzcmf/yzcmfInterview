'''
🧾 题目描述（简化版）：
给你两个数组：
servers：长度为 n，servers[i] 表示第 i 台服务器的权重（weight）
tasks：长度为 m，tasks[i] 表示第 i 个任务的到达时间（就是时间点 i）以及处理时间 tasks[i]
规则：
每个任务要尽快被一个空闲服务器处理。
空闲服务器的选择规则是：
权重更小的优先； 权重相同的情况下，编号更小的优先。

返回一个数组 ans，其中 ans[i] 表示第 i 个任务分配给了哪台服务器。

Example 1:

Input: servers = [3,3,2], tasks = [1,2,3,2,1,2]
Output: [2,2,0,2,1,2]
Explanation: Events in chronological order go as follows:
- At second 0, task 0 is added and processed using server 2 until second 1.
- At second 1, server 2 becomes free. Task 1 is added and processed using server 2 until second 3.
- At second 2, task 2 is added and processed using server 0 until second 5.
- At second 3, server 2 becomes free. Task 3 is added and processed using server 2 until second 5.
- At second 4, task 4 is added and processed using server 1 until second 5.
- At second 5, all servers become free. Task 5 is added and processed using server 2 until second 7.
Example 2:

Input: servers = [5,1,4,3,2], tasks = [2,1,2,4,5,2,1]
Output: [1,4,1,4,1,3,2]
Explanation: Events in chronological order go as follows:
- At second 0, task 0 is added and processed using server 1 until second 2.
- At second 1, task 1 is added and processed using server 4 until second 2.
- At second 2, servers 1 and 4 become free. Task 2 is added and processed using server 1 until second 4.
- At second 3, task 3 is added and processed using server 4 until second 7.
- At second 4, server 1 becomes free. Task 4 is added and processed using server 1 until second 9.
- At second 5, task 5 is added and processed using server 3 until second 7.
- At second 6, task 6 is added and processed using server 2 until second 7.

Constraints:

servers.length == n
tasks.length == m
1 <= n, m <= 2 * 10^5
1 <= servers[i], tasks[j] <= 2 * 10^5
'''
import heapq


# 时间复杂度：O(n * 2 * log m + n * 2 * log m + m log m)
# 空间复杂度：O(n + 2 * m)

def assignTasks(servers, tasks):
    if not servers or not tasks: return []
    N = len(tasks)
    busy_servers = []
    free_servers = []
    for i, weight in enumerate(servers):
        heapq.heappush(free_servers, (weight, i))
    ans = [0] * N

    for task_id, task_duration in enumerate(tasks):
        # N tasks in busy heap finished, total O(N * 2 * logm)
        while busy_servers and task_id >= busy_servers[0][0]:
            _, weight, server_id = heapq.heappop(busy_servers)
            heapq.heappush(free_servers, (weight, server_id))
        if free_servers:
            weight, server_id = heapq.heappop(free_servers)
            ans[task_id] = server_id
            heapq.heappush(busy_servers, (task_id+task_duration, weight, server_id))
        else:
            finish_time, weight, server_id = heapq.heappop(busy_servers)
            ans[task_id] = server_id
            heapq.heappush(busy_servers, (finish_time + task_duration, weight, server_id))

    return ans

servers = [3,3,2]
tasks = [1,2,3,2,1,2]
print(assignTasks(servers, tasks))
# Output: [2,2,0,2,1,2]

servers = [5,1,4,3,2]
tasks = [2,1,2,4,5,2,1]
print(assignTasks(servers, tasks))
# Output: [1,4,1,4,1,3,2]

