// src/pages/ResponsablesAcademicos.jsx
import { useMemo, useState, useEffect } from "react";
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
import Evaluadores from "./Evaluadores";

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
  const [activeTab, setActiveTab] = useState("responsables");
  const [meta, setMeta] = useState({});
  const [takenAreas, setTakenAreas] = useState([]);
  const { form, setField, errors, submitting, submit, resetForm, setErrors } =
    useRegisterResponsable();

  const fetchResponsables = async () => {
    try {
      const response = await responsablesRepo.list();
      const data = response.data;
      console.log("esto es la respuest resa", response);

      const adaptedData = data.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        apellidos: item.apellidos,
        ci: item.ci,
        correo: item.correo,
        telefono: item.telefono,
        area: item.area || "—",
        id_area: item.id_area,
        fecha: item.fecha_registro,
      }));
      setRows(adaptedData);
      setMeta(response.meta);
      setTakenAreas(response.meta.areas);
    } catch (err) {
      console.error("Error al cargar responsables:", err);
    }
  };
  console.log("takenAreas", takenAreas);
  async function fetchAreas() {
    try {
      const areas = await getAreasConNiveles();
      setAllAreas(areas);
    } catch (err) {
      console.error("Error al cargar areas:", err);
    }
  }
  useEffect(() => {
    fetchAreas();
    fetchResponsables();
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
    console.log("Editar fila:", row, "en el índice:", idx);

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
      setRows((prev) => prev.filter((_, i) => i !== deletingIndex));
      setSuccessMsg("El responsable fue eliminado correctamente.");
      setSuccessOpen(true);
    } catch (err) {
      console.error("Error al eliminar:", err);
      setSuccessMsg("No se pudo eliminar el responsable. Inténtalo más tarde.");
      setSuccessOpen(true);
    } finally {
      setDeleteOpen(false);
    }
  };
  if (activeTab === "evaluadores") {
    return (
      <Evaluadores onBackToResponsables={() => setActiveTab("responsables")} />
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("responsables")}
          className="py-3 border-b-2 border-cta text-cta font-semibold"
        >
          Responsables Académicos
        </button>
        <button
          onClick={() => setActiveTab("evaluadores")}
          className="py-3 text-slate-400 hover:text-slate-600"
        >
          Evaluadores
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Registro de Responsables Académicos
          </h1>
          <p className="text-slate-500 mt-2">
            Registra responsables académicos por área para garantizar la
            supervisión de la evaluación.
          </p>
        </div>
        {/* ✅ Botón actualizado: deshabilitado si no hay áreas disponibles */}
        <button
          className={`btn btn-cta text-white ${
            (meta?.areasDisponibles || 0) <= 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={() => setOpen(true)}
          disabled={(meta?.areasDisponibles || 0) <= 0}
        >
          <UserPlusIcon className="w-5 h-5" />
          {(meta?.areasDisponibles || 0) > 0
            ? "Registrar Responsable"
            : "No hay áreas disponibles"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatsCard
          title="Total Responsables"
          value={meta?.totalResponsables || 0}
          variant="cta"
          icon="userplus"
        />
        <StatsCard
          title="Áreas Cubiertas"
          value={meta?.areasCubiertas || 0}
          variant="accent"
          icon="check"
        />
        <StatsCard
          title="Áreas Disponibles"
          value={meta?.areasDisponibles || 0}
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
        setErrors={setErrors}
        submitting={submitting}
        onSubmit={handleCreate}
        takenAreas={takenAreas}
        areas={allAreas}
      />

      <EditResponsibleModal
        key={editingRow?.id || "nuevo"}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={editingRow}
        takenAreas={takenAreas}
        areas={allAreas}
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
