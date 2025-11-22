// AsignarEvaluadores.jsx
import React, { useEffect, useState } from "react";
import TableAsignacion from "./TableAsignacion";
import AsignacionesModal from "./AsignacionesModal";
import { asignacionService } from "@/services/asignacionService";

function AsignarEvaluadores() {
  const [asignaciones, setAsignaciones] = useState([
    {
      id: 1,
      area: "Matemática",
      nivel: "Primaria",
      evaluadores_asignados: 3,
      competidores: 4,
      evaluadores: [
        { id: 1, nombre: "Juan" },
        { id: 2, nombre: "María" },
        { id: 3, nombre: "Pedro" },
      ],
    },
    {
      id: 2,
      area: "Física",
      nivel: "Secundaria",
      evaluadores_asignados: 2,
      competidores: 4,
      evaluadores: [
        { id: 4, nombre: "Ana" },
        { id: 5, nombre: "Luis" },
        { id: 6, nombre: "Caro" },
      ],
    },
    {
      id: 3,
      area: "Informática",
      nivel: "Olimpíada",
      evaluadores_asignados: 4,
      competidores: 4,
      evaluadores: [
        { id: 7, nombre: "Diego" },
        { id: 8, nombre: "Sofia" },
        { id: 9, nombre: "Miguel" },
        { id: 9, nombre: "Angel" },
      ],
    },
    {
      id: 4,
      area: "Química",
      nivel: "Primaria",
      evaluadores_asignados: 1,
      competidores: 4,
      evaluadores: [{ id: 10, nombre: "Laura" }],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [currentEvaluadores, setCurrentEvaluadores] = useState([]);
  const [currentAsignacionId, setCurrentAsignacionId] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);

  const handleView = (r) => {
    try {
      setCurrentEvaluadores(r.evaluadores || []);
      setModalMode("view");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
    }
  };
  const fetchAsignaciones = async (page = 1) => {
    try {
      const params = { page: page };
      console.log(params);
      const res = await asignacionService.listarAsignaciones(params);
      console.log(res);
      const data = res.data.map((item) => ({
        id: item.id_area_nivel,
        area: item.area,
        nivel: item.nivel,
        evaluadores_asignados: item.total_evaluadores,
        competidores: item.total_competidores,
        evaluadores: [{ id: 10, nombre: "Laura" }],
      }));
      setAsignaciones(data);
      setPage(res.meta.current_page || 1);
      setLastPage(res.meta.last_page || 1);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
    }
  };

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  useEffect(() => {
    fetchAsignaciones(page);
  }, [page]);
  const handleAssign = (r) => {
    setCurrentEvaluadores(r.evaluadores || []);
    setCurrentAsignacionId(r.id);
    setModalMode("assign");
    setModalOpen(true);
  };

  const handleSave = (selectedIds) => {
    setAsignaciones((prev) =>
      prev.map((a) =>
        a.id === currentAsignacionId
          ? {
              ...a,
              evaluadores_asignados: selectedIds.length,
              evaluadores: a.evaluadores.filter((e) =>
                selectedIds.includes(e.id)
              ),
            }
          : a
      )
    );
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Desea eliminar esta asignación?")) {
      setAsignaciones((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Asignar evaluadores</h2>
        </div>
        <TableAsignacion
          asignaciones={asignaciones}
          onView={handleView}
          onAssign={handleAssign}
          onDelete={handleDelete}
          page={page}
          lastPage={lastPage}
          onPageChange={setPage}
        />
      </div>

      <AsignacionesModal
        isOpen={modalOpen}
        mode={modalMode}
        evaluadores={currentEvaluadores}
        seleccionados={currentEvaluadores}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}

export default AsignarEvaluadores;
