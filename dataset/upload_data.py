import csv
import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# MongoDB connection setup
load_dotenv(".env")
MONGO_URI = os.getenv("MONGO_URI") # MongoDB connection URI
DB_NAME = "Giet_Hack"  # Database name
COLLECTION_NAME = "Coal"  # Collection name
CSV_FILE_PATH = "./dataset/coal_power_plants.csv"  # Path to the CSV file

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

print("Connected to MongoDB.")
# Read CSV and insert data
with open(CSV_FILE_PATH, mode='r', newline='') as file:
    reader = csv.DictReader(file)
    data_to_insert = []
    
    for row in reader:
        row["plf"] = float(row["plf"])
        row["production"] = int(row["production"])
        row["totalemission"] = float(row["totalemission"])
        row["createdAt"] = row["createdAt"]
        row["updatedAt"] = row["updatedAt"]
        
        # Convert coaluses string back to list of dictionaries
        coal_uses = json.loads(row["coaluses"].replace("'", '"'))  # Convert to valid JSON
        row["coaluses"] = coal_uses
        
        data_to_insert.append(row)
    
    # Insert into MongoDB
    if data_to_insert:
        collection.insert_many(data_to_insert)
        print("Data successfully inserted into MongoDB.")
    else:
        print("No data found in CSV.")

# Close MongoDB connection
client.close()
