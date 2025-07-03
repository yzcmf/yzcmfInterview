# AutoBuilder.py - 自动化 AI 项目开发流水线执行器
# 串联 DeepSeek-R1 → V0.dev → Figma → Cursor → 多平台部署

import requests
import os
import time
import subprocess
from openai import OpenAI

# === 环境配置 ===
OPENROUTER_API_KEY = "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"
V0_API_KEY = "v1:cYKn1h2r52mZsJhYPr48ua8u:9xudmHWnXcphqSunMXXBK51O"
PROJECT_NAME = "interview_simulator"
IDEA_PROMPT = "我想做一个AI面试模拟问答系统，上传简历后生成问题并评分"

# === 客户端初始化（仅用 OpenRouter + DeepSeek） ===
router_client = OpenAI(api_key=OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")

# === 通用对话函数（调用 DeepSeek） ===
def call_chat(prompt):
    msgs = [
        {"role": "system", "content": "你是资深系统架构师，请将以下项目需求拆解为模块、推荐技术栈，并输出页面结构与接口设计。"},
        {"role": "user", "content": prompt}
    ]
    resp = router_client.chat.completions.create(
        model="deepseek/deepseek-r1:free",
        extra_headers={"HTTP-Referer": "AutoBuilder", "X-Title": "AutoBuilder"},
        messages=msgs
    )
    return resp.choices[0].message.content

# === Step 1: 架构分析 ===
def get_project_architecture(prompt):
    print("📐 正在生成系统架构...")
    plan = call_chat(prompt)
    print("✅ 架构规划完成:\n", plan)

    os.makedirs(PROJECT_NAME, exist_ok=True)
    readme_path = os.path.join(PROJECT_NAME, "README.autogen.md")
    try:
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write("# 项目架构设计\n\n")
            f.write(plan)
        print("📄 架构已写入 README.autogen.md")
    except Exception as e:
        print(f"⚠️ 写入 README.autogen.md 失败: {e}")

    return plan

# === Step 2: V0.dev UI 页面生成 ===
def generate_ui_pages_v0(pages):
    print("🎨 正在调用 V0.dev 生成 UI...")
    results = {}
    for page in pages:
        resp = requests.post(
            "https://api.v0.dev/v1/generate",
            headers={"Authorization": f"Bearer {V0_API_KEY}"},
            json={"prompt": f"用 TailwindCSS 和 React 生成一个{page} 页面"}
        )
        try:
            results[page] = resp.json().get("code", "")
        except requests.exceptions.JSONDecodeError:
            print(f"❌ 无法解析 V0.dev 返回的数据，页面: {page}，响应: {resp.text}")
            results[page] = ""
    return results

# === Step 3: 写入代码到项目目录 ===
def scaffold_next_project(pages_code):
    print("📦 正在初始化 Next.js 项目...")
    if os.path.exists(PROJECT_NAME):
        subprocess.run(["rm", "-rf", PROJECT_NAME])
    subprocess.run(["npx", "create-next-app", PROJECT_NAME, "--typescript", "--eslint", "--tailwind"], check=True)
    pages_path = os.path.join(PROJECT_NAME, "app")
    os.makedirs(pages_path, exist_ok=True)
    for name, code in pages_code.items():
        with open(os.path.join(pages_path, f"{name.lower().replace(' ', '_')}.tsx"), "w") as f:
            f.write(code)
    print("✅ 页面代码写入完成")

# === Step 4: 打开项目到 Cursor（可选） ===
def open_in_cursor():
    print("🧠 打开项目到 Cursor IDE...")
    os.system(f"open -a Cursor {PROJECT_NAME}")

# === Step 5: 多平台部署选项 ===
def deploy_to_vercel():
    print("🚀 正在部署至 Vercel...")
    os.chdir(PROJECT_NAME)
    subprocess.run(["vercel", "--prod"], check=False)

def deploy_to_netlify():
    print("🚀 正在部署至 Netlify...")
    os.chdir(PROJECT_NAME)
    subprocess.run(["npm", "run", "build"], check=True)
    subprocess.run(["npx", "netlify", "deploy", "--prod", "--dir=.next"], check=False)

def deploy_to_render():
    print("🚀 正在部署至 Render...（请在控制台完成 Web 配置）")
    print("📎 上传项目到 GitHub 并在 https://dashboard.render.com/new 连接仓库")

def deploy_to_python_anywhere():
    print("🐍 可部署至 https://www.pythonanywhere.com/ 免费 Python Web 托管（需上传 Flask/FastAPI 应用）")

def deploy_to_replit():
    print("🟦 可部署至 https://replit.com/（支持 Python + Node.js，适合教学和展示）")

def deploy_to_glitch():
    print("🟨 可部署至 https://glitch.com/（支持 Node.js 和 Java，轻量项目适用）")

# === 主流程 ===
if __name__ == "__main__":
    print("✨ AutoBuilder 正在启动...")
    architecture = get_project_architecture(IDEA_PROMPT)

    pages_needed = ["首页", "简历上传", "面试问答", "得分反馈"]
    ui_code = generate_ui_pages_v0(pages_needed)

    scaffold_next_project(ui_code)
    open_in_cursor()

    print("请选择部署平台：")
    print("1. Vercel\n2. Netlify\n3. Render\n4. PythonAnywhere (Python)\n5. Replit (Python/JS)\n6. Glitch (JS/Java)\n0. 跳过部署")
    deploy_choice = input("请输入编号 (可多选，如 135 表示同时部署 Vercel、Render 和 Replit): ")

    if "1" in deploy_choice:
        deploy_to_vercel()
    if "2" in deploy_choice:
        deploy_to_netlify()
    if "3" in deploy_choice:
        deploy_to_render()
    if "4" in deploy_choice:
        deploy_to_python_anywhere()
    if "5" in deploy_choice:
        deploy_to_replit()
    if "6" in deploy_choice:
        deploy_to_glitch()
    if deploy_choice.strip() == "0":
        print("🛑 已跳过部署阶段，可稍后手动部署。")