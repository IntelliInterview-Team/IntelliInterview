const BASE_URL = "http://localhost:8000";

// ================= SESSION =================
export const startSession = async (level) => {
  try {
    const res = await fetch(`${BASE_URL}/session/start/${level}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { error: "Failed to start session" };
  }
};

export const getSessionQuestions = async (session_id) => {
  try {
    const res = await fetch(`${BASE_URL}/session/${session_id}/questions`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { questions: [] };
  }
};

export const saveAnswer = async (session_id, question_id, selected_answer) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/answer?question_id=${encodeURIComponent(
        question_id
      )}&selected_answer=${encodeURIComponent(selected_answer)}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { error: "Failed to save answer" };
  }
};

// ================= VERBAL =================
export const getVerbalQuestions = async (session_id) => {
  try {
    const res = await fetch(`${BASE_URL}/session/${session_id}/verbal`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { questions: [] };
  }
};

export const saveVerbalAnswer = async (session_id, question_id, selected_answer) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/verbal/answer?question_id=${encodeURIComponent(
        question_id
      )}&selected_answer=${encodeURIComponent(selected_answer)}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { error: "Failed to save verbal answer" };
  }
};

// ================= CORE CS =================
export const getCoreCSQuestions = async (session_id) => {
  try {
    const res = await fetch(`${BASE_URL}/session/${session_id}/corecs`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { questions: [] };
  }
};

export const saveCoreCSAnswer = async (session_id, question_id, selected_answer) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/corecs/answer?question_id=${encodeURIComponent(
        question_id
      )}&selected_answer=${encodeURIComponent(selected_answer)}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { error: "Failed to save core CS answer" };
  }
};

// ================= CODING =================
export const getCodingQuestions = async (session_id) => {
  try {
    const res = await fetch(`${BASE_URL}/session/${session_id}/coding`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { questions: [] };
  }
};
export const submitCode = async (sessionId, questionId, code, mode) => {
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

    console.log("API RESPONSE:", data);

    // ✅ handle backend error safely
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
// ================= COMPLETE SESSION =================
export const completeSession = async (session_id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/session/${session_id}/complete`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { error: "Failed to complete session" };
  }
};