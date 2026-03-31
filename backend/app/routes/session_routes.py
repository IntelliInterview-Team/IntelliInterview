from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

import app.services.coding_service as coding_service

from app.services.question_service import (
    fetch_aptitude_questions,
    fetch_verbal_questions,
    fetch_corecs_questions,
    fetch_coding_questions
)

from app.database import sessions_collection

import uuid
from datetime import datetime

router = APIRouter()


# =========================
# REQUEST MODEL
# =========================
class CodeRequest(BaseModel):
    question_id: str
    code: str
    mode: str = "run"


# =========================
# START SESSION
# =========================
@router.post("/session/start/{level}")
def start_session(level: str):
    session_id = str(uuid.uuid4())

    questions = fetch_aptitude_questions(level)

    session = {
        "session_id": session_id,
        "level": level,
        "questions": questions,
        "answers": {},
        "verbal_answers": {},
        "corecs_answers": {},
        "coding_answers": {},
        "speech": [],                # ✅ added
        "speech_questions": [],      # ✅ added
        "started_at": datetime.now(),
        "completed": False
    }

    sessions_collection.insert_one(session)

    return {"session_id": session_id}


# =========================
# APTITUDE
# =========================
@router.get("/session/{session_id}/questions")
def get_session_questions(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "questions": session["questions"],
        "duration": 1200
    }


@router.post("/session/{session_id}/answer")
def save_answer(session_id: str, question_id: str, selected_answer: str):
    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {f"answers.{question_id}": selected_answer}}
    )

    return {"status": "success"}


# =========================
# VERBAL
# =========================
@router.get("/session/{session_id}/verbal")
def get_verbal_questions(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})

    questions = fetch_verbal_questions(session["level"])

    return {
        "questions": questions,
        "duration": 900
    }


@router.post("/session/{session_id}/verbal/answer")
def save_verbal_answer(session_id: str, question_id: str, selected_answer: str):
    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {f"verbal_answers.{question_id}": selected_answer}}
    )

    return {"status": "success"}


# =========================
# CORE CS
# =========================
@router.get("/session/{session_id}/corecs")
def get_corecs_questions(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})

    questions = fetch_corecs_questions(session["level"])

    return {
        "questions": questions,
        "duration": 1200
    }


@router.post("/session/{session_id}/corecs/answer")
def save_corecs_answer(session_id: str, question_id: str, selected_answer: str):
    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {f"corecs_answers.{question_id}": selected_answer}}
    )

    return {"status": "success"}


# =========================
# CODING
# =========================
@router.get("/session/{session_id}/coding")
def get_coding_questions(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})

    questions = fetch_coding_questions(session["level"])

    return {
        "questions": questions,
        "duration": 3600
    }


# =========================
# SUBMIT CODE
# =========================
@router.post("/session/{session_id}/submit-code")
def submit_code(session_id: str, data: CodeRequest):

    session = sessions_collection.find_one({"session_id": session_id})

    result = coding_service.evaluate_submission(
        data.question_id,
        data.code,
        data.mode
    )

    if data.mode == "submit":
        sessions_collection.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    f"coding_answers.{data.question_id}": {
                        "code": data.code,
                        "result": result
                    }
                }
            }
        )

    return {"result": result}


# =========================
# 🎤 SPEECH (HARDCODED)
# =========================
@router.get("/session/{session_id}/speech")
def get_speech_questions(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})

    questions = [
        {"question": "Tell me about yourself"},
        {"question": "Why should we hire you?"},
        {"question": "Describe a challenge you faced"},
        {"question": "What are your strengths and weaknesses?"},
        {"question": "Where do you see yourself in 5 years?"}
    ]

    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {"speech_questions": questions}}
    )

    return {
        "questions": questions,
        "duration": 600
    }


@router.post("/session/{session_id}/speech/answer")
async def save_speech_answer(session_id: str, file: UploadFile = File(...)):

    sessions_collection.update_one(
        {"session_id": session_id},
        {
            "$push": {
                "speech": {
                    "transcript": "Recorded answer",
                    "feedback": "Good attempt 👍"
                }
            }
        }
    )

    return {"status": "saved"}


# =========================
# RESULT
# =========================
@router.get("/session/{session_id}/result")
def get_result(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})

    return {
        "speech_questions": session.get("speech_questions", []),
        "speech": session.get("speech", []),
        "coding": session.get("coding_answers", {}),
        "verbal": session.get("verbal_answers", {}),
        "corecs": session.get("corecs_answers", {}),
        "aptitude": session.get("answers", {})
    }


# =========================
# COMPLETE SESSION
# =========================
@router.post("/session/{session_id}/complete")
def complete_session(session_id: str):
    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {"completed": True}}
    )

    return {"status": "completed"}