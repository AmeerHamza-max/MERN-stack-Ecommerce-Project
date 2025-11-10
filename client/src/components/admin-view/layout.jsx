import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./header";
import AdminSidebar from "./sidebar";

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="flex min-h-screen w-full bg-neutral-950 text-gray-200 relative">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-950 border-r border-neutral-800 p-6">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 border-r border-neutral-800 p-6 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onMobileItemClick={closeSidebar} onCloseMobile={closeSidebar} />
      </div>

      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-neutral-900 p-6 md:p-8 rounded-t-2xl shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
