// src/pages/Dashboard.jsx
import { Outlet, useNavigate } from "react-router-dom";
import React, { useState, useCallback } from "react";
import SideMenu from "../components/SideMenu";
import Header from "../components/ui/Header";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => setSidebarOpen(s => !s), []);

  const handleLogout = useCallback(() => {
    // limpia sesión
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    // redirige al HOME (nunca al /login)
    navigate("/", { replace: true, state: { from: "logout" } });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f6f8f9] flex">
      <SideMenu open={sidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Olimpiadas en Ciencias y Tecnología"
          showMenu
          onToggleMenu={toggleMenu}
          onLogout={handleLogout}
        />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}