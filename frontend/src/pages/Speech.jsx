import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Speech = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    fetch(`http://localhost:8000/session/${sessionId}/speech`)
      .then(res => res.json())
      .then(data => setQuestions(data.questions || []));
  }, []);

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

      const qid = questions[currentIndex]?._id;
      if (!qid) {
        console.error("❌ Question ID missing");
        return;
      }

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("question_id", qid);

      setLoading(true);

      const res = await fetch(
        `http://localhost:8000/session/${sessionId}/speech/answer`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      setResult(data);
      setLoading(false);
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
    setResult(null);
    setCurrentIndex(prev => prev + 1);
  };

  const submitAll = () => navigate(`/result/${sessionId}`);

  const question = questions[currentIndex];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🎤 Speech Interview</h2>
        <button style={styles.homeBtn} onClick={() => navigate("/")}>
          ⬅ Home
        </button>
      </div>

      <div style={styles.card}>
        <h3>Question {currentIndex + 1}</h3>
        <p style={{ fontSize: "18px", marginTop: "10px" }}>
          {question?.question}
        </p>

        <div style={styles.controls}>
          {!isRecording ? (
            <button style={styles.startBtn} onClick={startRecording} disabled={loading}>
              🎤 Start
            </button>
          ) : (
            <button style={styles.stopBtn} onClick={stopRecording}>
              ⏹ Stop
            </button>
          )}
        </div>

        {audioURL && <audio controls src={audioURL} style={{ marginTop: "15px" }} />}

        {loading && <p style={{ marginTop: "10px" }}>⏳ Evaluating...</p>}

        {result && (
          <div style={styles.resultBox}>
            <h3>📝 Transcription</h3>
            <p>{result.transcription}</p>

            <h3>📊 Score: {result.evaluation?.score}/10</h3>

            <p><b>Feedback:</b> {result.evaluation?.feedback}</p>
            <p><b>Tip:</b> {result.evaluation?.tip}</p>
            <p><b>Confidence:</b> {result.confidence}</p>
          </div>
        )}

        <div style={styles.navBtns}>
          {currentIndex < questions.length - 1 ? (
            <button style={styles.nextBtn} onClick={nextQuestion} disabled={loading}>
              Next ➡
            </button>
          ) : (
            <button style={styles.submitBtn} onClick={submitAll} disabled={loading}>
              Submit ✅
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Speech;

const styles = {
  container: {
    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
    minHeight: "100vh",
    padding: "30px",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  homeBtn: {
    background: "white",
    color: "black",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  card: {
    background: "white",
    color: "black",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "700px",
    margin: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  controls: {
    marginTop: "20px",
  },
  startBtn: {
    background: "#2ecc71",
    padding: "10px 15px",
    borderRadius: "8px",
  },
  stopBtn: {
    background: "#e74c3c",
    padding: "10px 15px",
    borderRadius: "8px",
  },
  nextBtn: {
    background: "#3498db",
    padding: "10px 15px",
    borderRadius: "8px",
  },
  submitBtn: {
    background: "#9b59b6",
    padding: "10px 15px",
    borderRadius: "8px",
  },
  navBtns: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#f4f6f7",
    borderRadius: "10px",
  }
};