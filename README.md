# OLIMPIADAS FRONT

Frontend de la plataforma **Olimpiadas**.  
Este proyecto consume la API del backend en Laravel 11 y está preparado para que todo el equipo trabaje en conjunto.

---

## 🧩 Tecnologías principales

- React 18 + Vite
- Tailwind CSS 3.4.x
- Axios (cliente HTTP)
- React Router DOM

---

## ✅ Requisitos previos

1. **Node.js** LTS (20.x recomendado)  
   Verifica que esté instalado:

   ```bash
   node -v
   npm -v
🚀 Instalación y ejecución
1. Clonar el repositorio

git clone <URL-del-repositorio>
cd Olimpiadas-Front

2. Instalar dependencias

npm install

3. Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto:

# URL del backend
VITE_API_BASE=http://localhost:8000


Si el backend corre en otro puerto, cambia el valor.

4. Ejecutar en desarrollo

npm run dev

Abre en el navegador el enlace que muestre Vite, normalmente:
http://localhost:5173

📂 Estructura básica del proyecto
src/
├─ assets/            # Imágenes y recursos estáticos
├─ lib/
│  └─ api.ts          # Cliente Axios centralizado
├─ pages/
│  ├─ HomePage.jsx    # Página de inicio
│  └─ AboutPage.jsx   # Página de ejemplo
├─ App.jsx            # Layout y rutas
├─ index.css          # Estilos principales (Tailwind)
└─ main.jsx           # Punto de entrada

🔧 Configuración de Tailwind

tailwind.config.cjs
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }


📄 Licencia

Uso académico / interno del equipo Nebula Soft – Oh! SanSi.