import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCodingQuestions, submitCode } from "../services/api";
import CodeEditor from "../components/CodeEditor";
import CodingQuestion from "../components/CodingQuestion";
import RunResult from "../components/RunResult";

const Coding = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [codeMap, setCodeMap] = useState({});
  const [runResult, setRunResult] = useState(null);
  const [timer, setTimer] = useState(3600);

  // ✅ Handle Mongo _id safely
  const getId = (id) => (id?.$oid ? id.$oid : id);

  // ================= FETCH QUESTIONS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCodingQuestions(sessionId);

        const qs = data?.questions || [];
        setQuestions(qs);

        // ✅ Initialize code for each question
        let initial = {};
        qs.forEach((q) => {
          const id = getId(q._id);
          initial[id] = `def solve():
    pass`;
        });

        setCodeMap(initial);
        setTimer(data?.duration || 3600);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchData();
  }, [sessionId]);

  // ================= TIMER =================
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (!questions.length) return <div>Loading...</div>;

  const currentQ = questions[currentTab];
  const currentId = getId(currentQ._id);

  // ================= RUN =================
  const handleRun = async () => {
    try {
      const res = await submitCode(
        sessionId,
        currentId,
        codeMap[currentId],
        "run"
      );

      console.log("RUN RESPONSE:", res);

      setRunResult(res?.result || null); // ✅ SAFE
    } catch (err) {
      console.error("Run Error:", err);
      setRunResult({
        passed: 0,
        total: 0,
        cases: [],
        error: "Run failed"
      });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const res = await submitCode(
        sessionId,
        currentId,
        codeMap[currentId],
        "submit"
      );

      console.log("SUBMIT RESPONSE:", res);

      setRunResult(res?.result || null); // ✅ SAFE

      // ✅ Move to next question or finish
      if (currentTab < questions.length - 1) {
        setCurrentTab((prev) => prev + 1);
        setRunResult(null);
      } else {
        navigate(`/speech/${sessionId}`);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setRunResult({
        passed: 0,
        total: 0,
        cases: [],
        error: "Submit failed"
      });
    }
  };

  // ================= RESET =================
  const handleResetCode = () => {
    setCodeMap((prev) => ({
      ...prev,
      [currentId]: `def solve():
    pass`,
    }));
    setRunResult(null);
  };

  // ================= CLEAR =================
  const handleClear = () => {
    setRunResult(null);
  };

  return (
    <div className="aptitude-page">

      {/* TOP BAR */}
      <div className="top-ribbon">
        <div className="title-area">
          <span className="brand-title">IntelliInterview</span>
          <span className="module-title">Coding</span>
        </div>

        <div className="timer-box">
          ⏱ {Math.floor(timer / 60)}:
          {String(timer % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="coding-body">

        {/* LEFT SIDEBAR */}
        <div className="coding-sidebar">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`coding-qblock ${currentTab === i ? "active" : ""}`}
              onClick={() => {
                setCurrentTab(i);
                setRunResult(null);
              }}
            >
              Q{i + 1}
            </div>
          ))}
        </div>

        {/* QUESTION */}
        <div className="coding-question-area">
          <div className="question-card">
            <div className="question-content">
              <CodingQuestion question={currentQ} />
            </div>
          </div>
        </div>

        {/* EDITOR */}
        <div className="coding-editor-area">

          <CodeEditor
            code={codeMap[currentId]}
            setCode={(val) =>
              setCodeMap((prev) => ({
                ...prev,
                [currentId]: val,
              }))
            }
          />

          {/* BUTTONS */}
          <div className="coding-buttons">
            <button className="next-btn" onClick={handleRun}>
              Run
            </button>

            <button onClick={handleClear}>
              Clear
            </button>

            <button onClick={handleResetCode}>
              Reset
            </button>

            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>

          {/* RESULT */}
          {runResult && <RunResult result={runResult} />}
        </div>
      </div>
    </div>
  );
};

export default Coding;