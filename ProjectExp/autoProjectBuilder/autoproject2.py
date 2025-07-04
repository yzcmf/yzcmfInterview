# AutoBuilder.py - 自动化 AI 项目开发流水线执行器
# 串联 DeepSeek-R1 → V0.dev → Figma → Cursor → 多平台部署（支持批量创建多个项目）

import requests
import os
import subprocess
from openai import OpenAI

# === 环境配置 ===
OPENROUTER_API_KEY = "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"
V0_API_KEY = "v1:cYKn1h2r52mZsJhYPr48ua8u:9xudmHWnXcphqSunMXXBK51O"

client = OpenAI(api_key=OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")

class AutoAppBuilder:
    def __init__(self, project_name, idea_prompt):
        self.project_name = project_name
        self.idea_prompt = idea_prompt
        self.pages_needed = ["首页", "简历上传", "面试问答", "得分反馈"]

    def call_chat(self):
        messages = [
            {"role": "system", "content": "你是资深系统架构师，请将以下项目需求拆解为模块、推荐技术栈，并输出页面结构与接口设计。"},
            {"role": "user", "content": self.idea_prompt}
        ]
        response = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=messages,
            extra_headers={"HTTP-Referer": "AutoBuilder", "X-Title": "AutoBuilder"}
        )
        return response.choices[0].message.content

    def get_architecture(self):
        print(f"📐 正在生成系统架构: {self.project_name}")
        plan = self.call_chat()
        self.architecture = plan
        print("✅ 架构规划完成\n")
        return plan

    def write_readme(self):
        readme_path = os.path.join(self.project_name, "README.autogen.md")
        try:
            os.makedirs(self.project_name, exist_ok=True)
            with open(readme_path, "w", encoding="utf-8") as f:
                f.write("# 项目架构设计\n\n")
                f.write(self.architecture)
            print("📄 架构已写入 README.autogen.md")
        except Exception as e:
            print(f"⚠️ 写入 README.autogen.md 失败: {e}")

    def generate_ui(self):
        print("🎨 正在调用 V0.dev 生成 UI...")
        self.pages_code = {}
        for page in self.pages_needed:
            resp = requests.post(
                "https://api.v0.dev/v1/generate",
                headers={"Authorization": f"Bearer {V0_API_KEY}"},
                json={"prompt": f"用 TailwindCSS 和 React 生成一个{page} 页面"}
            )
            try:
                self.pages_code[page] = resp.json().get("code", "")
            except requests.exceptions.JSONDecodeError:
                print(f"❌ 无法解析页面: {page}, 响应: {resp.text}")
                self.pages_code[page] = ""

    def write_code(self):
        print("📦 正在初始化 Next.js 项目...")
        if os.path.exists(self.project_name):
            subprocess.run(["rm", "-rf", self.project_name])
        subprocess.run(["npx", "create-next-app", self.project_name, "--typescript", "--eslint", "--tailwind"], check=True)
        pages_path = os.path.join(self.project_name, "app")
        os.makedirs(pages_path, exist_ok=True)
        for name, code in self.pages_code.items():
            with open(os.path.join(pages_path, f"{name.lower().replace(' ', '_')}.tsx"), "w") as f:
                f.write(code)
        print("✅ 页面代码写入完成")

    def open_cursor(self):
        print("🧠 打开项目到 Cursor IDE...")
        os.system(f"open -a Cursor {self.project_name}")

    def deploy(self):
        print("请选择部署平台：")
        print("1. Vercel\n2. Netlify\n3. Render\n4. PythonAnywhere (Python)\n5. Replit (Python/JS)\n6. Glitch (JS/Java)\n0. 跳过部署")
        deploy_choice = input("请输入编号 (可多选，如 135 表示同时部署 Vercel、Render 和 Replit): ")

        os.chdir(self.project_name)
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


# === 批量运行入口 ===
def run_batch(prompt_list):
    for i, prompt in enumerate(prompt_list):
        pname = prompt.split("，")[0].split("AI")[1]
        # pname = f"auto_project_{i+1}
        builder = AutoAppBuilder(project_name=pname, idea_prompt=prompt)
        builder.get_architecture()
        builder.write_readme()
        builder.generate_ui()
        builder.write_code()
        builder.open_cursor()
        builder.deploy()


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