import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

client = InferenceClient(
    model="deepseek-ai/deepseek-coder-6.7b-instruct",
    token=os.getenv("HF_TOKEN")
)
def evaluate_code_feedback(title, code, passed, total):
    prompt = f"""
You are a coding interviewer.

Problem: {title}

Code:
{code}

Result:
Passed {passed} out of {total}

Give short feedback:
- correctness
- mistake
- improvement
"""

    try:
        res = client.text_generation(
            prompt,
            max_new_tokens=200
        )
        return res
    except Exception as e:
        print("HF ERROR:", e)
        return "Feedback unavailable"