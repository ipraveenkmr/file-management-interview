from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_db_url = os.getenv("MONGODB_URL")
client = MongoClient(mongo_db_url)
db = client["document_db"]

collections = {
    "documents": db["documents"],
}
