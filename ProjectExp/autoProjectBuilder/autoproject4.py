# AutoBuilder.py - 自动化 AI 项目开发流水线执行器
# 串联 DeepSeek-R1 → V0.dev → Figma → Cursor → 多平台部署（支持批量创建多个项目）
import random
import time

import requests
import os
import subprocess
import concurrent.futures
import httpx
import re

import sys
import os

from dotenv import load_dotenv

# === 加载本地 .env 环境变量 ===
load_dotenv()

# OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
V0_API_KEY = os.getenv("V0_API_KEY")

# # === 环境配置 ===
# OPENROUTER_API_KEY = "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"
# V0_API_KEY = "v1:cYKn1h2r52mZsJhYPr48ua8u:9xudmHWnXcphqSunMXXBK51O"

# AUTO_PROJECTS_DIR = "auto_projects"
AUTO_PROJECTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../yzcmfInterview/ProjectExp/autoProjectBuilder/autoProject"))
print(AUTO_PROJECTS_DIR)
GITHUB_REPO = "git@github.com:yzcmf/yzcmfInterview.git"  # 🚀 改为 SSH 方式

OPENROUTER_KEYS = [
    key.strip() for key in os.getenv("OPENROUTER_API_KEYS", "").split(",") if key.strip()
][::-1]

print(OPENROUTER_KEYS)

def call_chat_direct(prompt, retries=3):
    key_index = 0
    skip_keys = set()

    for attempt in range(retries):
        available_keys = [k for k in OPENROUTER_KEYS if k not in skip_keys]
        if not available_keys:
            print("🕒 所有 Key 均被限流，等待 60 秒后重置...")
            time.sleep(60)
            skip_keys.clear()
            available_keys = OPENROUTER_KEYS

        api_key = available_keys[key_index % len(available_keys)]
        key_index += 1

        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "AutoBuilder",
            "X-Title": "AutoBuilder"
        }
        print(f"🔐 使用的 API Key: {api_key[-8:]}...（第 {attempt+1}/{retries} 次尝试）")

        payload = {
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {"role": "system", "content": "你是资深系统架构师，请将以下项目需求拆解为模块、推荐技术栏，并输出页面结构与接口设计，同时输出 mermaid 格式系统组件图。"},
                {"role": "user", "content": prompt}
            ]
        }

        time.sleep(3)  # 节流
        response = httpx.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)

        if response.status_code == 200:
            data = response.json()
            if "choices" in data:
                return data["choices"][0]["message"]["content"]
            else:
                raise Exception(f"Invalid OpenRouter response: {data}")

        elif response.status_code == 429:
            print(f"⚠️ 当前 key 被限流，跳过并等待 10 秒...（Key: {api_key[-8:]})")
            skip_keys.add(api_key)
            time.sleep(10)

        else:
            print(f"❌ 请求失败: {response.status_code} - {response.text}")
            time.sleep(10)

    raise Exception("🚫 所有重试次数已用完，构建失败。")
class AutoAppBuilder:
    def __init__(self, project_name, idea_prompt):
        self.project_name = project_name
        self.idea_prompt = idea_prompt
        self.pages_needed = ["首页", "简历上传", "面试问答", "得分反馈"]
        self.backend = "nextjs"
        self.full_path = os.path.join(AUTO_PROJECTS_DIR, self.project_name)

    def call_chat(self):
        return call_chat_direct(self.idea_prompt)

    def get_architecture(self):
        print(f"📐 正在生成系统架构: {self.project_name}")
        plan = self.call_chat()
        self.architecture = plan
        if re.search(r"\\bSpring|Java\\b", plan, re.IGNORECASE):
            self.backend = "java"
        elif re.search(r"\\bFlask|FastAPI|Python\\b", plan, re.IGNORECASE):
            self.backend = "python"
        else:
            self.backend = "python"
        print(f"✅ 架构规划完成 (后端语言: {self.backend})\n")
        return plan

    def write_readme(self):
        readme_path = os.path.join(self.full_path, "README.autogen.md")
        print(readme_path)
        os.makedirs(self.full_path, exist_ok=True)
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write("# 项目架构设计\n\n")
            f.write(self.architecture)
            if os.path.exists(os.path.join(self.full_path, "architecture.svg")):
                f.write("\n\n![系统架构图](architecture.svg)\n")
        print("📄 架构已写入 README.autogen.md")

    def generate_ui(self):
        print("🎨 正在调用 V0.dev 生成 UI...")
        self.pages_code = {}
        for page in self.pages_needed:
            resp = requests.post(
                "https://api.v0.dev/v1/generate",
                headers={"Authorization": f"Bearer {V0_API_KEY}"},
                json={"prompt": f"用 TailwindCSS 和 React 生成一个{page} 页面，并提供可导入 Figma 的图层结构"}
            )
            try:
                self.pages_code[page] = resp.json().get("code", "")
            except requests.exceptions.JSONDecodeError:
                print(f"❌ 无法解析页面: {page}, 响应: {resp.text}")
                self.pages_code[page] = ""

    def write_code(self):
        if self.backend == "nextjs":
            print("📦 正在初始化 Next.js 项目...")
            subprocess.run(["rm", "-rf", self.full_path])
            subprocess.run(["npx", "create-next-app", self.full_path, "--typescript", "--eslint", "--tailwind"], check=True)
            pages_path = os.path.join(self.full_path, "app")
            os.makedirs(pages_path, exist_ok=True)
            for name, code in self.pages_code.items():
                with open(os.path.join(pages_path, f"{name.lower().replace(' ', '_')}.tsx"), "w") as f:
                    f.write(code)
            print("✅ 页面代码写入完成")
        elif self.backend == "python":
            print("🐍 自动生成 FastAPI 项目 (占位)")
            os.makedirs(self.full_path, exist_ok=True)
            with open(os.path.join(self.full_path, "main.py"), "w") as f:
                f.write("""from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/')\ndef read_root():\n    return {'Hello': 'World'}\n""")
        elif self.backend == "java":
            print("☕ 自动生成 Java Spring Boot 项目 (占位)")
            os.makedirs(self.full_path, exist_ok=True)
            with open(os.path.join(self.full_path, "Main.java"), "w") as f:
                f.write("""public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Spring Boot Project\");\n    }\n}\n""")

    def generate_figma_json(self):
        figma_path = os.path.join(self.full_path, "figma_layers.json")
        with open(figma_path, "w") as f:
            f.write('{"type": "FIGMA_LAYER_DEMO", "layers": ["Button", "Input", "Text"]}')
        print("🧩 Figma 可编辑图层结构已导出 figma_layers.json")

    def generate_mermaid_svg(self):
        matches = re.findall(r"```mermaid\\n(.*?)```", self.architecture, re.DOTALL)
        if matches:
            svg_path = os.path.join(self.full_path, "architecture.svg")
            temp_path = os.path.join(self.full_path, "architecture.mmd")
            with open(temp_path, "w") as f:
                f.write(matches[0])
            subprocess.run(["mmdc", "-i", temp_path, "-o", svg_path], check=False)
            print("🧬 Mermaid 架构图已导出 architecture.svg")

    def upload_to_github(self):
        print("⬆️ 正在集中上传至 yzcmfInterview 仓库...")
        os.makedirs(AUTO_PROJECTS_DIR, exist_ok=True)
        subprocess.run(["cp", "-r", self.full_path, AUTO_PROJECTS_DIR])
        subprocess.run(["git", "add", "."], cwd=AUTO_PROJECTS_DIR)
        subprocess.run(["git", "commit", "-m", f"add {self.project_name}"], cwd=AUTO_PROJECTS_DIR)
        subprocess.run(["git", "push"], cwd=AUTO_PROJECTS_DIR)
        print("✅ GitHub 上传完成")

    def open_cursor(self):
        print("🧠 打开项目到 Cursor IDE...")
        os.system(f"open -a Cursor {self.full_path}")

    def deploy(self, deploy_choice="345"):
        print("🚀 正在部署平台: " + deploy_choice)
        os.chdir(self.full_path)
        if "1" in deploy_choice:
            subprocess.run(["vercel", "--prod"], check=False)
        if "2" in deploy_choice:
            subprocess.run(["npm", "run", "build"], check=True)
            subprocess.run(["npx", "netlify", "deploy", "--prod", "--dir=.next"], check=False)
        if "3" in deploy_choice:
            print("📎 上传项目到 GitHub 并在 https://dashboard.render.com/new 连接仓库")
        if "4" in deploy_choice:
            print("🐍 请上传 FastAPI/Flask 项目到 https://www.pythonanywhere.com/")
        if "5" in deploy_choice:
            print("🟦 可部署至 https://replit.com/")
        if "6" in deploy_choice:
            print("🟨 可部署至 https://glitch.com/")
        if deploy_choice.strip() == "0":
            print("🛑 已跳过部署阶段")

def run_builder(builder):
    try:
        builder.get_architecture()
        builder.write_readme()
        # builder.generate_ui()
        builder.write_code()
        # builder.generate_figma_json()
        # builder.generate_mermaid_svg()
        # builder.upload_to_github()
        builder.open_cursor()
        # builder.deploy(deploy_choice="345")
        with open("log.txt", "a") as log:
            log.write(f"✅ {builder.project_name} 构建成功\n")
    except Exception as e:
        print(f"❌ 项目 {builder.project_name} 构建失败: {e}")
        with open("log.txt", "a") as log:
            log.write(f"❌ {builder.project_name} 构建失败: {e}\n")
def run_batch(prompt_list, skip_flag=True):
    os.makedirs(AUTO_PROJECTS_DIR, exist_ok=True)

    # === 设置 Git 身份为 yzcmf，防止默认使用 yuxuanKaribu ===
    # subprocess.run(["git", "config", "--global", "user.name", "yzcmf"])
    # subprocess.run(["git", "config", "--global", "user.email", "yzcmf@example.com"])
    #
    # # 初始化 Git 仓库
    # if not os.path.exists(os.path.join(AUTO_PROJECTS_DIR, ".git")):
    #     subprocess.run(["git", "init"], cwd=AUTO_PROJECTS_DIR)
    #     subprocess.run(["git", "remote", "add", "origin", GITHUB_REPO], cwd=AUTO_PROJECTS_DIR)
    #     subprocess.run(["git", "fetch", "origin"], cwd=AUTO_PROJECTS_DIR)
    #     subprocess.run(["git", "checkout", "-b", "yzcmf", "origin/yzcmf"], cwd=AUTO_PROJECTS_DIR)
    #
    # # 🚀 强制使用 SSH 地址，避免因 token 权限导致 403
    # subprocess.run(["git", "remote", "set-url", "origin", GITHUB_REPO], cwd=AUTO_PROJECTS_DIR)
    #
    # # ✅ run_batch 内添加一个标志变量 only_delete_once，确保只删一次远程 autogen
    # only_delete_once = True
    #
    # # ✅ 删除远程 autogen 分支（只删一次）
    # if only_delete_once:
    #     # 如果 autogen 分支存在，先删除
    #     result = subprocess.run(["git", "ls-remote", "--heads", "origin", "autogen"], capture_output=True, text=True)
    #     if result.stdout.strip():
    #         subprocess.run(["git", "push", "origin", "--delete", "autogen"], cwd=AUTO_PROJECTS_DIR)
    #         only_delete_once = False
    #
    # # 创建 autogen 分支并推送
    # subprocess.run(["git", "checkout", "-b", "autogen"], cwd=AUTO_PROJECTS_DIR)
    # subprocess.run(["git", "push", "--set-upstream", "origin", "autogen"], cwd=AUTO_PROJECTS_DIR)

    print("📦 开始顺序构建项目（共 {} 个）...".format(len(prompt_list)))
    for i, prompt in enumerate(prompt_list):
        name_part = '_'.join(prompt.split("that ")[0].split("AI ")[1].split(" ")[:-1]) if "AI " in prompt else f"project_{i+1}"
        project_name = f"auto_project_{i+1}_{name_part}"
        cwd_projects = os.listdir(AUTO_PROJECTS_DIR)
        print(project_name, cwd_projects, AUTO_PROJECTS_DIR)
        if skip_flag and project_name in cwd_projects:
            continue
        builder = AutoAppBuilder(project_name=project_name, idea_prompt=prompt)
        print(f"🚧 正在处理第 {i+1}/{len(prompt_list)} 个项目: {builder.project_name}")
        run_builder(builder)

        # # ✅ 修复 README.md 被覆盖为 autogen 的逻辑
        # project_path = os.path.join(AUTO_PROJECTS_DIR, builder.project_name)
        # readme_md = os.path.join(project_path, "README.md")
        # readme_autogen = os.path.join(project_path, "README.autogen.md")
        # if os.path.exists(readme_md):
        #     if not os.path.exists(readme_autogen):
        #         os.rename(readme_md, readme_autogen)
        #         print(f"📄 README.md 已重命名为 README.autogen.md → 保留 AI 输出")
        #     else:
        #         print(f"⚠️ 检测到已有 README.autogen.md，保留两者")
        #
        # # ✅ 每轮生成后自动提交并推送到 autogen 分支
        # subprocess.run(["git", "add", "."], cwd=AUTO_PROJECTS_DIR)
        # subprocess.run(["git", "commit", "-m", f"add {builder.project_name}"], cwd=AUTO_PROJECTS_DIR)
        # subprocess.run(["git", "push"], cwd=AUTO_PROJECTS_DIR)
        #
        # time.sleep(30)  # 项目间暂停加长，确保不过载


# 示例触发
if __name__ == "__main__":
    prompts = [
        "我想做一个AI交友推荐系统，上传资料后生成个性化推荐和互动交友",
        "我想做一个AI工作推荐系统，上传简历后生成个性化工作推荐和面试准备",
        "我想做一个AI学习助手，上传课程资料后生成个性化学习计划和知识点总结",
        "我想做一个AI租房房东租户交租系统，第三方平台代保管押金、同时能够管理租金和合同信息"
    ]
    # run_batch(prompts)
    prompts_detail = [
        "我想做一个AI简历打分系统，给出优化建议并生成岗位匹配图",
        "我想做一个AI智能客服系统，能够自动回答常见问题并提供个性化服务",
        "我想做一个AI健康管理系统，上传健康数据后生成个性化健康建议和运动计划",
        "我想做一个AI旅游推荐系统，上传旅行偏好后生成个性化行程和景点推荐",
        "我想做一个AI新闻推荐系统，上传兴趣标签后生成个性化新闻摘要和推荐",
        "我想做一个AI音乐推荐系统，上传音乐偏好后生成个性化歌单和音乐推荐",
        "我想做一个AI电影推荐系统，上传观影偏好后生成个性化电影推荐和影评",
        "我想做一个AI健身教练系统，上传身体数据后生成个性化健身计划和饮食建议",
        "我想做一个AI财务管理系统，上传财务数据后生成个性化理财建议和预算规划",
        "我想做一个AI心理咨询系统，上传心理测试结果后生成个性化心理建议和情绪管理方案",
        "我想做一个AI宠物管理系统，上传宠物信息后生成个性化养护建议和健康监测",
        "我想做一个AI音乐推荐系统，上传音乐偏好后生成个性化歌单和音乐推荐",
        "我想做一个AI旅游推荐系统，上传旅行偏好后生成个性化行程和景点推荐"
    ]
    # run_batch(prompts + prompts_detail)
    P = [
        "I want to build an AI friend social platform that generates personalized matches and enables interactive socializing after uploading profile data.",
        "I want to build an AI job search platform that generates personalized job matches and interview prep tips based on uploaded resumes.",
        "I want to build an AI rental platform that for landlords and tenants, where a third-party platform manages deposits, rent tracking, and contract information.",
        "I want to build an AI vpn platform that helping chinese to connect to Google and ChatGPT",
        "I want to build an AI auto code system that create fullstack application with just user's word decription.",
        "I want to build an AI deepfake detection system that auto detect the fake AI artifact nowadays.",
        "I want to build an AI business develop platform that exchange service and products.",
        "I want to build an AI health life system that generates personalized health advice and workout plans from uploaded health data.",
         "I want to build an AI learning system that creates personalized study plans and summarizes key concepts from uploaded course materials.",
        "I want to build an AI resume scoring system that gives optimization suggestions and generates job match graphs.",
        "I want to build an AI smart customer service system that automatically answers FAQs and provides personalized support.",
        "I want to build an AI movie recommendation system that generates personalized movie recommendations and reviews based on viewing preferences.",
        "I want to build an AI fitness coach system that creates personalized workout and diet plans from uploaded body data.",
        "I want to build an AI financial management system that provides personalized financial advice and budgeting plans based on uploaded data.",
        "I want to build an AI mental health consulting system that offers personalized psychological suggestions and emotional management based on test results.",
        "I want to build an AI pet care system that generates personalized pet care suggestions and health monitoring based on pet information.",
        "I want to build an AI music recommendation system that creates personalized playlists and music suggestions based on preferences.",
        "I want to build an AI travel recommendation system that creates personalized itineraries and attraction suggestions based on travel preferences."
    ]
    run_batch(P[:8], skip_flag=True)
    run_batch(P[:8], skip_flag=False)