import os
import urllib.request
import zipfile
import pandas as pd
from pymongo import MongoClient
from datetime import datetime, timedelta

# MongoDB configuration
MONGODB_URI = "mongodb://localhost:27017/"
DB_NAME = "bse_data"
COLLECTION_NAME = "DailyStock"


BSE_URL = "https://www.bseindia.com/download/BhavCopy/Equity/EQ{}_CSV.ZIP"
DOWNLOAD_DIR = "bhavcopy_files"


def download_and_extract(date):
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)

    date_str = date.strftime("%d%m%y")
    url = BSE_URL.format(date_str)

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

    request = urllib.request.Request(url, headers=headers)
    response = urllib.request.urlopen(request)

    zip_file_path = os.path.join(DOWNLOAD_DIR, f"EQ{date_str}_CSV.ZIP")

    with open(zip_file_path, 'wb') as zip_file:
        zip_file.write(response.read())

    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(DOWNLOAD_DIR)

    return f"EQ{date_str}.CSV", date_str


def process_and_store_data(csv_file_path, file_date):
    df = pd.read_csv(csv_file_path)

    df = df[['SC_CODE', 'SC_NAME', 'OPEN', 'HIGH', 'LOW', 'CLOSE']]

    #Pre-Processing Dataset
    df = df.dropna(subset=['SC_CODE'])
    df['date'] = datetime.strptime(file_date, "%d%m%y").strftime('%Y-%m-%d')
    df['SC_NAME'] = df['SC_NAME'].str.rstrip()
    data = df.to_dict(orient='records')

    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    collection.drop_index('code_1')
    collection.insert_many(data)

    client.close()


def fetch_and_store_data_for_date(date):
    csv_file_name, file_date = download_and_extract(date)
    csv_file_path = os.path.join(DOWNLOAD_DIR, csv_file_name)
    process_and_store_data(csv_file_path, file_date)


def main():
    # Fetch data for the last 50 days
    today = datetime.now()
    for i in range(2, 5):#change 5 to the required number get previous days data
        current_date = today - timedelta(days=i)
        fetch_and_store_data_for_date(current_date)

    print("Script executed successfully!")


if __name__ == "__main__":
    main()
