import React from "react";

// FORMAT ONLY FOR DISPLAY (NOT MODIFYING ACTUAL DATA)
const formatInput = (input) => {
  try {
    // If already JSON → pretty print
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // If "nums = [1,2]"
    if (input.includes("=")) {
      return input;
    }
    return input;
  }
};

const CodingQuestion = ({ question }) => {
  return (
    <div className="coding-question">

      <h2>{question.title}</h2>

      <p>{question.question}</p>

      {/* CONSTRAINTS */}
      <h4>Constraints:</h4>
      <ul>
        {(question.constraints || []).map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      {/* SAMPLE TEST CASES */}
      <h4>Sample Tests:</h4>

      {(question.sample_tests || []).map((t, i) => (
        <div key={i} className="testcase">

          <p><b>Input:</b></p>
          <pre className="code-block">
            {formatInput(t.input)}
          </pre>

          <p><b>Output:</b></p>
          <pre className="code-block">
            {t.output}
          </pre>

        </div>
      ))}

    </div>
  );
};

export default CodingQuestion;