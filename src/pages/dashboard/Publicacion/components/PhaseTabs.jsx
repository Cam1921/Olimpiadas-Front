// src/pages/dashboard/publicacion/components/PhaseTabs.jsx
import { MdOutlineTimeline, MdOutlineHourglassEmpty } from "react-icons/md";

export default function PhaseTabs({ fase, setFase, fases }) {
  const Item = ({ keyPhase, label, Icon, disabled }) => (
    <button
      type="button"
      onClick={() =>
        !disabled && setFase(fases.find((e) => e.nombre == keyPhase))
      }
      disabled={disabled}
      className={`flex-1 rounded-full py-2 text-sm flex items-center justify-center gap-2
        ${
          fase?.nombre === keyPhase ? "bg-white shadow text-ink" : "text-ink/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
      title={disabled ? "Disponible próximamente" : undefined}
    >
      <Icon /> {label}
    </button>
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full md:w-1/2 bg-surface rounded-full p-1 flex items-center gap-1">
        <Item
          keyPhase="clasificacion"
          label="Fase Clasificatoria"
          Icon={MdOutlineTimeline}
        />
        <Item
          keyPhase="final"
          label="Fase Final"
          Icon={MdOutlineHourglassEmpty}
        />
      </div>
    </div>
  );
}
