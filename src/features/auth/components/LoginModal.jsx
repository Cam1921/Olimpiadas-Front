// src/features/auth/components/LoginModal.jsx
import { useEffect, useRef, useCallback } from "react";
import { FiX, FiLock, FiArrowRight } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import ButtonIo from "@/shared/ui/ButtonIo";
import useLoginForm from "../hooks/useLoginForm";

export default function LoginModal({ open, onClose }) {
  const emailRef = useRef(null);

  const {
    email, setEmail,
    password, setPassword,
    showPassword, toggleShowPassword,
    loading, credError, setCredError,
    touchedEmail, setTouchedEmail,
    touchedPass, setTouchedPass,
    emailLimitMsg,
    emailError, passwordError,
    canSubmit, onSubmit,
    role, setRole,
    reset,
  } = useLoginForm(() => {
    handleClose(); // cierra y limpia tras éxito
    window.location.href = "/dashboard";
  });

  // ⚠️ handleClose estable y seguro
  const handleClose = useCallback(() => {
    try { reset?.(); } catch {}
    onClose?.();
  }, [reset, onClose]);

  // Bloquea scroll y limpia error de credenciales al cerrar
  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setCredError("");
    }
    return () => (document.body.style.overflow = "");
  }, [open, setCredError]);

  // Escape para cerrar (usa handleClose estable)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open) return null;

  const eyeDisabled = password.length === 0;
  const emailInvalid = touchedEmail && !!emailError;
  const passInvalid  = touchedPass && !!passwordError;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="login-title"
    >
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
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <FiX size={18} />
          </button>
        </div>

        <p className="text-ink/70 mt-2 mb-6">
          Ingresa tus credenciales para acceder al sistema
        </p>

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
                  : "border border-slate-300 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!touchedEmail) setTouchedEmail(true);
              }}
              autoComplete="email"
              aria-invalid={emailInvalid}
              aria-describedby="email-help email-limit"
            />
            {emailLimitMsg && (
              <p id="email-limit" className="text-[var(--danger)] text-sm mt-1">{emailLimitMsg}</p>
            )}
            {emailInvalid && (
              <p id="email-help" className="text-[var(--danger)] text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-ink mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className={`w-full rounded-xl bg-white/90 px-3 py-2 pr-12 focus:outline-none
                  ${passInvalid
                    ? "border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)] focus:border-[var(--danger)]"
                    : "border border-slate-300 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"}`}
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
            {passInvalid && (
              <p id="password-help" className="text-[var(--danger)] text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Selector de rol (UI) */}
          <div>
            <p className="text-ink mb-2">Seleccionar rol</p>
            <div className="bg-surface rounded-2xl p-1 flex gap-2">
              {["Administrador", "Evaluador", "Responsable de área"].map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-2 rounded-xl border transition
                      ${active
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-ink/80 border-slate-200 hover:bg-[#ebf4f8] hover:text-black"}`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ¿Olvidaste tu contraseña? */}
          <div className="text-center">
            <a href="#" className="text-ink/60 hover:text-ink underline-offset-2">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Error de credenciales */}
          {credError && (
            <p className="text-[var(--danger)] text-sm">{credError}</p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <ButtonIo
              type="submit"
              disabled={!canSubmit}
              className="w-full"
              icon={<FiArrowRight />}
              ariaLabel="Iniciar sesión"
            >
              Iniciar sesión
            </ButtonIo>
          </div>
        </form>
      </div>
    </div>
  );
}
