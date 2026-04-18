import { BookOpen, Map, Package, CheckCircle, ShieldCheck } from "lucide-react";

export default function Guidelines() {
  const guides = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      title: "1. Autentikasi & Keamanan",
      description:
        "Untuk mulai menggunakan Travel Notes, Anda harus membuat akun terlebih dahulu. Sistem kami menggunakan enkripsi standar industri. Setiap user hanya bisa melihat dan mengubah catatan perjalanan miliknya sendiri (Row Level Security aktif).",
    },
    {
      icon: <Map className="h-6 w-6 text-amber-500" />,
      title: "2. Membuat Rencana Ekspedisi",
      description:
        "Setelah login, masuk ke menu Dashboard. Isi form 'Nama Rencana', 'Gunung/Tujuan', dan 'Tanggal Mulai'. Setelah diklik 'Buat Rencana', ekspedisi Anda akan otomatis muncul di daftar perjalanan.",
    },
    {
      icon: <Package className="h-6 w-6 text-teal-500" />,
      title: "3. Manajemen Logistik Bebas Hambatan",
      description:
        "Klik tombol 'Cek Logistik' pada salah satu kartu ekspedisi Anda. Di sini, Anda bisa mencatat barang bawaan. Kolom 'Kategori' sengaja dibuat sebagai input teks bebas agar Anda bisa menyesuaikan jenis logistik (misal: P3K, Alat Masak, atau Pribadi).",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "4. Checklist Kesiapan",
      description:
        "Klik pada barang yang sudah Anda masukkan ke dalam ransel. Teks akan otomatis tercoret dan berubah warna, menandakan barang tersebut sudah siap dibawa. Anda juga bisa menghapus barang yang tidak jadi dibawa.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Panduan Penggunaan Sistem
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Pelajari cara memaksimalkan fitur Travel Notes untuk manajemen
          logistik perjalanan Anda.
        </p>
      </div>

      <div className="space-y-6">
        {guides.map((guide, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-6 items-start hover:shadow-md transition"
          >
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl flex-shrink-0">
              {guide.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {guide.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {guide.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
