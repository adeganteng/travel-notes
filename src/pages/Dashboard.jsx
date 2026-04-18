import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { toast } from "sonner";
import {
  Map,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");

  // 1. Cek sesi & Ambil Data saat komponen dimuat
  useEffect(() => {
    checkSessionAndFetchData();
  }, []);

  const checkSessionAndFetchData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Kamu harus login terlebih dahulu!");
      navigate("/login");
      return;
    }

    setSession(session);
    fetchTrips(session.user.id);
  };

  // 2. Fungsi READ: Ambil data dari Supabase
  const fetchTrips = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      toast.error("Gagal mengambil data perjalanan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fungsi CREATE: Tambah ekspedisi baru
  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (!title || !destination || !startDate) {
      toast.warning("Semua kolom harus diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("trips").insert([
        {
          user_id: session.user.id,
          title,
          destination,
          start_date: startDate,
        },
      ]);

      if (error) throw error;

      toast.success("Rencana ekspedisi berhasil ditambahkan!");
      setTitle("");
      setDestination("");
      setStartDate("");
      fetchTrips(session.user.id); // Refresh data
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Fungsi DELETE: Hapus ekspedisi
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin membatalkan rencana ini?")) return;

    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);

      if (error) throw error;
      toast.success("Rencana ekspedisi dibatalkan.");
      fetchTrips(session.user.id); // Refresh data
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Form Tambah Trip */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Map className="h-6 w-6 text-blue-600" /> Rencana Ekspedisi
        </h1>

        <form
          onSubmit={handleAddTrip}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama Rencana
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cth: Pendakian Rinjani"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gunung/Tujuan
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Cth: Mt. Rinjani"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              Buat Rencana
            </button>
          </div>
        </form>
      </div>

      {/* Grid Daftar Trip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Belum ada rencana pendakian. Yuk, buat sekarang!
            </p>
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-1">
                  {trip.title}
                </h3>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                  title="Hapus Rencana"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 text-teal-500" />
                  <span className="text-sm">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">
                    {new Date(trip.start_date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Nanti tombol ini kita arahkan ke halaman Detail untuk input barang logistik */}
              <Link
                to={`/dashboard/${trip.id}`}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-sm font-medium transition"
              >
                Cek Logistik <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
