import { useState, useEffect } from "react"; // 1. Tambahkan useEffect di sini
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 2. TAMBAHKAN BLOK INI: Pengecekan sesi saat halaman login dimuat
  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // Kalau sudah login, langsung tendang ke dashboard tanpa ba-bi-bu!
        navigate("/dashboard");
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        toast.success("Login berhasil! Selamat datang.");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        toast.success("Akun berhasil dibuat! Silakan login.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // ... (Bagian return / UI di bawahnya TETAP SAMA seperti sebelumnya)
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isLogin ? "Selamat Datang!" : "Buat Akun Baru"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {isLogin
              ? "Masukkan email dan password untuk melanjutkan."
              : "Daftar untuk mulai mencatat perjalananmu."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isLogin ? "Login" : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            {isLogin ? "Daftar di sini" : "Login di sini"}
          </button>
        </div>
      </div>
    </div>
  );
}
