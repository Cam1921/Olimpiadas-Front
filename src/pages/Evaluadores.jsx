// src/pages/Evaluadores.jsx

import { useMemo, useState, useEffect } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import StatsCard from "../components/StatsCard";
import EvaluadoresTable from "../components/EvaluadoresTable";
import RegisterEvaluadorModal from "../components/RegisterEvaluadorModal";
import EditEvaluadorModal from "../components/EditEvaluadorModal";
import SuccessDialog from "../components/SuccessDialog";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useRegisterEvaluador } from "../application/responsables/useRegisterEvaluador"; // 👈 Hook específico
import { getAreasConNiveles } from "../infrastructure/http/areas/areaRepostory";
import { evaluadoresRepo } from "../infrastructure/http/evaluadores/repository";
import api from "@/lib/api";

export default function Evaluadores() {
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
  const [allAreas, setAllAreas] = useState([]);

  // ✅ Transforma rows en un array de objetos { area, nivel } para el hook
  const takenAreas = useMemo(
    () => rows.map((r) => ({ area: r.area, nivel: r.nivel })),
    [rows]
  );
  const areasCubiertas = useMemo(
    () => new Set(rows.map((r) => r.area)).size,
    [rows]
  );
  const areasDisponibles = useMemo(() => {
    if (!allAreas) return 0;
    return allAreas.length - areasCubiertas;
  }, [allAreas, areasCubiertas]);

  const { form, setField, errors, submitting, submit, resetForm, setErrors } =
    useRegisterEvaluador(takenAreas);

  const fetchEvaluadores = async () => {
    try {
      const response = await api.get("/evaluador"); // no pongas /api si ya lo tienes en baseURL
      const data = response.data;

      const adaptedData = data.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        apellidos: item.apellidos,
        ci: item.ci,
        correo: item.correo,
        telefono: item.telefono,
        area: item.asignaciones?.[0]?.area || "—",
        nivel: item.asignaciones?.[0]?.nivel || "—",
        fecha: item.fecha_registro,
      }));

      setRows(adaptedData);
    } catch (err) {
      console.error("❌ Error al cargar evaluadores:", err);
    }
  };
  const handleDelete = async (id) => {
    try {
      await evaluadoresRepo.remove(id);
      fetchEvaluadores();
    } catch (err) {
      console.error("Error al eliminar evaluador:", err);
      alert("No se pudo eliminar el evaluador");
    } finally {
    }
  };
  async function fetchAreas() {
    const areas = await getAreasConNiveles();
    setAllAreas(areas);
    console.log(areas);
  }
  // 👇 Cargar datos al montar el componente
  useEffect(() => {
    fetchEvaluadores();

    fetchAreas();
  }, []);

  // 👇 Función para cerrar el modal Y limpiar el formulario
  const handleCloseModal = () => {
    setOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    const result = await submit();
    if (result.ok) {
      await fetchEvaluadores(); // ✅ Recarga los datos reales del backend
      setSuccessMsg("Evaluador registrado correctamente.");
      setSuccessOpen(true);
      handleCloseModal();
    }
  };

  // === Handlers de edición y eliminación ===
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
      handleDelete(deletingIndex);
      // ✅ Eliminado del backend: ahora actualiza el estado local
      await fetchEvaluadores(); // Recarga la lista completa desde el backend
      setSuccessMsg("El evaluador fue eliminado correctamente.");
      setSuccessOpen(true);
    } catch (err) {
      console.error("Error al eliminar:", err);
      setSuccessMsg("No se pudo eliminar el evaluador. Inténtalo más tarde.");
      setSuccessOpen(true);
    } finally {
      setDeleteOpen(false);
    }
  };
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button
          onClick={() => {
            window.location.href = "gestion-roles";
          }}
          className="py-3 text-slate-400 hover:text-slate-600"
        >
          Responsables Académicos
        </button>
        <button className="py-3 border-b-2 border-cta text-cta font-semibold">
          Evaluadores
        </button>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-semibold text-primary">
            Registro de Evaluadores
          </h1>
          <p className="text-slate-500 mt-2">
            Registra evaluadores por área y nivel para garantizar la supervisión
            de la evaluación.
          </p>
        </div>
        <button
          className={`btn btn-cta text-white ${
            areasDisponibles <= 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setOpen(true)}
          disabled={areasDisponibles <= 0}
        >
          <UserPlusIcon className="w-5 h-5" />
          Registrar Evaluador
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatsCard
          title="Total Evaluadores"
          value={rows.length}
          variant="cta"
          icon="userplus"
        />
        <StatsCard
          title="Áreas Cubiertas"
          value={areasCubiertas}
          variant="accent"
          icon="check"
        />
        <StatsCard
          title="Áreas Disponibles"
          value={areasDisponibles}
          variant="cta"
          icon="check"
        />
      </div>
      <div className="mt-8">
        <EvaluadoresTable
          data={rows}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>
      <RegisterEvaluadorModal
        open={open}
        onClose={handleCloseModal}
        form={form}
        setField={setField}
        errors={errors}
        setErrors={setErrors} // 👈 AÑADE ESTA LÍNEA
        submitting={submitting}
        onSubmit={handleCreate}
        takenAreas={takenAreas} // ✅ Pasa el array de objetos
      />
      <EditEvaluadorModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={editingRow}
        takenAreas={rows.map((r) => ({ area: r.area, nivel: r.nivel }))} // ✅ Pasa el array de objetos
        onUpdate={(updated) => {
          fetchEvaluadores();
          setEditOpen(false);
          setSuccessMsg("La información se actualizó correctamente.");
          setSuccessOpen(true);
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
