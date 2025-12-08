// src/pages/dashboard/certificados/certificados.jsx
import React, { useMemo, useState, useRef } from "react";
import {
  HiAdjustments,
  HiCheckCircle,
  HiX,
  HiDocumentText,
  HiSparkles,
  HiClipboardList,
  HiDownload,
  HiCollection,
  HiBadgeCheck,
  HiOutlineDocumentDuplicate,
  HiClock,
  HiTrash,
  HiRefresh,
} from "react-icons/hi";
import { FaTrophy } from "react-icons/fa";

// 👇 Usa el renderer existente (no tocar)
import { buildCertificate, downloadBlob } from "./canvasRenderers";
import { useFilterCertificados } from "./useFilterCertificados";
import { DataInteractive } from "@headlessui/react";

/* ====== Colores y estilos ====== */
const COLORS = {
  primary: "#0284C7",
  text: "#23263D",
  bg: "#F8FAFB",
  success: "#1B8665",
  error: "#DC2626",
  line: "#E5EEF7",
  mint: "#E6FFF4",
  grayPill: "#EEF1F6",
  premBtn: "#FFAE00",
};
const shadowCard = "shadow-[0_6px_18px_rgba(35,38,61,0.08)]";
const ringSoft = "ring-1 ring-[#DFE7F1]";

/* ===== Grids ===== */
const GRID_PART = "40px 2fr 1fr 1fr 1fr 120px";
const GRID_PREM = "40px 2fr 1fr 1fr 1fr 1fr 120px";

/* ===== Áreas y niveles ===== */
const AREAS = [
  "Informática",
  "Astrofísica",
  "Biología",
  "Matemáticas",
  "Química",
  "Robótica",
];
const LEVELS_BY_AREA = {
  Astrofísica: [
    "Todos los niveles",
    "3P",
    "4P",
    "5P",
    "6P",
    "1S",
    "2S",
    "3S",
    "4S",
    "5S",
    "6S",
  ],
  Biología: ["Todos los niveles", "2S", "3S", "4S", "5S", "6S"],
  Informática: [
    "Todos los niveles",
    "Guacamayo",
    "Guanaco",
    "Londra",
    "Jucumari",
    "Bufeo",
    "Puma",
  ],
  Matemáticas: [
    "Todos los niveles",
    "Primer Nivel",
    "Segundo Nivel",
    "Tercer Nivel",
    "Cuarto Nivel",
    "Quinto Nivel",
    "Sexto Nivel",
  ],
  Química: ["Todos los niveles", "2S", "3S", "4S", "5S", "6S"],
  Robótica: [
    "Todos los niveles",
    "Builders P",
    "Builders S",
    "Lego P",
    "Lego S",
  ],
};

/* ===== Util visual ===== */
const Pill = ({ color = "#EEF1F6", textColor = COLORS.text, children }) => (
  <span
    className="px-2.5 py-1 text-xs rounded-full font-medium"
    style={{ backgroundColor: color, color: textColor }}
  >
    {children}
  </span>
);

const PRIZE_STYLE = {
  Oro: { bg: "#FACC15", ring: "#B45309", icon: "#7C2D12", text: COLORS.text },
  Plata: { bg: "#E5E7EB", ring: "#9CA3AF", icon: "#374151", text: COLORS.text },
  Bronce: { bg: "#B45309", ring: "#7C2D12", icon: "#431407", text: "#0F172A" },
  Mención: {
    bg: "#3B82F6",
    ring: "#1D4ED8",
    icon: "#1E3A8A",
    text: COLORS.text,
  },
};
function PrizeBadge({ value }) {
  const v = (value || "").trim();
  const style = PRIZE_STYLE[v] || PRIZE_STYLE["Mención"];
  const valor = v === "Mención Honorífica" ? "Mención" : v;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: 36,
          height: 36,
          background: style.bg,
          boxShadow: `inset 0 0 0 3px ${style.ring}`,
        }}
      >
        <FaTrophy size={16} color={style.icon} />
      </span>
      <span className="text-base font-semibold" style={{ color: COLORS.text }}>
        {valor}
      </span>
    </span>
  );
}

/* ===== Modal de éxito reutilizable ===== */
function SuccessModal({ open, title, subtitle, detail, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(35,38,61,0.30)" }}
    >
      <div
        className={`${shadowCard} ${ringSoft} bg-white w-full max-w-md rounded-2xl`}
      >
        <div className="p-5 flex items-start gap-3">
          <div className="mt-0.5">
            <HiCheckCircle size={22} color={COLORS.success} />
          </div>
          <div className="flex-1">
            <h3
              className="text-xl font-semibold"
              style={{ color: COLORS.text }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <HiX size={18} />
          </button>
        </div>
        {detail && (
          <div className="px-5 -mt-2 mb-2">
            <p className="text-sm" style={{ color: COLORS.text }}>
              {detail}
            </p>
          </div>
        )}
        <div className="p-5 pt-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold text-white"
            style={{ backgroundColor: COLORS.primary }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Row/Table helpers ===== */
function Row({ grid = GRID_PART, lead = null, cells = [], right = null }) {
  return (
    <div
      className="grid items-center px-4 py-2.5 border-t text-[13px] sm:text-sm"
      style={{ borderColor: COLORS.line, gridTemplateColumns: grid }}
    >
      <div className="flex items-center">{lead}</div>
      {cells.map((c, i) => (
        <div key={i} className="text-[#334155] truncate">
          {c}
        </div>
      ))}
      <div className="flex justify-end">{right}</div>
    </div>
  );
}

function SoftTable({
  grid = GRID_PART,
  header = [],
  leading = null,
  children,
  minWidth = 760,
}) {
  return (
    <div
      className={`${ringSoft} bg-white rounded-2xl overflow-hidden ${shadowCard}`}
    >
      <div className="overflow-x-auto">
        <div style={{ minWidth: minWidth }}>
          <div
            className="grid px-4 py-3 text-[12px] sm:text-[13px] font-semibold"
            style={{ color: COLORS.text, gridTemplateColumns: grid }}
          >
            <div className="flex items-center">{leading}</div>
            {header.map((h, idx) => (
              <div key={idx} className="truncate">
                {h}
              </div>
            ))}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================== */
/*                   PANTALLA PRINCIPAL                  */
/* ===================================================== */
export default function Certificados() {
  // Datos base
  const baseRows = useMemo(
    () => [
      {
        id: 1,
        nombre: "María González",
        colegio: "Colegio Nacional A",
        area: "Química",
        nivel: "2S",
        premio: "Bronce",
        estado: "Pendiente",
      },
      {
        id: 2,
        nombre: "Carlos Pérez",
        colegio: "Unidad Educ. Cosmos",
        area: "Astrofísica",
        nivel: "4P",
        premio: "Plata",
        estado: "Pendiente",
      },
      {
        id: 3,
        nombre: "Sofía Quispe",
        colegio: "Colegio del Sol",
        area: "Biología",
        nivel: "5S",
        premio: "Mención",
        estado: "Pendiente",
      },
      {
        id: 4,
        nombre: "Lucía Rojas",
        colegio: "Colegio San Pablo",
        area: "Biología",
        nivel: "4S",
        premio: "Oro",
        estado: "Pendiente",
      },
      {
        id: 5,
        nombre: "Diego Vargas",
        colegio: "U.E. Robótica XXI",
        area: "Robótica",
        nivel: "Lego S",
        premio: "Bronce",
        estado: "Pendiente",
      },
      {
        id: 6,
        nombre: "Ana Flores",
        colegio: "Colegio Informar",
        area: "Informática",
        nivel: "Puma",
        premio: "Plata",
        estado: "Pendiente",
      },
      {
        id: 7,
        nombre: "Javier Cruz",
        colegio: "Colegio Euler",
        area: "Matemáticas",
        nivel: "Tercer Nivel",
        premio: "Mención",
        estado: "Pendiente",
      },
    ],
    []
  );

  /* ===== Filtros ===== */
  const [area, setArea] = useState("Todas las áreas");
  const [nivel, setNivel] = useState("Todos los niveles");
  const [habilitado, setHabilitado] = useState(false);

  const tabs = [
    "Participación",
    "Premiación",
    "Plantilla vacía",
    "Log de certificados",
  ];
  const [tab, setTab] = useState(tabs[0]);

  const {
    dataLogs,
    data,
    filtros,
    setters,
    opciones,
    lastPage,
    lastPageL,
    handleGenerar,
  } = useFilterCertificados(tab);
  /*   console.log(filtros, setters, opciones, data); */
  const [filtered, setFiltered] = useState(data);

  const onChangeArea = (e) => {
    setArea(e.target.value);
    setNivel("Todos los niveles");
    setHabilitado(false);
    setSelectedPart(new Set());
    setSelectedPrem(new Set());
  };
  const onChangeNivel = (e) => {
    setNivel(e.target.value);
    setHabilitado(false);
    setSelectedPart(new Set());
    setSelectedPrem(new Set());
  };
  const aplicarFiltros = () => {
    let rows = [...baseRows];
    if (area !== "Todas las áreas") {
      rows = rows.filter((r) => r.area === area);
      if (nivel !== "Todos los niveles")
        rows = rows.filter((r) => r.nivel === nivel);
    }
    setFiltered(rows);
  };
  const validar = () => {
    aplicarFiltros();
    setHabilitado(true);
  };

  /* ===== Selecciones ===== */
  const [selectedPart, setSelectedPart] = useState(new Set());
  const [selectedPrem, setSelectedPrem] = useState(new Set());

  /* ===== Encabezados ===== */
  const headerPart = ["Nombre", "Área", "Nivel", "Estado", "Acciones"];
  const headerPrem = [
    "Nombre",
    "Área",
    "Nivel",
    "Premio",
    "Estado",
    "Acciones",
  ];

  /* ===== Plantillas (PNG) ===== */
  const premInputRef = useRef(null);
  const partInputRef = useRef(null);
  const [tplPrem, setTplPrem] = useState(null); // plantilla premiación
  const [tplPart, setTplPart] = useState(null); // plantilla participación
  const MAX_BYTES = 10 * 1024 * 1024;
  const validateAndSet = (file, kind) => {
    if (!file) return;
    if (file.type !== "image/png") {
      setSuccess({
        open: true,
        title: "Formato inválido",
        detail: "Solo se admite formato PNG.",
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      setSuccess({
        open: true,
        title: "Archivo muy grande",
        detail: "Tamaño máximo 10 MB.",
      });
      return;
    }
    const payload = {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    };
    if (kind === "prem") setTplPrem(payload);
    else setTplPart(payload);
    setSuccess({
      open: true,
      title: "Operación Exitosa",
      detail: `Se cargó la plantilla de ${
        kind === "prem" ? "premiación" : "participación"
      } correctamente.`,
    });
  };
  const humanSize = (n) =>
    n < 1024
      ? `${n} B`
      : n < 1048576
      ? `${(n / 1024).toFixed(1)} KB`
      : `${(n / 1048576).toFixed(2)} MB`;
  const removeTpl = (kind) => {
    if (kind === "prem" && tplPrem?.url) URL.revokeObjectURL(tplPrem.url);
    if (kind === "part" && tplPart?.url) URL.revokeObjectURL(tplPart.url);
    (kind === "prem" ? setTplPrem : setTplPart)(null);
  };

  /* ===== Log de certificados (AHORA DINÁMICO) ===== */
  const seedLog = [
    {
      fecha: "2025-01-21",
      hora: "20:44",
      usuario: "Admin Usuario",
      tipo: "Premio",
      competidor: "—",
      area: "—",
    },
    {
      fecha: "2025-01-21",
      hora: "20:40",
      usuario: "Admin Usuario",
      tipo: "Participación",
      competidor: "—",
      area: "—",
    },
  ];
  const [logRows, setLogRows] = useState(seedLog);

  const addLog = (tipo, row) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      const usuario = user?.username || user?.user?.nombre || "Admin Usuario";
      const now = new Date();
      const fecha = now.toISOString().slice(0, 10);
      const hora = now.toTimeString().slice(0, 5);
      setLogRows((prev) => [
        ...prev,
        {
          fecha,
          hora,
          usuario,
          tipo: tipo === "premiacion" ? "Premio" : "Participación",
          competidor: row?.nombre || "-",
          area: row?.area || "-",
        },
      ]);
    } catch {
      // fallback mínimo
      const now = new Date();
      setLogRows((prev) => [
        ...prev,
        {
          fecha: now.toISOString().slice(0, 10),
          hora: now.toTimeString().slice(0, 5),
          usuario: "Admin Usuario",
          tipo: tipo === "premiacion" ? "Premio" : "Participación",
          competidor: row?.nombre || "-",
          area: row?.area || "-",
        },
      ]);
    }
  };

  /* ===== Modal de éxito ===== */
  const [success, setSuccess] = useState({
    open: false,
    title: "",
    detail: "",
  });
  const closeSuccess = () => setSuccess((s) => ({ ...s, open: false }));

  /* ===================================================== */
  /*                   GENERACIÓN CERTS                     */
  /* ===================================================== */

  // 👇 util para validar que la plantilla correcta exista
  const ensureTemplateFor = (tipo) => {
    if (tipo === "premiacion" && !tplPrem) {
      throw new Error("FALTA_PLANTILLA_PREM");
    }
    if (tipo === "participacion" && !tplPart) {
      throw new Error("FALTA_PLANTILLA_PART");
    }
  };

  async function generar(row, tipo /* "premiacion" | "participacion" */) {
    try {
      // 1) Validar plantilla correcta
      handleGenerar(row.id_inscrito);
      ensureTemplateFor(tipo);
      console.log(row);
      // 2) Construir y descargar (asegurando el 'tipo' correcto y el orden de args)
      const { blob, fileName } = await buildCertificate(
        row,
        tipo, // <— PASO EXPLÍCITO del tipo correcto
        tplPrem, // <— plantilla de premiación
        tplPart, // <— plantilla de participación
        { spacingVersion: "v2" }
      );
      downloadBlob(blob, fileName);

      // 3) Actualizar estado "Generado" en la tabla activa
      setFiltered((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, estado: "Generado" } : r))
      );

      // 4) Registrar en LOG
      addLog(tipo, row);

      // 5) Mensaje de OK
      setSuccess({
        open: true,
        title: "Operación Exitosa",
        detail:
          tipo === "premiacion"
            ? "Certificado de premiación generado."
            : "Certificado de participación generado.",
      });
    } catch (err) {
      const msg = String(err?.message || "");
      if (msg === "FALTA_PLANTILLA_PREM") {
        setSuccess({
          open: true,
          title: "Falta plantilla de premiación",
          detail: "Sube la PNG de premiación en la pestaña “Plantilla vacía”.",
        });
      } else if (msg === "FALTA_PLANTILLA_PART") {
        setSuccess({
          open: true,
          title: "Falta plantilla de participación",
          detail:
            "Sube la PNG de participación en la pestaña “Plantilla vacía”.",
        });
      } else if (msg === "FALTA_PLANTILLA") {
        setSuccess({
          open: true,
          title: "Falta plantilla",
          detail: "Sube las plantillas PNG en la pestaña “Plantilla vacía”.",
        });
      } else {
        setSuccess({
          open: true,
          title: "No se pudo generar",
          detail: "Verifica que la imagen de plantilla sea válida.",
        });
      }
    }
  }

  async function generarLote(tipo /* "premiacion" | "participacion" */) {
    const setSel = tipo === "premiacion" ? selectedPrem : selectedPart;
    if (setSel.size === 0) return;
    // Validar plantilla correcta una vez
    ensureTemplateFor(tipo);

    const ids = new Set(setSel);
    for (const r of data) {
      if (ids.has(r.id)) {
        await generar(r, tipo); // generar ya registra en log y marca “Generado”
      }
    }
    (tipo === "premiacion" ? setSelectedPrem : setSelectedPart)(new Set());
  }

  /* ============================ */
  /*   UI                         */
  /* ============================ */

  return (
    <div className="p-4 sm:p-6" style={{ backgroundColor: COLORS.bg }}>
      <div className="mb-4">
        <h1
          className="text-xl sm:text-2xl font-semibold"
          style={{ color: COLORS.text }}
        >
          Generación de Certificados – Olimpiadas Científicas
        </h1>
        <p className="text-sm mt-1 text-[#64748B]">
          Genera certificados de <b>participación</b> y <b>premiación</b>{" "}
          personalizados para los competidores.
        </p>
      </div>

      {/* Filtros */}
      <div
        className={`${shadowCard} ${ringSoft} bg-white rounded-2xl p-4 mb-5`}
      >
        <div
          className="flex items-center gap-2 text-[15px] font-semibold mb-2"
          style={{ color: COLORS.text }}
        >
          <HiAdjustments className="text-[#3B82F6]" /> Filtros de Selección
        </div>

        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="text-xs text-[#64748B]">Área</label>
            <select
              value={filtros.area || "Todas las áreas"}
              onChange={(e) => setters.setArea(e.target.value)}
              className="w-full mt-1 rounded-xl bg-white px-3.5 py-2.5 text-sm outline-none"
              style={{ border: `1px solid ${COLORS.line}` }}
            >
              {(opciones.areasDisponibles || ["Todas las áreas"]).map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-xs text-[#64748B]">Nivel</label>
            <select
              value={filtros.nivel}
              onChange={(e) => setters.setNivel(e.target.value)}
              className="w-full mt-1 rounded-xl bg-white px-3.5 py-2.5 text-sm outline-none"
              style={{ border: `1px solid ${COLORS.line}` }}
              disabled={filtros.area === "Todas las áreas"}
            >
              {(opciones.nivelesDisponibles || ["Todos los niveles"]).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              onClick={() => {
                setHabilitado(true);
              }}
              className="w-full py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              <HiBadgeCheck size={18} /> Validar habilitación
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[
          "Participación",
          "Premiación",
          "Plantilla vacía",
          "Log de certificados",
        ].map((t) => {
          const active = t === (tab ?? "Participación");
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 h-9 rounded-full text-sm font-medium transition ${
                active ? "text-white" : "text-[#0F172A]"
              }`}
              style={{
                background: active ? COLORS.primary : COLORS.grayPill,
                boxShadow: active ? "0 6px 14px rgba(2,132,199,0.25)" : "none",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Participación */}
      {tab === "Participación" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <HiClipboardList className="text-[#06B6D4]" /> Certificados de
            Participación
            <div
              className="flex-1 border-t ml-2"
              style={{ borderColor: COLORS.line }}
            />
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <SoftTable
                grid={GRID_PART}
                header={["Nombre", "Área", "Nivel", "Estado", "Acciones"]}
                leading={
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#0EA5E9] cursor-pointer"
                    checked={
                      data.length > 0 &&
                      data.every((r) => selectedPart.has(r.id))
                    }
                    onChange={() => {
                      const all =
                        DataInteractive.length > 0 &&
                        data.every((r) => selectedPart.has(r.id));
                      const next = new Set(selectedPart);
                      if (all) data.forEach((r) => next.delete(r.id));
                      else data.forEach((r) => next.add(r.id));
                      setSelectedPart(next);
                    }}
                    aria-label="Seleccionar todo participación"
                  />
                }
              >
                {data.map((r) => {
                  const checked = selectedPart.has(r.id);
                  return (
                    <Row
                      key={r.id}
                      grid={GRID_PART}
                      lead={
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#0EA5E9] cursor-pointer"
                          checked={checked}
                          onChange={() => {
                            const next = new Set(selectedPart);
                            next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                            setSelectedPart(next);
                          }}
                          aria-label={`Seleccionar ${r.nombre}`}
                        />
                      }
                      cells={[
                        r.nombre,
                        r.area,
                        r.nivel,
                        r.estado === "Generado" ? (
                          <Pill color={COLORS.mint} textColor={COLORS.success}>
                            Generado
                          </Pill>
                        ) : (
                          <Pill>Pendiente</Pill>
                        ),
                      ]}
                      right={
                        <button
                          disabled={!habilitado}
                          onClick={() => generar(r, "participacion")}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                            habilitado ? "text-white" : "text-[#94A3B8]"
                          }`}
                          style={{
                            backgroundColor: habilitado
                              ? COLORS.primary
                              : COLORS.grayPill,
                          }}
                        >
                          <HiDownload size={16} /> Generar
                        </button>
                      }
                    />
                  );
                })}
              </SoftTable>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setters.setPage(filtros.page - 1)}
                disabled={filtros.page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm">
                Página {filtros.page} de {lastPage}
              </span>
              <button
                onClick={() => setters.setPage(filtros.page + 1)}
                disabled={filtros.page === lastPage}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <button
              disabled={!habilitado || selectedPart.size === 0}
              onClick={() => generarLote("participacion")}
              className={`px-3 py-2 mt-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                habilitado && selectedPart.size > 0
                  ? "text-white"
                  : "text-[#94A3B8]"
              }`}
              style={{
                background:
                  habilitado && selectedPart.size > 0
                    ? COLORS.primary
                    : COLORS.grayPill,
              }}
            >
              <HiCollection size={18} /> Generar en lote
            </button>
          </div>
        </div>
      )}

      {/* Premiación */}
      {tab === "Premiación" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <HiSparkles className="text-[#F59E0B]" /> Certificados de Premiación
            <div
              className="flex-1 border-t ml-2"
              style={{ borderColor: COLORS.line }}
            />
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[880px]">
              <SoftTable
                grid={GRID_PREM}
                header={[
                  "Nombre",
                  "Área",
                  "Nivel",
                  "Premio",
                  "Estado",
                  "Acciones",
                ]}
                leading={
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#0EA5E9] cursor-pointer"
                    checked={
                      data.length > 0 &&
                      data.every((r) => selectedPrem.has(r.id))
                    }
                    onChange={() => {
                      const all =
                        data.length > 0 &&
                        data.every((r) => selectedPrem.has(r.id));
                      const next = new Set(selectedPrem);
                      if (all) data.forEach((r) => next.delete(r.id));
                      else data.forEach((r) => next.add(r.id));
                      setSelectedPrem(next);
                    }}
                    aria-label="Seleccionar todo premiación"
                  />
                }
              >
                {data.map((r) => {
                  const checked = selectedPrem.has(r.id);
                  return (
                    <Row
                      key={r.id}
                      grid={GRID_PREM}
                      lead={
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#0EA5E9] cursor-pointer"
                          checked={checked}
                          onChange={() => {
                            const next = new Set(selectedPrem);
                            next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                            setSelectedPrem(next);
                          }}
                          aria-label={`Seleccionar ${r.nombre}`}
                        />
                      }
                      cells={[
                        r.nombre,
                        r.area,
                        r.nivel,
                        <PrizeBadge key={`p-${r.id}`} value={r.premio} />,
                        r.estado === "Generado" ? (
                          <Pill color={COLORS.mint} textColor={COLORS.success}>
                            Generado
                          </Pill>
                        ) : (
                          <Pill>Pendiente</Pill>
                        ),
                      ]}
                      right={
                        <button
                          disabled={!habilitado}
                          onClick={() => generar(r, "premiacion")}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                            habilitado ? "text-white" : "text-[#94A3B8]"
                          }`}
                          style={{
                            backgroundColor: habilitado
                              ? COLORS.premBtn
                              : COLORS.grayPill,
                          }}
                        >
                          <HiDownload size={16} /> Generar
                        </button>
                      }
                    />
                  );
                })}
              </SoftTable>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setters.setPage(filtros.page - 1)}
                disabled={filtros.page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm">
                Página {filtros.page} de {lastPage}
              </span>
              <button
                onClick={() => setters.setPage(filtros.page + 1)}
                disabled={filtros.page === lastPage}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <button
              disabled={!habilitado || selectedPrem.size === 0}
              onClick={() => generarLote("premiacion")}
              className={`px-3 py-2 mt-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                habilitado && selectedPrem.size > 0
                  ? "text-white"
                  : "text-[#94A3B8]"
              }`}
              style={{
                background:
                  habilitado && selectedPrem.size > 0
                    ? COLORS.premBtn
                    : COLORS.grayPill,
              }}
            >
              <HiCollection size={18} /> Generar en lote
            </button>
          </div>
        </div>
      )}

      {/* Plantilla vacía */}
      {tab === "Plantilla vacía" && (
        <div className={`${shadowCard} ${ringSoft} bg-white rounded-2xl p-6`}>
          <div
            className="flex items-center gap-2 text-[15px] font-semibold mb-6"
            style={{ color: COLORS.text }}
          >
            <HiOutlineDocumentDuplicate className="text-[#64748B]" /> Plantilla
            Vacía
          </div>

          <div className="flex flex-col items-center text-center pt-2 pb-6">
            <div
              className="rounded-2xl border-2 border-dashed w-full max-w-4xl py-10 mb-6"
              style={{ borderColor: COLORS.line, background: "#FBFDFF" }}
            >
              <div className="flex items-center justify-center mb-4">
                <HiDocumentText size={48} className="text-[#94A3B8]" />
              </div>
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ color: COLORS.text }}
              >
                Subir planilla de certificados
              </h3>
              <p className="text-[#94A3B8] max-w-2xl mx-auto">
                Sube tus <b>plantillas PNG</b> diseñadas en Canva para{" "}
                <b>premiación</b> y <b>participación</b>.
              </p>

              <input
                ref={premInputRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => validateAndSet(e.target.files?.[0], "prem")}
              />
              <input
                ref={partInputRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => validateAndSet(e.target.files?.[0], "part")}
              />

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                  onClick={() => premInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl font-semibold text-[#0F172A] flex items-center gap-2"
                  style={{
                    backgroundColor: COLORS.premBtn,
                    boxShadow: "0 6px 14px rgba(255,174,0,0.25)",
                  }}
                >
                  Subir plantilla de premiación
                </button>
                <button
                  onClick={() => partInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl font-semibold text-white flex items-center gap-2"
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: "0 6px 14px rgba(2,132,199,0.25)",
                  }}
                >
                  Subir plantilla de participación
                </button>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-4 px-2 sm:px-6 w-full">
                {/* Prem */}
                <div className={`${ringSoft} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      Plantilla de premiación
                    </span>
                    {tplPrem ? (
                      <Pill color={COLORS.mint} textColor={COLORS.success}>
                        Cargada
                      </Pill>
                    ) : (
                      <Pill>Sin archivo</Pill>
                    )}
                  </div>
                  {tplPrem ? (
                    <>
                      <div className="flex items-center gap-3">
                        <img
                          src={tplPrem.url}
                          alt="preview premiación"
                          className="w-24 h-16 object-cover rounded-lg ring-1 ring-[#DFE7F1]"
                        />
                        <div className="text-left">
                          <div
                            className="font-medium text-sm"
                            style={{ color: COLORS.text }}
                          >
                            {tplPrem.name}
                          </div>
                          <div className="text-xs text-[#64748B]">
                            {humanSize(tplPrem.size)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => premInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#0F172A]"
                          style={{ backgroundColor: COLORS.grayPill }}
                        >
                          <HiRefresh size={16} /> Reemplazar
                        </button>
                        <button
                          onClick={() => removeTpl("prem")}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: COLORS.error }}
                        >
                          <HiTrash size={16} /> Quitar
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#94A3B8]">
                      Aún no subiste un PNG para premiación.
                    </p>
                  )}
                </div>

                {/* Part */}
                <div className={`${ringSoft} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      Plantilla de participación
                    </span>
                    {tplPart ? (
                      <Pill color={COLORS.mint} textColor={COLORS.success}>
                        Cargada
                      </Pill>
                    ) : (
                      <Pill>Sin archivo</Pill>
                    )}
                  </div>
                  {tplPart ? (
                    <>
                      <div className="flex items-center gap-3">
                        <img
                          src={tplPart.url}
                          alt="preview participación"
                          className="w-24 h-16 object-cover rounded-lg ring-1 ring-[#DFE7F1]"
                        />
                        <div className="text-left">
                          <div
                            className="font-medium text-sm"
                            style={{ color: COLORS.text }}
                          >
                            {tplPart.name}
                          </div>
                          <div className="text-xs text-[#64748B]">
                            {humanSize(tplPart.size)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => partInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#0F172A]"
                          style={{ backgroundColor: COLORS.grayPill }}
                        >
                          <HiRefresh size={16} /> Reemplazar
                        </button>
                        <button
                          onClick={() => removeTpl("part")}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: COLORS.error }}
                        >
                          <HiTrash size={16} /> Quitar
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#94A3B8]">
                      Aún no subiste un PNG para participación.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log de certificados (DINÁMICO) */}
      {tab === "Log de certificados" && (
        <>
          <div className={`${shadowCard} ${ringSoft} bg-white rounded-2xl`}>
            <div
              className="flex items-center gap-2 px-4 py-3 text-[15px] font-semibold"
              style={{ color: COLORS.text }}
            >
              <HiClock className="text-[#64748B]" /> Log de Certificados
              Emitidos
            </div>

            <div className="overflow-x-auto">
              <div
                className="min-w-[760px] border-t"
                style={{ borderColor: COLORS.line }}
              >
                <div
                  className="grid px-4 py-3 text-[12px] sm:text-[13px] font-semibold"
                  style={{
                    color: COLORS.text,
                    gridTemplateColumns: "150px 110px 1fr 1fr 1fr 1fr",
                  }}
                >
                  <div>Fecha</div>
                  <div>Hora</div>
                  <div>Usuario</div>
                  <div>Tipo</div>
                  <div>Competidor</div>
                  <div>Área</div>
                </div>
                {dataLogs.map((r, idx) => (
                  <div
                    key={idx}
                    className="grid px-4 py-2.5 border-t text-[13px] sm:text-sm text-[#334155]"
                    style={{
                      borderColor: COLORS.line,
                      gridTemplateColumns: "150px 110px 1fr 1fr 1fr 1fr",
                    }}
                  >
                    <div className="truncate">{r.fecha}</div>
                    <div className="truncate">{r.hora}</div>
                    <div className="truncate">{r.usuario}</div>
                    <div className="truncate">
                      <Pill
                        color={r.tipo === "Premio" ? "#E6F7FF" : COLORS.mint}
                        textColor={
                          r.tipo === "Premio" ? COLORS.primary : COLORS.success
                        }
                      >
                        {r.tipo}
                      </Pill>
                    </div>
                    <div className="truncate">{r.competidor}</div>
                    <div className="truncate">{r.area}</div>
                  </div>
                ))}
                {logRows.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-[#64748B]">
                    Aún no hay registros.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setters.setPageL(filtros.pageL - 1)}
              disabled={filtros.pageL === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {filtros.pageL} de {lastPageL}
            </span>
            <button
              onClick={() => setters.setPage(filtros.pageL + 1)}
              disabled={filtros.pageL === lastPageL}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {!habilitado && (tab === "Participación" || tab === "Premiación") && (
        <div className="mt-4 text-sm text-[#64748B]">
          Para generar certificados, primero{" "}
          <span className="font-semibold" style={{ color: COLORS.primary }}>
            valida la habilitación
          </span>
          .
        </div>
      )}

      <SuccessModal
        open={success.open}
        title={success.title || "Operación Exitosa"}
        subtitle="La operación se completó correctamente"
        detail={success.detail}
        onClose={closeSuccess}
      />
    </div>
  );
}
