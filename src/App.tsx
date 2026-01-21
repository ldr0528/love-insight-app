import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LoveTest from "@/pages/LoveTest";
import MBTIPage from "@/pages/MBTIPage";
import PalmPage from "@/pages/PalmPage";
import LoveCoach from "@/pages/LoveCoach";
import NamingMaster from "@/pages/NamingMaster";
import Compatibility from "@/pages/Compatibility";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<LoveTest />} />
        <Route path="/mbti" element={<MBTIPage />} />
        <Route path="/palm" element={<PalmPage />} />
        <Route path="/coach" element={<LoveCoach />} />
        <Route path="/naming" element={<NamingMaster />} />
        <Route path="/compatibility" element={<Compatibility />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
