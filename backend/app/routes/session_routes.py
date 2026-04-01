from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import whisper
from fastapi import UploadFile, File

import app.services.coding_service as coding_service
from app.services.ai_service import evaluate_speech

from app.services.question_service import (
    fetch_aptitude_questions,
    fetch_verbal_questions,
    fetch_corecs_questions,
    fetch_coding_questions,
    fetch_speech_questions 
)

from app.database import sessions_collection

import uuid
from datetime import datetime

router = APIRouter()

# ✅ Lazy load model (instead of loading at startup)
model = None

def get_model():
    global model
    if model is None:
        model = whisper.load_model("base")  # change to "tiny" for speed
    return model


# =========================
# REQUEST MODEL (MATCHES FRONTEND)
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
        "speech_answers": {},
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
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

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
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    questions = fetch_verbal_questions(session["level"])

    return {
        "questions": questions,
        "duration": 900
    }


@router.post("/session/{session_id}/verbal/answer")
def save_verbal_answer(session_id: str, question_id: str, selected_answer: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

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
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    questions = fetch_corecs_questions(session["level"])

    return {
        "questions": questions,
        "duration": 1200
    }


@router.post("/session/{session_id}/corecs/answer")
def save_corecs_answer(session_id: str, question_id: str, selected_answer: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

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
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

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

    print("🔥 RECEIVED:", data)

    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        result = coding_service.evaluate_submission(
            data.question_id,
            data.code,
            data.mode
        )
    except Exception as e:
        return {
            "result": {
                "passed": 0,
                "total": 0,
                "cases": [],
                "error": str(e)
            }
        }

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

    return {
        "result": {
            "passed": result.get("passed", 0),
            "total": result.get("total", 0),
            "cases": result.get("cases", []),
            "feedback": result.get("feedback", ""),
            "error": result.get("error", None)
        }
    }


# =========================
# COMPLETE CODING
# =========================
@router.post("/session/{session_id}/coding/complete")
def complete_coding(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {"coding_completed": True}}
    )

    return {"status": "coding_completed"}


# =========================
# SPEECH
# =========================
@router.get("/session/{session_id}/speech")
def get_speech_questions(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    questions = fetch_speech_questions(session["level"])

    return {
        "questions": questions,
        "duration": 900
    }


# =========================
# 🎤 SPEECH ANSWER (UPDATED)
# =========================
@router.post("/session/{session_id}/speech/answer")
async def submit_speech_answer(
    session_id: str,
    file: UploadFile = File(...),
    question_id: str = None
):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    import os

    file_path = f"temp_{uuid.uuid4()}_{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    model = get_model()

    result = model.transcribe(file_path, word_timestamps=True)
    text = result["text"]

    print("📝 Transcription:", text)

    # ✅ Confidence
    confidence = 0
    if "segments" in result:
        probs = [seg.get("avg_logprob", 0) for seg in result["segments"]]
        if probs:
            confidence = sum(probs) / len(probs)

    os.remove(file_path)

    # 🤖 AI evaluation
    evaluation = evaluate_speech(text)

    try:
        import json
        evaluation = json.loads(evaluation)
    except:
        evaluation = {
            "score": 0,
            "feedback": str(evaluation),
            "tip": ""
        }

    # ✅ STORE CLEAN STRUCTURE
    if question_id:
        sessions_collection.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    f"speech_answers.{question_id}": {
                        "question_id": question_id,
                        "transcript": text,
                        "confidence": round(confidence, 2),
                        "score": evaluation.get("score", 0),
                        "feedback": evaluation.get("feedback", ""),
                        "tip": evaluation.get("tip", "")
                    }
                }
            }
        )

    return {
        "transcription": text,
        "confidence": round(confidence, 2),
        "evaluation": evaluation
    }

@router.get("/session/{session_id}/result")
def get_result(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    level = session["level"]

    # ================= SPEECH =================
    speech_answers = session.get("speech_answers", {})
    speech_list = []

    for qid, val in speech_answers.items():
        speech_list.append({
            "question_id": qid,
            "transcript": val.get("transcript"),
            "confidence": val.get("confidence", 0),
            "score": val.get("score", 0),
            "feedback": val.get("feedback", ""),
            "tip": val.get("tip", "")
        })

    # ================= VERBAL =================
    verbal_qs = fetch_verbal_questions(level)
    verbal_result = {}

    for q in verbal_qs:
        qid = q["_id"]
        user_ans = session["verbal_answers"].get(qid)

        verbal_result[q["question"]] = {
        "selected": user_ans,
        "correct_answer": q["correct_answer"],
        "correct": user_ans == q["correct_answer"],
        "explanation": q.get("explanation", "")
    }

    # ================= CORECS =================
    corecs_qs = fetch_corecs_questions(level)
    corecs_result = {}

    for q in corecs_qs:
        qid = q["_id"]
        user_ans = session["corecs_answers"].get(qid)

        corecs_result[q["question"]] = {
        "selected": user_ans,
        "correct_answer": q["correct_answer"],
        "correct": user_ans == q["correct_answer"],
        "explanation": q.get("explanation", "")
    }

    # ================= APTITUDE =================
    aptitude_qs = fetch_aptitude_questions(level)
    aptitude_result = {}

    for q in aptitude_qs:
        qid = q["_id"]
        user_ans = session["answers"].get(qid)

        aptitude_result[q["question"]] = {
        "selected": user_ans,
        "correct_answer": q["correct_answer"],
        "correct": user_ans == q["correct_answer"],
        "explanation": q.get("explanation", "")
    }

    # ✅ RETURN OUTSIDE LOOP
    return {
        "speech": speech_list,
        "speech_questions": fetch_speech_questions(level),
        "coding": session.get("coding_answers", {}),
        "verbal": verbal_result,
        "corecs": corecs_result,
        "aptitude": aptitude_result
    }
# =========================
# COMPLETE SESSION
# =========================
@router.post("/session/{session_id}/complete")
def complete_session(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {"completed": True}}
    )

    return {"status": "completed"}