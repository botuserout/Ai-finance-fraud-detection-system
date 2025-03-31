import pandas as pd
import gspread
import numpy as np
import smtplib
import random
import time
from email.mime.text import MIMEText
from oauth2client.service_account import ServiceAccountCredentials
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# -------------------- 1️⃣ Connect to Google Sheets --------------------
def connect_google_sheets(realtime_database):
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/spreadsheets",
             "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]
    
    creds = ServiceAccountCredentials.from_json_keyfile_name("agents/fraud-detection-key.json", scope)
    client = gspread.authorize(creds)
    sheet = client.open(realtime_database).sheet1  
    return sheet

# -------------------- 2️⃣ Fetch Transactions --------------------
def fetch_transactions(sheet):
    data = sheet.get_all_records()
    df = pd.DataFrame(data)
    
    if "user_email" not in df.columns:
        print("❌ ERROR: 'user_email' column missing in the dataset.")
        return None

    required_numeric_cols = ["transaction_amount", "transaction_time", "account_age_days", "num_transactions"]
    for col in required_numeric_cols:
        if col not in df.columns:
            print(f"❌ ERROR: Missing required column '{col}' in dataset.")
            return None

    for col in required_numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    if "Verification_Status" not in df.columns:
        df["Verification_Status"] = np.nan  

    return df

# -------------------- 3️⃣ Train Fraud Models --------------------
def train_fraud_models(df, selected_features):
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df[selected_features])

    # Adjust contamination to make fraud detection more sensitive
    isolation_model = IsolationForest(contamination=0.2, random_state=42)  
    isolation_model.fit(df_scaled)

    kmeans_model = KMeans(n_clusters=2, random_state=42, n_init=10)
    kmeans_model.fit(df_scaled)

    return scaler, isolation_model, kmeans_model

# -------------------- 4️⃣ Detect Fraud --------------------
def detect_fraud(df, scaler, isolation_model, kmeans_model, selected_features):
    df_scaled = scaler.transform(df[selected_features])

    # Isolation Forest detection
    df["Fraud_Anomaly"] = np.where(isolation_model.predict(df_scaled) == -1, "Fraud", "Normal")

    # K-Means detection
    kmeans_pred = kmeans_model.predict(df_scaled)
    cluster_means = [df[selected_features][kmeans_pred == i].mean().sum() for i in range(2)]
    fraud_cluster = np.argmax(cluster_means)
    df["Fraud_Pattern"] = np.where(kmeans_pred == fraud_cluster, "Fraud", "Normal")

    # Final decision: If EITHER model detects fraud, mark as Fraud
    df["Final_Fraud_Flag"] = np.where(
        (df["Fraud_Anomaly"] == "Fraud") | (df["Fraud_Pattern"] == "Fraud"),  
        "Fraud", 
        "Normal"
    )

    print("\n🔍 Fraud Detection Results:")
    print(df[["transaction_id", "Fraud_Anomaly", "Fraud_Pattern", "Final_Fraud_Flag"]])

    return df

# -------------------- 5️⃣ Email OTP Setup --------------------
SENDER_EMAIL = "kishanchauhan10888@gmail.com"
SENDER_PASSWORD = "kxup yeen eqgx spzy"

def generate_otp():
    return random.randint(100000, 999999)

def send_email(recipient, otp_code):
    subject = "Your Fraud Verification OTP"
    body = f"Your OTP for transaction verification is: {otp_code}\nThis OTP is valid for 5 minutes."
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = recipient
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient, msg.as_string())
        print(f"✅ OTP sent to {recipient}!")
    except Exception as e:
        print(f"❌ Failed to send OTP to {recipient}: {e}")

def verify_otp(otp_sent):
    try:
        user_otp = input("Enter OTP sent to your email: ").strip()
        if not user_otp.isdigit():
            raise ValueError("OTP must be numeric!")
        if int(user_otp) == otp_sent:
            print("✅ OTP Verified Successfully! Transaction Approved.")
            return "Verified"
        else:
            print("❌ Incorrect OTP. Identity Verification Failed.")
            return "Revoked"
    except Exception as e:
        print(f"⚠ Error: {e}")
    return "Revoked"

# -------------------- 6️⃣ Update Google Sheets --------------------
def update_google_sheets(sheet, df):
    print("\n⏳ Updating Google Sheets...")
    sheet.clear()
    sheet.update([df.columns.values.tolist()] + df.values.tolist())
    print("✅ Google Sheets updated!")

# -------------------- 7️⃣ Main Execution --------------------
if __name__ == "__main__":
    SHEET_NAME = "realtime_database"
    sheet = connect_google_sheets(SHEET_NAME)
    selected_features = ["transaction_amount", "transaction_time", "account_age_days", "num_transactions"]

    df = fetch_transactions(sheet)
    if df is None:
        exit()

    # Train fraud detection models
    scaler, isolation_model, kmeans_model = train_fraud_models(df, selected_features)
    df = detect_fraud(df, scaler, isolation_model, kmeans_model, selected_features)

    # Process transactions
    for index, row in df.iterrows():
        if row["Final_Fraud_Flag"] == "Fraud":
            if pd.notna(row["Verification_Status"]) and row["Verification_Status"] in ["Verified", "Revoked"]:
                print(f"Skipping transaction {row['transaction_id']} ({row['Verification_Status']})")
                continue  # Skip already processed transactions

            user_email = row["user_email"]
            if pd.notna(user_email) and user_email.strip() != "":
                print(f"\n⚠ Fraud detected in transaction {row['transaction_id']}! Sending OTP to {user_email}...")
                otp = generate_otp()
                send_email(user_email, otp)

                verification_result = verify_otp(otp)
                df.at[index, "Verification_Status"] = verification_result
            else:
                print(f"No email found for transaction {row['transaction_id']}. Marking as Revoked.")
                df.at[index, "Verification_Status"] = "Revoked"
        else:
            if pd.isna(row["Verification_Status"]):
                df.at[index, "Verification_Status"] = "Verified"

    # Final cleanup
    df["Verification_Status"] = df["Verification_Status"].fillna("Revoked")

    print("\n🔄 Final Verification Status:")
    print(df[["transaction_id", "Final_Fraud_Flag", "Verification_Status"]])

    update_google_sheets(sheet, df)
    print("\n✅ Fraud verification process completed!")
