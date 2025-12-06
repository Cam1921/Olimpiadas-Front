// src/features/auth/components/LoginModal.jsx
import { useEffect, useRef, useCallback, useState } from "react";
import { FiX, FiLock, FiArrowRight } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import ButtonIo from "@/shared/ui/ButtonIo";
import useLoginForm from "../hooks/useLoginForm";

export default function LoginModal({ open, onClose }) {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [isOpen, setIsOpen] = useState(open); // estado interno

  const {
    email, setEmail,
    password, setPassword,
    showPassword, toggleShowPassword,
    loading, credError, setCredError,
    touchedEmail, setTouchedEmail,
    touchedPass, setTouchedPass,
    emailLimitMsg, emailError, passwordError,
    canSubmit, onSubmit,
    role, setRole,
    reset,
  } = useLoginForm(() => {
    // ÉXITO: navegamos y cerramos realmente
    window.location.href = "/dashboard";
  });

  // Sincroniza prop -> estado interno
  useEffect(() => {
    if (credError) return;       // ⟵ mientras haya error, NO sincronizamos open -> isOpen
    setIsOpen(open);
  }, [open, credError]);

  const handleClose = useCallback(() => {
    try { reset?.(); } catch {}
    setIsOpen(false);
    onClose?.();
  }, [reset, onClose]);

  // Bloqueo scroll + foco inicial usando isOpen
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => emailRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setCredError(""); // limpia al cerrar real
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, setCredError]);

  // Escape para cerrar
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  // Si aparece error, fuerza seguir abierto y enfoca contraseña
  useEffect(() => {
    if (isOpen || credError) {
      setIsOpen(true);       // ignora cierres externos accidentales
      passRef.current?.focus();
    }
  }, [isOpen, credError]);

  if (!isOpen) return null;

  const eyeDisabled = password.length === 0;
  const emailInvalid = touchedEmail && !!emailError;
  const passInvalid = touchedPass && !!passwordError;

  return (
    <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" aria-modal="true" role="dialog" aria-labelledby="login-title">
      <div
        className="mx-auto max-w-xl w-[92%] md:w-[680px] mt-20 rounded-2xl bg-white p-6 md:p-8 shadow-soft border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 id="login-title" className="text-ink text-3xl md:text-[var(--fs-h2)] font-bold flex items-center gap-3">
            <FiLock className="text-[var(--primary)]" />
            Iniciar Sesión
          </h2>
          <button type="button" onClick={handleClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Cerrar">
            <FiX size={18} />
          </button>
        </div>

        <p className="text-ink/70 mt-2 mb-6">Ingresa tus credenciales para acceder al sistema</p>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-ink mb-1">Correo electrónico</label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              inputMode="email"
              placeholder="ejemplo@gmail.com"
              maxLength={70}
              className={`w-full rounded-xl bg-white/90 px-3 py-2 focus:outline-none
                ${emailInvalid
                  ? "border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)] focus:border-[var(--danger)]"
                  : "border border-slate-300 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!touchedEmail) setTouchedEmail(true);
              }}
              autoComplete="email"
              aria-invalid={emailInvalid}
              aria-describedby="email-help email-limit"
            />
            {emailLimitMsg && <p id="email-limit" className="text-[var(--danger)] text-sm mt-1">{emailLimitMsg}</p>}
            {emailInvalid && <p id="email-help" className="text-[var(--danger)] text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-ink mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                ref={passRef}
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className={`w-full rounded-xl bg-white/90 px-3 py-2 pr-12 focus:outline-none
                  ${passInvalid
                    ? "border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)] focus:border-[var(--danger)]"
                    : "border border-slate-300 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                  }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!touchedPass) setTouchedPass(true);
                }}
                autoComplete="current-password"
                aria-invalid={passInvalid}
                aria-describedby="password-help"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                disabled={eyeDisabled}
                aria-disabled={eyeDisabled}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg
                           ${eyeDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"}`}
              >
                <BsEye />
              </button>
            </div>
            {passInvalid && <p id="password-help" className="text-[var(--danger)] text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Error de credenciales (permanece visible) */}
          {credError && <p className="text-[var(--danger)] text-sm">{credError}</p>}

          {/* Submit */}
          <div className="pt-2">
            <ButtonIo type="submit" disabled={!canSubmit} className="w-full" icon={<FiArrowRight />} ariaLabel="Iniciar sesión">
              Iniciar sesión
            </ButtonIo>
          </div>
        </form>
      </div>
    </div>
  );
}
