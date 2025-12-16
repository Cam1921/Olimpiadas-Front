// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import "./index.css";

// 🔔 importamos el provider de corrección de notificaciones
import { CorreccionNotificacionesProvider } from "@/hooks/useCorreccionNotificaciones";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/*  Aquí envolvemos toda la app con el provider */}
      <CorreccionNotificacionesProvider>
        <App />
      </CorreccionNotificacionesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
