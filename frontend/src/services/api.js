const BASE_URL = "http://localhost:8000";

// ==========================
// START SESSION
// ==========================
export const startSession = async (level) => {
  try {
    const res = await fetch(`${BASE_URL}/session/start/${level}`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to start session");

    return await res.json();
  } catch (err) {
    console.error("START SESSION ERROR:", err);
    return { error: "Failed to start session" };
  }
};

// ==========================
// GET QUESTIONS (APTITUDE)
// ==========================
export const getSessionQuestions = async (session_id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/questions`
    );

    if (!res.ok) throw new Error("Failed to fetch questions");

    return await res.json();
  } catch (err) {
    console.error("GET QUESTIONS ERROR:", err);
    return { questions: [] };
  }
};

// ==========================
// SAVE ANSWER (APTITUDE)
// ==========================
export const saveAnswer = async (
  session_id,
  question_id,
  selected_answer
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/answer?question_id=${encodeURIComponent(
        question_id
      )}&selected_answer=${encodeURIComponent(selected_answer)}`,
      {
        method: "POST",
      }
    );

    if (!res.ok) throw new Error("Failed to save answer");

    return await res.json();
  } catch (err) {
    console.error("SAVE ANSWER ERROR:", err);
    return { error: "Failed to save answer" };
  }
};

// ==========================
// VERBAL QUESTIONS
// ==========================
export const getVerbalQuestions = async (session_id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/verbal`
    );

    if (!res.ok) throw new Error("Failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return { questions: [] };
  }
};

// ==========================
// SAVE VERBAL ANSWER
// ==========================
export const saveVerbalAnswer = async (
  session_id,
  question_id,
  selected_answer
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/verbal/answer?question_id=${encodeURIComponent(
        question_id
      )}&selected_answer=${encodeURIComponent(selected_answer)}`,
      { method: "POST" }
    );

    if (!res.ok) throw new Error();

    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Failed to save verbal answer" };
  }
};

// ==========================
// CORE CS QUESTIONS
// ==========================
export const getCoreCSQuestions = async (session_id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/corecs`
    );

    if (!res.ok) throw new Error();

    return await res.json();
  } catch (err) {
    console.error(err);
    return { questions: [] };
  }
};

// ==========================
// SAVE CORE CS ANSWER
// ==========================
export const saveCoreCSAnswer = async (
  session_id,
  question_id,
  selected_answer
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/corecs/answer?question_id=${encodeURIComponent(
        question_id
      )}&selected_answer=${encodeURIComponent(selected_answer)}`,
      { method: "POST" }
    );

    if (!res.ok) throw new Error();

    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Failed to save core CS answer" };
  }
};

// ==========================
// CODING QUESTIONS
// ==========================
export const getCodingQuestions = async (session_id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/coding`
    );

    if (!res.ok) throw new Error();

    return await res.json();
  } catch (err) {
    console.error(err);
    return { questions: [] };
  }
};

// ==========================
// SUBMIT CODE
// ==========================
export const submitCode = async (
  sessionId,
  questionId,
  code,
  mode
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/session/${sessionId}/submit-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: questionId,
          code: code,
          mode: mode,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        result: {
          passed: 0,
          total: 0,
          cases: [],
          error: data?.detail || "Submission failed",
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Submit Code Error:", error);

    return {
      result: {
        passed: 0,
        total: 0,
        cases: [],
        error: "Network error",
      },
    };
  }
};

// ==========================
// SPEECH QUESTIONS
// ==========================
export const getSpeechQuestions = async (sessionId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${sessionId}/speech`
    );

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    return {
      questions: data.questions || [],
      duration: data.duration || 600,
    };
  } catch (err) {
    console.error("SPEECH ERROR:", err);

    return {
      questions: [],
      duration: 600,
    };
  }
};

// ==========================
// COMPLETE SESSION
// ==========================
export const completeSession = async (session_id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/complete`,
      {
        method: "POST",
      }
    );

    if (!res.ok) throw new Error();

    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Failed to complete session" };
  }
};