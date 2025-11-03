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
  // RENDER
  // ==============================
  return (
    <div className="p-6 md:p-8">
      {/* Tabs arriba */}
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

      {/* Header y acciones */}
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        {/* Título y descripción */}
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-primary leading-tight">
            Registro de Evaluadores
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Registra evaluadores por área y nivel para asegurar el proceso de
            calificación.
          </p>
        </div>

        {/* Acciones (lado derecho) */}
        <div className="flex items-center gap-3 justify-start md:justify-end">
          {/* Botón CSV */}
          <button
            className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 bg-white font-medium rounded-lg px-4 py-2 text-sm shadow-sm transition-all duration-150 ease-in-out"
            onClick={() => setImportOpen(true)}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            <span>Registrar evaluadores por CSV</span>
          </button>

          {/* Botón Registrar Evaluador */}
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-150 ease-in-out ${
              areasDisponibles <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setOpen(true)}
            disabled={areasDisponibles <= 0}
          >
            <UserPlusIcon className="w-5 h-5" />
            Registrar Evaluador
          </button>
        </div>
      </div>

      {/* Tarjetas de estado */}
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

      {/* Tabla de evaluadores */}
      <div className="mt-8">
        <EvaluadoresTable
          data={rows}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
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
