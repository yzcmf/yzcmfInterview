# refer to google sheet app script
# Design multi-sender as Referers; Recuriters; Hiring Managers; Co-founders; Investors; Customers Emails;

import smtplib, ssl, csv, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# 多账号配置
accounts = [
    {"email": "yzcmf80@gmail.com", "pwd": "gytaldifxehhawbc", "smtp": "smtp.gmail.com", "port": 587},
    {"email": "yzcmf72@gmail.com", "pwd": "ioyvlinfqmjvjgnl", "smtp": "smtp.gmail.com", "port": 587},
    # 可继续添加账号
]

# 附件文件路径（支持多个附件）
attachments = [
    "./attachments/CV8 [Jack][M].pdf",
    "./attachments/CV8 [Jack][SDE].pdf",
    "./attachments/M2_Engineer_Cover.pdf",
    "./attachments/M2_SelfIntro.pdf",
    "./attachments/Senior_Staff_Engineer_Cover.pdf",
    "./attachments/Senior_Staff_SelfIntro.pdf"
]

# 加载目标邮箱
with open("./data/final_combined_unique_emails_1_202.csv", encoding="utf-8") as f:
    reader = csv.reader(f)
    recipients = [row[0].strip() for row in reader if '@' in row[0]]

# 群发逻辑
for i, recipient in enumerate(recipients):
    acc = accounts[i // 100 % len(accounts)]

    # 创建邮件（支持文本+附件）
    msg = MIMEMultipart()
    msg['Subject'] = "Referral Request for Backend/Infra/EM Role – Ex-Oracle & Huawei"
    msg['From'] = acc['email']
    msg['To'] = recipient

    # 邮件正文
    body = MIMEText(f"""
Hi Referrer

I hope this message finds you well!

My name is Jack Zhou. I’m currently exploring new opportunities in backend or infrastructure engineering. I came across your contact via 1point3acres and saw you’re associated with Top Level IT Company.

A bit about me:
- 7+ years experience in large-scale cloud systems  
- Focus: infrastructure, monitoring, and security  
- Key projects: SLAPS @ Oracle, SFS 2.0 @ Huawei, and my AI+Trust startup (TrustScience)

If your team is hiring, I’d love to explore ways I can contribute. I’d be very grateful for a referral or any advice you can share.

Warm regards,  
Jack Zhou  
GitHub: https://github.com/yzcmf
+1 (313) 923‑4257 | yzcmf94@gmail.com
""", "plain")
    msg.attach(body)

    # 添加附件
    for file_path in attachments:
        if not os.path.exists(file_path):
            print(f"⚠️ Attachment not found: {file_path}")
            continue
        with open(file_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f'attachment; filename="{os.path.basename(file_path)}"')
        msg.attach(part)

    # 发送邮件
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(acc['smtp'], acc['port']) as server:
            server.starttls(context=context)
            server.login(acc['email'], acc['pwd'])
            server.send_message(msg)
            print(f"✅ Sent to {recipient} via {acc['email']}")
    except Exception as e:
        print(f"⚠️ Failed to send to {recipient}: {e}")
