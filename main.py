from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse,JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json

from chatgpt import chat_with_gpt3

app = FastAPI()
app.mount("/static", StaticFiles(directory="src/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this as needed for security in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="src/templates")

@app.get("/", response_class=HTMLResponse)
def user_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login") 
async def handle_login(username: str = Form(...), password: str = Form(...)):
    # Add authentication
    return RedirectResponse(url=f"/chat/{username}")

# Renders the chat page for a specific user
@app.post("/chat/{user_name}", response_class=HTMLResponse)
async def read_root(request: Request, user_name: str):
    with open("src/mock_data/test.json") as file:
        data1 = json.load(file)
    return templates.TemplateResponse("index.html", {"request": request, "user": user_name, "chat_data": data1})

@app.post("/chat/{user_name}/submit")
async def submit_message(user_message: str = Form(...)):
    # Process the user's message if needed
    response_message = chat_with_gpt3(user_message)
    return JSONResponse(content={"message": response_message})

#Session-----------------------
# chat_sessions = []

# @app.post("/start-session/")
# def start_session():
#     session = {
#         "id": len(chat_sessions) + 1,
#         "start_timestamp": datetime.now().isoformat()
#     }
#     chat_sessions.append(session)
#     return session

# @app.get("/sessions/")
# def get_sessions():
#     return chat_sessions

# @app.delete("/sessions/{session_id}")
# def delete_session(session_id: int):
#     session_to_remove = next((s for s in chat_sessions if s["id"] == session_id), None)
#     if session_to_remove:
#         chat_sessions.remove(session_to_remove)
#         return {"status": "Session removed"}
#     return {"status": "Session not found"}



