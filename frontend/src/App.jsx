import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Aptitude from "./pages/Aptitude";
import Verbal from "./pages/Verbal"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aptitude/:sessionId" element={<Aptitude />} />
        <Route path="/verbal/:sessionId" element={<Verbal />} />
      </Routes>
    </BrowserRouter>
  );
}