import { useState } from "react";
import Modal from "./Modal";
import { AREAS, areaHasPrimaria, areaHasSecundaria } from "../constants";

/* Íconos (mantenemos familias ya usadas para evitar problemas) */
import {
  HiCheckCircle,
  HiExclamationTriangle,
  HiNoSymbol,
  HiDocumentCheck,
  HiTrophy,
  HiClipboardDocumentList,
  HiCheckCircle as HiCheckCircleOutline,
} from "react-icons/hi2";

import { MdOutlineTimeline, MdFlag } from "react-icons/md";

/* Paleta */
const BRAND = "#0284C7";
const GREEN_MAIN = "#22C55E";
const GREEN_BADGE_BG = "#D1FAE5";
const PURPLE_MAIN = "#7C3AED";
const PURPLE_BADGE_BG = "#E9D5FF";
const WARN = "#FFCC00"; // si prefieres #F59E0B cambia aquí
const DANGER = "#DC2626";

/* ----------------- Util/Badges ----------------- */
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

/* ----------------- Paso 1: Selección Área/Nivel ----------------- */
function AreaCard({ area, selection, setSelection }) {
  const hasP = areaHasPrimaria(area);
  const hasS = areaHasSecundaria(area);
  const isP = selection?.area === area && selection?.nivel === "Primaria";
  const isS = selection?.area === area && selection?.nivel === "Secundaria";

  const base =
    "px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-[0_2px_6px_rgba(0,0,0,.05)]";
  const off =
    "bg-white border border-[#23263D]/10 text-[#23263D]/80 hover:bg-[#F8FAFB]";
  const dis = "bg-gray-100 text-[#23263D]/40 cursor-not-allowed shadow-none";

  return (
    <div className="bg-white rounded-xl border border-[#23263D]/10 shadow-sm p-4">
      <div className="text-sm font-medium text-[#23263D]/80 mb-2">{area}</div>

      {selection?.area === area && (
        <div className="mb-3">
          <Badge tipo={selection.nivel} />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!hasP}
          onClick={() => setSelection({ area, nivel: "Primaria" })}
          className={`${base} ${hasP ? (isP ? "text-white" : off) : dis}`}
          style={hasP ? (isP ? { backgroundColor: GREEN_MAIN } : {}) : {}}
        >
          Primaria
        </button>
        <button
          type="button"
          disabled={!hasS}
          onClick={() => setSelection({ area, nivel: "Secundaria" })}
          className={`${base} ${hasS ? (isS ? "text-white" : off) : dis}`}
          style={hasS ? (isS ? { backgroundColor: PURPLE_MAIN } : {}) : {}}
        >
          Secundaria
        </button>
      </div>
    </div>
  );
}

/* ----------------- Paso 2: Tabs de fase (clickables) ----------------- */
function PhaseTabs({ phase, setPhase }) {
  const base =
    "flex-1 rounded-full text-sm h-8 bg-white flex items-center justify-center transition";
  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="bg-[#F8FAFB] rounded-full p-1 flex gap-2">
        <button
          type="button"
          className={`${base} border-2 shadow ${
            phase === "clasificatoria"
              ? "text-[#23263D]"
              : "text-[#23263D]/60"
          }`}
          style={{
            borderColor: phase === "clasificatoria" ? BRAND : "transparent",
          }}
          onClick={() => setPhase("clasificatoria")}
        >
          <MdOutlineTimeline className="mr-2" />
          Fase Clasificatoria
        </button>

        <button
          type="button"
          className={`${base} ${
            phase === "final" ? "border-2 shadow text-[#23263D]" : "text-[#23263D]/60"
          }`}
          style={{ borderColor: phase === "final" ? BRAND : "transparent" }}
          onClick={() => setPhase("final")}
        >
          <MdFlag className="mr-2" />
          Fase Final
        </button>
      </div>
    </div>
  );
}

/* ----------------- Paso 2: Contenido Fase Clasificatoria ----------------- */
function CardClasif({ tone, Icon, title, desc, onClick }) {
  const COLORS = {
    success: { border: `${GREEN_MAIN}66`, chip: GREEN_MAIN, btn: GREEN_MAIN },
    warn: { border: `${WARN}66`, chip: WARN, btn: WARN },
    danger: { border: `${DANGER}66`, chip: DANGER, btn: DANGER },
  }[tone];

  return (
    <div
      className="rounded-xl bg-white shadow-sm p-4 border"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={20} color={COLORS.chip} />
        <div className="font-semibold text-[#23263D]">{title}</div>
      </div>
      <p className="text-sm text-[#23263D]/70 mb-3">{desc}</p>
      <button
        onClick={onClick}
        className="h-8 px-3 rounded-xl text-white text-sm inline-flex items-center gap-2"
        style={{ backgroundColor: COLORS.btn }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v10m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Descargar xlsx
      </button>
    </div>
  );
}

function ContentClasificatoria({ onDownload, selection }) {
  return (
    <>
      <div className="text-lg font-semibold text-[#23263D] mb-1">
        Listas de Fase Clasificatoria
      </div>
      <p className="text-xs text-[#23263D]/60 mb-3">
        Generar listas por categoría de clasificación (xlsx)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardClasif
          tone="success"
          Icon={HiCheckCircle}
          title="Clasificados"
          desc="Listas de competidores que pasaron a la siguiente fase."
          onClick={() => onDownload?.("Clasificados", selection)}
        />
        <CardClasif
          tone="warn"
          Icon={HiExclamationTriangle}
          title="No Clasificados"
          desc="Listas de competidores que no alcanzaron el puntaje."
          onClick={() => onDownload?.("No Clasificados", selection)}
        />
        <CardClasif
          tone="danger"
          Icon={HiNoSymbol}
          title="Descalificados"
          desc="Listas de competidores descalificados."
          onClick={() => onDownload?.("Descalificados", selection)}
        />
      </div>
    </>
  );
}

/* ----------------- Paso 2: Contenido Fase Final (solo vista) ----------------- */
function FinalItem({ color, Icon, title, subtitle, badgeColor }) {
  return (
    <div
      className="rounded-xl bg-white shadow-sm p-4 border mb-3 flex items-center justify-between"
      style={{ borderColor: `${color}66` }}
    >
      <div className="flex items-start gap-3">
        <Icon size={28} color={color} />
        <div>
          <div className="text-lg font-semibold text-[#23263D]">{title}</div>
          <div className="text-sm text-[#23263D]/60">{subtitle}</div>
        </div>
      </div>

      {/* Botón solo visual */}
      <button
        className="h-8 px-4 rounded-xl text-white text-sm"
        style={{ backgroundColor: color, opacity: 0.9 }}
        disabled
      >
        Generar
      </button>
    </div>
  );
}

function ContentFinalSoloVista() {
  return (
    <>
      <div className="text-lg font-semibold text-[#23263D] mb-1">
        Listas de Fase Final
      </div>
      <p className="text-xs text-[#23263D]/60 mb-3">
        Generar listas especializadas para certificados, ceremonia y publicación.
      </p>

      <FinalItem
        color={BRAND} // azul
        Icon={HiDocumentCheck}
        title="Listas de Emisión de Certificados"
        subtitle="Nombre completo, unidad educativa, departamento, área, nivel, nota, posición, profesor y responsable."
      />

      <FinalItem
        color={PURPLE_MAIN} // morado
        Icon={HiTrophy}
        title="Listas de Ceremonia de Premiación"
        subtitle="Nombre completo, unidad educativa, departamento, área, nivel y posición obtenida."
      />

      <FinalItem
        color={GREEN_MAIN} // verde
        Icon={HiClipboardDocumentList}
        title="Listas de Publicación de Resultados"
        subtitle="Datos de olimpista y lugar obtenido para publicar en la página oficial."
      />

      <div
  className="rounded-xl shadow-sm p-4 border mt-3"
  style={{ borderColor: "#0284C7", backgroundColor: "#E6F4FB" }}
>
  <div className="flex items-start gap-3">
    <HiCheckCircleOutline size={22} color="#0284C7" />
    <div>
      <div className="font-semibold" style={{ color: "#0284C7" }}>
        Requisitos Cumplidos
      </div>
      <div className="text-sm" style={{ color: "#0284C7" }}>
        Esta area tiene aval del responsable y puede generar todas las listas de fase final
      </div>
    </div>
  </div>
</div>
    </>
  );
}

/* ----------------- Componente principal ----------------- */
export default function GenerateListsFlow({ open, onClose, onDownload }) {
  const [step, setStep] = useState(1); // 1: seleccionar, 2: fase
  const [selection, setSelection] = useState(null); // { area, nivel }
  const [phaseView, setPhaseView] = useState("clasificatoria"); // 'clasificatoria' | 'final'

  const footer =
    step === 1 ? (
      <div className="flex justify-end">
        <button
          onClick={() => selection?.area && selection?.nivel && setStep(2)}
          className={`h-10 px-6 rounded-full font-medium ${
            selection?.area && selection?.nivel
              ? "bg-[#0284C7] text-white hover:bg-[#027AB6]"
              : "bg-gray-200 text-[#23263D]/50 cursor-not-allowed"
          }`}
        >
          Aceptar
        </button>
      </div>
    ) : (
      <div className="flex justify-end">
        <button
          onClick={() => {
            setStep(1);
            setSelection(null);
            setPhaseView("clasificatoria");
            onClose?.();
          }}
          className="h-10 px-6 rounded-full bg-[#0284C7] text-white hover:bg-[#027AB6]"
        >
          Cerrar
        </button>
      </div>
    );

  return (
    <Modal
      open={open}
      onClose={() => {
        setStep(1);
        setSelection(null);
        setPhaseView("clasificatoria");
        onClose?.();
      }}
      title={
        step === 1
          ? "Seleccionar Area y Nivel"
          : `Generar Listas - ${selection?.area} (${selection?.nivel})`
      }
      footer={footer}
    >
      {step === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AREAS.map((a) => (
            <AreaCard
              key={a}
              area={a}
              selection={selection}
              setSelection={setSelection}
            />
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-[#23263D]/60 mb-3">
            Generar y descargar listas según la fase y estado del área
            seleccionada
          </p>

          {/* Tabs clickables */}
          <PhaseTabs phase={phaseView} setPhase={setPhaseView} />

          {phaseView === "clasificatoria" ? (
            <ContentClasificatoria
              onDownload={onDownload}
              selection={selection}
            />
          ) : (
            <ContentFinalSoloVista />
          )}
        </>
      )}
    </Modal>
  );
}
