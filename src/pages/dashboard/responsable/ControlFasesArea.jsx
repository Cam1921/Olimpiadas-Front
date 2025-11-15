// src/pages/dashboard/responsable/ControlFasesArea.jsx
import EvaluacionesRepository from "@/infrastructure/http/Evaluacion/repository";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineCheckCircle,
  HiCheck,
  HiXMark,
  HiOutlineEye,
} from "react-icons/hi2";

/* ====== Colores (paleta del sistema) ====== */
const C = {
  brand: "#0284C7",
  ink: "#23263D",
  bg: "#F8FAFB",
  ok: "#1B8665",
  err: "#DC2626",
  warn: "#F59E0B",
  grayB: "#E5E7EB",
};

/* ===== Constante para el límite del motivo ===== */
const MAX_MOTIVO_CHARS = 500;

/* ===== Helpers HU11.2 (normalización + comparación) ===== */
function nombreDe(r) {
  return r?.nombre_completo || r?.competidor?.nombre_completo || r?.nombre || "";
}
function ciDe(r) {
  return r?.ci || r?.documento_identidad || r?.competidor?.ci || "";
}
function notaDe(r) {
  const raw = r?.nota_academica ?? r?.nota ?? r?.evaluacion?.nota ?? null;
  if (raw === null || raw === undefined || raw === "" || raw === "Sin nota" || raw === "0-100") return null;
  const n = Number(String(raw).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/* ===== Modal genérico (con overlay que cubre toda la pantalla) ===== */
function Modal({ open, title, children, footer, onClose }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2000] bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-[2001] flex items-start justify-center px-4 pt-16">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#23263D]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#23263D]/10 flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: C.ink }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full grid place-items-center hover:bg-[#F1F5F9] text-[#23263D]/70"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
          {footer && (
            <div className="px-6 py-4 bg-[#F8FAFB] border-t border-[#23263D]/10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

/* ===== Pills/Badges ===== */
function PhasePill({ text }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 h-8 rounded-full text-sm font-medium"
      style={{
        color: C.brand,
        background: "#E6F2FA",
        border: `1px solid ${C.brand}`,
      }}
    >
      <HiOutlineCheckCircle />
      {text}
    </span>
  );
}

function CategoryBadge({ cat }) {
  const cfg =
    cat === "Clasificado"
      ? { bg: "#E7F5EF", fg: C.ok }
      : cat === "No clasificado"
      ? { bg: "#FFF7DB", fg: C.warn }
      : cat === "Descalificado"
      ? { bg: "#FEECEC", fg: C.err }
      : { bg: "FFFFFF", fg: C.brand };

  return (
    <span
      className="inline-block px-3 py-[2px] rounded-full text-xs font-medium"
      style={{
        background: cfg.bg,
        color: cfg.fg,
        border: `1px solid ${cfg.fg}3a`,
      }}
    >
      {cat}
    </span>
  );
}

/* ➜ “Aprobado/Rechazado” muy redondeados, sin íconos */
function AprobadoPill() {
  return (
    <span
      className="inline-flex items-center px-4 py-[7px] rounded-full text-xs font-semibold"
      style={{
        background: "#E7F5EF",
        color: C.ok,
        border: `1px solid ${C.ok}3a`,
      }}
    >
      Aprobado
    </span>
  );
}
function RechazadoPill() {
  return (
    <span
      className="inline-flex items-center px-4 py-[7px] rounded-full text-xs font-semibold"
      style={{
        background: "#FEECEC",
        color: C.err,
        border: `1px solid ${C.err}3a`,
      }}
    >
      Rechazado
    </span>
  );
}

/* ===== Vista principal ===== */
export default function ControlFasesArea({
  idAreaNivelFase,
  nombreNivel,
  nombreFase,
  estadoFase,
}) {
  const [rows, setRows] = useState([]);

  // Rechazo (captura motivo)
  const [openRechazo, setOpenRechazo] = useState(false);
  const [rowSel, setRowSel] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [motivoErr, setMotivoErr] = useState("");

  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Ver motivo
  const [openVer, setOpenVer] = useState(false);
  const [rowVer, setRowVer] = useState(null);

  // Botón de “Aval aplicado a Clasificados”
  const [avalGranted, setAvalGranted] = useState(false);

  // === HU11.2: buscador + orden (visual) ===
  const [query, setQuery] = useState(""); // Buscar por nombre/CI
  const [sort, setSort] = useState({ by: "nota", dir: "desc" }); // default: Nota ↓

  const fetchEvaluaciones = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await EvaluacionesRepository.getEvaluaciones(
        { page: pageNum, perPage: 10 },
        idAreaNivelFase
      );
      const adaptedData = res.data.map((item) => ({
        id: item.id_evaluacion,
        nombre: item.nombre,
        ci:
          item.ci ||
          item.documento_identidad ||
          item?.competidor?.ci ||
          "", // para búsqueda por CI
        nota: item.nota || "Sin nota",
        categoria: item.estado_clasificado || "Sin categoria",
        observacion: item.descripcion || "Sin observacion",
        estado: item.estado_confirmado,
        motivo: item.observacion,
      }));
      setRows(adaptedData);
      setMeta(res.meta);
      setPage(res.meta.current_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (estadoFase === "confirmado") setAvalGranted(true);
    fetchEvaluaciones(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aprobar = async (r) => {
    await EvaluacionesRepository.updateEvaluacion(r.id, {
      estado_confirmacion: "aprobado",
      observacion: "Ninguno",
    });
    setRows((prev) =>
      prev.map((x) =>
        x.id === r.id ? { ...x, estado: "aprobado", motivo: "Ninguno" } : x
      )
    );
  };

  const abrirRechazo = (r) => {
    setRows((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, estado: "rechazado" } : x))
    );
    setRowSel(r);
    setMotivo("");
    setMotivoErr("");
    setOpenRechazo(true);
  };

  const cancelarRechazo = () => {
    if (rowSel) {
      setRows((prev) =>
        prev.map((x) =>
          x.id === rowSel.id ? { ...x, estado: "pendiente", motivo: "" } : x
        )
      );
    }
    setOpenRechazo(false);
  };

  /* ✅ Validación: min 5 y máx 500 */
  const confirmarRechazo = async () => {
    const len = (motivo || "").trim().length;
    if (len < 5) {
      setMotivoErr("El motivo es obligatorio (mín. 5 caracteres).");
      return;
    }
    if (len > MAX_MOTIVO_CHARS) {
      setMotivoErr(`Máximo ${MAX_MOTIVO_CHARS} caracteres.`);
      return;
    }
    await EvaluacionesRepository.updateEvaluacion(rowSel.id, {
      estado_confirmacion: "rechazado",
      observacion: motivo.trim(),
    });
    setRows((prev) =>
      prev.map((x) =>
        x.id === rowSel.id
          ? { ...x, estado: "rechazado", motivo: motivo.trim() }
          : x
      )
    );
    setOpenRechazo(false);
  };

  const abrirVerMotivo = (r) => {
    setRowVer(r);
    setOpenVer(true);
  };

  /* ✅ Otorgar aval: aprueba en bloque solo los “Clasificado” */
  const otorgarAval = async () => {
    try {
      await EvaluacionesRepository.otorgarAval(idAreaNivelFase);
      setRows((prev) =>
        prev.map((x) =>
          x.categoria === "Clasificado"
            ? { ...x, estado: "aprobado", motivo: "Ninguno" }
            : x
        )
      );
      setAvalGranted(true);
      fetchEvaluaciones(1);
    } catch (error) {
      console.error("Error al otorgar aval:", error);
    }
  };

  /* ===== HU11.2: filtrado (nombre/CI) + orden estable (nombre/nota) ===== */
  const rowsFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const nom = nombreDe(r).toLowerCase();
      const ci  = String(ciDe(r)).toLowerCase();
      return nom.includes(q) || ci.includes(q);
    });
  }, [rows, query]);

  const rowsOrdenadas = useMemo(() => {
    const arr = [...rowsFiltradas].map((x, i) => ({ x, i })); // sort estable
    arr.sort((A, B) => {
      let cmp = 0;
      if (sort.by === "nota") {
        const a = notaDe(A.x), b = notaDe(B.x);
        if (a === null && b === null) cmp = 0;
        else if (a === null) cmp = -1;
        else if (b === null) cmp = 1;
        else cmp = a - b;
        if (sort.dir === "desc") cmp = -cmp;
      } else {
        const a = nombreDe(A.x).toLocaleLowerCase();
        const b = nombreDe(B.x).toLocaleLowerCase();
        cmp = a.localeCompare(b, "es", { sensitivity: "base" });
        if (sort.dir === "desc") cmp = -cmp;
      }
      return cmp !== 0 ? cmp : A.i - B.i;
    });
    return arr.map((o) => o.x);
  }, [rowsFiltradas, sort]);

  const active = (by) => sort.by === by;
  const arrow = sort.dir === "asc" ? "▲" : "▼";

  return (
    <div className="p-6">
      {/* Título principal */}
      <h1 className="text-[26px] font-semibold mb-1" style={{ color: C.ink }}>
        Control de Fases de mi Área
      </h1>
      <p className="text-sm mb-5" style={{ color: `${C.ink}99` }}>
        Gestiona las aprobaciones y rechazos según la fase actual
      </p>

      {/* Card: Fase Actual */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#23263D]/10 mb-5">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="text-[15px] font-semibold" style={{ color: C.ink }}>
            Fase Actual: <span className="font-normal">{nombreFase}</span>
          </div>
          <PhasePill text={nombreFase} />
        </div>
      </div>

      {/* Card: Control de Clasificación */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#23263D]/10">
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-[20px] font-semibold"
                style={{ color: C.ink }}
              >
                Control de Clasificación
              </div>
              <p className="text-xs mt-[2px]" style={{ color: `${C.ink}99` }}>
                Revisa y aprueba las clasificaciones propuestas para tu área
              </p>
            </div>

            <button
              type="button"
              onClick={otorgarAval}
              disabled={avalGranted}
              className={`inline-flex items-center gap-2 h-9 px-4 rounded-lg text-white text-sm shadow-sm ${
                avalGranted ? "opacity-60 cursor-not-allowed" : ""
              }`}
              style={{ background: C.brand }}
              title="Otorgar aval de fase"
            >
              <HiOutlineCheckCircle size={18} />
              {avalGranted
                ? "Aval aplicado a Clasificados"
                : "Otorgar aval de fase"}
            </button>
          </div>

          {/* === HU11.2: Barra de búsqueda y orden === */}
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Buscar por nombre o CI */}
            <div className="relative w-full md:max-w-lg">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o CI…"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-sky-500 focus:outline-none"
                disabled={loading}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ⌕
              </span>
            </div>

            {/* Ordenar por */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>

              <button
                type="button"
                onClick={() =>
                  setSort((s) =>
                    s.by === "nombre"
                      ? { by: "nombre", dir: s.dir === "asc" ? "desc" : "asc" }
                      : { by: "nombre", dir: "asc" }
                  )
                }
                aria-pressed={active("nombre")}
                disabled={loading}
                className={[
                  "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition",
                  active("nombre")
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                  loading && "opacity-60",
                ].join(" ")}
              >
                <span>Nombre</span>
                {active("nombre") && <span>{arrow}</span>}
              </button>

              <button
                type="button"
                onClick={() =>
                  setSort((s) =>
                    s.by === "nota"
                      ? { by: "nota", dir: s.dir === "asc" ? "desc" : "asc" }
                      : { by: "nota", dir: "desc" }
                  )
                }
                aria-pressed={active("nota")}
                disabled={loading}
                className={[
                  "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition",
                  active("nota")
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                  loading && "opacity-60",
                ].join(" ")}
              >
                <span>Nota</span>
                {active("nota") && <span>{arrow}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-[#F8FAFB] text-[#23263D]">
                <th className="px-5 py-3 rounded-tl-2xl">Competidor/Equipo</th>
                <th className="px-5 py-3">Nota</th>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">Observación</th>
                <th className="px-5 py-3">Acción</th>
                <th className="px-5 py-3 rounded-tr-2xl">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Cargando evaluaciones...
                  </td>
                </tr>
              ) : rowsOrdenadas.length ? (
                rowsOrdenadas.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "#23263D1a" }}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium">{r.nombre}</div>
                      {r.ci ? (
                        <div className="text-xs text-gray-500 mt-1">CI: {r.ci}</div>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">{r.nota}</td>
                    <td className="px-5 py-3">
                      <CategoryBadge cat={r.categoria} />
                    </td>
                    <td className="px-5 py-3">{r.observacion}</td>

                    {/* Acción */}
                    <td className="px-5 py-3">
                      {r.estado === "aprobado" ? (
                        <AprobadoPill />
                      ) : r.estado === "rechazado" ? (
                        <RechazadoPill />
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => aprobar(r)}
                            className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-white text-xs shadow-sm"
                            style={{ background: C.brand }}
                          >
                            <HiCheck size={14} />
                            Aprobar
                          </button>
                          <button
                            type="button"
                            onClick={() => abrirRechazo(r)}
                            className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs shadow-sm"
                            style={{
                              background: "#FFFFFF",
                              color: "#6B7280",
                              border: `1px solid ${C.grayB}`,
                            }}
                          >
                            <HiXMark size={14} />
                            Rechazar
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Motivo */}
                    <td className="px-5 py-3">
                      {r.estado === "rechazado" && r.motivo ? (
                        <button
                          type="button"
                          onClick={() => abrirVerMotivo(r)}
                          className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-white text-xs shadow-sm"
                          style={{ background: C.brand }}
                        >
                          <HiOutlineEye size={14} />
                          Ver
                        </button>
                      ) : r.estado === "aprobado" ? (
                        "Ninguno"
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Sin registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {meta && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 py-3 mt-4">
              <div className="flex gap-2 justify-center items-center">
                <button
                  disabled={!meta.prev_page_url}
                  onClick={() => fetchEvaluaciones(page - 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-gray-600 mt-2 sm:mt-0">
                  Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                  disabled={!meta.next_page_url}
                  onClick={() => fetchEvaluaciones(page + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5" />
      </div>

      {/* Modal motivo de rechazo (con contador y límite) */}
      <Modal
        open={openRechazo}
        onClose={cancelarRechazo}
        title="Motivo de rechazo"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelarRechazo}
              className="h-10 px-6 rounded-full text-white shadow-sm"
              style={{ background: C.brand }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarRechazo}
              className="h-10 px-6 rounded-full text-white shadow-sm"
              style={{ background: C.err }}
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p className="text-sm mb-2" style={{ color: `${C.ink}99` }}>
          Explica brevemente el motivo (mín. 5 caracteres, máx.{" "}
          {MAX_MOTIVO_CHARS}).
        </p>

        <textarea
          value={motivo}
          onChange={(e) => {
            const v = e.target.value;
            const clipped = v.slice(0, MAX_MOTIVO_CHARS);
            setMotivo(clipped);
            if (motivoErr) setMotivoErr("");
          }}
          maxLength={MAX_MOTIVO_CHARS}
          className="w-full min-h-[120px] rounded-xl border p-3 outline-none"
          style={{ borderColor: "#E5E7EB" }}
          placeholder="Escribe el motivo…"
        />

        <div className="mt-2 flex items-center justify-between text-sm">
          <span style={{ color: "#6B7280" }}>
            {(motivo || "").trim().length}/{MAX_MOTIVO_CHARS}
          </span>
          {motivoErr && <span style={{ color: C.err }}>{motivoErr}</span>}
        </div>
      </Modal>

      {/* Modal Ver motivo */}
      <Modal
        open={openVer}
        onClose={() => setOpenVer(false)}
        title="Motivo registrado"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setOpenVer(false)}
              className="h-10 px-5 rounded-full text-white"
              style={{ background: C.brand }}
            >
              Cerrar
            </button>
          </div>
        }
      >
        <div
          className="rounded-xl border p-4 text-sm"
          style={{
            borderColor: "#E5E7EB",
            color: C.ink,
            background: "#F8FAFB",
          }}
        >
          {rowVer?.motivo}
        </div>
      </Modal>
    </div>
  );
}
