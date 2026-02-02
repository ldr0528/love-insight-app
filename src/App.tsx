import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import LoveTest from "@/pages/LoveTest";
import MBTIPage from "@/pages/MBTIPage";
import PalmPage from "@/pages/PalmPage";
import LoveCoach from "@/pages/LoveCoach";
import NamingMaster from "@/pages/NamingMaster";
import Compatibility from "@/pages/Compatibility";
import WorryGrocery from "@/pages/WorryGrocery";
import DreamInterpretation from "@/pages/DreamInterpretation";
import DivinePage from "@/pages/DivinePage";
import SimpleAuthModal from "@/components/auth/SimpleAuthModal";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ContactUs from "@/pages/ContactUs";
import RechargePage from "@/pages/RechargePage";
import { useAuthStore } from "@/store/useAuthStore";
import { Toaster } from 'react-hot-toast';
import ResourcePreloader from "@/components/ResourcePreloader";

// Component to handle global auth effects
function AuthEffect() {
  const { isAuthenticated, refreshProfile } = useAuthStore();

  useEffect(() => {
    // Listen for unauthorized events to trigger logout
    const handleUnauthorized = () => {
      useAuthStore.getState().logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    // Check profile immediately on mount if authenticated
    if (isAuthenticated) {
      refreshProfile();
    }

    // Poll every 30 seconds to keep VIP status updated
    const interval = setInterval(() => {
      if (useAuthStore.getState().isAuthenticated) {
        refreshProfile();
      }
    }, 30000);

    // Refresh when window regains focus
    const handleFocus = () => {
      if (useAuthStore.getState().isAuthenticated) {
        refreshProfile();
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, refreshProfile]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ResourcePreloader />
      <Toaster position="top-center" />
      <AuthEffect />
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
        <Route path="/dream" element={<DreamInterpretation />} />
        <Route path="/divine" element={<DivinePage />} />
        
        {/* Other Routes */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/recharge" element={<RechargePage />} />
        
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}