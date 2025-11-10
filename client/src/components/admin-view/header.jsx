import React from "react";
import { LogOut, TextAlignJustify } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminHeader = ({ toggleSidebar }) => {

  // ----------------------------
  // Logout handler
  // ----------------------------
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",          // backend logout route
        credentials: "include",  // send cookies
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        toast({ title: "Logged out successfully" });

        // Force full page reload and redirect to login
        window.location.href = "/auth/login";
      } else {
        toast({ title: data.message || "Logout failed", variant: "destructive" });
      }
    } catch (err) {
      console.error("Logout Error:", err);
      toast({ title: "Logout failed", variant: "destructive" });
    }
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-neutral-950 border-b border-neutral-800 text-gray-100">
      
      {/* Left: Menu icon */}
      <button
        onClick={toggleSidebar}
        className="flex items-center gap-2 hover:text-gray-300 transition lg:hidden focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <TextAlignJustify size={22} strokeWidth={1.5} />
        <span className="text-sm md:text-base">Menu</span>
      </button>

      {/* Center: Dashboard title */}
      <h1 className="text-lg md:text-xl font-semibold tracking-wide">Dashboard</h1>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 hover:text-red-400 transition focus:outline-none"
        aria-label="Logout"
      >
        <span className="text-sm md:text-base">Logout</span>
        <LogOut size={20} strokeWidth={1.5} />
      </button>
    </header>
  );
};

export default AdminHeader;
