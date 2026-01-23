import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LoveTest from "@/pages/LoveTest";
import MBTIPage from "@/pages/MBTIPage";
import PalmPage from "@/pages/PalmPage";
import LoveCoach from "@/pages/LoveCoach";
import NamingMaster from "@/pages/NamingMaster";
import Compatibility from "@/pages/Compatibility";
import WorryGrocery from "@/pages/WorryGrocery";
import SimpleAuthModal from "@/components/auth/SimpleAuthModal";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import RequireAuth from "@/components/auth/RequireAuth";
import ContactUs from "@/pages/ContactUs";
import RechargePage from "@/pages/RechargePage";

export default function App() {
  return (
    <Router>
      <SimpleAuthModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Feature Routes (Accessible without login) */}
        <Route path="/report" element={<LoveTest />} />
        <Route path="/mbti" element={<MBTIPage />} />
        <Route path="/palm" element={<PalmPage />} />
        <Route path="/coach" element={<LoveCoach />} />
        <Route path="/naming" element={<NamingMaster />} />
        <Route path="/compatibility" element={<Compatibility />} />
        <Route path="/worry-grocery" element={<WorryGrocery />} />
        
        {/* Other Routes */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/recharge" element={<RechargePage />} />
        
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
