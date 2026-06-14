import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def send_warranty_alert(to_email: str, merchant: str, warranty_expiry: str, days_left: int):
    sender = os.getenv("SMTP_EMAIL")
    password = os.getenv("SMTP_PASSWORD")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"⚠️ Warranty Expiring Soon — {merchant}"
    msg["From"] = sender
    msg["To"] = to_email

    html = f"""
    <html>
    <body style="font-family: Inter, sans-serif; background: #f3f2ef; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 24px; border: 1px solid #e0dfdc;">
            <h2 style="color: #0a66c2;">🧾 ReceiptRadar</h2>
            <p style="color: #333;">Your warranty for <strong>{merchant}</strong> is expiring soon!</p>
            <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="color: #cc1016; margin: 0;">⏰ <strong>{days_left} days left</strong> — expires on {warranty_expiry}</p>
            </div>
            <p style="color: #666; font-size: 13px;">Login to ReceiptRadar to take action before your warranty expires.</p>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, to_email, msg.as_string())
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Email failed: {e}")
        return False