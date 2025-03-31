from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://192.168.16.229"],  # Example: Frontend IP + port
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Enable CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

def connect_google_sheets():
    """Connect to Google Sheets and return the worksheet"""
    try:
        scope = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
        ]
        creds = ServiceAccountCredentials.from_json_keyfile_name(
            "agents/fraud-detection-key.json", scope)
        client = gspread.authorize(creds)
        return client.open("realtime_database").sheet1
    except Exception as e:
        raise Exception(f"Google Sheets connection failed: {str(e)}")

def get_all_transactions():
    """Fetch all transactions from Google Sheets"""
    try:
        sheet = connect_google_sheets()
        # Get all values and process headers to handle duplicates
        all_values = sheet.get_all_values()
        
        if not all_values:
            return pd.DataFrame()
            
        headers = all_values[0]
        rows = all_values[1:] if len(all_values) > 1 else []
        
        # Process headers to make them unique
        seen_headers = {}
        unique_headers = []
        for header in headers:
            if header in seen_headers:
                seen_headers[header] += 1
                unique_headers.append(f"{header}_{seen_headers[header]}")
            else:
                seen_headers[header] = 0
                unique_headers.append(header)
        
        return pd.DataFrame(rows, columns=unique_headers)
    except Exception as e:
        raise Exception(f"Failed to fetch transactions: {str(e)}")

@app.route('/')
def home():
    """Display transactions from Google Sheets"""
    try:
        df = get_all_transactions()
        
        # Remove any auto-generated unnamed columns
        df = df.loc[:, ~df.columns.str.contains('^Unnamed|^_')]
        
        transactions_html = df.to_html(
            classes='transaction-table', 
            index=False,
            border=0
        ) if not df.empty else "<p>No transactions found</p>"
        
        return f"""
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }}
            .transaction-table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            .transaction-table th, .transaction-table td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            .transaction-table th {{ background-color: #f2f2f2; }}
            .transaction-table tr:nth-child(even) {{ background-color: #f9f9f9; }}
        </style>
        <h1>Transaction Records</h1>
        {transactions_html}
        """
    except Exception as e:
        return f"<h1>Error loading transactions: {str(e)}</h1>"

@app.route('/api/transactions', methods=['GET'])
def get_transactions_json():
    """Return all transactions in JSON format"""
    try:
        df = get_all_transactions()
        df = df.loc[:, ~df.columns.str.contains('^Unnamed|^_')]  # Clean columns
        
        if df.empty:
            return jsonify({"status": "error", "message": "No transactions found"}), 404
            
        return jsonify({
            "status": "success",
            "count": len(df),
            "transactions": df.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/transaction/<transaction_id>', methods=['GET'])
def get_single_transaction(transaction_id):
    """Return a specific transaction in JSON format"""
    try:
        df = get_all_transactions()
        df = df.loc[:, ~df.columns.str.contains('^Unnamed|^_')]  # Clean columns
        
        transaction = df[df['transaction_id'] == transaction_id]
        if transaction.empty:
            return jsonify({"status": "error", "message": "Transaction not found"}), 404
            
        return jsonify({
            "status": "success",
            "transaction": transaction.iloc[0].to_dict()
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)