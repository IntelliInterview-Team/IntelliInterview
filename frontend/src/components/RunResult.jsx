import React from "react";

const RunResult = ({ result }) => {
  if (!result) return null;

  const cases = result?.cases || [];
  const passed = result?.passed || 0;
  const total = result?.total || 0;

  return (
    <div style={{ marginTop: "20px" }}>

      <h3 style={{ marginBottom: "10px" }}>
        Passed {passed} / {total} Test Cases
      </h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {cases.map((c, index) => {
          const isPass = c.status === "passed";

          return (
            <div
              key={index}
              title={`Test Case ${index + 1}`}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isPass ? "#16a34a" : "#dc2626",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {isPass ? "✓" : "✗"}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "15px" }}>
        {cases.map((c, i) => (
          <div key={i}>
            Test Case {i + 1}:{" "}
            <span style={{ color: c.status === "passed" ? "#16a34a" : "#dc2626" }}>
              {c.status === "passed" ? "Passed" : "Failed"}
            </span>
          </div>
        ))}
      </div>

      {result.feedback && (
        <div style={{ marginTop: "15px" }}>
          <h4>AI Feedback:</h4>
          <pre style={{ background: "#111", color: "#0f0", padding: "10px" }}>
            {result.feedback}
          </pre>
        </div>
      )}

    </div>
  );
};

export default RunResult;