import React, { useEffect, useState } from "react"

import {
    getSessionQuestions,
    saveAnswer,
    completeSession
} from "../services/api"



export default function Aptitude(){


    const session_id = localStorage.getItem("session_id")


    const [questions, setQuestions] = useState([])

    const [currentIndex, setCurrentIndex] = useState(0)

    const [answers, setAnswers] = useState({})

    const [timeLeft, setTimeLeft] = useState(1200)

    const [loading, setLoading] = useState(true)



    useEffect(()=>{

        loadQuestions()

    },[])



    const loadQuestions = async ()=>{

        const data = await getSessionQuestions(session_id)

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

        const question_id = questions[currentIndex].question_id


        await saveAnswer(session_id, question_id, option)


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

        const result = await completeSession(session_id)

        alert(`Score: ${result.score} / ${result.total}`)
    }



    if(loading)

        return <h2>Loading...</h2>



    const question = questions[currentIndex]



    return(

        <div style={{display:"flex"}}>



            {/* Sidebar */}



            <div style={{
                width:"200px",
                borderRight:"1px solid black"
            }}>


                {questions.map((q,index)=>{


                    const answered = answers[index]


                    return(

                        <button

                            key={index}

                            style={{

                                display:"block",

                                margin:"5px",

                                backgroundColor:
                                    answered ? "green" : "red"

                            }}

                            onClick={()=>setCurrentIndex(index)}

                        >

                            {index+1}

                        </button>
                    )
                })}


            </div>



            {/* Question Area */}



            <div style={{padding:"20px"}}>



                <h3>
                    Time Left: {Math.floor(timeLeft/60)} :
                    {timeLeft%60}
                </h3>



                <h2>
                    Q{currentIndex+1}.
                    {question.question}
                </h2>



                {question.options.map((opt,index)=>{

                    return(

                        <div key={index}>

                            <button

                                onClick={()=>handleAnswer(opt)}

                            >

                                {opt}

                            </button>

                        </div>
                    )
                })}



                <br/>



                <button onClick={handleNext}>
                    Next
                </button>



                <button
                    onClick={handleComplete}
                    style={{marginLeft:"10px"}}
                >

                    Submit Test

                </button>



            </div>



        </div>
    )
}