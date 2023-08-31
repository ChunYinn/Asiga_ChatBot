from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse,JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import json
from db import authenticate_customer, start_new_chat_session, log_message,get_user_by_id, delete_session
from chatgpt import chat_with_gpt3
import uuid

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
async def handle_login(request: Request, username: str = Form(...), password: str = Form(...)):
    # Validate the user credentials
    customer = authenticate_customer(username, password)
    if not customer:
        return templates.TemplateResponse("login.html", {"request": request, "error": "Invalid credentials"})
    # Redirect to the chat page
    return RedirectResponse(url=f"/chat/{str(customer['_id'])}")

@app.post("/chat/{user_id}", response_class=HTMLResponse)
async def read_root(request: Request, user_id: str):
    customer = get_user_by_id(user_id)
    if not customer:
        raise HTTPException(status_code=404, detail="User not found")
    
    return templates.TemplateResponse("index.html", {
        "request": request, 
        "user": customer["customer_name"], 
        "chat_data": customer["chat_sessions"],
        "user_id": str(customer['_id'])
    })


@app.post("/chat/{user_id}/submit")
async def submit_message(user_id: str, user_message: str = Form(...), session_id: str = Form(...)):
    print(f"session_id: {session_id}")
    # AI response
    response_message = chat_with_gpt3(user_message)
    print(f"response_message: {response_message}")
    
    # Log the user's message (wrong here)
    log_result = log_message(user_id, session_id, "user", user_message)
    if "error" in log_result:
        raise HTTPException(status_code=500, detail=log_result["error"])
    
    # Log the chatbot's response
    log_result = log_message(user_id, session_id, "chatbot", response_message)
    if "error" in log_result:
        raise HTTPException(status_code=500, detail=log_result["error"])
    
    return JSONResponse(content={"message": response_message})

@app.post("/start-session/{user_id}")
async def start_session(user_id: str):
    new_session = start_new_chat_session(user_id)
    if "error" in new_session:
        raise HTTPException(status_code=404, detail=new_session["error"])
    return {"session_id": new_session["session_id"]} #return session_id}


@app.delete("/delete-session/{user_id}/{session_id}")
async def delete_session_endpoint(user_id: str, session_id: str):
    result = delete_session(user_id, session_id)
    if result:
        return {"message": "Session deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete the session")
