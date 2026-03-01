import { useLocation } from "react-router-dom";
function Aptitude() {
    const location = useLocation();
    const { level } = location.state || {};
    return (
        <div>
            <h1>Aptitude Test - {level}</h1>
            <p>This is the aptitude test page for the selected level: {level}.</p>
        </div>
    );
}
export default Aptitude;