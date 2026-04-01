import os
import json
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
 
load_dotenv()

client = InferenceClient(
    model= "mistralai/Mistral-7B-Instruct-v0.2",
    token = os.getenv("HF_TOKEN")
)

print(os.getenv("HF_TOKEN"))
# ✅ EXISTING (for coding)
def evaluate_code_feedback(title, code, passed, total):
    prompt = f"""
You are a senior coding interviewer evaluating a candidate's solution.

Problem:
{title}

Candidate Code:
{code}

Test Case Results:
Passed {passed} out of {total}

Evaluate the solution based on:

1. Correctness:
- Does the code handle all edge cases?
- If not fully correct, what is missing?

2. Efficiency:
- Time and space complexity
- Is the approach optimal or can it be improved?

3. Code Quality:
- Readability and structure
- Meaningful variable names
- Clean logic and formatting

4. Approach:
- Is the approach standard or innovative?
- Any better algorithm or data structure possible?

IMPORTANT INSTRUCTIONS:
- Be concise but insightful (4–6 lines total)
- Be slightly strict (like a real interviewer)
- If tests failed, clearly mention why
- If all passed, still suggest improvements

Return in this format ONLY:

Feedback:
<overall feedback in 2-3 lines>

Strengths:
- <point 1>
- <point 2>

Improvements:
- <point 1>
- <point 2>
"""

    try:
        from app.services.ai_service import client
        return client.text_generation(prompt, max_new_tokens=250)
    except Exception as e:
        print("HF ERROR:", e)
        return "Feedback unavailable"
# ✅ ADD THIS FOR SPEECH (IMPORTANT)




def evaluate_speech(text: str):
    # ✅ Handle empty input
    if not text.strip():
        return {
            "score": 0,
            "feedback": "No answer detected",
            "tip": "Try answering clearly and confidently"
        }

    prompt = f"""
You are a professional HR interviewer evaluating a candidate's spoken response.

Candidate Answer:
{text}

Evaluate the answer based on:

1. Clarity:
- Is the answer easy to understand?
- Is the language simple and clear?

2. Confidence:
- Does the answer sound confident and assertive?
- Avoids hesitation or uncertainty?

3. Structure:
- Is the answer well-organized?
- Has a clear beginning, middle, and end?

4. Relevance:
- Does the answer actually address the question?
- Avoids unnecessary or off-topic content?

5. Depth:
- Does the candidate provide examples or meaningful explanation?
- Not too short or too vague?

6. Fluency:
- Does the answer contain filler words (um, uh)?
- Is the speech smooth or broken?

Scoring Guidelines:
- 9-10: Excellent
- 7-8: Good
- 5-6: Average
- 3-4: Poor
- 0-2: Very poor

IMPORTANT:
- Be fair but slightly strict (like a real interviewer)
- Keep feedback concise (2–3 lines max)
- Tip should be actionable and specific

Return ONLY valid JSON.
Do NOT include any explanation, text, or formatting outside JSON.

Format:
{{
  "score": <number between 0 and 10>,
  "feedback": "<short feedback>",
  "tip": "<two clear improvement tips>"
}}
"""

    try:
        response = client.text_generation(prompt, max_new_tokens=200)

        # ✅ Clean response (remove unwanted text if model adds)
        response = response.strip()

        # Sometimes model adds text before JSON → extract JSON part
        if "{" in response and "}" in response:
            response = response[response.find("{"):response.rfind("}") + 1]

        # ✅ Parse safely
        try:
            return json.loads(response)
        except:
            return {
                "score": 5,
                "feedback": "Could not fully evaluate response",
                "tip": "Try speaking more clearly and with better structure"
            }

    except Exception as e:
        print("HF ERROR:", e)
        return {
            "score": 0,
            "feedback": "Evaluation failed",
            "tip": "Try again"
        }