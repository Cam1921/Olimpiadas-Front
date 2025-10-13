// src/components/forms/PasswordInline.jsx
import { useEffect, useMemo, useState } from "react";
import { GoPencil } from "react-icons/go";
import { RiLock2Line } from "react-icons/ri";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { validatePassword, validatePasswordConfirm } from "@/utils/validators";

export default function PasswordInline({
  fieldKey = "password",
  activeField,
  setActiveField,
  onSave = async () => {},
}) {
  const editing = activeField === fieldKey;

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [touched1, setTouched1] = useState(false);
  const [touched2, setTouched2] = useState(false);
  const [success, setSuccess] = useState("");

  // errores sólo si usuario escribió algo (touched)
  const passErr = useMemo(() => {
    if (!editing) return "";
    if (!touched1 || pass.length === 0) return "";
    return validatePassword(pass);
  }, [pass, editing, touched1]);

  const confirmErr = useMemo(() => {
    if (!editing) return "";
    if (!touched2 || confirm.length === 0) return "";
    return validatePasswordConfirm(pass, confirm);
  }, [pass, confirm, editing, touched2]);

  const canSave = useMemo(() => {
    if (!editing) return false;
    // Revalidación “fuerte” al habilitar guardar
    const hardPassErr = validatePassword(pass);
    const hardConfirmErr = validatePasswordConfirm(pass, confirm);
    return pass.length > 0 && !hardPassErr && !hardConfirmErr;
  }, [editing, pass, confirm]);

  useEffect(() => {
    if (!editing) {
      setPass("");
      setConfirm("");
      setTouched1(false);
      setTouched2(false);
      setShow1(false);
      setShow2(false);
    }
  }, [editing]);

  const startEdit = () => setActiveField(fieldKey);

  const cancel = () => {
    setActiveField(null);
  };

  const save = async () => {
    // validación final por si guardan sin escribir
    const hardPassErr = validatePassword(pass);
    const hardConfirmErr = validatePasswordConfirm(pass, confirm);
    if (hardPassErr || hardConfirmErr) {
      // forzamos “touched” para que se muestren los mensajes
      setTouched1(true);
      setTouched2(true);
      return;
    }
    await onSave(pass);
    setActiveField(null);
    setSuccess("Contraseña actualizada correctamente");
    setTimeout(() => setSuccess(""), 3000); // ✅ 3s
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-lg font-medium">Contraseña:</label>

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

      {!editing && (
        <div className="relative">
          <RiLock2Line className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
          <input
            type="password"
            value="************"
            readOnly
            className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 border-gray-300 cursor-not-allowed"
          />
        </div>
      )}

      {editing && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <RiLock2Line className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
              <input
                type={show1 ? "text" : "password"}
                placeholder="************"
                value={pass}
                onChange={(e) => { setPass(e.target.value); setTouched1(true); }}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg outline-none ${
                  passErr ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShow1((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80"
                aria-label="Mostrar/Ocultar contraseña"
              >
                {show1 ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {passErr && <p className="text-sm text-red-600">{passErr}</p>}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <RiLock2Line className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
              <input
                type={show2 ? "text" : "password"}
                placeholder="************"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setTouched2(true); }}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg outline-none ${
                  confirmErr ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShow2((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80"
                aria-label="Mostrar/Ocultar contraseña"
              >
                {show2 ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {confirmErr && <p className="text-sm text-red-600">{confirmErr}</p>}
          </div>
        </div>
      )}

      {/* éxito inline luego de guardar */}
      {success && !editing && <p className="text-sm text-green-600">{success}</p>}
    </div>
  );
}
