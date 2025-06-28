'''
给定一个 JSON-like 树状对象，每个节点包含：

tag: 标签名称（如 "div"、"p"、"h1" 等）

children: 子节点数组

要求： 生成 HTML 字符串，格式如：<tag> ... children html ... </tag>
'''
def renderHTML(node):
    if not node or 'tag' not in node: return ""
    tag = node['tag']
    sub_res = ''
    for childNode in node.get('children', []):
        sub_res += renderHTML(childNode)
    return '<' + tag + '>' + sub_res + '<' + '/' + tag + '>'

input_node = {
    "tag": "div",
    "children": [
        { "tag": "h1", "children": [] },
        { "tag": "p", "children": [
            { "tag": "span", "children": [] }
        ]}
    ]
}


def renderHTML2(node):
    if not node or 'tag' not in node:
        return ''

    tag = node['tag']
    children = node.get('children', [])

    children_html = ''.join(renderHTML(child) for child in children)

    return f"<{tag}>{children_html}</{tag}>"



print(renderHTML(input_node))
print(renderHTML2(input_node))
