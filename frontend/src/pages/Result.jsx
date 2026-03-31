import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Result = () => {
  const { sessionId } = useParams();

  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/session/${sessionId}/result`)
      .then((res) => res.json())
      .then((res) => {
        console.log("RESULT:", res);
        setData(res);
      })
      .catch((err) => console.error(err));
  }, [sessionId]);

  if (!data) return <h2 style={{ color: "white" }}>Loading...</h2>;

  // ✅ FROM BACKEND (IMPORTANT FIX)
  const speechQuestions = data.speech_questions || [];
  const speechData = data.speech || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Interview Results</h1>

      {/* ================= SPEECH ================= */}
      <div style={styles.main}>
        <div style={styles.left}>
          <h3>🎤 Questions</h3>

          {speechQuestions.length > 0 ? (
            speechQuestions.map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.qBox,
                  background: selected === i ? "#f39c12" : "#222",
                }}
                onClick={() => setSelected(i)}
              >
                Q{i + 1}
              </div>
            ))
          ) : (
            <p>No questions</p>
          )}
        </div>

        <div style={styles.right}>
          <h2>
            {speechQuestions[selected]?.question || "No question"}
          </h2>

          <div style={styles.card}>
            <h3>📝 Your Answer</h3>
            <p>
              {speechData[selected]?.transcript ||
                "No answer recorded"}
            </p>
          </div>

          <div style={styles.card}>
            <h3>🤖 AI Feedback</h3>
            <p>
              {speechData[selected]?.feedback ||
                "No feedback available"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CODING ================= */}
      <h2 style={styles.heading}>💻 Coding Results</h2>

      <div style={styles.grid}>
        {data.coding &&
          Object.entries(data.coding).map(([key, val], index) => (
            <div key={index} style={styles.card}>
              <h4>{key}</h4>
              <p>Passed: {val?.result?.passed ? "✅ Yes" : "❌ No"}</p>
            </div>
          ))}
      </div>

      {/* ================= VERBAL ================= */}
      <h2 style={styles.heading}>🗣 Verbal Round</h2>

      {data.verbal && Object.keys(data.verbal).length > 0 ? (
        Object.entries(data.verbal).map(([q, val], index) => (
          <div key={index} style={styles.card}>
            <p><strong>Q:</strong> {q}</p>
            <p>
              <strong>Correct:</strong>{" "}
              {val.correct ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        ))
      ) : (
        <p style={styles.empty}>No verbal answers</p>
      )}

      {/* ================= CORE CS ================= */}
      <h2 style={styles.heading}>🧠 CoreCS Round</h2>

      {data.corecs && Object.keys(data.corecs).length > 0 ? (
        Object.entries(data.corecs).map(([q, val], index) => (
          <div key={index} style={styles.card}>
            <p><strong>Q:</strong> {q}</p>
            <p>
              <strong>Correct:</strong>{" "}
              {val.correct ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        ))
      ) : (
        <p style={styles.empty}>No CoreCS answers</p>
      )}

      {/* ================= APTITUDE ================= */}
      <h2 style={styles.heading}>📊 Aptitude Round</h2>

      {data.aptitude && Object.keys(data.aptitude).length > 0 ? (
        Object.entries(data.aptitude).map(([q, val], index) => (
          <div key={index} style={styles.card}>
            <p><strong>Q:</strong> {q}</p>
            <p>
              <strong>Selected:</strong> {val}
            </p>
          </div>
        ))
      ) : (
        <p style={styles.empty}>No aptitude answers</p>
      )}
    </div>
  );
};

export default Result;


// ================= STYLES =================
const styles = {
  container: {
    background: "linear-gradient(135deg, #2b5876, #4e4376)",
    minHeight: "100vh",
    padding: "20px",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  main: {
    display: "flex",
    gap: "20px",
  },

  left: {
    width: "20%",
    background: "#111",
    padding: "10px",
    borderRadius: "10px",
  },

  qBox: {
    padding: "12px",
    margin: "10px 0",
    textAlign: "center",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  },

  right: {
    width: "80%",
    background: "#1c1c1c",
    padding: "20px",
    borderRadius: "10px",
  },

  card: {
    background: "white",
    color: "black",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "10px",
  },

  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  heading: {
    marginTop: "30px",
  },

  empty: {
    color: "#ccc",
  },
};