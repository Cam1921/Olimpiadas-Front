import { useEffect, useState } from "react";
import axios from "axios";

export default function useAreasNiveles() {
    const [areas, setAreas] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedNivel, setSelectedNivel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarAreas();
    }, []);

    const cargarAreas = async () => {
        try {
            const res = await axios.get("/catalogos/area-niveles");
            setAreas(res.data.data);
        } catch (error) {
            console.error("Error cargando áreas:", error);
        } finally {
            setLoading(false);
        }
    };

    const seleccionarArea = (areaId) => {
        setSelectedArea(areaId);
        const area = areas.find((a) => a.id === parseInt(areaId));
        setNiveles(area ? area.niveles : []);
        setSelectedNivel(null);
    };

    const seleccionarNivel = (nivelId) => {
        setSelectedNivel(nivelId);
    };

    return {
        areas,
        niveles,
        selectedArea,
        selectedNivel,
        loading,
        seleccionarArea,
        seleccionarNivel,
    };
}
