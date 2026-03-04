import React from "react"
import { useNavigate } from "react-router-dom"
import { startSession } from "../services/api"

function Home(){

    const navigate = useNavigate()

    const handleStart = async (level) => {

        const data = await startSession(level)

        localStorage.setItem("session_id", data.session_id)

        // Navigate to first module
        navigate("/aptitude")
    }

    return(

        <div style={{textAlign:"center"}}>

            <h1>IntelliInterview</h1>

            <p>
                Simulate a real technical interview experience.
                Start your interview by selecting a difficulty level.
            </p>

            <div style={{
                display:"flex",
                justifyContent:"center",
                gap:"30px",
                marginTop:"40px"
            }}>

                <div style={cardStyle}>
                    <h2>Beginner</h2>
                    <p>Service-based company level</p>
                    <button onClick={()=>handleStart("beginner")}>
                        Start Interview
                    </button>
                </div>

                <div style={cardStyle}>
                    <h2>Intermediate</h2>
                    <p>Mid-level company difficulty</p>
                    <button onClick={()=>handleStart("intermediate")}>
                        Start Interview
                    </button>
                </div>

                <div style={cardStyle}>
                    <h2>Advanced</h2>
                    <p>Product-based company level</p>
                    <button onClick={()=>handleStart("advanced")}>
                        Start Interview
                    </button>
                </div>

            </div>

        </div>

    )
}

const cardStyle = {
    border:"1px solid black",
    padding:"20px",
    width:"220px",
    borderRadius:"10px"
}
export default Home 