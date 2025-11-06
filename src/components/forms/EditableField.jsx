// src/components/forms/EditableField.jsx
import { useEffect, useMemo, useState } from "react";
import { GoPencil } from "react-icons/go";

export default function EditableField({
  fieldKey,
  label,
  icon: Icon,
  placeholder,
  initialValue = "",
  validator = () => "",
  successMessage = "Actualizado exitosamente",
  onSave = async () => {},
  activeField,
  setActiveField,
  // 👇 opcional: para filtrar inputs (teléfono)
  onInputFilter, // (nextValue, prevValue) => ({ next, errorOverride? })
}) {
  const editing = activeField === fieldKey;

  const [value, setValue] = useState(initialValue);
  const [base, setBase] = useState(initialValue);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setValue(initialValue);
    setBase(initialValue);
    setError("");
    setSuccess("");
  }, [initialValue]);

  useEffect(() => {
    if (!editing) return;
    setSuccess("");
    setError(validator(value));
  }, [value, validator, editing]);

  const canSave = useMemo(() => {
    if (!editing) return false;
    if (error) return false;
    if (value === base) return false;
    return true;
  }, [editing, error, value, base]);

  const startEdit = () => {
    setActiveField(fieldKey);
    setValue(base);
    setError("");
    setSuccess("");
  };

  const cancel = () => {
    setValue(base);
    setError("");
    setSuccess("");
    setActiveField(null);
  };

  const save = async () => {
    await onSave(value);
    setBase(value);
    setActiveField(null);
    setSuccess("Contraseña actualizada correctamente");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    if (onInputFilter) {
      const { next, errorOverride } = onInputFilter(raw, value);
      setValue(next);
      if (typeof errorOverride === "string") setError(errorOverride);
      else setError(validator(next));
      return;
    }
    setValue(raw);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-lg font-medium">{label}</label>
        {!editing ? (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
            title="Editar"
          >
            <GoPencil />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canSave}
              onClick={save}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={cancel}
              className="px-3 py-1.5 rounded-md bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {Icon ? (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
        ) : null}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          readOnly={!editing}
          inputMode="numeric" // ayuda móvil para tel, ignora en nombre
          className={[
            "w-full",
            Icon ? "pl-10" : "pl-3",
            "pr-3 py-3 border rounded-lg outline-none",
            editing
              ? error
                ? "border-red-500"
                : "border-gray-300"
              : "bg-gray-100 border-gray-300 cursor-not-allowed",
          ].join(" ")}
        />
      </div>

      {editing && error && <p className="text-sm text-red-600">{error}</p>}
      {!editing && success && (
        <p className="text-sm text-green-600">{success}</p>
      )}
    </div>
  );
}
