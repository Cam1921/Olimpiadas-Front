// src/pages/ResponsablesAcademicos.jsx
import { useMemo, useState, useEffect } from "react"; // 👈 Agregado useEffect
import { UserPlusIcon } from "@heroicons/react/24/outline";
import StatsCard from "../components/StatsCard";
import ResponsablesTable from "../components/ResponsablesTable";
import RegisterResponsibleModal from "../components/RegisterResponsibleModal";
import EditResponsibleModal from "../components/EditResponsibleModal";
import SuccessDialog from "../components/SuccessDialog";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useRegisterResponsable } from "../application/responsables/useRegisterResponsible"; // 👈 Corregido nombre (a)
import { getAreasConNiveles } from "../infrastructure/http/areas/areaRepostory";
import { responsablesRepo } from "../infrastructure/http/responsables/repository";
import api from "@/lib/api";
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
  const [allAreas, setAllAreas] = useState([]);

  const takenAreas = useMemo(() => rows.map((r) => r.area), [rows]);
  const areasCubiertas = useMemo(
    () => new Set(rows.map((r) => r.area)).size,
    [rows]
  );
  const areasDisponibles = useMemo(() => {
    if (!allAreas) return 0;
    console.log(takenAreas);
    return allAreas.length - areasCubiertas;
  }, [allAreas, areasCubiertas]);

  const { form, setField, errors, submitting, submit, resetForm, setErrors } =
    useRegisterResponsable(takenAreas);

  // 👇 Función para cargar responsables desde el backend
  const fetchResponsables = async () => {
    try {
      const response = await api.get("/responsable-academico");
      const data = response.data;

      const adaptedData = data.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        apellidos: item.apellidos,
        ci: item.ci,
        correo: item.correo,
        telefono: item.telefono,
        area: item.asignaciones?.[0] || "—",
        nivel: "—",
        fecha: item.fecha_registro,
      }));

      setRows(adaptedData);
    } catch (err) {
      console.error("Error al cargar responsables:", err);
    }
  };

  // 👇 Cargar datos al montar el componente
  useEffect(() => {
    fetchResponsables();
    async function fetchAreas() {
      const areas = await getAreasConNiveles();
      setAllAreas(areas);
      console.log(areas);
    }
    fetchAreas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await responsablesRepo.remove(id); // 🔥 Aquí usas el método remove
      fetchResponsables();
    } catch (err) {
      console.error("Error al eliminar evaluador:", err);
      alert("No se pudo eliminar el evaluador");
    } finally {
    }
  };
  // 👇 Función para cerrar el modal Y limpiar el formulario
  const handleCloseModal = () => {
    setOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    const result = await submit();
    if (result.ok) {
      await fetchResponsables(); // ✅ Recarga los datos reales del backend
      setSuccessMsg("Responsable académico registrado correctamente.");
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

  const confirmDelete = () => {
    // 👇 Opcional: también podrías llamar a fetchResponsables() aquí
    console.log(deletingIndex);
    handleDelete(deletingIndex);
    setRows((prev) => prev.filter((_, i) => i !== deletingIndex));
    setDeleteOpen(false);
    setSuccessMsg("El responsable fue eliminado correctamente.");
    setSuccessOpen(true);
  };
  const handleNavigate = () => {
    window.location.href = "evaluadores"; // Navega a la página de Evaluadores
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button className="py-3 border-b-2 border-cta text-cta font-semibold">
          Responsables Académicos
        </button>
        <button
          onClick={handleNavigate}
          className="py-3 text-slate-400 hover:text-slate-600"
        >
          Evaluadores
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-semibold text-primary">
            Registro de Responsables Académicos
          </h1>
          <p className="text-slate-500 mt-2">
            Registra responsables académicos por área para garantizar la
            supervisión de la evaluación.
          </p>
        </div>
        <button
          className="btn btn-cta text-white"
          onClick={() => setOpen(true)}
        >
          <UserPlusIcon className="w-5 h-5" />
          Registrar Responsable
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatsCard
          title="Total Responsables"
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
        <ResponsablesTable
          data={rows}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

      <RegisterResponsibleModal
        open={open}
        onClose={handleCloseModal}
        form={form}
        setField={setField}
        errors={errors}
        setErrors={setErrors} // 👈 AÑADE ESTA LÍNEA
        submitting={submitting}
        onSubmit={handleCreate}
        takenAreas={takenAreas}
      />

      <EditResponsibleModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={editingRow}
        takenAreas={rows.map((r) => r.area)}
        onUpdate={(updated) => {
          setRows((prev) =>
            prev.map((r, i) =>
              i === editingIndex
                ? {
                    ...r,
                    ...updated,
                    fecha: new Date().toISOString().slice(0, 10),
                  }
                : r
            )
          );
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
