def evaluate_speech(answer_text: str):
    print("🔥 LLM INPUT:", answer_text)

    if not answer_text or answer_text.strip() == "":
        return "No answer detected. Score: 0/10"

    # Simple evaluation logic (temporary)
    length = len(answer_text.split())

    if length < 5:
        score = 3
        feedback = "Answer too short. Try to elaborate."
    elif length < 15:
        score = 6
        feedback = "Decent answer but can be improved with more details."
    else:
        score = 8
        feedback = "Good answer with clear explanation."

    result = f"{feedback} Score: {score}/10"

    print("✅ LLM OUTPUT:", result)

    return result