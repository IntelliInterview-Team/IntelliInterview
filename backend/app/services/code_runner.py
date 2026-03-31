import json
import sys
import io
import inspect

def run_user_code(code: str, input_data: str):
    old_stdout = sys.stdout

    try:
        local_scope = {}
        input_data = input_data.strip()

        # =========================
        # STEP 1: PARSE INPUT
        # =========================
        try:
            parsed = json.loads(input_data)

            if isinstance(parsed, dict):
                local_scope.update(parsed)
            else:
                local_scope["data"] = parsed

        except:
            if "=" in input_data:
                key, value = input_data.split("=", 1)
                local_scope[key.strip()] = eval(value.strip())
            else:
                local_scope["data"] = eval(input_data)

        # =========================
        # STEP 2: CAPTURE PRINT
        # =========================
        sys.stdout = mystdout = io.StringIO()

        # =========================
        # STEP 3: EXECUTE CODE
        # =========================
        exec(code, {}, local_scope)

        if "solve" not in local_scope:
            raise Exception("Function 'solve' not defined")

        solve = local_scope["solve"]

        # =========================
        # STEP 4: PASS ONLY REQUIRED PARAMS
        # =========================
        params = inspect.signature(solve).parameters
        args = {k: v for k, v in local_scope.items() if k in params}

        try:
            result = solve(**args)
        except:
            result = solve()

        # =========================
        # STEP 5: HANDLE PRINT VS RETURN
        # =========================
        printed = mystdout.getvalue().strip()
        sys.stdout = old_stdout

        return printed if printed else result

    except Exception as e:
        sys.stdout = old_stdout
        raise Exception(f"Runtime Error: {str(e)}")