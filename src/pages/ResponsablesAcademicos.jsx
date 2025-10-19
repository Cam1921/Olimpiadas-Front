// src/pages/ResponsablesAcademicos.jsx
import { useMemo, useState, useEffect } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import StatsCard from "../components/StatsCard";
import ResponsablesTable from "../components/ResponsablesTable";
import RegisterResponsibleModal from "../components/RegisterResponsibleModal";
import EditResponsibleModal from "../components/EditResponsibleModal";
import SuccessDialog from "../components/SuccessDialog";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useRegisterResponsable } from "../application/responsables/useRegisterResponsible";
import { AREAS } from "../services/areas";

export default function ResponsablesAcademicos() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(-1);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const takenAreas = useMemo(() => rows.map(r => r.area), [rows]);
  const areasCubiertas = useMemo(() => new Set(rows.map(r => r.area)).size, [rows]);
  const areasDisponibles = AREAS.length - areasCubiertas;

  const { form, setField, errors, submitting, submit, resetForm, setErrors } = useRegisterResponsable(takenAreas);

  const fetchResponsables = async () => {
    try {
      const response = await fetch('/api/responsable-academico');
      if (!response.ok) throw new Error('Error al cargar responsables');
      const data = await response.json();
      setRows(data);
    } catch (err) {
      console.error('Error al cargar responsables:', err);
    }
  };

  useEffect(() => {
    fetchResponsables();
  }, []);

  const handleCloseModal = () => {
    setOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    const result = await submit();
    if (result.ok) {
      await fetchResponsables();
      setSuccessMsg("Responsable académico registrado correctamente.");
      setSuccessOpen(true);
      handleCloseModal();
    }
  };

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

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/responsable-academico/${deletingRow.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('No se pudo eliminar el registro');
      await fetchResponsables();
      setSuccessMsg("El responsable fue eliminado correctamente.");
      setSuccessOpen(true);
    } catch (err) {
      console.error('Error al eliminar:', err);
      setSuccessMsg("No se pudo eliminar el responsable. Inténtalo más tarde.");
      setSuccessOpen(true);
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button className="py-3 border-b-2 border-cta text-cta font-semibold">
          Responsables Académicos
        </button>
        <button className="py-3 text-slate-400 hover:text-slate-600">Evaluadores</button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-semibold text-primary">
            Registro de Responsables Académicos
          </h1>
          <p className="text-slate-500 mt-2">
            Registra responsables académicos por área para garantizar la supervisión de la evaluación.
          </p>
        </div>
        {/* ✅ Botón actualizado: deshabilitado si no hay áreas disponibles */}
        <button
          className={`btn btn-cta text-white ${
            areasDisponibles <= 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => setOpen(true)}
          disabled={areasDisponibles <= 0}
        >
          <UserPlusIcon className="w-5 h-5" />
          {areasDisponibles > 0 ? "Registrar Responsable" : "No hay áreas disponibles"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatsCard title="Total Responsables" value={rows.length} variant="cta" icon="userplus" />
        <StatsCard title="Áreas Cubiertas" value={areasCubiertas} variant="accent" icon="check" />
        <StatsCard title="Áreas Disponibles" value={areasDisponibles} variant="cta" icon="check" />
      </div>

      <div className="mt-8">
        <ResponsablesTable data={rows} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
      </div>

      <RegisterResponsibleModal
        open={open}
        onClose={handleCloseModal}
        form={form}
        setField={setField}
        errors={errors}
        setErrors={setErrors}
        submitting={submitting}
        onSubmit={handleCreate}
        takenAreas={takenAreas}
      />

      <EditResponsibleModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={editingRow}
        takenAreas={takenAreas}
        onUpdate={async (updatedData) => {
          await fetchResponsables();
          setSuccessMsg("Responsable actualizado correctamente.");
          setSuccessOpen(true);
          setEditOpen(false);
        }}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        record={deletingRow}
      />

      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message={successMsg}
      />
    </div>
  );
}
