import { HiOutlineDocumentArrowUp, HiOutlineGlobeAmericas } from "react-icons/hi2";

export default function HeaderBar({ onGenerar, onPublicar, isGenerating = false }) {
  const base =
    "h-10 px-5 rounded-full inline-flex items-center gap-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]/40 transition-colors";

  // Botón outline (default) y botón relleno (cuando el modal está abierto)
  const outline =
    "bg-white text-[#0284C7] border-2 border-[#0284C7] hover:bg-[#E6F4FB]";
  const filled =
    "bg-[#0284C7] text-white border-2 border-[#0284C7] hover:bg-[#027AB6] active:bg-[#026BA1]";

  const generarClasses = `${base} ${isGenerating ? filled : outline}`;

  // Botón primario para 'Publicar Resultados' (se mantiene)
  const primary =
    "bg-[#0284C7] text-white hover:bg-[#027AB6] active:bg-[#026BA1] " +
    "h-10 px-5 rounded-full inline-flex items-center gap-2 font-medium shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#0284C7]/40 transition-colors";

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold">Publicación de Resultados</h1>
        <p className="text-sm text-[#23263D]/60">
          Resultados de las Olimpiadas en Ciencia y Tecnología
        </p>
      </div>

      <div className="flex gap-3">
        {/* Generar Listas: outline -> filled cuando isGenerating=true */}
        <button
          type="button"
          onClick={() => {
            onGenerar?.();
          }}
          className={generarClasses}
        >
          {/* El ícono hereda el color del texto (currentColor) */}
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
