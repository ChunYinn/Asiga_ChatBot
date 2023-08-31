from datetime import datetime
from pymongo.mongo_client import MongoClient
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError

uri = "mongodb+srv://eric:123@asiga.tmcfs9q.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri)

db = client.chat_db #database name 
customers = db.customers #collection name

# set seed my own data (hard code)
# def seed_data():
#     # Check if the user already exists
#     if not customers.find_one({"customer_email": "a@gmail.com"}):
#         user_data = {
#             "customer_id": 1,
#             "customer_name": "Eric",
#             "customer_email": "a@gmail.com",
#             "customer_password": "123456",
#             "chat_sessions": []
#         }
#         customers.insert_one(user_data)

#get user
def get_user_by_id(user_id):
    return customers.find_one({"_id": ObjectId(user_id)})

def authenticate_customer(email, password):
    user = customers.find_one({"customer_email": email})
    if user and user["customer_password"] == password:
        return user
    else:
        return False

def start_new_chat_session(user_id: str):
    # Get the user from the DB
    oid = ObjectId(user_id)
    user = customers.find_one({"_id": oid})

    if not user:
        return {"error": "User not found"}

    # Create a new session
    new_session = {
        "session_id": str(ObjectId()),  # Using ObjectId as a unique session ID
        "start_timestamp": datetime.now().isoformat(),
        "chat_log": [
            {
                "_id": str(ObjectId()),
                "sender": "bot",
                "content": "Asiga GPT: How can I help you?",
                "timestamp": datetime.now().isoformat()
            }
        ]
    }

    # Append this session to user's chat_sessions and save
    user['chat_sessions'].append(new_session)
    customers.save(user)

    return new_session

#when msg is sent or received
def log_message(user_id, session_id, sender, content):
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found"}

    message = {
        "sender": sender,
        "content": content,
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        db.customers.update_one(
            {"_id": ObjectId(user_id), "chat_sessions.session_id": session_id},
            {"$push": {"chat_sessions.$.chat_log": {
                "sender": sender,
                "content": content,
                "timestamp": datetime.now().isoformat()
            }}}
        )
    except PyMongoError as e:
        print("MongoDB Error in log_message:", e)

    return message

