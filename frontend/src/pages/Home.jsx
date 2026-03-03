import React from "react"
import { useNavigate } from "react-router-dom"
import { startSession } from "../services/api"


export default function Home(){

    const navigate = useNavigate()


    const handleStart = async (level) => {

        const data = await startSession(level)

        localStorage.setItem("session_id", data.session_id)

        navigate("/aptitude")
    }


    return(

        <div style={{textAlign:"center"}}>

            <h1>Welcome to IntelliInterview</h1>

            <p>
                Practice aptitude interview questions with timer and evaluation
            </p>


            <div style={{
                display:"flex",
                justifyContent:"center",
                gap:"30px",
                marginTop:"40px"
            }}>


                <div style={cardStyle}>

                    <h2>Beginner</h2>

                    <button onClick={()=>handleStart("beginner")}>
                        Start
                    </button>

                </div>


                <div style={cardStyle}>

                    <h2>Intermediate</h2>

                    <button onClick={()=>handleStart("intermediate")}>
                        Start
                    </button>

                </div>


                <div style={cardStyle}>

                    <h2>Advanced</h2>

                    <button onClick={()=>handleStart("advanced")}>
                        Start
                    </button>

                </div>


            </div>

        </div>

    )
}



const cardStyle = {

    border:"1px solid black",
    padding:"20px",
    width:"200px"
}