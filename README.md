# OLIMPIADAS FRONT

Repositorio para el desarrollo **Front-end** de la aplicación web Olimpiadas.  
Este proyecto es parte del desarrollo grupal de Nebula Soft para la materia Ingeniería de Software.

Las tecnologías que se usarán para su desarrollo son:
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM

---

## 🛠 Tecnologías Requeridas

- [Node.js](https://nodejs.org/) (LTS recomendado 20.x)
- [NPM] (se instala junto con Node.js)
- Git
- Visual Studio Code

Extensiones recomendadas en VSCode:
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Thunder Client (o Postman para probar APIs)

Verifica instalación en tu terminal:

```bash
node -v
npm -v
git --version


# 🚀 Inicio Rápido
1. Clonar el repositorio

Ejecuta el siguiente comando en la terminal para clonar el proyecto en tu máquina:

git clone <URL-del-repositorio>


Accede a la carpeta del proyecto:

cd Olimpiadas-Front

2. Cambiar a la rama de desarrollo

Cambia a la rama principal de trabajo del equipo (develop):

git checkout develop

3. Instalar dependencias

Ejecuta:

npm install


Esto descargará todos los paquetes necesarios.

4. Configurar variables de entorno

Crea .env.development en la raíz (no subir a git):

# URL del backend (Laravel)
VITE_API_URL=http://localhost:8000/api


Esta URL debe apuntar al backend Laravel. Si corre en otro host/puerto, cámbiala aquí.
Importante: si cambias el .env, reinicia el servidor de Vite.

5. Ejecutar el servidor de desarrollo

Inicia la aplicación:

npm run dev


Si todo está bien, verás un resultado similar:

  VITE v5.0.0  ready in 300ms

  ➜  Local:   http://localhost:5173/


Abre en tu navegador: http://localhost:5173


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

📄 Notas para el equipo

La rama principal del proyecto es develop.

Cada integrante debe crear sus ramas de feature a partir de develop:

git checkout -b feature/nueva-pantalla


Una vez finalizada la tarea, hacer Pull Request hacia develop.

🔍 Smoke test (5 min)

Navega a http://localhost:8000/api/health → debe responder { ok: true }.

Desde el front, intenta login con el admin seed:
admin@nebula.com / Admin12345!

Debe guardar token en sessionStorage, redirigir y cargar me().

📄 Licencia

Uso académico / interno del equipo Nebula Soft – Oh! SanSi.