import collections

def CanSchedule(numCourses, prerequisites):
    if numCourses <=0: return False

    graph = collections.defaultdict(set)

    # a -> b
    for prerequisite in prerequisites:
        a, b = prerequisite
        graph[b].add(a)

    haveTakenCourses = [0] * numCourses  # 0 = unvisited, 1 = visiting, 2 = visited


    # to detect a cycle
    def dfs(ind):
        if haveTakenCourses[ind] == 2:
            return False # have checked and no cycle is found
        if haveTakenCourses[ind] == 1:
            return True # find a cycle

        haveTakenCourses[ind] = 1 # begin to check whether there is a cycle from this course's pre

        for preRequiredCourse in graph[ind]:
            if dfs(preRequiredCourse):
                return True

        res.append(ind)
        haveTakenCourses[ind] = 2 # have checked and no cycle is found from this course's pre
        return False


    res = []
    for i in range(numCourses):
        if dfs(i):
            return False, []

    return True, res


def Schedule(numCourses, prerequisites):
    if numCourses <= 0: return False

    graph = collections.defaultdict(set)

    # a -> b
    for prerequisite in prerequisites:
        a, b = prerequisite
        graph[b].add(a)

    haveTakenCourses = [0] * numCourses  # 0 = unvisited, 1 = visiting, 2 = visited


    # to detect a cycle
    def dfs(ind):
        if haveTakenCourses[ind] == 2:
            return False # no cycle is found

        if haveTakenCourses[ind] == 1:
            return True  # find a cycle

        haveTakenCourses[ind] = 1


        for preRequiredCourse in graph[ind]:
            if dfs(preRequiredCourse):
                return True

        res.append(ind)
        haveTakenCourses[ind] = 2
        return False


    res = []
    for i in range(numCourses):
        if dfs(i):
            return []

    return res

def CanScheduleB(numCourses, prerequisites):
    if numCourses <=0 : return False
    graph = collections.defaultdict(set)
    indegree = [0] * numCourses

    # a -> b
    for a, b in prerequisites:
        graph[a].add(b) # diff from dfs; low level course -> high level courses
        indegree[b] += 1

    q = collections.deque(c for c in graph if indegree[c] == 0)
    cnt = 0

    while q:
        c = q.popleft()
        cnt += 1
        for nei in graph[c]:
            indegree[nei] -= 1
            if indegree[nei] == 0:
                q.append(nei)

    return cnt == numCourses


def ScheduleB(numCourses, prerequisites):
    if numCourses <= 0: return False
    graph = collections.defaultdict(set)
    indegree = [0] * numCourses

    # a -> b
    for a, b in prerequisites:
        graph[a].add(b)
        indegree[b] += 1


    q = collections.deque(c for c in graph if indegree[c] == 0)
    res = []

    while q:
        c = q.popleft()
        res.append(c)
        for nei in graph[c]:
            indegree[nei] -= 1
            if indegree[nei] == 0:
                q.append(nei)

    return res if len(res) == numCourses else []


numCourses, prerequisites = 3, [[0, 1], [1, 2], [0, 2]]
print(CanSchedule(numCourses, prerequisites))
print(Schedule(numCourses, prerequisites))
print(CanScheduleB(numCourses, prerequisites))
print(ScheduleB(numCourses, prerequisites))

numCourses, prerequisites = 4, [[0, 1], [1, 2], [2, 3]]
print(CanSchedule(numCourses, prerequisites))
print(Schedule(numCourses, prerequisites))
print(CanScheduleB(numCourses, prerequisites))
print(ScheduleB(numCourses, prerequisites))


'''
0->1->2

0->1->2
3->1
2->0
'''