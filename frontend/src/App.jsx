import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Aptitude from "./pages/Aptitude"

export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aptitude" element={<Aptitude />} />
      </Routes>
    </Router>
  )
}