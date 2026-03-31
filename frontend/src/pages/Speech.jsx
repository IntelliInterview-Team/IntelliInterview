import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Speech = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // ================= FETCH =================
  useEffect(() => {
    fetch(`http://localhost:8000/session/${sessionId}/speech`)
      .then(res => res.json())
      .then(data => {
        console.log("Speech:", data);
        setQuestions(data.questions || []);
      });
  }, []);

  // ================= RECORD =================
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioURL(URL.createObjectURL(blob));

      const formData = new FormData();
      formData.append("file", blob);

      await fetch(
        `http://localhost:8000/session/${sessionId}/speech/answer`,
        { method: "POST", body: formData }
      );
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const nextQuestion = () => {
    setAudioURL(null);
    setCurrentIndex(prev => prev + 1);
  };

  const submitAll = () => {
    navigate(`/result/${sessionId}`);
  };

  const question = questions[currentIndex];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎤 Speech Round</h1>

      <div style={styles.main}>
        {/* LEFT */}
        <div style={styles.left}>
          <h3>Questions</h3>

          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.qBox,
                background: currentIndex === i ? "#f39c12" : "#222",
              }}
              onClick={() => setCurrentIndex(i)}
            >
              Q{i + 1}
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <h2>{question?.question}</h2>

          {!isRecording ? (
            <button style={styles.btn} onClick={startRecording}>
              🎤 Start Recording
            </button>
          ) : (
            <button style={styles.stopBtn} onClick={stopRecording}>
              ⏹ Stop Recording
            </button>
          )}

          {audioURL && <audio controls src={audioURL} />}

          <div style={{ marginTop: "20px" }}>
            {currentIndex < questions.length - 1 ? (
              <button style={styles.nextBtn} onClick={nextQuestion}>
                Next ➡
              </button>
            ) : (
              <button style={styles.submitBtn} onClick={submitAll}>
                Submit ✅
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speech;

// ================= STYLES =================
const styles = {
  container: {
    background: "linear-gradient(135deg, #2b5876, #4e4376)",
    minHeight: "100vh",
    padding: "20px",
    color: "white",
  },
  title: { textAlign: "center" },
  main: { display: "flex", gap: "20px" },
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
  },
  right: {
    width: "80%",
    background: "#1c1c1c",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  btn: { padding: "10px", background: "#3498db" },
  stopBtn: { padding: "10px", background: "#e74c3c" },
  nextBtn: { padding: "10px", background: "#f39c12" },
  submitBtn: { padding: "10px", background: "#2ecc71" },
};