from app.database import questions_collection
from app.database import verbal_collection
from app.database import corecs_collection 
from app.database import coding_collection 
import random


def fetch_aptitude_questions(level, limit=20):

    questions = list(
        questions_collection.find(
            {
                "module": "aptitude",
                "level": level
            }
        )
    )

    if len(questions) < limit:
        raise Exception("Not enough questions")

    random.shuffle(questions)

    selected = []
    used_topics = set()

    for q in questions:

        if q["topic"] not in used_topics:

            selected.append(q)
            used_topics.add(q["topic"])

        if len(selected) == limit:
            break

    if len(selected) < limit:

        remaining = [q for q in questions if q not in selected]

        selected.extend(remaining[:limit - len(selected)])

    return selected

# fetching verbal questions

def fetch_verbal_questions(level, limit=15):

    questions = list(
        verbal_collection.find(
            {
                "level": level
            }
        )
    )

    if len(questions) < limit:
        raise Exception("Not enough questions")

    random.shuffle(questions)

    return questions[:limit]

# fetching corecs questions
def fetch_corecs_questions(level):

    subjects = ["dbms", "os", "cn", "oop"]

    selected_questions = []

    for subject in subjects:

        questions = list(
            corecs_collection.find(
                {
                    "level": level,
                    "topic": subject
                }
            )
        )

        if len(questions) < 5:
            raise Exception(f"Not enough questions in {subject}")

        random.shuffle(questions)

        selected_questions.extend(questions[:5])

    random.shuffle(selected_questions)

    return selected_questions

def fetch_coding_questions(level, limit=2):
    
    questions = list(
        coding_collection.find({
            "level": level
        })
    )

    if len(questions) < limit:
        raise Exception("Not enough coding questions")

    random.shuffle(questions)

    selected = []
    used_topics = set()

    for q in questions:
        if q["topic"] not in used_topics:
            selected.append(q)
            used_topics.add(q["topic"])

        if len(selected) == limit:
            break

    if len(selected) < limit:
        remaining = [q for q in questions if q not in selected]
        selected.extend(remaining[:limit - len(selected)])

    # 🔥🔥🔥 MOST IMPORTANT FIX
    for q in selected:
        q["_id"] = str(q["_id"])   # ✅ convert ObjectId
        q["constraints"] = q.get("constraints", [])
        q["sample_tests"] = q.get("sample_tests", [])

    return selected
def fetch_speech_questions(level, limit=5):

    questions = list(
        verbal_collection.find(
            {
                "level": level,
                "module": "speech"
            }
        )
    )

    if len(questions) < limit:
        raise Exception("Not enough speech questions")

    random.shuffle(questions)

    return questions[:limit]
