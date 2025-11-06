import Modal from "./Modal";
import { areaHasPrimaria, areaHasSecundaria, AREAS } from "../constants";

// Colores (mock)
const GREEN_MAIN = "#22C55E";
const GREEN_BADGE_BG = "#D1FAE5";
const PURPLE_MAIN = "#7C3AED";
const PURPLE_BADGE_BG = "#E9D5FF";

function Badge({ tipo }) {
  const isP = tipo === "Primaria";
  return (
    <span
      className="inline-block text-xs px-3 py-1 rounded-full border shadow-sm"
      style={{
        backgroundColor: isP ? GREEN_BADGE_BG : PURPLE_BADGE_BG,
        color: isP ? GREEN_MAIN : PURPLE_MAIN,
        borderColor: (isP ? GREEN_MAIN : PURPLE_MAIN) + "33",
      }}
    >
      {tipo}
    </span>
  );
}

function AreaCard({ area, value, onChange }) {
  const hasP = areaHasPrimaria(area);
  const hasS = areaHasSecundaria(area);
  const isP = value?.area === area && value?.nivel === "Primaria";
  const isS = value?.area === area && value?.nivel === "Secundaria";

  const base =
    "px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-[0_2px_6px_rgba(0,0,0,.05)]";
  const off  = "bg-white border border-ink/10 text-ink/80 hover:bg-surface";
  const dis  = "bg-gray-100 text-ink/40 cursor-not-allowed shadow-none";

  return (
    <div className="bg-white rounded-xl border border-ink/10 shadow-sm p-4">
      <div className="text-sm font-medium text-ink/80 mb-2">{area}</div>

      {value?.area === area && (
        <div className="mb-3">
          <Badge tipo={value.nivel} />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!hasP}
          onClick={() => onChange({ area, nivel: "Primaria" })}
          className={`${base} ${hasP ? (isP ? "text-white" : off) : dis}`}
          style={hasP ? (isP ? { backgroundColor: GREEN_MAIN } : {}) : {}}
        >
          Primaria
        </button>

        <button
          type="button"
          disabled={!hasS}
          onClick={() => onChange({ area, nivel: "Secundaria" })}
          className={`${base} ${hasS ? (isS ? "text-white" : off) : dis}`}
          style={hasS ? (isS ? { backgroundColor: PURPLE_MAIN } : {}) : {}}
        >
          Secundaria
        </button>
      </div>
    </div>
  );
}

export default function GenerateListsModal({
  open, onClose, value, onChange, onNext,
}) {
  // Handler local: solo avanza si hay selección válida
  const handleAccept = () => {
    if (!value?.area || !value?.nivel) return;
    onNext && onNext();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Seleccionar Area y Nivel"
      footer={
        <div className="flex justify-end">
          {/* Botón SIEMPRE visible */}
          <button
            onClick={handleAccept}
            className={`h-10 px-6 rounded-full font-medium
                        ${value?.area && value?.nivel
                          ? "bg-brand text-white hover:bg-brand/90"
                          : "bg-gray-200 text-ink/50 cursor-not-allowed"}`}
          >
            Aceptar
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AREAS.map((a) => (
          <AreaCard key={a} area={a} value={value} onChange={onChange} />
        ))}
      </div>
    </Modal>
  );
}
