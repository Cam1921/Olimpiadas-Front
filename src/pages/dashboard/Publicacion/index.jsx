import { useEffect, useState } from "react";
import HeaderBar from "./components/HeaderBar";
import PhaseTabs from "./components/PhaseTabs";
import ResultsCard from "./components/ResultsCard";
import ToastInline from "./components/ToastInline";
import GenerateListsFlow from "./components/GenerateListsFlow";
import { useFilters } from "./hooks/useFilters";
import { usePublicacion } from "./hooks/usePublicacion";
import { getAreasConNiveles } from "@/infrastructure/http/areas/areaRepostory";
import api from "@/lib/api";
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
    const nombre = r.nombre ?? r.name ?? r.participante ?? "";
    const area = r.area ?? r.área ?? r.areaNombre ?? "";
    const nivel = r.nivel ?? r.level ?? r.nivelNombre ?? "";
    const puntaje = r.puntaje ?? r.score ?? r.puntos ?? "";
    const estado = r.estado ?? r.status ?? "";
    lines.push([nombre, area, nivel, puntaje, estado].map(esc).join(","));
  }
  return lines.join("\n");
}

function obtenerValuePorLabel(labelBuscado, opciones) {
  const opcion = opciones.find(
    (op) => op.label.toLowerCase() === labelBuscado.toLowerCase()
  );
  return opcion ? opcion.value : null; // null si no encuentra
}
function obtenerIdArea(areas, nombreArea) {
  const area = areas.find(
    (a) => a.nombre.toLowerCase() === nombreArea.toLowerCase()
  );

  if (!area) {
    return { error: `No se encontró el área "${nombreArea}".` };
  }

  return {
    id_area: area.id,
  }; // ✅ solo el id del área
}

// reconocer primaria/secundaria desde el texto del nivel o alias
function matchNivel(nivelStr, wanted) {
  if (!wanted) return true;
  const s = String(nivelStr || "").toLowerCase();

  if (s.includes("prim")) return wanted === "Primaria";
  if (s.includes("secu")) return wanted === "Secundaria";

  const primariaAliases = ["guacamayo"]; // tus alias de primaria
  const secundariaAliases = ["puma", "londra", "jucumari", "bufeo"]; // alias secundaria

  if (primariaAliases.some((a) => s.includes(a))) return wanted === "Primaria";
  if (secundariaAliases.some((a) => s.includes(a)))
    return wanted === "Secundaria";

  return true; // si no se reconoce, no filtra por nivel
}

function filtrarPorTipoAreaNivel(tipo, selection, rows) {
  const porTipo = {
    Clasificados: (r) => (r.estado ?? r.status) === "Clasificado",
    "No Clasificados": (r) => (r.estado ?? r.status) === "No Clasificado",
    Descalificados: (r) => (r.estado ?? r.status) === "Descalificado",
  }[tipo];

  return (rows || []).filter((r) => {
    const okTipo = porTipo ? porTipo(r) : true;
    const areaVal = r.area ?? r.área ?? r.areaNombre;
    const nivelVal = r.nivel ?? r.level ?? r.nivelNombre;

    const okArea = selection?.area ? areaVal === selection.area : true;
    const okNivel = selection?.nivel
      ? matchNivel(nivelVal, selection.nivel)
      : true;

    return okTipo && okArea && okNivel;
  });
}

/* ===========================
   Página de Publicación
   =========================== */
export default function PublicacionPage() {
  const {
    fase,
    setFase,
    area,
    setArea,
    nivel,
    setNivel,
    nivelesDisponibles,
    areasDisponibles,
  } = useFilters();

  const [tipo, setTipo] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const {
    data,
    loading,
    totalPages,
    toast,
    generarListas,
    publicarResultados,
    limpiarToast,
  } = usePublicacion({ fase, area, nivel, tipo, page, perPage });

  const [allAreas, setAllAreas] = useState([]);
  const [flowOpen, setFlowOpen] = useState(false);
  useEffect(() => {
    async function fetchAreas() {
      const aNi = await getAreasConNiveles();
      setAllAreas(aNi);
      console.log(aNi);
    }
    fetchAreas();
  }, []);

  // Handler para el modal: descarga XLSX filtrando sobre "data"
  const handleDownload = async (tipo, sel) => {
    try {
      const opciones = [
        { label: "Todos", value: "todos" },
        { label: "Clasificados", value: "clasificados" },
        { label: "No Clasificados", value: "no_clasificados" },
        { label: "Descalificados", value: "descalificados" },
      ];
      const tipo_clas = obtenerValuePorLabel(tipo, opciones);
      const nombreArchivo = `${tipo} - ${sel?.area || "Todas"} (${
        sel?.nivel || "Todos"
      })`;
      const asignaciones = obtenerIdArea(allAreas, sel.area);
      const params = {
        id_area: asignaciones.id_area || "",
        nivel_nombre: sel?.nivel || "",
        estado_clasificado: tipo_clas || "",
      };
      console.log(params);
      const response = await api.get("evaluaciones/exportar", {
        params,
        responseType: "blob", // clave para descarga Excel
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `evaluaciones_${nombreArchivo}_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", "_")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Si además quieres disparar tu acción existente:
      // generarListas();
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
      alert("Hubo un problema al exportar las evaluaciones.");
    }
  };

  return (
    <div className="p-6 space-y-5">
      <HeaderBar
        isGenerating={flowOpen} // << nuevo: controla el estilo del botón
        onGenerar={() => {
          setFlowOpen(true);
        }}
        onPublicar={publicarResultados}
      />

      <PhaseTabs
        fase={fase}
        setFase={(f) => f !== "final" && setFase(f)}
        disableFinal
      />

      <ResultsCard
        titulo="Resultados Fase Clasificatoria"
        areas={areasDisponibles}
        area={area}
        setArea={setArea}
        niveles={nivelesDisponibles}
        nivel={nivel}
        setNivel={setNivel}
        rows={data}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
        loading={loading}
      />

      {toast && (
        <ToastInline
          type={toast.type}
          message={toast.message}
          onClose={limpiarToast}
        />
      )}

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
