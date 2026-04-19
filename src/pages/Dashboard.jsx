import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import Sidebar from "../components/Sidebar";
import {
  MapPin,
  Calendar,
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
  Menu,
  Receipt,
  KeyRound,
  Package,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Tambah Trip
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");

  // State Form Edit Trip
  const [editingTripId, setEditingTripId] = useState(null);
  const [editTripTitle, setEditTripTitle] = useState("");
  const [editTripDest, setEditTripDest] = useState("");
  const [editTripDate, setEditTripDate] = useState("");

  useEffect(() => {
    fetchTripsWithDetails();
  }, []);

  // Ambil data Trip + Relasi ke Trip Notes
  const fetchTripsWithDetails = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("trips")
        .select(
          `
          *,
          trip_notes (id, is_completed, price, quantity)
        `,
        )
        .eq("user_id", session.user.id)
        .order("start_date", { ascending: true });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      toast.error("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI CRUD TRIP ---
  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (!title || !destination || !startDate)
      return toast.warning("Lengkapi data rencana dulu!");

    setIsSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { error } = await supabase.from("trips").insert([
        {
          user_id: session.user.id,
          title,
          destination,
          start_date: startDate,
        },
      ]);
      if (error) throw error;

      toast.success("Rencana pendakian dibuat!");
      setTitle("");
      setDestination("");
      setStartDate("");
      fetchTripsWithDetails();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    if (!editTripTitle) return toast.warning("Judul tidak boleh kosong!");

    try {
      const { error } = await supabase
        .from("trips")
        .update({
          title: editTripTitle,
          destination: editTripDest,
          start_date: editTripDate,
        })
        .eq("id", editingTripId);

      if (error) throw error;
      toast.success("Rencana berhasil diperbarui!");
      setEditingTripId(null);
      fetchTripsWithDetails();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (
      !window.confirm(
        "Hapus rencana ini? Semua data logistik di dalamnya akan hilang.",
      )
    )
      return;
    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
      toast.success("Rencana dihapus");
      fetchTripsWithDetails();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- LOGIKA FILTER & FORMATTING ---
  const today = new Date().toISOString().split("T")[0];

  const processedTrips = trips.map((trip) => {
    const totalItems = trip.trip_notes?.length || 0;
    const completedItems =
      trip.trip_notes?.filter((n) => n.is_completed).length || 0;
    const progress =
      totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    const totalBudget =
      trip.trip_notes?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

    return {
      ...trip,
      progress,
      totalBudget,
      isReady: totalItems > 0 && progress === 100,
      isPast: trip.start_date < today,
      totalItems,
      completedItems,
    };
  });

  const filteredTrips = processedTrips.filter((trip) => {
    if (activeFilter === "completed") return trip.isReady || trip.isPast;
    if (activeFilter === "ongoing") return !trip.isReady && !trip.isPast;
    return true;
  });

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 lg:ml-64 p-4 md:p-8 transition-all">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-blue-600" />
            <span className="font-bold dark:text-white">Travel Notes</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <Menu className="dark:text-white" />
          </button>
        </div>

        {activeFilter === "password" ? (
          /* SECTION: UBAH PASSWORD */
          <div className="max-w-md mx-auto mt-10">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <KeyRound size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">
                Keamanan Akun
              </h2>
              <p className="text-slate-500 mb-8 text-sm">
                Ganti password Anda secara berkala untuk menjaga keamanan data.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const newPass = e.target.newPassword.value;
                  if (newPass.length < 6)
                    return toast.error("Minimal 6 karakter!");
                  const { error } = await supabase.auth.updateUser({
                    password: newPass,
                  });
                  if (error) toast.error(error.message);
                  else {
                    toast.success("Password diperbarui!");
                    e.target.reset();
                  }
                }}
                className="space-y-4"
              >
                <input
                  name="newPassword"
                  type="password"
                  placeholder="Password Baru"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-700 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* SECTION: DASHBOARD LIST */
          <>
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {activeFilter === "all"
                  ? "Dashboard Utama"
                  : activeFilter === "completed"
                    ? "Jadwal Selesai"
                    : "Jadwal Mendatang"}
              </h1>
              <p className="text-slate-500 font-medium">
                Total {filteredTrips.length} ekspedisi ditemukan.
              </p>
            </header>

            {activeFilter !== "completed" && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 mb-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plus size={14} /> Buat Ekspedisi Baru
                </h3>
                <form
                  onSubmit={handleAddTrip}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Nama Rencana"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Tujuan"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Tambah"
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 flex justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-400">Belum ada data perjalanan.</p>
                </div>
              ) : (
                filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-7 shadow-sm border border-slate-100 dark:border-slate-700 group relative"
                  >
                    {editingTripId === trip.id ? (
                      /* FORM EDIT CARD */
                      <form onSubmit={handleUpdateTrip} className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-blue-600 text-sm">
                            Mode Edit Rencana
                          </h3>
                          <button
                            type="button"
                            onClick={() => setEditingTripId(null)}
                          >
                            <X size={18} className="text-slate-400" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editTripTitle}
                          onChange={(e) => setEditTripTitle(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-700 dark:text-white rounded-xl outline-none border border-blue-500/30"
                          placeholder="Judul..."
                        />
                        <input
                          type="text"
                          value={editTripDest}
                          onChange={(e) => setEditTripDest(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-700 dark:text-white rounded-xl outline-none border border-blue-500/30"
                          placeholder="Tujuan..."
                        />
                        <input
                          type="date"
                          value={editTripDate}
                          onChange={(e) => setEditTripDate(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-700 dark:text-white rounded-xl outline-none border border-blue-500/30"
                        />
                        <button
                          type="submit"
                          className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-green-500/20"
                        >
                          <Save size={18} /> Simpan
                        </button>
                      </form>
                    ) : (
                      /* TAMPILAN NORMAL CARD */
                      <>
                        <div className="flex justify-between items-start mb-6">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${trip.isReady ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"}`}
                          >
                            {trip.isReady ? "Ready to Go" : "Preparing"}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingTripId(trip.id);
                                setEditTripTitle(trip.title);
                                setEditTripDest(trip.destination);
                                setEditTripDate(trip.start_date);
                              }}
                              className="text-slate-300 hover:text-blue-500 transition-colors p-1"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold dark:text-white mb-2 line-clamp-1">
                          {trip.title}
                        </h3>
                        <div className="flex flex-col gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-blue-500" />{" "}
                            {trip.destination}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" />{" "}
                            {trip.start_date}
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl mb-6 flex items-center gap-4 border border-slate-100 dark:border-slate-600">
                          <div className="bg-white dark:bg-slate-600 p-2 rounded-xl shadow-sm text-green-500">
                            <Receipt size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              Budget Logistik
                            </p>
                            <p className="text-sm font-black dark:text-white">
                              {formatRupiah(trip.totalBudget)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-8">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Kesiapan Packing
                            </span>
                            <span className="text-sm font-black text-blue-600">
                              {trip.progress}%
                            </span>
                          </div>
                          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${trip.progress === 100 ? "bg-green-500" : "bg-blue-600"}`}
                              style={{ width: `${trip.progress}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          to={`/dashboard/${trip.id}`}
                          className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-blue-900/20"
                        >
                          Kelola Rencana <ArrowRight size={18} />
                        </Link>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
