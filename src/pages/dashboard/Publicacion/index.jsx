// src/pages/dashboard/publicacion/index.jsx
import { useEffect, useMemo, useState } from "react";
import HeaderBar from "./components/HeaderBar";
import PhaseTabs from "./components/PhaseTabs";
import ResultsCard from "./components/ResultsCard";
import ToastInline from "./components/ToastInline";
import GenerateListsFlow from "./components/GenerateListsFlow";
import { useFilters } from "./hooks/useFilters";
import { usePublicacion } from "./hooks/usePublicacion";
import { getAreasConNiveles } from "@/infrastructure/http/areas/areaRepostory";
import api from "@/lib/api";

// 🔹 NUEVO: barra UI (solo nombre + orden nombre/nota)
import BusquedaOrdenAdmin from "./components/BusquedaOrdenAdmin";

/* ===========================
   Utils de exportación (tu lógica)
   =========================== */
const HEADERS = ["Nombre", "Área", "Nivel", "Puntaje", "Estado"];

const esc = (v) =>
  String(v).includes(",") || String(v).includes('"') || String(v).includes("\n")
    ? `"${String(v).replace(/"/g, '""')}"` // eslint-disable-line
    : String(v);

function toCSV(rows) {
  const lines = [HEADERS.map(esc).join(",")];
  for (const r of rows) {
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
  return opcion ? opcion.value : null;
}
function obtenerIdArea(areas, nombreArea) {
  const area = areas.find(
    (a) => a.nombre.toLowerCase() === nombreArea.toLowerCase()
  );
  if (!area) return { error: `No se encontró el área "${nombreArea}".` };
  return { id_area: area.id };
}

// Reconocer Primaria/Secundaria por texto del nivel o alias (tu lógica)
function matchNivel(nivelStr, wanted) {
  if (!wanted) return true;
  const s = String(nivelStr || "").toLowerCase();

  if (s.includes("prim")) return wanted === "Primaria";
  if (s.includes("secu")) return wanted === "Secundaria";

  const primariaAliases = ["guacamayo"];
  const secundariaAliases = ["puma", "londra", "jucumari", "bufeo"];

  if (primariaAliases.some((a) => s.includes(a))) return wanted === "Primaria";
  if (secundariaAliases.some((a) => s.includes(a)))
    return wanted === "Secundaria";

  return true;
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
    const okNivel = selection?.nivel ? matchNivel(nivelVal, selection.nivel) : true;
    return okTipo && okArea && okNivel;
  });
}

/* ===========================
   Helpers para buscar/ordenar (solo cliente)
   =========================== */
function nombreDe(r) {
  return (
    r?.nombre_completo ||
    r?.competidor?.nombre_completo ||
    r?.nombre ||
    ""
  );
}
function notaDe(r) {
  const raw = r?.nota_academica ?? r?.nota ?? r?.evaluacion?.nota ?? null;
  if (raw === null || raw === undefined || raw === "" || raw === "0-100") return null;
  const n = Number(String(raw).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/* ===========================
   Página de Publicación (ADMIN)
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
    data,           // ← filas que ya alimentan ResultsCard
    loading,
    totalPages,
    toast,
    generarListas,
    publicarResultados,
    limpiarToast,
  } = usePublicacion({ fase, area, nivel, tipo, page, perPage });

  // Para exportación (tu lógica)
  const [allAreas, setAllAreas] = useState([]);
  const [flowOpen, setFlowOpen] = useState(false);
  useEffect(() => {
    async function fetchAreas() {
      const aNi = await getAreasConNiveles();
      setAllAreas(aNi);
    }
    fetchAreas();
  }, []);

  /* ===========================
     NUEVO: Buscador + Orden (solo sobre la página actual)
     =========================== */
  const [query, setQuery] = useState(""); // buscar por NOMBRE (solo nombre)
  const [sort, setSort] = useState({ by: "nota", dir: "desc" }); // predeterminado: Nota ↓

  // Buscar por nombre (cliente, sobre data de la página actual)
  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data || [];
    return (data || []).filter((r) => nombreDe(r).toLowerCase().includes(q));
  }, [data, query]);

  // Orden estable (cliente)
  const ordenadas = useMemo(() => {
    const arr = [...filtradas].map((x, i) => ({ x, i }));
    arr.sort((A, B) => {
      let cmp = 0;
      if (sort.by === "nota") {
        const a = notaDe(A.x), b = notaDe(B.x);
        if (a === null && b === null) cmp = 0;
        else if (a === null) cmp = sort.dir === "asc" ? -1 : 1;
        else if (b === null) cmp = sort.dir === "asc" ?  1 : -1;
        else cmp = a - b;
        if (sort.dir === "desc") cmp = -cmp;
      } else {
        const a = nombreDe(A.x).toLocaleLowerCase();
        const b = nombreDe(B.x).toLocaleLowerCase();
        cmp = a.localeCompare(b, "es", { sensitivity: "base" });
        if (sort.dir === "desc") cmp = -cmp;
      }
      return cmp !== 0 ? cmp : A.i - B.i; // sort estable
    });
    return arr.map((o) => o.x);
  }, [filtradas, sort]);

  /* ===========================
     Exportar desde modal (tu lógica)
     =========================== */
  const handleDownload = async (tipo, sel) => {
    try {
      const opciones = [
        { label: "Todos", value: "todos" },
        { label: "Clasificados", value: "clasificados" },
        { label: "No Clasificados", value: "no_clasificados" },
        { label: "Descalificados", value: "descalificados" },
      ];
      const tipo_clas = obtenerValuePorLabel(tipo, opciones);
      const nombreArchivo = `${tipo} - ${sel?.area || "Todas"} (${sel?.nivel || "Todos"})`;
      const asignaciones = obtenerIdArea(allAreas, sel.area);
      const params = {
        id_area: asignaciones.id_area || "",
        nivel_nombre: sel?.nivel || "",
        estado_clasificado: tipo_clas || "",
      };
      const response = await api.get("evaluaciones/exportar", {
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `evaluaciones_${nombreArchivo}_${new Date().toISOString().slice(0, 19).replace("T", "_")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
      alert("Hubo un problema al exportar las evaluaciones.");
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header con acciones */}
      <HeaderBar
        isGenerating={flowOpen}
        onGenerar={() => setFlowOpen(true)}
        onPublicar={publicarResultados}
      />

      {/* Tabs de fase (dejamos final deshabilitado como tenías) */}
      <PhaseTabs
        fase={fase}
        setFase={(f) => f !== "final" && setFase(f)}
        disableFinal
      />

      {/* 🔹 NUEVO: Buscador/Orden SOLO arriba de la tabla, sin tocarla */}
      <BusquedaOrdenAdmin
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        disabled={loading}
      />

      {/* Tablita: SIN CAMBIAR, solo que ahora recibe 'ordenadas' */}
      <ResultsCard
        titulo="Resultados Fase Clasificatoria"
        areas={areasDisponibles}
        area={area}
        setArea={setArea}
        niveles={nivelesDisponibles}
        nivel={nivel}
        setNivel={setNivel}
        rows={ordenadas}        // ← antes: data
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

      {/* Modal "Generar listas" (tu flujo) */}
      <GenerateListsFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
}
