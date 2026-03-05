from app.database import questions_collection
from app.database import verbal_collection
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