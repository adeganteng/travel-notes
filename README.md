# 🏔️ Travel Notes App

Travel Notes adalah aplikasi manajemen logistik dan estimasi biaya ekspedisi pendakian. Didesain dengan antarmuka modern, aplikasi ini membantu para pendaki untuk mencatat barang bawaan, menyusun jadwal, dan menghitung total _budget_ secara otomatis dalam satu _dashboard_ terintegrasi.

Aplikasi ini dibangun sebagai _portfolio_ untuk memenuhi standar **Uji Kompetensi Junior Web Programmer**.

## 🚀 Tech Stack Utama

- **Frontend Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL)
- **Routing:** React Router v7
- **UI Components & Icons:** Lucide React
- **Notifications:** Sonner

## ✨ Fitur Unggulan

1. **Sistem Autentikasi Modern:** Login, Register, dan fitur Ubah Password yang diamankan oleh Supabase Auth.
2. **Manajemen Ekspedisi (CRUD):** _User_ dapat menjadwalkan, melihat, dan menghapus rencana pendakian.
3. **Smart Logistics & Budgeting (Relational Data):**
   - Pencatatan barang bawaan dengan input manual untuk Jumlah (_Quantity_) dan Total Harga.
   - Sistem _auto-calculate_ untuk menjumlahkan seluruh barang bawaan dan mengestimasi total _budget_ secara _real-time_.
4. **Interactive Dashboard:** - Dilengkapi _Sidebar Navigation_.
   - Filter otomatis (_Ongoing_ dan _Completed_) berdasarkan progres kesiapan logistik dan tanggal ekspedisi.
   - _Progress bar_ visual untuk memantau status _packing_.
5. **Modern UI/UX:** Mendukung fitur _Dark Mode_, _responsive design_ (aman dibuka via HP/Mobile), dan transisi yang _smooth_.

## 🛠️ Cara Instalasi & Menjalankan di Lokal

1. **Clone repository ini**

   ```bash
   git clone <link-repo-github-kamu>
   cd travel-notes
   ```

2. **Install semua dependencies**
   **Bash**

   ```
   npm install
   ```

3. **Setup Environment Variables**
   Buat file bernama `.env.local` di root folder, lalu masukkan kredensial Supabase Anda:
   **Cuplikan kode**

   ```
   VITE_SUPABASE_URL=masukkan_url_project_anda_disini
   VITE_SUPABASE_ANON_KEY=masukkan_anon_key_anda_disini
   ```

4. **Jalankan Development Server**
   **Bash**

   ```
   npm run dev
   ```

   Buka `http://localhost:5173` di browser Anda.

## 📋 Pemetaan Unit Kompetensi (Asesmen)

Aplikasi ini mendemonstrasikan penguasaan pada Unit Kompetensi berikut:

- **J.620100.004.02:** Menggunakan Struktur Data (Implementasi skema relasional One-to-Many pada tabel _Trips_ dan _Trip Notes_ ).
- **J.620100.005.02:** Mengimplementasikan User Interface (Responsive design, Dark Mode, Sidebar, Feedback Sonner).
- **J.620100.017.02:** Mengimplementasikan Pemrograman Terstruktur (Pemisahan komponen React, penggunaan _Hooks_ ).
- **J.620100.019.02:** Menggunakan Library/Komponen Pre-existing (Integrasi Supabase Auth & Database, Lucide, Sonner).
- **J.620100.023.02:** Membuat Dokumen Kode Program (File README.md ini).
- **J.620100.025.02:** Melakukan Debugging (Penyelesaian isu dependensi Vite dan _Rate Limiting_ ).

---

_Didesain dan dikembangkan dengan ❤️ untuk pendakian yang lebih terencana._

https://travel-notes-pink.vercel.app/
