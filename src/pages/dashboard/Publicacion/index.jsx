import { useState } from "react";
import HeaderBar from "./components/HeaderBar";
import PhaseTabs from "./components/PhaseTabs";
import ResultsCard from "./components/ResultsCard";
import ToastInline from "./components/ToastInline";
import GenerateListsFlow from "./components/GenerateListsFlow";
import { useFilters } from "./hooks/useFilters";
import { usePublicacion } from "./hooks/usePublicacion";

/* ===========================
   Utils: generar “xlsx” (CSV) y filtros
   =========================== */
const HEADERS = ["Nombre", "Área", "Nivel", "Puntaje", "Estado"];

const esc = (v) =>
  String(v).includes(",") || String(v).includes('"') || String(v).includes("\n")
    ? `"${String(v).replace(/"/g, '""')}"`
    : String(v);

function toCSV(rows) {
  const lines = [HEADERS.map(esc).join(",")];
  for (const r of rows) {
    // mapeo tolerante de claves
    const nombre  = r.nombre  ?? r.name  ?? r.participante ?? "";
    const area    = r.area    ?? r.área  ?? r.areaNombre   ?? "";
    const nivel   = r.nivel   ?? r.level ?? r.nivelNombre  ?? "";
    const puntaje = r.puntaje ?? r.score ?? r.puntos       ?? "";
    const estado  = r.estado  ?? r.status ?? "";
    lines.push([nombre, area, nivel, puntaje, estado].map(esc).join(","));
  }
  return lines.join("\n");
}

function downloadXLSX(rows, filename) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xlsx`; // Excel lo abre directo
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// reconocer primaria/secundaria desde el texto del nivel o alias
function matchNivel(nivelStr, wanted) {
  if (!wanted) return true;
  const s = String(nivelStr || "").toLowerCase();

  if (s.includes("prim")) return wanted === "Primaria";
  if (s.includes("secu")) return wanted === "Secundaria";

  const primariaAliases   = ["guacamayo"]; // tus alias de primaria
  const secundariaAliases = ["puma", "londra", "jucumari", "bufeo"]; // alias secundaria

  if (primariaAliases.some((a) => s.includes(a))) return wanted === "Primaria";
  if (secundariaAliases.some((a) => s.includes(a))) return wanted === "Secundaria";

  return true; // si no se reconoce, no filtra por nivel
}

function filtrarPorTipoAreaNivel(tipo, selection, rows) {
  const porTipo = {
    "Clasificados":    (r) => (r.estado ?? r.status) === "Clasificado",
    "No Clasificados": (r) => (r.estado ?? r.status) === "No Clasificado",
    "Descalificados":  (r) => (r.estado ?? r.status) === "Descalificado",
  }[tipo];

  return (rows || []).filter((r) => {
    const okTipo  = porTipo ? porTipo(r) : true;
    const areaVal = r.area ?? r.área ?? r.areaNombre;
    const nivelVal = r.nivel ?? r.level ?? r.nivelNombre;

    const okArea  = selection?.area  ? areaVal  === selection.area  : true;
    const okNivel = selection?.nivel ? matchNivel(nivelVal, selection.nivel) : true;

    return okTipo && okArea && okNivel;
  });
}

/* ===========================
   Página de Publicación
   =========================== */
export default function PublicacionPage() {
  const { fase, setFase, area, setArea, nivel, setNivel, nivelesDisponibles, areasDisponibles } =
    useFilters();
  const { data, toast, generarListas, publicarResultados, limpiarToast } =
    usePublicacion({ fase, area, nivel });

  const [flowOpen, setFlowOpen] = useState(false);

  // Handler para el modal: descarga XLSX filtrando sobre "data"
  const handleDownload = (tipo, sel) => {
    try {
      const filas = filtrarPorTipoAreaNivel(tipo, sel, data);
      const nombreArchivo = `${tipo} - ${sel?.area || "Todas"} (${sel?.nivel || "Todos"})`;
      downloadXLSX(filas, nombreArchivo);
      // Si además quieres disparar tu acción existente:
      // generarListas();
    } catch (e) {
      console.error("[onDownload] error:", e);
    }
  };

  return (
    <div className="p-6 space-y-5">
       <HeaderBar
   isGenerating={flowOpen}              // << nuevo: controla el estilo del botón
   onGenerar={() => {
     setFlowOpen(true);
   }}
   onPublicar={publicarResultados}
 />

      <PhaseTabs fase={fase} setFase={(f) => f !== "final" && setFase(f)} disableFinal />

      <ResultsCard
        titulo="Resultados Fase Clasificatoria"
        areas={areasDisponibles}
        area={area}
        setArea={setArea}
        niveles={nivelesDisponibles}
        nivel={nivel}
        setNivel={setNivel}
        rows={data}
      />

      {toast && <ToastInline type={toast.type} message={toast.message} onClose={limpiarToast} />}

      <GenerateListsFlow
        open={flowOpen}
        onClose={() => {
          console.log("[UI] cerrar modal");
          setFlowOpen(false);
        }}
        onDownload={handleDownload} // << descarga .xlsx filtrada
      />
    </div>
  );
}
