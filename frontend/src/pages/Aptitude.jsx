import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getSessionQuestions,
  saveAnswer,
  completeSession
} from "../services/api";

export default function Aptitude() {

  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1200);
  const [loading, setLoading] = useState(true);

  // Load questions
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await getSessionQuestions(sessionId);
    setQuestions(data.questions);
    setTimeLeft(data.duration);
    setLoading(false);
  };

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Save Answer
  const handleAnswer = async (option) => {
    const question_id = questions[currentIndex]._id;

    await saveAnswer(sessionId, question_id, option);

    setAnswers({
      ...answers,
      [currentIndex]: option
    });
  };

  // Next Question
  const handleNext = () => {
    if (currentIndex < questions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  // Complete Session
  const handleComplete = async () => {
    await completeSession(sessionId);
    alert("Aptitude Completed!");
    navigate("/verbal");
  };

  if (loading)
    return <h2 style={{ color: "white" }}>Loading...</h2>;

  const question = questions[currentIndex];

  return (
  <div className="aptitude-page">

    {/* Top Ribbon */}
    <div className="top-ribbon">
      <div className="title-area">
        <div className="brand-title">IntelliInterview</div>
        <div className="module-title">Aptitude & Logical Reasoning</div>
      </div>

      <div className="timer-box">
        ⏱
        {Math.floor(timeLeft / 60)} :
        {timeLeft % 60 < 10
          ? "0" + (timeLeft % 60)
          : timeLeft % 60}
      </div>
    </div>

    {/* Body */}
    <div className="aptitude-body">

      {/* Sidebar (Question Strip) */}
      <div className="aptitude-sidebar">
        {questions.map((q, index) => {
          const answered = answers[index];
          return (
            <div
              key={index}
              className={`question-indicator 
                ${answered ? "attempted" : ""} 
                ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>

      {/* Question Area */}
      <div className="question-area">

        <div className="question-card">

          <div className="question-content">
            <h2>
              Q{currentIndex + 1}. {question.question}
            </h2>

            {question.options.map((opt, index) => {
              const optionLabel = ["A", "B", "C", "D"][index];
              const isSelected = answers[currentIndex] === opt;

              return (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleAnswer(opt)}
                >
                  {/* Radio circle */}
                  <span className={`option-radio ${isSelected ? "selected" : ""}`}></span>

                  {/* Option Label */}
                  <strong>{optionLabel}.</strong> {opt}
                </button>
              );
            })}
          </div>

          <div className="button-area">
            {currentIndex < questions.length - 1 ? (
              <button
                className="next-btn"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="submit-btn"
                onClick={handleComplete}
              >
                Submit
              </button>
            )}
          </div>

        </div>

      </div>

    </div>

  </div>
);
}