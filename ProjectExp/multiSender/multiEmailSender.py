# refer to google sheet app script
# Design multi-sender as Referers; Recuriters; Hiring Managers; Co-founders; Investors; Customers Emails;

import smtplib, ssl, csv
from email.mime.text import MIMEText

# 配置多个邮箱账号
accounts = [
    {"email": "yzcmf80@gmail.com", "pwd": "Zyx!213416", "smtp": "smtp.gmail.com", "port": 587},
    {"email": "yzcmf72@gmail.com", "pwd": "Zyx!213416", "smtp": "smtp.gmail.com", "port": 587},
    # 添加更多账号
]

# 加载目标邮箱
with open("target_emails_no_xxx_no_dots_no_xx.csv.csv") as f:
    readers = csv.reader(f)
    recipients = [row[0] for row in readers if '@' in row[0]]

# 群发逻辑
for i, recipient in enumerate(recipients):
    acc = accounts[i // 100 % len(accounts)]  # 每个账号最多发100封
    msg = MIMEText(f"Dear {recipient},\n\nI'm looking for a referral...")
    msg['Subject'] = "Referral Request"
    msg['From'] = acc['email']
    msg['To'] = recipient

    context = ssl.create_default_context()
    with smtplib.SMTP(acc['smtp'], acc['port']) as server:
        server.starttls(context=context)
        server.login(acc['email'], acc['pwd'])
        server.send_message(msg)
        print(f"✅ Sent to {recipient} via {acc['email']}")
