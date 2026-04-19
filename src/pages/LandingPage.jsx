import { Link } from "react-router-dom";
import {
  MapPin,
  ListChecks,
  LayoutDashboard,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Map,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* 1. HERO SECTION with Background Image */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070"
            alt="Mountain Landscape"
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-900/50 dark:to-slate-900"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-4">
            Partner Travelling Setiamu
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Petualangan Hebat Dimulai dari <br />
            <span className="text-blue-600 dark:text-blue-400">
              Rencana yang Matang.
            </span>
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Kelola logistik, jadwal, dan catatan perjalananmu dalam satu
            platform modern. Fokus pada puncak, biarkan kami menjaga detailnya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              Mulai Perjalanan <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/guidelines"
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              Pelajari Fitur
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Social Proof Simulation) */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              100+
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 font-semibold">
              Destinasi
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              500+
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 font-semibold">
              Logistik Tercatat
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              10k+
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 font-semibold">
              Langkah Kaki
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              FREE
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 font-semibold">
              Akses Selamanya
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES with Side Image */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1761846786544-f0f522394fbb?auto=format&fit=crop&q=80&w=1000"
              alt="Trekking Gear"
              className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Didesain untuk Memudahkan <br /> Pendakian Anda.
            </h2>
            <div className="space-y-6">
              <FeatureItem
                icon={<Zap className="text-amber-500" />}
                title="Akses Kilat & Real-time"
                desc="Data tersimpan di cloud dengan Supabase, sinkronisasi otomatis antar perangkat."
              />
              <FeatureItem
                icon={<Shield className="text-blue-500" />}
                title="Keamanan Data Terjamin"
                desc="Sistem proteksi Row Level Security memastikan catatanmu tetap jadi rahasiamu."
              />
              <FeatureItem
                icon={<Globe className="text-teal-500" />}
                title="Input Kategori Bebas"
                desc="Sesuaikan jenis logistikmu tanpa batasan. P3K, Alat Masak, atau Perlengkapan Tidur."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISUAL GALLERY (Showcase) */}
      <section className="py-24 bg-slate-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Inspirasi Destinasi
            </h2>
            <p className="text-slate-400">
              Rencanakan perjalananmu ke berbagai medan tanpa rasa khawatir.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
            <div className="group relative overflow-hidden rounded-2xl md:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1654046920188-6e7ee051d7a4?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                alt="Lake"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <h3 className="text-2xl font-bold">
                  Danau Segara Anak, Rinjani
                </h3>
              </div>
            </div>
            <div className="space-y-6">
              <div className="group relative overflow-hidden rounded-2xl h-[288px]">
                <img
                  src="https://images.unsplash.com/photo-1612144613550-171966fab8c5?auto=format&fit=crop&q=80&w=1000"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  alt="Mountain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <h3 className="text-xl font-bold">Mahameru</h3>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl h-[288px]">
                <img
                  src="https://images.unsplash.com/photo-1703081350237-ef57fafb6f6a?auto=format&fit=crop&q=80&w=1000"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  alt="Hiking"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <h3 className="text-xl font-bold">Banda Neira</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="py-24 text-center px-4">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-500/40 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Siap Untuk Travelling Bro?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Bergabunglah dengan ratusan penggiat alam lainnya yang telah
              beralih ke manajemen logistik digital.
            </p>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl inline-block"
            >
              Buat Catatan Sekarang
            </Link>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* FOOTER */}
      {/* FOOTER LANDING PAGE (Clean) */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">
                Travel Notes
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
              Membantu para pendaki merencanakan ekspedisi dengan lebih aman dan
              terstruktur. Fokus pada puncak, biarkan sistem kami yang mengingat
              logistikmu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Jelajahi</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                >
                  Panduan Sistem
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all"
                >
                  Login / Daftar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 Travel Notes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-komponen untuk Feature Item
function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex-shrink-0 h-12 w-12 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
