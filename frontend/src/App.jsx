import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Aptitude from "./pages/Aptitude";
import Verbal from "./pages/Verbal";
import CoreCS from "./pages/CoreCS";
import Coding from "./pages/Coding";
import Speech from "./pages/Speech"; // create later

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aptitude/:sessionId" element={<Aptitude />} />
        <Route path="/verbal/:sessionId" element={<Verbal />} />
        <Route path="/corecs/:sessionId" element={<CoreCS />} />
        <Route path="/coding/:sessionId" element={<Coding />} />
        <Route path="/speech/:sessionId" element={<Speech />} />
      </Routes>
    </BrowserRouter>
  );
}