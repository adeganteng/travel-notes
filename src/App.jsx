import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripDetail from "./pages/TripDetail";
import Guidelines from "./pages/Guidelines";

// Kita buat komponen wrapper khusus agar bisa memakai hook useLocation
function AppContent() {
  const location = useLocation();

  // Cek apakah URL saat ini berawalan "/dashboard"
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* KONDISI LOGIKA: Tampilkan Navbar HANYA jika BUKAN di rute dashboard */}
      {!isDashboardRoute && <Navbar />}

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
  );
}

// Komponen Utama
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
