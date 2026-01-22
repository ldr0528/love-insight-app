import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LoveTest from "@/pages/LoveTest";
import MBTIPage from "@/pages/MBTIPage";
import PalmPage from "@/pages/PalmPage";
import LoveCoach from "@/pages/LoveCoach";
import NamingMaster from "@/pages/NamingMaster";
import Compatibility from "@/pages/Compatibility";
import SimpleAuthModal from "@/components/auth/SimpleAuthModal";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import RequireAuth from "@/components/auth/RequireAuth";

export default function App() {
  return (
    <Router>
      <SimpleAuthModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Protected Routes */}
        <Route path="/report" element={<RequireAuth><LoveTest /></RequireAuth>} />
        <Route path="/mbti" element={<RequireAuth><MBTIPage /></RequireAuth>} />
        <Route path="/palm" element={<RequireAuth><PalmPage /></RequireAuth>} />
        <Route path="/coach" element={<RequireAuth><LoveCoach /></RequireAuth>} />
        <Route path="/naming" element={<RequireAuth><NamingMaster /></RequireAuth>} />
        <Route path="/compatibility" element={<RequireAuth><Compatibility /></RequireAuth>} />
        
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
