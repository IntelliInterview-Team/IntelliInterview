const BASE_URL = "http://localhost:8000"

export const startSession = async (level) => {

    const res = await fetch(`${BASE_URL}/session/start/${level}`, {
        method: "POST"
    })

    return await res.json()
}

export const getAptitudeQuestions = async (level) => {

    const res = await fetch(`${BASE_URL}/aptitude/${level}`)

    return await res.json()
}