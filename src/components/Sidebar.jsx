import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarClock,
  KeyRound,
  LogOut,
  Map,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function Sidebar({
  activeFilter,
  setActiveFilter,
  isOpen,
  setIsOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    navigate("/login");
  };

  const menuItems = [
    { id: "all", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      id: "ongoing",
      label: "Jadwal Belum Selesai",
      icon: <CalendarClock size={20} />,
    },
    {
      id: "completed",
      label: "Jadwal Selesai",
      icon: <CalendarCheck size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Sidebar */}
          <div className="p-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Map className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl dark:text-white">
                Travel Notes
              </span>
            </Link>
            <button className="lg:hidden" onClick={() => setIsOpen(false)}>
              <X size={20} className="dark:text-white" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveFilter(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeFilter === item.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => {
                  setActiveFilter("password");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeFilter === "password"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <KeyRound size={20} />
                <span className="font-medium">Ubah Password</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>

          <div className="p-4 text-xs text-slate-400 text-center">
            &copy; 2026 Travel Notes.
          </div>
        </div>
      </aside>
    </>
  );
}
