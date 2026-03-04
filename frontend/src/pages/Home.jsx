import React from "react"
import { useNavigate } from "react-router-dom"
import { startSession } from "../services/api"

function Home(){

    const navigate = useNavigate()

    const handleStart = async (level) => {

        const data = await startSession(level)

        localStorage.setItem("session_id", data.session_id)

        // Navigate to first module
       navigate(`/aptitude/${data.session_id}`)
    }

    return(

        <div className="home-container">

            <h1>IntelliInterview</h1>

            <p>
                Simulate a real technical interview experience.
                Start your interview by selecting a difficulty level.
            </p>

            <div className="cards-wrapper">

                <div className="home-card">
                    <h2>Beginner</h2>
                    <p>Service-based company level</p>
                    <button onClick={()=>handleStart("beginner")}>
                        Start
                    </button>
                </div>

                <div className="home-card">
                    <h2>Intermediate</h2>
                    <p>Mid-level company difficulty</p>
                    <button onClick={()=>handleStart("intermediate")}>
                        Start
                    </button>
                </div>

                <div className="home-card">
                    <h2>Advanced</h2>
                    <p>Product-based company level</p>
                    <button onClick={()=>handleStart("advanced")}>
                        Start
                    </button>
                </div>

            </div>

        </div>

    )
}

export default Home