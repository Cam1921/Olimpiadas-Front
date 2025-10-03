import { useMemo, useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import StatsCard from "../components/StatsCard";
import ResponsablesTable from "../components/ResponsablesTable";
import RegisterResponsibleModal from "../components/RegisterResponsibleModal";
import EditResponsibleModal from "../components/EditResponsibleModal";
import SuccessDialog from "../components/SuccessDialog";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function ResponsablesAcademicos() {
  // ===== Datos iniciales (mock) =====
  const [rows, setRows] = useState([
    {
      nombre: "María",
      apellidos: "González Pérez",
      correo: "maria.gonzalez@gmail.com",
      telefono: "+591 71234567",
      area: "Matemáticas",
      fecha: "2025-01-15",
    },
    {
      nombre: "Juan",
      apellidos: "Pérez López",
      correo: "juan.perez@gmail.com",
      telefono: "+591 72345678",
      area: "Física",
      fecha: "2025-01-20",
    },
  ]);

  // ===== UI state =====
  const [open, setOpen] = useState(false);               // Registrar
  const [editOpen, setEditOpen] = useState(false);       // Editar
  const [editingRow, setEditingRow] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);

  const [deleteOpen, setDeleteOpen] = useState(false);   // Eliminar
  const [deletingRow, setDeletingRow] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(-1);

  const [successOpen, setSuccessOpen] = useState(false); // Popup éxito
  const [successMsg, setSuccessMsg] = useState("Los cambios se han guardado correctamente en el sistema.");

  // ===== KPIs =====
  const areasCubiertas = useMemo(() => new Set(rows.map(r => r.area)).size, [rows]);
  const areasDisponibles = 5; // UI (ajústalo si conoces el total del catálogo)

  // ===== Helpers =====
  const normalizeTelefono = (tel) => (tel?.startsWith("+591") ? tel : `+591 ${tel}`);

  // Áreas ocupadas actuales (para bloquear duplicados en REGISTRO)
  const takenAreas = useMemo(() => rows.map(r => r.area), [rows]);

  // ===== Handlers: Tabla -> editar/eliminar =====
  const handleOpenEdit = (row, idx) => {
    setEditingRow(row);
    setEditingIndex(idx);
    setEditOpen(true);
  };

  const handleOpenDelete = (row, idx) => {
    setDeletingRow(row);
    setDeletingIndex(idx);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setRows(prev => prev.filter((_, i) => i !== deletingIndex));
    setDeleteOpen(false);
    setDeletingRow(null);
    setDeletingIndex(-1);
    // Si quieres popup de éxito al eliminar, descomenta:
    // setSuccessMsg("El responsable fue eliminado correctamente.");
    // setSuccessOpen(true);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Tabs Header */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button className="py-3 border-b-2 border-cta text-cta font-semibold">
          Responsables Académicos
        </button>
        <button className="py-3 text-slate-400 hover:text-slate-600">
          Evaluadores
        </button>
      </div>

      {/* Título + CTA */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-semibold text-primary">
            Registro de Responsables Académicos
          </h1>
          <p className="text-slate-500 mt-2">
            Registra responsables académicos por área para garantizar la supervisión de la evaluación.
          </p>
        </div>
        <button className="btn btn-cta text-white" onClick={() => setOpen(true)}>
          <UserPlusIcon className="w-5 h-5" />
          Registrar Responsable
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatsCard title="Total Responsables" value={rows.length} variant="cta" icon="userplus" />
        <StatsCard title="Áreas Cubiertas" value={areasCubiertas} variant="accent" icon="check" />
        <StatsCard title="Áreas Disponibles" value={areasDisponibles} variant="cta" icon="check" />
      </div>

      {/* Tabla */}
      <div className="mt-8">
        <ResponsablesTable
          data={rows}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

      {/* ===== Modal: Registrar ===== */}
      <RegisterResponsibleModal
        open={open}
        onClose={() => setOpen(false)}
        takenAreas={takenAreas} // bloquea áreas ya ocupadas
        onCreate={(payload) => {
          const nuevo = {
            ...payload,
            telefono: normalizeTelefono(payload.telefono),
            fecha: new Date().toISOString().slice(0, 10),
          };
          setRows(prev => [...prev, nuevo]);
          setSuccessMsg("Responsable académico registrado correctamente.");
          setSuccessOpen(true);
        }}
      />

      {/* ===== Modal: Editar ===== */}
      <EditResponsibleModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={editingRow}
        takenAreas={rows.map(r => r.area)} // el modal permite mantener su propia área
        onUpdate={(updated) => {
          setRows(prev => prev.map((r, i) => (i === editingIndex ? { ...r, ...updated } : r)));
          setEditOpen(false);
          // Si quieres popup de éxito al actualizar, descomenta:
          // setSuccessMsg("La información se actualizó correctamente.");
          // setSuccessOpen(true);
        }}
      />

      {/* ===== Modal: Confirmar Eliminación ===== */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        record={deletingRow}
      />

      {/* Popup de éxito */}
      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Operación Exitosa"
        subtitle="La operación se completó correctamente"
        message={successMsg}
        confirmLabel="Aceptar"
      />
    </div>
  );
}
