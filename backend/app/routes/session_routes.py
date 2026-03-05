from fastapi import APIRouter, HTTPException
from app.database import sessions_collection
from app.services.question_service import fetch_aptitude_questions
from app.services.question_service import fetch_verbal_questions
from app.services.question_service import fetch_corecs_questions    
import uuid
from datetime import datetime

router = APIRouter()

# Start session
@router.post("/session/start/{level}")
def start_session(level: str):
    session_id = str(uuid.uuid4())
    questions = fetch_aptitude_questions(level)
    session = {
        "session_id": session_id,
        "level": level,
        "questions": questions,
        "answers": {},
        "started_at": datetime.now(),
        "completed": False,
        "duration": 1200  # 20 minutes
    }
    sessions_collection.insert_one(session)
    return {"session_id": session_id}

# Get session questions
@router.get("/session/{session_id}/questions")
def get_session_questions(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"questions": session["questions"], "duration": session.get("duration", 1200)}

# Save answer
@router.post("/session/{session_id}/answer")
def save_answer(session_id: str, question_id: str, selected_answer: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {f"answers.{question_id}": selected_answer}}
    )
    return {"status": "success"}

# Complete session
@router.post("/session/{session_id}/complete")
def complete_session(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    sessions_collection.update_one({"session_id": session_id}, {"$set": {"completed": True}})
    return {"status": "completed"}

@router.get("/session/{session_id}/verbal")
def get_verbal_questions(session_id: str):

    session = sessions_collection.find_one({"session_id": session_id})

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    level = session["level"]

    questions = fetch_verbal_questions(level)

    return {
        "questions": questions,
        "duration": 900
    }
# corecs questions endpoint
@router.get("/session/{session_id}/corecs")
def get_corecs_questions(session_id: str):

    session = sessions_collection.find_one({"session_id": session_id})  
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")    
    level = session["level"]
    questions = fetch_corecs_questions(level)
    return {
        "questions": questions,
        "duration": 1200
    }