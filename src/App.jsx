import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripDetail from "./pages/TripDetail";
import Guidelines from "./pages/Guidelines";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <Navbar />

        <Toaster position="top-center" richColors expand={true} />

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:id" element={<TripDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
