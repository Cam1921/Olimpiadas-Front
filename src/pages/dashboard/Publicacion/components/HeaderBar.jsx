// src/pages/dashboard/publicacion/components/HeaderBar.jsx
import { HiOutlineDocumentArrowUp, HiOutlineGlobeAmericas } from "react-icons/hi2";

export default function HeaderBar({ onGenerar, onPublicar, isGenerating }) {
  // Clases base para ambos botones
  const base =
    "h-10 px-5 rounded-full inline-flex items-center gap-2 text-sm font-medium shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 transition-colors";

  // Estado de "Generar Listas": outline vs filled
  const outline =
    "bg-white text-[#0284C7] border-2 border-[#0284C7] hover:bg-[#E6F4FB]";
  const filled =
    "bg-[#0284C7] text-white border-2 border-[#0284C7] hover:bg-[#027AB6] active:bg-[#026BA1]";

  const generarClasses = `${base} ${isGenerating ? filled : outline}`;

  // Botón primario para 'Publicar Resultados'
  const primary =
    "bg-[#0284C7] text-white hover:bg-[#027AB6] active:bg-[#026BA1] " +
    "h-10 px-5 rounded-full inline-flex items-center gap-2 font-medium shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#0284C7]/40 transition-colors";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      {/* Títulos */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Publicación de Resultados
        </h1>
        <p className="text-sm text-[#23263D]/60">
          Resultados de las Olimpiadas en Ciencia y Tecnología
        </p>
      </div>

      {/* Botones de acciones */}
      <div className="flex flex-wrap justify-end gap-3">
        {/* Generar Listas: outline -> filled cuando isGenerating=true */}
        <button
          type="button"
          onClick={() => {
            onGenerar?.();
          }}
          className={generarClasses}
        >
          <HiOutlineDocumentArrowUp size={18} />
          <span>Generar Listas</span>
        </button>

        <button
          type="button"
          onClick={() => onPublicar?.()}
          className={primary}
        >
          <HiOutlineGlobeAmericas size={18} />
          <span>Publicar Resultados</span>
        </button>
      </div>
    </div>
  );
}
