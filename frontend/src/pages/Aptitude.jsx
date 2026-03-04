import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
    getSessionQuestions,
    saveAnswer,
    completeSession
} from "../services/api"

export default function Aptitude(){

    const navigate = useNavigate()

    // ✅ Get sessionId from URL
    const { sessionId } = useParams()

    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(1200)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        loadQuestions()
    },[])

    const loadQuestions = async ()=>{
        const data = await getSessionQuestions(sessionId)
        setQuestions(data.questions)
        setTimeLeft(data.duration)
        setLoading(false)
    }

    useEffect(()=>{
        const timer = setInterval(()=>{
            setTimeLeft(prev => {
                if(prev <= 1){
                    handleComplete()
                    return 0
                }
                return prev - 1
            })
        },1000)

        return ()=>clearInterval(timer)
    },[])

    const handleAnswer = async(option)=>{
        const question_id = questions[currentIndex]._id

        await saveAnswer(sessionId, question_id, option)

        setAnswers({
            ...answers,
            [currentIndex]: option
        })
    }

    const handleNext = ()=>{
        if(currentIndex < questions.length - 1)
            setCurrentIndex(currentIndex + 1)
    }

    const handleComplete = async ()=>{
        await completeSession(sessionId)
        alert("Aptitude Completed!")

        // ✅ Navigate to verbal route (NOT file name)
        navigate("/verbal")
    }

    if(loading)
        return <h2 style={{color:"white"}}>Loading...</h2>

    const question = questions[currentIndex]

    return(
        <div className="aptitude-container">

            {/* Sidebar */}
            <div className="aptitude-sidebar">
                {questions.map((q,index)=>{

                    const answered = answers[index]

                    return(
                        <div
                            key={index}
                            className={`question-indicator 
                                ${answered ? "attempted" : ""} 
                                ${currentIndex === index ? "active" : ""}`}
                            onClick={()=>setCurrentIndex(index)}
                        >
                            {index+1}
                        </div>
                    )
                })}
            </div>

            {/* Question Area */}
            <div className="aptitude-content">

                <div className="timer">
                    Time Left: {Math.floor(timeLeft/60)} :
                    {timeLeft%60 < 10 ? "0"+(timeLeft%60) : timeLeft%60}
                </div>

                <div className="question-card">

                    <h2>
                        Q{currentIndex+1}. {question.question}
                    </h2>

                    {question.options.map((opt,index)=>(
                        <button
                            key={index}
                            className="option-button"
                            onClick={()=>handleAnswer(opt)}
                        >
                            {opt}
                        </button>
                    ))}

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
    )
}