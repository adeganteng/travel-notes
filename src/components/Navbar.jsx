import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { Map, Sun, Moon, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  // Efek untuk mengganti tema
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Cek status login secara real-time
  useEffect(() => {
    // 1. Ambil sesi saat pertama kali Navbar dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Dengarkan perubahan (otomatis update saat user login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Gagal logout: " + error.message);
    } else {
      toast.success("Berhasil logout!");
      navigate("/login"); // Lempar kembali ke halaman login
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Judul */}
          <Link to="/" className="flex items-center gap-2">
            <Map className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              Travel Notes
            </span>
          </Link>

          {/* Menu Kanan */}
          <div className="flex items-center gap-4">
            <Link
              to="/guidelines"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 hidden sm:block"
            >
              Panduan
            </Link>

            {/* Toggle Dark Mode */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {isDark ? (
                <Sun className="text-amber-400 h-5 w-5" />
              ) : (
                <Moon className="text-slate-600 h-5 w-5" />
              )}
            </button>

            {/* LOGIKA KONDISIONAL BERDASARKAN STATUS LOGIN */}
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 hidden sm:flex items-center gap-1 font-medium text-sm"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
