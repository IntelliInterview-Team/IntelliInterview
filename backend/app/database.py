from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = MongoClient(MONGO_URL)

db = client.get_database("intelliinterview")
print("DATABASE FILE IS RUNNING")

questions_collection = db.get_collection("aptitude")
print("aptitude collection is running")

verbal_collection = db.get_collection("verbal")
print("verbal collection is running")

corecs_collection = db.get_collection("corecs")
print("corecs collection is running")

coding_collection = db.get_collection("coding")
print("coding collection is running")

sessions_collection = db.get_collection("sessions")
print("DATABASE FILE IS RUNNING")