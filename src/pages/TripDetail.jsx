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
  Receipt,
  Pencil,
  X,
  Save,
} from "lucide-react";

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Form Tambah
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(1);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchTripAndItems();
  }, [id]);

  const fetchTripAndItems = async () => {
    try {
      const { data: tripData } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();
      setTrip(tripData);

      const { data: itemsData } = await supabase
        .from("trip_notes")
        .select("*")
        .eq("trip_id", id)
        .order("created_at", { ascending: false });
      setItems(itemsData || []);
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI AJAIB: Mengubah inputan "1000000" jadi "1.000.000" saat diketik
  const formatNumberInput = (value) => {
    const numberString = value.toString().replace(/\D/g, ""); // Buang huruf & simbol
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Kasih titik tiap 3 angka
  };

  // --- FUNGSI TAMBAH BARANG ---
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName) return toast.warning("Nama barang wajib diisi!");

    setIsSubmitting(true);
    const rawPrice = parseInt(price.replace(/\./g, "")) || 0; // Kembalikan ke angka murni untuk di-save

    try {
      const { error } = await supabase
        .from("trip_notes")
        .insert([
          {
            trip_id: id,
            note_content: itemName,
            quantity: parseInt(quantity) || 1,
            price: rawPrice,
          },
        ]);
      if (error) throw error;

      toast.success("Barang ditambahkan!");
      setItemName("");
      setQuantity(1);
      setPrice("");
      fetchTripAndItems();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FUNGSI MULAI EDIT & SIMPAN EDIT ---
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.note_content);
    setEditQty(item.quantity);
    setEditPrice(formatNumberInput(item.price || 0)); // Format angkanya buat ditampilkan di form edit
  };

  const handleSaveEdit = async () => {
    if (!editName) return toast.warning("Nama barang tidak boleh kosong!");

    const rawPrice = parseInt(editPrice.replace(/\./g, "")) || 0;

    try {
      const { error } = await supabase
        .from("trip_notes")
        .update({
          note_content: editName,
          quantity: parseInt(editQty) || 1,
          price: rawPrice,
        })
        .eq("id", editingId);

      if (error) throw error;
      toast.success("Perubahan disimpan!");
      setEditingId(null);
      fetchTripAndItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // FUNGSI LAINNYA (Checklist & Hapus)
  const toggleComplete = async (itemId, currentStatus) => {
    await supabase
      .from("trip_notes")
      .update({ is_completed: !currentStatus })
      .eq("id", itemId);
    fetchTripAndItems();
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Hapus barang ini?")) return;
    await supabase.from("trip_notes").delete().eq("id", itemId);
    toast.success("Barang dihapus.");
    fetchTripAndItems();
  };

  const totalBarang = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const grandTotalHarga = items.reduce(
    (sum, item) => sum + (item.price || 0),
    0,
  );
  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {trip?.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Destinasi: {trip?.destination}
        </p>
      </div>

      {/* --- FORM TAMBAH BARANG --- */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-teal-500" /> Tambah Logistik
        </h2>
        <form
          onSubmit={handleAddItem}
          className="grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Nama Barang"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
              required
            />
          </div>
          <div className="md:col-span-1">
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
              required
            />
          </div>
          <div className="md:col-span-2">
            {/* INPUT HARGA FORMAT TEXT (BIAR BISA ADA TITIKNYA) */}
            <input
              type="text"
              placeholder="Total Harga"
              value={price}
              onChange={(e) => setPrice(formatNumberInput(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
            </button>
          </div>
        </form>
      </div>

      {/* --- DAFTAR BARANG & INLINE EDIT --- */}
      <div className="space-y-3 mb-8">
        {items.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Belum ada barang.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border ${item.is_completed ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200" : "bg-white dark:bg-slate-800 border-slate-200"} transition`}
            >
              {/* KONDISI: Jika sedang diedit, munculkan form edit kecil */}
              {editingId === item.id ? (
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama..."
                  />
                  <input
                    type="number"
                    min="1"
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="w-20 px-3 py-2 bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qty..."
                  />
                  <input
                    type="text"
                    value={editPrice}
                    onChange={(e) =>
                      setEditPrice(formatNumberInput(e.target.value))
                    }
                    className="w-32 px-3 py-2 bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Harga..."
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 bg-slate-300 dark:bg-slate-600 dark:text-white rounded-lg hover:bg-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                /* TAMPILAN NORMAL (TIDAK DIEDIT) */
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => toggleComplete(item.id, item.is_completed)}
                  >
                    <button>
                      {item.is_completed ? (
                        <CheckCircle2 className="text-teal-500" />
                      ) : (
                        <Circle className="text-slate-300" />
                      )}
                    </button>
                    <div>
                      <h3
                        className={`font-bold ${item.is_completed ? "text-slate-400 line-through" : "dark:text-white"}`}
                      >
                        {item.note_content}{" "}
                        <span className="text-sm font-normal text-slate-500 ml-2">
                          (x{item.quantity})
                        </span>
                      </h3>
                      {item.price > 0 && (
                        <span className="text-xs font-semibold px-2 py-1 mt-1 inline-block rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {formatRupiah(item.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {/* TOMBOL EDIT */}
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 text-slate-400 hover:text-blue-500"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- REKAP TOTAL --- */}
      {items.length > 0 && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center border border-slate-800">
          <div>
            <p className="text-slate-400 text-sm">Total Barang</p>
            <p className="text-2xl font-bold">
              {totalBarang}{" "}
              <span className="text-base text-slate-400">pcs</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Estimasi Biaya</p>
            <p className="text-3xl font-black text-teal-400">
              {formatRupiah(grandTotalHarga)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
