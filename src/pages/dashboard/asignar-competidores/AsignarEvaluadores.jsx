// AsignarEvaluadores.jsx
import React, { useEffect, useState } from "react";
import TableAsignacion from "./TableAsignacion";
import AsignacionesModal from "./AsignacionesModal";
import { asignacionService } from "@/services/asignacionService";
import Dropdown from "@/components/Dropdown";
import { FaChevronDown } from "react-icons/fa";

function AsignarEvaluadores({ areas = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [currentEvaluadores, setCurrentEvaluadores] = useState([]);
  const [currentAsignacionId, setCurrentAsignacionId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [asignaciones, setAsignaciones] = useState([]);
  const [idArea, setidArea] = useState("");
  const [idNivel, setidNivel] = useState("");
  const [Allareas, setAreas] = useState(areas || []);
  const [selectNivel, setSelectedNivel] = useState("");
  const [niveles, setNiveles] = useState([]);

  const fetchAsignaciones = async () => {
    setLoading(false);
    try {
      const params = {
        id_area: idArea,
        id_nivel: idNivel,
        page: page,
      };
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAsignaciones();
  }, [page, idArea, idNivel]);

  useEffect(() => {
    fetchAsignaciones();
  }, []);
  const handleAssign = async (r) => {
    const idAreaNivel = r.id;

    const params = {
      estado: "no_asignados",
    };

    const res = await asignacionService.getEvaluadoresAsignacion(
      params,
      idAreaNivel
    );
    setCurrentEvaluadores(res.data);
    setCurrentAsignacionId(r.id);
    setModalMode("assign");
    setModalOpen(true);
  };
  const handleView = async (r) => {
    try {
      const idAreaNivel = r.id;

      const params = {
        estado: "asignados",
      };

      const res = await asignacionService.getEvaluadoresAsignacion(
        params,
        idAreaNivel
      );
      console.log(res);
      setCurrentEvaluadores(res.data);
      setModalMode("view");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
    }
  };

  const handleSave = async (selectedIds) => {
    const idAreaNivel = currentAsignacionId;
    console.log(selectedIds);
    if (modalMode === "assign") {
      const payload = {
        evaluadores: selectedIds,
      };
      const res = await asignacionService.createAsignacion(
        payload,
        idAreaNivel
      );
    } else if (modalMode === "delete") {
      const payload = {
        asignaciones: selectedIds,
      };
      const res = await asignacionService.deleteAsignacion(
        payload,
        idAreaNivel
      );
      console.log(res);
    }

    setModalOpen(false);
    fetchAsignaciones();
  };

  const handleDelete = async (r) => {
    try {
      const idAreaNivel = r.id;

      const params = {
        estado: "asignados",
      };

      const res = await asignacionService.getEvaluadoresAsignacion(
        params,
        idAreaNivel
      );
      console.log(res);
      setCurrentEvaluadores(res.data);
      setCurrentAsignacionId(r.id);
      setModalMode("delete");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Asignar evaluadores</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-end">
          <Dropdown
            defaultLabel="Todas las áreas"
            menuClass="w-full"
            buttonClass="w-full"
            dropdowClass="md:col-span-4"
            items={[
              { value: "", label: "Todas las áreas" },
              ...areas.map((a) => ({
                value: a.id,
                label: a.nombre,
              })),
            ]}
            icon={FaChevronDown}
            onSelect={(a) => {
              console.log(a.value);
              const id = a.value;
              const data = areas.find((a) => a.id === id);
              setidNivel("");
              setSelectedNivel("");
              setNiveles(data?.niveles || []);
              setidArea(id);
            }}
          />

          <Dropdown
            defaultLabel="Todos los niveles"
            menuClass="w-full"
            buttonClass="w-full"
            dropdowClass="md:col-span-4"
            selectedLabel={selectNivel ? selectNivel : "Todos los niveles"}
            items={[
              { value: "", label: "Todos los niveles" },
              ...niveles.map((a) => ({
                value: a.id,
                label: a.nombre_nivel,
              })),
            ]}
            icon={FaChevronDown}
            onSelect={(n) => {
              const id = n.value;
              setidNivel(id);
              setSelectedNivel(n.label);
            }}
          />
        </div>
        <TableAsignacion
          asignaciones={asignaciones}
          onView={handleView}
          onAssign={handleAssign}
          onDelete={handleDelete}
          page={page}
          lastPage={lastPage}
          onPageChange={setPage}
          loading={loading}
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
