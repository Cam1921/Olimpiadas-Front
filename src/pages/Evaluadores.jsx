// src/pages/Evaluadores.jsx

import React, { useMemo, useState, useEffect } from "react";
import { UserPlusIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import StatsCard from "../components/StatsCard";
import EvaluadoresTable from "../components/EvaluadoresTable";
import RegisterEvaluadorModal from "../components/RegisterEvaluadorModal";
import EditEvaluadorModal from "../components/EditEvaluadorModal";
import SuccessDialog from "../components/SuccessDialog";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ImportarEvaluadoresModal from "../components/ImportarEvaluadoresModal";

import { useRegisterEvaluador } from "../application/responsables/useRegisterEvaluador";
import { getAreasConNiveles } from "../infrastructure/http/areas/areaRepostory";
import { evaluadoresRepo } from "../infrastructure/http/evaluadores/repository";
import api from "@/lib/api";

export default function Evaluadores() {
  // ==============================
  // ESTADOS
  // ==============================
  const [rows, setRows] = useState([]);

  // modal registrar evaluador
  const [open, setOpen] = useState(false);

  // modal editar
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // modal eliminar
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);

  // modal importar CSV
  const [importOpen, setImportOpen] = useState(false);

  // diálogo éxito
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // áreas disponibles para asignar
  const [allAreas, setAllAreas] = useState([]);

  // ==============================
  // DERIVADOS / MÉTRICAS
  // ==============================
  // esto genera [{ area, nivel }, ...] para validar áreas ocupadas
  const takenAreas = useMemo(
    () => rows.map((r) => ({ area: r.area, nivel: r.nivel })),
    [rows]
  );

  // cuántas áreas ya tienen evaluador asignado
  const areasCubiertas = useMemo(
    () => new Set(rows.map((r) => r.area)).size,
    [rows]
  );

  // cuántas áreas quedan libres para asignar un evaluador nuevo
  const areasDisponibles = useMemo(() => {
    if (!allAreas) return 0;
    return allAreas.length - areasCubiertas;
  }, [allAreas, areasCubiertas]);

  // hook para manejar el formulario de registro
  const { form, setField, errors, submitting, submit, resetForm, setErrors } =
    useRegisterEvaluador(takenAreas);

  // ==============================
  // CARGA DE EVALUADORES (GET)
  // ==============================
  const fetchEvaluadores = async () => {
    try {
      const response = await api.get("/evaluador"); // baseURL ya está en api
      const data = response.data;

      // adaptamos el backend a lo que la tabla necesita
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

  // ==============================
  // ELIMINAR EVALUADOR
  // ==============================
  const handleDelete = async (id) => {
    try {
      await evaluadoresRepo.remove(id); // <- esto llama tu backend DELETE
      await fetchEvaluadores(); // recarga lista después de borrar
    } catch (err) {
      console.error("Error al eliminar evaluador:", err);
      alert("No se pudo eliminar el evaluador");
    } finally {
      // aunque no hagamos nada aquí,
      // necesitamos cerrar bien el bloque para que no rompa el archivo
    }
  };

  // ==============================
  // CARGA DE ÁREAS
  // ==============================
  async function fetchAreas() {
    try {
      const areas = await getAreasConNiveles();
      setAllAreas(areas);
      console.log("Áreas cargadas:", areas);
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  }

  // ==============================
  // USEEFFECT INICIAL
  // ==============================
  useEffect(() => {
    fetchEvaluadores();
    fetchAreas();
  }, []);

  // ==============================
  // HANDLERS MODALES
  // ==============================

  // cerrar modal registrar + limpiar form
  const handleCloseModal = () => {
    setOpen(false);
    resetForm();
  };

  // crear evaluador nuevo
  const handleCreate = async () => {
    const result = await submit(); // submit usa el hook useRegisterEvaluador

    if (result.ok) {
      await fetchEvaluadores();
      setSuccessMsg("Evaluador registrado correctamente.");
      setSuccessOpen(true);
      handleCloseModal();
    } else {
      // si tu hook retorna errores, puedes mostrarlos
      console.warn("No se pudo crear el evaluador", result);
    }
  };

  // abrir modal edición
  const handleOpenEdit = (row /*, idx */) => {
    setEditingRow(row);
    setEditOpen(true);
  };

  // abrir modal eliminar
  const handleOpenDelete = (row /*, idx */) => {
    setDeletingRow(row);
    setDeleteOpen(true);
  };

  // confirmar eliminar
  const confirmDelete = async () => {
    try {
      if (!deletingRow) return;
      await handleDelete(deletingRow.id); // usamos el id real
      await fetchEvaluadores(); // recargar
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

  // ==============================
  // BUSCADOR (por correo o CI)
  // ==============================
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase().trim();
    return rows.filter(
      (r) => r.correo?.toLowerCase().includes(q) || r.ci?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="px-4 sm:px-6 md:px-8 py-6">
      {/* Tabs arriba (scroll en móvil) */}
      <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => {
            window.location.href = "gestion-roles";
          }}
          className="py-3 text-slate-500 hover:text-slate-700 shrink-0 text-sm sm:text-base"
        >
          Responsables Académicos
        </button>

        <button className="py-3 border-b-2 border-cta text-cta font-semibold shrink-0 text-sm sm:text-base" aria-current="page">
          Evaluadores
        </button>
      </div>

      {/* Header y acciones: se apilan en móvil */}
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        {/* Título y descripción */}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-primary leading-tight">
            Registro de Evaluadores
          </h1>

          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-prose">
            Registra evaluadores por área y nivel para asegurar el proceso de calificación.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-start md:justify-end">
          {/* Botón CSV */}
          <button
            className="w-full sm:w-auto inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 bg-white font-medium rounded-lg px-4 py-2 text-sm shadow-sm transition-all duration-150 ease-in-out"
            onClick={() => setImportOpen(true)}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            <span>Registrar evaluadores por CSV</span>
          </button>

          {/* Botón Registrar Evaluador */}
          <button
            className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-150 ease-in-out ${
              areasDisponibles <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setOpen(true)}
            disabled={areasDisponibles <= 0}
            aria-disabled={areasDisponibles <= 0}
          >
            <UserPlusIcon className="w-5 h-5" />
            Registrar Evaluador
          </button>
        </div>
      </div>

      {/* Tarjetas de estado responsivas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        <StatsCard title="Total Evaluadores" value={rows.length} variant="cta" icon="userplus" />
        <StatsCard title="Áreas Cubiertas" value={areasCubiertas} variant="accent" icon="check" />
        <StatsCard title="Áreas Disponibles" value={areasDisponibles} variant="cta" icon="check" />
      </div>

      {/* Buscador por correo o CI */}
      <div className="relative w-full md:max-w-md mb-6 ml-0 md:ml-auto mt-8">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
          </svg>
        </span>

        <input
          type="text"
          placeholder="Buscar por correo o CI"
          className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-700 placeholder-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-md text-slate-500 hover:text-sky-600 hover:bg-slate-100"
            aria-label="Limpiar filtro"
            title="Limpiar filtro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabla de evaluadores: scroll horizontal en móvil */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="min-w-[720px] sm:min-w-0">
          <EvaluadoresTable data={filteredRows} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
        </div>
      </div>

      {/* MODAL: Registrar nuevo evaluador */}
      <RegisterEvaluadorModal
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

      {/* MODAL: Editar evaluador existente */}
      <EditEvaluadorModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={editingRow}
        takenAreas={rows.map((r) => ({ area: r.area, nivel: r.nivel }))}
        onUpdate={async () => {
          await fetchEvaluadores();
          setEditOpen(false);
          setSuccessMsg("La información se actualizó correctamente.");
          setSuccessOpen(true);
        }}
      />

      {/* MODAL: Confirmar eliminación */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        record={deletingRow}
      />

      {/* MODAL: Importar Evaluadores por CSV */}
      <ImportarEvaluadoresModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onUpload={async (file) => {
          console.log("Subiendo CSV:", file.name);
        }}
      />

      {/* DIÁLOGO DE ÉXITO */}
      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message={successMsg}
      />
    </div>
  );
}


