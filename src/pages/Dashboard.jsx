// src/pages/Dashboard.jsx
import { Outlet, useNavigate } from "react-router-dom";
import React, { useState, useCallback } from "react";
import SideMenu from "../components/SideMenu";
import Header from "../components/ui/Header";
import Footer from "@/components/Footer";

const WIDTH_EXPANDED = 260;
const WIDTH_COLLAPSED = 72;

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => setSidebarOpen((s) => !s), []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/", { replace: true, state: { from: "logout" } });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f6f8f9]">
      {/* Sidebar fijo */}
      <SideMenu open={sidebarOpen} />

      {/* Contenedor principal desplazado */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300`}
        style={{
          marginLeft: sidebarOpen ? WIDTH_EXPANDED : WIDTH_COLLAPSED,
        }}
      >
        <Header
          title="Olimpiadas en Ciencias y Tecnología"
          showMenu
          onToggleMenu={toggleMenu}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
