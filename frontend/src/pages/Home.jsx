import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
const  Home = () => {
    const [selectedLevel, setSelectedLevel] = useState('');
    const navigate = useNavigate();
    console.log(selectedLevel);
    return (
    <div>
        <h1>IntelliInterview</h1>
        <p>Welcome to IntelliInterview, your AI-powered interview preparation platform.</p>
        <div className="cards-container">
            <div className={selectedLevel === 'Beginner' ? 'card selected' : 'card'} onClick={() => setSelectedLevel('Beginner')}>
                <h2>Beginner</h2>
                <p>Basic level Questions</p>
            </div> 
            <div className={selectedLevel === 'Intermediate' ? 'card selected' : 'card'} onClick={() => setSelectedLevel('Intermediate')}>
                <h2>Intermediate</h2>
                <p>Moderate Difficulty</p>
            </div>  
            <div className={selectedLevel === 'Advanced' ? 'card selected' : 'card'} onClick={() => setSelectedLevel('Advanced')}>
                <h2>Advanced</h2>
                <p>Industry-Level Simulation</p>
            </div>       
        </div>
        <button disabled={!selectedLevel} onClick={()=>navigate('/Aptitude',{state:{level:selectedLevel}})}>Start Interview</button>
    </div>
    );
}
export default Home;