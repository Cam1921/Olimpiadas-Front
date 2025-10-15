import { useEffect, useState, useMemo } from "react";
import EditableField from "@/components/forms/EditableField";
import PasswordInline from "@/components/forms/PasswordInline";
import { personaRepo } from "../../../infrastructure/http/persona/repositorio"; // 👈 ahora usamos el repo único
import { ROLE_NAMES } from "@/constants/menu";
import {
  validateNombre,
  validateTelefono,
  formatTelefonoInput,
} from "@/utils/validators";

import {
  BsPerson,
  BsEnvelopeAt,
  BsTelephone,
  BsJustifyLeft,
  BsPersonVcard,
} from "react-icons/bs";
import { SlLayers } from "react-icons/sl";

// 🧩 función auxiliar para extraer los datos de asignación
const getAsignacionInfo = (data, role) => {
  const asignaciones = data.asignaciones || [];

  if (role === ROLE_NAMES.EVALUADOR) {
    // el evaluador tiene área y nivel
    const a = asignaciones[0] || {};
    return {
      area: a.area || "Sin área asignada",
      nivel: a.nivel || "Sin nivel asignado",
    };
  }

  if (role === ROLE_NAMES.RESPONSABLE_DE_AREA) {
    // el responsable solo tiene área (única)
    const a = asignaciones[0] || {};
    return {
      area: a.area || "Sin área asignada",
      nivel: "No aplica",
    };
  }

  // administrador u otros roles sin asignación
  return {
    area: "No aplica",
    nivel: "No aplica",
  };
};

export default function InformacionPersonal() {
  const user = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      const role =
        u?.role?.nombre ||
        u?.rol?.[0] ||
        u?.personas?.[0]?.rols?.[0]?.nombre ||
        ROLE_NAMES.ADMINISTRADOR;
      return { ...u, role };
    } catch {
      return null;
    }
  }, []);

  const [persona, setPersona] = useState(null);
  const [activeField, setActiveField] = useState(null);

  // 🧩 cargar datos desde el backend
  useEffect(() => {
    const loadPersona = async () => {
      try {
        const data = await personaRepo.show();
        const { area, nivel } = getAsignacionInfo(data, user.role);

        setPersona({
          id: data.persona.id,
          nombre: data.persona.nombre,
          apellidos: data.persona.apellidos,
          telefono: data.persona.telefono,
          ci: data.persona.ci,
          correo: data.persona.correo,
          area,
          nivel,
        });
      } catch (err) {
        console.error("Error cargando información personal:", err);
      }
    };

    if (user) loadPersona();
  }, [user]);

  // 🧩 funciones para guardar cambios
  const saveNombre = async (nuevo) => {
    const next = { ...persona, nombre: nuevo };
    await personaRepo.update({ nombre: nuevo }); // 👈 actualiza backend
    setPersona(next);
    sessionStorage.setItem("user", JSON.stringify({ ...user, persona: next }));
  };

  const saveTelefono = async (nuevo) => {
    const next = { ...persona, telefono: nuevo };
    await personaRepo.update({ telefono: nuevo }); // 👈 actualiza backend
    setPersona(next);
    sessionStorage.setItem("user", JSON.stringify({ ...user, persona: next }));
  };

  const saveApellidos = async (nuevo) => {
    const next = { ...persona, apellidos: nuevo };
    await personaRepo.update({ apellidos: nuevo });
    setPersona(next);
    sessionStorage.setItem("user", JSON.stringify({ ...user, persona: next }));
  };
  const savePassword = async (nuevo) => {
    try {
      await personaRepo.update({
        password: nuevo,
        password_confirmation: nuevo, // obligatorio si tu backend valida confirmación
      });
    } catch (err) {
      console.error("Error actualizando contraseña:", err);
      alert("No se pudo actualizar la contraseña");
    }
  };

  const telefonoFilter = (raw, prev) => {
    let next = formatTelefonoInput(raw);
    if (next.length === 1 && !/[67]/.test(next[0])) {
      return { next: prev, errorOverride: "Debe comenzar con 6 o 7" };
    }
    return { next };
  };

  if (!persona)
    return <p className="p-6 text-gray-500">Cargando información...</p>;

  const nombreInit = persona.nombre ?? "";
  const apellidosInit = persona.apellidos ?? "";
  const emailInit = persona.correo ?? "";
  const telInit = persona.telefono ?? "";
  const ciInit = persona.ci ?? "";
  const areaInit = persona.area;
  const nivelInit = persona.nivel;

  const esResponsable = user.role === ROLE_NAMES.RESPONSABLE_DE_AREA;

  return (
    <section className="p-4 lg:p-8">
      <h2 className="text-2xl font-semibold mb-6">Información Personal</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Columna izquierda (editable) */}
        <div className="space-y-8">
          <EditableField
            fieldKey="nombre"
            label="Nombres:"
            icon={BsPerson}
            placeholder="Ingresa el Nombre completo"
            initialValue={nombreInit}
            validator={validateNombre}
            successMessage="Nombre actualizado exitosamente"
            onSave={saveNombre}
            activeField={activeField}
            setActiveField={setActiveField}
          />
          <EditableField
            fieldKey="apellidos"
            label="Apellidos:"
            icon={BsPerson}
            placeholder="Ingresa los apellidos"
            initialValue={apellidosInit}
            validator={validateNombre}
            successMessage="Apellidos actualizados exitosamente"
            onSave={saveApellidos}
            activeField={activeField}
            setActiveField={setActiveField}
          />
          <PasswordInline
            fieldKey="password"
            activeField={activeField}
            setActiveField={setActiveField}
            onSave={(nuevo) => savePassword(nuevo)}
          />

          <EditableField
            fieldKey="telefono"
            label="Teléfono:"
            icon={BsTelephone}
            placeholder="Ingresar número de teléfono"
            initialValue={telInit}
            validator={validateTelefono}
            successMessage="Teléfono guardado exitosamente"
            onSave={saveTelefono}
            activeField={activeField}
            setActiveField={setActiveField}
            onInputFilter={telefonoFilter}
          />
        </div>

        {/* Columna derecha (solo lectura) */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium">Correo:</label>
            <div className="relative">
              <BsEnvelopeAt className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
              <input
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 border-gray-300 cursor-not-allowed"
                value={emailInit}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium">Área:</label>
            <div className="relative">
              <BsJustifyLeft className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
              <input
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 border-gray-300 cursor-not-allowed"
                value={areaInit}
                readOnly
              />
            </div>
          </div>
          {!esResponsable && (
            <div className="space-y-2">
              <label className="block text-lg font-medium">Nivel:</label>
              <div className="relative">
                <SlLayers className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
                <input
                  className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 border-gray-300 cursor-not-allowed"
                  value={nivelInit}
                  readOnly
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-lg font-medium">
              Carnet de Identidad:
            </label>
            <div className="relative">
              <BsPersonVcard className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
              <input
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 border-gray-300 cursor-not-allowed"
                value={ciInit}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
