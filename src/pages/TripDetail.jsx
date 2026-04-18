import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  Loader2,
  Package,
} from "lucide-react";

export default function TripDetail() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk form tambah barang
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTripAndItems();
  }, [id]);

  const fetchTripAndItems = async () => {
    try {
      // 1. Ambil detail ekspedisi
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();

      if (tripError) throw tripError;
      setTrip(tripData);

      // 2. Ambil daftar barang logistik
      const { data: itemsData, error: itemsError } = await supabase
        .from("trip_notes")
        .select("*")
        .eq("trip_id", id)
        .order("created_at", { ascending: false });

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      toast.error("Gagal memuat data: " + error.message);
      navigate("/dashboard"); // Lempar balik kalau ID tidak valid
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Tambah Barang
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName) {
      toast.warning("Nama barang harus diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("trip_notes").insert([
        {
          trip_id: id,
          note_content: itemName,
          category: category || "Umum", // Default 'Umum' kalau kosong
        },
      ]);

      if (error) throw error;

      toast.success("Barang ditambahkan!");
      setItemName("");
      setCategory("");
      fetchTripAndItems(); // Refresh data
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi Toggle Checklist (Update status is_completed)
  const toggleComplete = async (itemId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("trip_notes")
        .update({ is_completed: !currentStatus })
        .eq("id", itemId);

      if (error) throw error;
      fetchTripAndItems(); // Refresh data
    } catch (error) {
      toast.error("Gagal update status: " + error.message);
    }
  };

  // Fungsi Hapus Barang
  const handleDeleteItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from("trip_notes")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast.success("Barang dihapus.");
      fetchTripAndItems(); // Refresh data
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Navigasi */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {trip?.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Destinasi: {trip?.destination}
        </p>
      </div>

      {/* Form Tambah Barang */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-teal-500" /> Tambah Logistik
        </h2>

        <form
          onSubmit={handleAddItem}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Nama Barang (Cth: Tenda 4P)"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Kategori Bebas (Cth: Kelompok/P3K)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              Tambah
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Barang */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            Belum ada barang logistik yang dicatat.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-xl border ${item.is_completed ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"} transition`}
            >
              <div
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => toggleComplete(item.id, item.is_completed)}
              >
                <button className="focus:outline-none">
                  {item.is_completed ? (
                    <CheckCircle2 className="h-6 w-6 text-teal-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-slate-300 dark:text-slate-500" />
                  )}
                </button>
                <div>
                  <h3
                    className={`font-medium ${item.is_completed ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}
                  >
                    {item.note_content}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 mt-1 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
