import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineSparkles,
  HiOutlineFire,
  HiOutlineTrophy,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlinePencilSquare,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiXMark,
} from "react-icons/hi2";

const BRAND = "#0284C7";
const TEXT = "#23263D";
const BG = "#F8FAFB";

const CHIP = {
  oro: { bg: "#FEF3C7", text: "#D97706", ring: "#F59E0B" },
  plata: { bg: "#F3F4F6", text: "#6B7280", ring: "#D1D5DB" },
  bronce: { bg: "#FFE7D5", text: "#EA580C", ring: "#FB923C" },
  menciones: { bg: "#E0F7FB", text: "#0891B2", ring: "#06B6D4" },
};

const DATA_INICIAL = [
  { id: 1, area: "Matemáticas",  nivel: "Secundaria", participantes: 45, oro: 3, plata: 5, bronce: 8, menciones: 10 },
  { id: 2, area: "Física",       nivel: "Secundaria", participantes: 38, oro: 2, plata: 4, bronce: 6, menciones: 8 },
  { id: 3, area: "Química",      nivel: "Secundaria", participantes: 52, oro: 4, plata: 6, bronce: 10, menciones: 12 },
  { id: 4, area: "Biología",     nivel: "Secundaria", participantes: 41, oro: 3, plata: 5, bronce: 7, menciones: 9 },
  { id: 5, area: "Informática",  nivel: "Primaria",   participantes: 29, oro: 2, plata: 3, bronce: 5, menciones: 6 },
  { id: 6, area: "Astrofísica",  nivel: "Secundaria", participantes: 33, oro: 2, plata: 4, bronce: 6, menciones: 7 },
  { id: 7, area: "Robótica",     nivel: "Primaria",   participantes: 40, oro: 8, plata: 6, bronce: 8, menciones: 15 },
];

/* ================= Mensaje de éxito SIN barra verde inferior ================= */
function SuccessDialog({
  open,
  onClose,
  title = "Operación Exitosa",
  subtitle = "La operación se completó correctamente",
  message = "Configuración guardada exitosamente.",
  primaryLabel = "Aceptar",
  onPrimary,
}) {
  if (!open) return null;
  const handlePrimary = () => {
    onPrimary?.();
    onClose?.();
  };
  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-[#23263D]/10">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                <HiOutlineCheckCircle className="text-emerald-600" size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-[#23263D]">{title}</h3>
                  <button
                    onClick={onClose}
                    className="text-[#23263D]/60 hover:text-[#23263D] rounded-md p-1"
                    aria-label="Cerrar"
                  >
                    <HiXMark size={22} />
                  </button>
                </div>
                <p className="text-[#23263D]/70 mt-1">{subtitle}</p>
                <p className="text-[#23263D] mt-4">{message}</p>

                <button
                  onClick={handlePrimary}
                  className="mt-5 w-full h-10 rounded-xl text-white font-medium"
                  style={{ backgroundColor: BRAND }}
                >
                  {primaryLabel}
                </button>
              </div>
            </div>
          </div>
          {/* (Se eliminó la barra decorativa inferior) */}
        </div>
      </div>
    </div>
  );
}

/* ================= Helpers ================= */
function computeTotals(rows) {
  const acc = { oro: 0, plata: 0, bronce: 0, menciones: 0, totalPremios: 0 };
  rows.forEach((r) => {
    acc.oro += r.oro;
    acc.plata += r.plata;
    acc.bronce += r.bronce;
    acc.menciones += r.menciones;
    acc.totalPremios += r.oro + r.plata + r.bronce + r.menciones;
  });
  return acc;
}

/* ================= UI piezas ================= */
function MetricCard({ label, value, Icon, color }) {
  return (
    <div className="relative rounded-2xl bg-white border border-[#23263D]/10 shadow-sm p-6">
      <div className="absolute right-4 top-3" style={{ color }}>
        <Icon size={22} />
      </div>
      <div className="text-[15px] text-[#23263D]/75">{label}</div>
      <div className="mt-5 text-5xl leading-none font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function NivelBadge({ nivel }) {
  const isP = (nivel || "").toLowerCase() === "primaria";
  return (
    <span
      className="text-[11px] px-3 py-1 rounded-full border shadow-sm"
      style={{
        backgroundColor: isP ? "#E6F7EC" : "#F2E8FF",
        color: isP ? "#1B8665" : "#7C3AED",
        borderColor: (isP ? "#1B8665" : "#7C3AED") + "33",
      }}
    >
      {nivel}
    </span>
  );
}

function Pill({ type, value }) {
  const theme = CHIP[type];
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full border"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        borderColor: theme.ring,
        boxShadow: "0 2px 6px rgba(0,0,0,.05)",
      }}
    >
      {value}
    </span>
  );
}

/* ================= Modal de parametrización ================= */
function RowInput({ label, value, onChange, Icon, color }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[#23263D]/80">
        <Icon size={18} style={{ color }} />
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-20 rounded-lg border border-[#D8E1EE] px-2 text-center outline-none focus:ring-2 focus:ring-[#90CAF9]"
        />
      </div>
    </div>
  );
}

function EditMedalleroModal({ open, onClose, baseRows, onSave }) {
  const [draft, setDraft] = useState(baseRows);

  useEffect(() => {
    setDraft(baseRows);
  }, [baseRows, open]);

  const resumen = useMemo(() => computeTotals(draft), [draft]);

  const setValue = (id, field, val) => {
    const n = Math.max(0, Number(String(val).replace(/\D+/g, "")) || 0);
    setDraft((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: n } : r)));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center px-3 py-4">
        <div className="w-full max-w-6xl rounded-2xl bg-white shadow-xl border border-[#23263D]/10 overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#23263D]/10">
            <div>
              <div className="text-xl font-semibold">Parametrizar Medallero por Área</div>
              <p className="text-sm text-[#23263D]/70">
                Edita los cupos por tipo de premio para cada área y nivel.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSave(draft, { source: "modal" })}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-white"
                style={{ backgroundColor: BRAND }}
              >
                <HiOutlineCheckCircle size={18} />
                Guardar Configuración
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-[#23263D]/15 bg-white hover:bg-[#F4F8FB] text-[#23263D]/70"
                aria-label="Cerrar"
              >
                <HiXMark size={18} />
              </button>
            </div>
          </div>

          {/* contenido */}
          <div className="max-h=[70vh] md:max-h-[70vh] overflow-auto px-5 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {draft.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-[#23263D]/10 bg-white shadow-sm p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">{r.area}</div>
                  </div>
                  <div className="text-xs text-[#23263D]/70">{r.participantes} participantes</div>
                  <div className="mt-1">
                    <NivelBadge nivel={r.nivel} />
                  </div>

                  <div className="mt-3 space-y-3 text-sm">
                    <RowInput
                      label="Oro"
                      Icon={HiOutlineTrophy}
                      color={CHIP.oro.text}
                      value={r.oro}
                      onChange={(v) => setValue(r.id, "oro", v)}
                    />
                    <RowInput
                      label="Plata"
                      Icon={HiOutlineStar}
                      color={CHIP.plata.text}
                      value={r.plata}
                      onChange={(v) => setValue(r.id, "plata", v)}
                    />
                    <RowInput
                      label="Bronce"
                      Icon={HiOutlineFire}
                      color={CHIP.bronce.text}
                      value={r.bronce}
                      onChange={(v) => setValue(r.id, "bronce", v)}
                    />
                    <RowInput
                      label="Mención"
                      Icon={HiOutlineSparkles}
                      color={CHIP.menciones.text}
                      value={r.menciones}
                      onChange={(v) => setValue(r.id, "menciones", v)}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-[#23263D]/70">Total premios:</span>
                    <span
                      className="inline-flex items-center justify-center h-7 min-w-[36px] px-2 rounded-full bg-[#E6F0FF] text-[13px]"
                      style={{ color: BRAND }}
                    >
                      {r.oro + r.plata + r.bronce + r.menciones}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen Total con íconos */}
            <div className="mt-5 rounded-2xl border border-[#23263D]/10 bg-[#FAFCFF] p-4">
              <div className="text-base font-semibold mb-3">Resumen Total</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
                <ResumenItem icon={HiOutlineTrophy} color={CHIP.oro.text} bg={CHIP.oro.bg} label="Oro" value={resumen.oro}/>
                <ResumenItem icon={HiOutlineStar} color={CHIP.plata.text} bg={CHIP.plata.bg} label="Plata" value={resumen.plata}/>
                <ResumenItem icon={HiOutlineFire} color={CHIP.bronce.text} bg={CHIP.bronce.bg} label="Bronce" value={resumen.bronce}/>
                <ResumenItem icon={HiOutlineSparkles} color={CHIP.menciones.text} bg={CHIP.menciones.bg} label="Menciones" value={resumen.menciones}/>
                <ResumenItem icon={HiOutlineClock} color={BRAND} bg={"#E6F0FF"} label="Total" value={`${resumen.totalPremios} premios`}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumenItem({ icon:Icon, color, bg, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ background:bg }}>
        <Icon size={16} style={{ color }} />
      </span>
      <span className="text-[#23263D]/70">{label}:</span>
      <b className="text-[#23263D]">{value}</b>
    </div>
  );
}

/* ================= Página principal ================= */
export default function ParametrizarMedallero() {
  const [rows, setRows] = useState(DATA_INICIAL);
  const [metrics, setMetrics] = useState(() => computeTotals(DATA_INICIAL));
  const [canSave, setCanSave] = useState(false);

  // estado del diálogo de éxito
  const [ok, setOk] = useState({
    open: false,
    message: "Configuración guardada exitosamente.",
  });

  const [openEdit, setOpenEdit] = useState(false);

  const totalFila = useMemo(
    () => (r) => r.oro + r.plata + r.bronce + r.menciones,
    []
  );

  useEffect(() => {
    setMetrics(computeTotals(rows));
    setCanSave(false);
  }, []);

  const handleRecalcular = () => {
    const t = computeTotals(rows);
    setMetrics(t);
    setCanSave(true);
  };

  const handleGuardar = () => {
    setOk({
      open: true,
      message: "Configuración guardada exitosamente.",
    });
    setCanSave(false);
  };

  // viene desde el modal de parametrización
  const handleSaveFromModal = (newRows, meta) => {
    setRows(newRows);
    setMetrics(computeTotals(newRows));
    setOpenEdit(false);
    setCanSave(true);

    // mensaje solicitado para guardar desde el modal
    setOk({
      open: true,
      message: "Medallero configurado exitosamente.",
    });
  };

  return (
    <div className="p-6 md:p-8" style={{ backgroundColor: BG, color: TEXT }}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-1">
            Configuración de Medallero
          </h1>
          <p className="text-[#23263D]/70">
            Configura la distribución de premios y medallerías por área y nivel
            de competencia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-7">
        <MetricCard
          label="Oro total"
          value={metrics.oro}
          Icon={HiOutlineTrophy}
          color={CHIP.oro.text}
        />
        <MetricCard
          label="Plata total"
          value={metrics.plata}
          Icon={HiOutlineStar}
          color={CHIP.plata.text}
        />
        <MetricCard
          label="Bronce total"
          value={metrics.bronce}
          Icon={HiOutlineFire}
          color={CHIP.bronce.text}
        />
        <MetricCard
          label="Menciones"
          value={metrics.menciones}
          Icon={HiOutlineSparkles}
          color={CHIP.menciones.text}
        />
        <MetricCard
          label="Total premios"
          value={metrics.totalPremios}
          Icon={HiOutlineClock}
          color={BRAND}
        />
      </div>

      <div className="rounded-2xl bg-white border border-[#23263D]/10 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-2xl font-semibold mb-1">
            Configuración por Área/Nivel
          </h2>
          <p className="text-sm text-[#23263D]/70">
            Distribución de premios y reconocimientos para cada área de
            competencia
          </p>
        </div>

        <div className="px-3 md:px-6 pb-4">
          <div className="w-full overflow-auto rounded-xl border border-[#23263D]/10">
            <table className="min-w-full text-sm table-auto border-collapse">
              <thead className="bg-[#F8FAFB]">
                <tr className="text-left text-[#23263D]/80">
                  <th className="py-3 pl-4 pr-2 font-medium">Área/Nivel</th>
                  <th className="py-3 px-2 font-medium">Participantes</th>
                  <th className="py-3 px-2 font-medium">Oro</th>
                  <th className="py-3 px-2 font-medium">Plata</th>
                  <th className="py-3 px-2 font-medium">Bronce</th>
                  <th className="py-3 pr-2 w-[120px] font-medium text-center">
                    Menciones
                  </th>
                  <th className="py-3 pl-2 pr-2 w-[120px] font-medium text-right">
                    Total Premios
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const zebra = idx % 2 === 1 ? "bg-[#FAFCFD]" : "bg-white";
                  return (
                    <tr key={r.id} className={`${zebra} border-t border-[#23263D]/5`}>
                      <td className="py-4 pl-4 pr-2">
                        <div className="font-medium">{r.area}</div>
                        <div className="mt-1">
                          <NivelBadge nivel={r.nivel} />
                        </div>
                      </td>
                      <td className="py-4 px-2 text-[#23263D]/80">{r.participantes}</td>
                      <td className="py-4 px-2">
                        <Pill type="oro" value={r.oro} />
                      </td>
                      <td className="py-4 px-2">
                        <Pill type="plata" value={r.plata} />
                      </td>
                      <td className="py-4 px-2">
                        <Pill type="bronce" value={r.bronce} />
                      </td>
                      <td className="py-4 pr-2 w-[120px] text-center">
                        <Pill type="menciones" value={r.menciones} />
                      </td>
                      <td
                        className="py-4 pl-2 pr-2 w-[120px] text-right font-semibold"
                        style={{ color: BRAND }}
                      >
                        {r.oro + r.plata + r.bronce + r.menciones}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 py-4">
            <button
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#23263D]/15 text-[15px] bg-white hover:bg-[#F4F8FB] text-[#23263D]"
              onClick={handleRecalcular}
              title="Vuelve a calcular totales desde la tabla"
            >
              <HiOutlineArrowPath size={18} style={{ color: BRAND }} />
              Recalcular premiados
            </button>

            <button
              disabled={!canSave}
              onClick={handleGuardar}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[15px] text-white shadow-sm ${
                canSave ? "hover:opacity-95" : "opacity-60 cursor-not-allowed"
              }`}
              style={{ backgroundColor: BRAND }}
              title={canSave ? "Guardar cambios" : "Recalcula o edita para habilitar"}
            >
              <HiOutlineCheckCircle size={18} />
              Guardar cambios
            </button>

            <button
              onClick={() => setOpenEdit(true)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[#23263D]/15 bg-white hover:bg-[#F4F8FB] text-[#23263D]/70"
              title="Editar parametrización por área"
            >
              <HiOutlinePencilSquare size={18} />
            </button>
          </div>
        </div>
      </div>

      <EditMedalleroModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        baseRows={rows}
        onSave={handleSaveFromModal}
      />

      <SuccessDialog
        open={ok.open}
        onClose={() => setOk((s) => ({ ...s, open: false }))}
        title="Operación Exitosa"
        subtitle="La operación se completó correctamente"
        message={ok.message}
        primaryLabel="Aceptar"
        onPrimary={() => {}}
      />
    </div>
  );
}
