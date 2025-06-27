import collections

def CanSchedule(numCourses, prerequisites):
    if numCourses <=0: return False

    graph = collections.defaultdict(set)

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

    for prerequisite in prerequisites:
        a, b = prerequisite
        graph[b].add(a)

    haveTakenCourses = [0] * numCourses  # 0 = unvisited, 1 = visiting, 2 = visited


    # to detect a cycle
    def dfs(ind, path):
        if haveTakenCourses[ind] == 2:
            return False # no cycle is found

        if haveTakenCourses[ind] == 1:
            path = []
            return True  # find a cycle

        haveTakenCourses[ind] = 1
        path.append(ind)

        for preRequiredCourse in graph[ind]:
            if dfs(preRequiredCourse, path):
                return True

        res.append(path)
        haveTakenCourses[ind] = 2
        return False

    path = []
    res = []
    for i in range(numCourses):
        if dfs(i, path):
            return []

    res = set(map(tuple, res))
    return [ '->'.join(map(str,path)) + '->' + str(path[0]) for path in res]


numCourses, prerequisites = 3, [[0, 1], [1, 2], [0, 2]]
print(CanSchedule(numCourses, prerequisites))
print(Schedule(numCourses, prerequisites))

numCourses, prerequisites = 4, [[0, 1], [1, 2], [3, 1], [2, 0]]
print(CanSchedule(numCourses, prerequisites))
print(Schedule(numCourses, prerequisites))

