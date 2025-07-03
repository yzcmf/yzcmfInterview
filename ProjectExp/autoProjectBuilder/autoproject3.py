# AutoBuilder.py - 自动化 AI 项目开发流水线执行器
# 串联 DeepSeek-R1 → V0.dev → Figma → Cursor → 多平台部署（支持批量创建多个项目）

import requests
import os
import subprocess
import concurrent.futures
import httpx
import re

# === 环境配置 ===
OPENROUTER_API_KEY = "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"
V0_API_KEY = "v1:cYKn1h2r52mZsJhYPr48ua8u:9xudmHWnXcphqSunMXXBK51O"

AUTO_PROJECTS_DIR = "auto_projects"
GITHUB_REPO = "https://github.com/yzcmf/yzcmfInterview.git"

def call_chat_direct(prompt):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "AutoBuilder",
        "X-Title": "AutoBuilder"
    }
    print("🔐 使用的 header:", headers)  # 临时调试输出
    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {"role": "system", "content": "你是资深系统架构师，请将以下项目需求拆解为模块、推荐技术栈，并输出页面结构与接口设计，同时输出 mermaid 格式系统组件图。"},
            {"role": "user", "content": prompt}
        ]
    }
    response = httpx.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Error code: {response.status_code} - {response.text}")
    data = response.json()
    if "choices" not in data:
        raise Exception(f"Invalid OpenRouter response: {data}")
    return data["choices"][0]["message"]["content"]

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
            self.backend = "nextjs"
        print(f"✅ 架构规划完成 (后端语言: {self.backend})\n")
        return plan

    def write_readme(self):
        readme_path = os.path.join(self.full_path, "README.autogen.md")
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

    def deploy(self, deploy_choice="135"):
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
        builder.generate_ui()
        builder.write_code()
        builder.generate_figma_json()
        builder.generate_mermaid_svg()
        builder.upload_to_github()
        builder.open_cursor()
        builder.deploy(deploy_choice="135")
        with open("log.txt", "a") as log:
            log.write(f"✅ {builder.project_name} 构建成功\n")
    except Exception as e:
        print(f"❌ 项目 {builder.project_name} 构建失败: {e}")
        with open("log.txt", "a") as log:
            log.write(f"❌ {builder.project_name} 构建失败: {e}\n")


def run_batch(prompt_list):
    os.makedirs(AUTO_PROJECTS_DIR, exist_ok=True)
    if not os.path.exists(os.path.join(AUTO_PROJECTS_DIR, ".git")):
        subprocess.run(["git", "init"], cwd=AUTO_PROJECTS_DIR)
        subprocess.run(["git", "remote", "add", "origin", GITHUB_REPO], cwd=AUTO_PROJECTS_DIR)
        subprocess.run(["git", "checkout", "-b", "autogen"], cwd=AUTO_PROJECTS_DIR)

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        builders = [AutoAppBuilder(project_name=f"auto_project_{i+1}_" + prompt.split("，")[0].split("AI")[1], idea_prompt=prompt) for i, prompt in enumerate(prompt_list)]
        executor.map(run_builder, builders)


# 示例触发
if __name__ == "__main__":
    prompts = [
        "我想做一个AI交友推荐系统，上传资料后生成个性化推荐和互动交友",
        "我想做一个AI工作推荐系统，上传简历后生成个性化工作推荐和面试准备",
        "我想做一个AI学习助手，上传课程资料后生成个性化学习计划和知识点总结",
        "我想做一个AI租房房东租户交租系统，第三方平台代保管押金、同时能够管理租金和合同信息"
    ]
    run_batch(prompts)

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

    run_batch(prompts_detail)