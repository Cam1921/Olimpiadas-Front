// src/pages/dashboard/informacionPersonal/InformacionPersonal.jsx
import { useMemo, useState } from "react";
import EditableField from "@/components/forms/EditableField";
import PasswordInline from "@/components/forms/PasswordInline";
import { validateNombre, validateTelefono, formatTelefonoInput } from "@/utils/validators";

import { BsPerson, BsEnvelopeAt, BsTelephone, BsJustifyLeft, BsPersonVcard } from "react-icons/bs";
import { SlLayers } from "react-icons/sl";

export default function InformacionPersonal() {
  const user = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); }
    catch { return null; }
  }, []);

  const nombreInit = user?.nombre ?? "";
  const emailInit  = user?.email ?? "example@gmail.com";
  const telInit    = user?.telefono ?? "76062620";
  const areaInit   = user?.area ?? "Matemáticas";
  const nivelInit  = user?.nivel ?? "Primaria";
  const ciInit     = user?.ci ?? "12345678";

  const [activeField, setActiveField] = useState(null);

  const saveNombre = async (nuevo) => {
    const next = { ...user, nombre: nuevo };
    sessionStorage.setItem("user", JSON.stringify(next));
  };
  const saveTelefono = async (nuevo) => {
    const next = { ...user, telefono: nuevo };
    sessionStorage.setItem("user", JSON.stringify(next));
  };
  const savePassword = async (_nuevo) => {};

  // Filtro de entrada para Teléfono:
  const telefonoFilter = (raw, prev) => {
    let next = formatTelefonoInput(raw);      // solo dígitos, máx 8
    // Regla del primer dígito = 6 o 7
    if (next.length === 1 && !/[67]/.test(next[0])) {
      // bloquea el cambio y muestra error
      return { next: prev, errorOverride: "Debe comenzar con 6 o 7" };
    }
    return { next }; // sin error aquí, el validator se encarga del resto
  };

  return (
    <section className="p-4 lg:p-8">
      <h2 className="text-2xl font-semibold mb-6">Información Personal</h2>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <EditableField
            fieldKey="nombre"
            label="Nombre completo:"
            icon={BsPerson}
            placeholder="Ingresa el Nombre completo"
            initialValue={nombreInit}
            validator={validateNombre}
            successMessage="Nombre actualizado exitosamente"
            onSave={saveNombre}
            activeField={activeField}
            setActiveField={setActiveField}
          />

          <PasswordInline
            fieldKey="password"
            activeField={activeField}
            setActiveField={setActiveField}
            onSave={savePassword}
          />

          <EditableField
            fieldKey="telefono"
            label="Teléfono:"
            icon={BsTelephone}
            placeholder="Ingresar numero de teléfono"
            initialValue={telInit}
            validator={validateTelefono}
            successMessage="Teléfono guardado exitosamente"
            onSave={saveTelefono}
            activeField={activeField}
            setActiveField={setActiveField}
            onInputFilter={telefonoFilter}     // 👈 bloqueo de largo y 1er dígito
          />
        </div>

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

          <div className="space-y-2">
            <label className="block text-lg font-medium">Carnet de Identidad:</label>
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
