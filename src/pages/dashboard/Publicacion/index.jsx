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
import { faseService } from "@/services/faseService";
import ResultsFinalTable from "./components/ResultsFinalTable";
import ConfirmationModal from "@/components/ConfirmationModal";

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
function quitarAcentos(texto) {
  return texto
    .normalize("NFD") // Separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .toLowerCase();
}

function obtenerIdArea(areas, nombreArea) {
  const nombreNormalizado = quitarAcentos(nombreArea);

  const area = areas.find((a) => quitarAcentos(a.nombre) === nombreNormalizado);

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
    const okNivel = selection?.nivel
      ? matchNivel(nivelVal, selection.nivel)
      : true;
    return okTipo && okArea && okNivel;
  });
}

/* ===========================
   Helpers para buscar/ordenar (solo cliente)
   =========================== */
function nombreDe(r) {
  return (
    r?.nombre_completo || r?.competidor?.nombre_completo || r?.nombre || ""
  );
}
function notaDe(r) {
  const raw = r?.nota_academica ?? r?.nota ?? r?.evaluacion?.nota ?? null;
  if (raw === null || raw === undefined || raw === "" || raw === "0-100")
    return null;
  const n = Number(String(raw).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/* ===========================
   Página de Publicación (ADMIN)
   =========================== */
export default function PublicacionPage() {
  const {
    dataAreas,
    fase,
    setFase,
    fases,
    area,
    setArea,
    nivel,
    setNivel,
    nivelesDisponibles,
    areasDisponibles,
  } = useFilters();

  const [tipo, setTipo] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  /* ===========================
     NUEVO: Buscador + Orden (solo sobre la página actual)
     =========================== */
  const [query, setQuery] = useState(""); // buscar por NOMBRE (solo nombre)
  const [sort, setSort] = useState({ by: "puntaje_total", dir: "desc" }); // predeterminado: Nota ↓
  const {
    isClasificacionActiva,
    isFinalActiva,
    data, // ← filas que ya alimentan ResultsCard
    loading,
    totalPages,
    toast,
    generarListas,
    publicarResultados,
    limpiarToast,
    openModalConfirm,
    setOpenModalConfirm,
  } = usePublicacion({ fase, area, nivel, tipo, page, perPage, query, sort });

  // Para exportación (tu lógica)

  const [flowOpen, setFlowOpen] = useState(false);

  const handleDownload = async (tipo, Nomfase, sel, sort) => {
    try {
      const opciones = [
        { label: "Todos", value: "todos" },
        { label: "Clasificados", value: "Clasificado" },
        { label: "No Clasificados", value: "No clasificado" },
        { label: "Descalificados", value: "Descalificado" },
      ];
      console.log("tipo ", tipo);
      let res = "";
      if (Nomfase == "final") {
        res = tipo;
      }
      const tipo_clas = obtenerValuePorLabel(tipo, opciones);
      const nombreArchivo = `${tipo} - ${sel?.area || "Todas"} (${
        sel?.nivel || "Todos"
      })`;
      console.log("fases", fases);
      const faseSel = fases.find((a) => a.nombre === Nomfase);
      console.log("sel", sel, faseSel, sort);
      const params = {
        estado: res || null,
        ordenar_por: sort?.by ?? "",
        direccion: sort?.dir ?? "",
        id_fase: faseSel?.id ?? "",
        id_area: sel.areaId || "",
        id_nivel: sel?.nivelId || "",
        estado_clasificado: tipo_clas || "",
      };
      console.log(params);
      const response = await api.get("evaluaciones/exportar", {
        params,
        responseType: "blob",
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
        onPublicar={() => setOpenModalConfirm(true)}
        isActivo={isClasificacionActiva || isFinalActiva}
      />

      {/* Tabs de fase (dejamos final deshabilitado como tenías) */}
      <PhaseTabs fase={fase} fases={fases} setFase={setFase} />

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
        rows={data} // ← antes: data
        setPage={setPage}
        page={page}
        totalPages={totalPages}
        loading={loading}
        esfinal={fase?.nombre == "final"}
      />

      {toast && (
        <ToastInline
          type={toast.type}
          message={toast.message}
          onClose={limpiarToast}
        />
      )}
      <ConfirmationModal
        open={openModalConfirm}
        onClose={() => setOpenModalConfirm(false)}
        onConfirm={publicarResultados}
        title="Publicar resultados"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, continuar"
        cancelText="Cancelar"
      />
      {/* Modal "Generar listas" (tu flujo) */}
      <GenerateListsFlow
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        onDownload={handleDownload}
        areas={dataAreas}
      />
    </div>
  );
}
