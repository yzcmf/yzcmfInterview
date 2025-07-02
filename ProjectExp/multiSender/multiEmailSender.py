# refer to google sheet app script
# Design multi-sender as Referers; Recuriters; Hiring Managers; Co-founders; Investors; Customers Emails;

def multiEmailSender():
    import smtplib, ssl, csv, os, re, socket
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.mime.base import MIMEBase
    from email import encoders

    # 多账号配置
    accounts = [
        {"email": "yzcmf453@gmail.com", "pwd": "pccvvkvgbomopqnt", "smtp": "smtp.gmail.com", "port": 587},
        {"email": "yzcmf80@gmail.com", "pwd": "gytaldifxehhawbc", "smtp": "smtp.gmail.com", "port": 587},
        {"email": "yzcmf72@gmail.com", "pwd": "ioyvlinfqmjvjgnl", "smtp": "smtp.gmail.com", "port": 587},
        # 可继续添加账号
    ]

    # 附件路径
    attachments = [
        "./attachments/CV8 [Jack][M].pdf",
        "./attachments/CV8 [Jack][SDE].pdf",
        "./attachments/M2_Engineer_Cover.pdf",
        "./attachments/M2_SelfIntro.pdf",
        "./attachments/Senior_Staff_Engineer_Cover.pdf",
        "./attachments/Senior_Staff_SelfIntro.pdf"
    ]

    # 提取合法邮箱部分（如修复 .开头、嵌入文本中等）
    def extract_valid_email_part(email):
        email = email.strip()
        email_regex = re.compile(r"[a-zA-Z0-9][a-zA-Z0-9_.+-]{2,}@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}")
        match = email_regex.search(email)
        if match:
            return match.group(0)
        return None

    # 验证邮箱格式 + MX记录
    def is_valid_email(email):
        email = email.strip()
        email_regex = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$")
        if not email_regex.match(email):
            return False
        try:
            domain = email.split("@")[1]
            if not domain or ".." in domain or domain.startswith(".") or domain.endswith("."):
                return False
            socket.gethostbyname(domain)
            return True
        except Exception:
            return False

    # 加载收件人邮箱列表
    with open("./data/screenshot_emails_deduplicated.csv", encoding="utf-8") as f:
        reader = csv.reader(f)
        raw_emails = [row[0].strip() for row in reader if row]

    # 修复并筛选有效邮箱
    recipients = []
    for raw in raw_emails:
        fixed = extract_valid_email_part(raw)
        if fixed and not fixed.split("@")[0].isdigit() and is_valid_email(fixed):
            recipients.append(fixed)

    print(f"📬 总有效邮箱数: {len(recipients)}")

    # 群发逻辑
    for i, recipient in enumerate(recipients):
        acc = accounts[i // 100 % len(accounts)]

        # 创建邮件内容
        msg = MIMEMultipart()
        msg['Subject'] = "Referral Request for Backend/Infra/EM Role – Ex-Oracle & Huawei"
        msg['From'] = acc['email']
        msg['To'] = recipient

        body = MIMEText(f"""
    Hi Referrer,
    
    I hope this message finds you well!
    
    My name is Jack Zhou. I’m currently exploring new opportunities in backend or infrastructure engineering. I came across your contact via 1point3acres and saw you’re associated with a top-tier tech company.
    
    A bit about me:
    - 7+ years experience in large-scale cloud systems  
    - Focus: infrastructure, monitoring, and security  
    - Key projects: SLAPS @ Oracle, SFS 2.0 @ Huawei, and my AI+Trust startup (TrustScience)
    
    If your team is hiring, I’d love to explore ways I can contribute. I’d be very grateful for a referral or any advice you can share.
    
    Warm regards,  
    Jack Zhou  
    GitHub: https://github.com/yzcmf  
    📞 +1 (313) 923‑4257 | ✉️ yzcmf94@gmail.com
    """, "plain")
        msg.attach(body)

        # 附件
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

        # 发送
        try:
            context = ssl.create_default_context()
            with smtplib.SMTP(acc['smtp'], acc['port']) as server:
                server.starttls(context=context)
                server.login(acc['email'], acc['pwd'])
                server.send_message(msg)
                print(f"✅ Sent to {recipient} via {acc['email']}")
        except Exception as e:
            print(f"⚠️ Failed to send to {recipient}: {e}")

multiEmailSender()