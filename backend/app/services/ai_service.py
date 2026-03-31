import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from openai import OpenAI
client = OpenAI(api_key="YOUR_API_KEY") 
load_dotenv()

client = InferenceClient(
    model="deepseek-ai/deepseek-coder-6.7b-instruct",
    token=os.getenv("HF_TOKEN")
)

# ✅ EXISTING (for coding)
def evaluate_code_feedback(title, code, passed, total):
    prompt = f"""
You are a coding interviewer.

Problem: {title}

Code:
{code}

Result:
Passed {passed} out of {total}

Give short feedback:
"""

    try:
        res = client.text_generation(prompt, max_new_tokens=200)
        return res
    except Exception as e:
        print("HF ERROR:", e)
        return "Feedback unavailable"


# ✅ ADD THIS FOR SPEECH (IMPORTANT)




def evaluate_speech(text: str):
    if not text:
        return "No speech detected."

    prompt = f"""
    Evaluate this interview answer:

    "{text}"

    Give:
    - Feedback
    - Confidence score (out of 10)
    - Fluency score (out of 10)
    - Improvement tip
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content