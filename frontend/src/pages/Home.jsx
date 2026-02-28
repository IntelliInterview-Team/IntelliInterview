import React from "react";
const  home = () => {
    return (
    <div>
        <h1>IntelliInterview</h1>
        <p>Welcome to IntelliInterview, your AI-powered interview preparation platform.</p>
        <div className="cards-container">
            <div className="card">
                <h2>Beginner</h2>
                <p>Basic level Questions</p>
            </div> 
            <div className="card">
                <h2>Intermediate</h2>
                <p>Moderate Difficulty</p>
            </div>  
            <div className="card">
                <h2>Advanced</h2>
                <p>Industry-Level Simulation</p>
            </div>       
        </div>
        <button>Start Interview</button>
    </div>
    );
}
export default home;