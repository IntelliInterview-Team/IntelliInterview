const BASE_URL = "http://localhost:8000"

// Start Session
export const startSession = async (level) => {
    const res = await fetch(`${BASE_URL}/session/start/${level}`, {
        method: "POST"
    })
    return await res.json()
}

// Get Questions
export const getSessionQuestions = async (session_id) => {
    const res = await fetch(`${BASE_URL}/session/${session_id}/questions`)
    return await res.json()
}

// Save Answer
export const saveAnswer = async (session_id, question_id, selected_answer) => {
    const res = await fetch(
        `${BASE_URL}/session/${session_id}/answer?question_id=${question_id}&selected_answer=${selected_answer}`,
        { method: "POST" }
    )
    return await res.json()
}

// Complete Session
export const completeSession = async (session_id) => {
    const res = await fetch(`${BASE_URL}/session/${session_id}/complete`, {
        method: "POST"
    })
    return await res.json()
}
// verbal questions
export const getVerbalQuestions = async (session_id) => {
    const res = await fetch(`${BASE_URL}/session/${session_id}/verbal`)
    return await res.json()
}