from app.database import coding_collection
from app.services.ai_service import evaluate_code_feedback


# =========================
# RUN USER CODE
# =========================
def run_user_code(code, input_data):
    try:
        local_vars = {}

        exec(code, {}, local_vars)

        if "solve" not in local_vars:
            return "Error: solve() function not defined"

        # convert input string into variables
        # Example: "nums = [2,7,11,15], target = 9"
        exec(input_data, {}, local_vars)

        # capture output
        import sys
        from io import StringIO

        old_stdout = sys.stdout
        sys.stdout = StringIO()

        local_vars["solve"](**{
            k: v for k, v in local_vars.items() if k not in ["solve"]
        })

        output = sys.stdout.getvalue().strip()

        sys.stdout = old_stdout

        return output

    except Exception as e:
        return f"Error: {str(e)}"


# =========================
# MAIN FUNCTION
# =========================
def evaluate_submission(question_id, code, mode):

    # ✅ FIX: _id is STRING (NO ObjectId)
    question = coding_collection.find_one({"_id": question_id})

    if not question:
        return {
            "passed": 0,
            "total": 0,
            "cases": [],
            "error": "Question not found"
        }

    # ✅ FIX: use sample_tests
    test_cases = question.get("sample_tests", [])

    if not test_cases:
        return {
            "passed": 0,
            "total": 0,
            "cases": [],
            "error": "No test cases found"
        }

    passed = 0
    results = []

    # =========================
    # RUN TEST CASES
    # =========================
    for tc in test_cases:
        output = run_user_code(code, tc["input"])

        if str(output).replace(" ", "") == str(tc["output"]).replace(" ", ""):
            passed += 1
            status = "passed"
        else:
            status = "failed"

        results.append({
            "input": tc["input"],
            "expected": tc["output"],
            "output": output,
            "status": status
        })

    total = len(test_cases)

    # =========================
    # AI FEEDBACK (ONLY ON SUBMIT)
    # =========================
    feedback = ""
    if mode == "submit":
        feedback = evaluate_code_feedback(
            question.get("title", ""),
            code,
            passed,
            total
        )

        # ✅ STORE RESULT IN DB
        coding_collection.update_one(
            {"_id": question_id},
            {
                "$set": {
                    "last_submission": {
                        "code": code,
                        "passed": passed,
                        "total": total,
                        "feedback": feedback
                    }
                }
            }
        )

    # =========================
    # RETURN RESPONSE
    # =========================
    return {
        "passed": passed,
        "total": total,
        "cases": results,
        "feedback": feedback
    }