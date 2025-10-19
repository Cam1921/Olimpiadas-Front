// src/features/auth/hooks/useLoginForm.js
import { useCallback, useMemo, useState } from "react";
import { login } from "@/services/auth";

export default function useLoginForm(onSuccess) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credError, setCredError] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPass, setTouchedPass] = useState(false);
  const [emailLimitMsg, setEmailLimitMsg] = useState("");
  const [role, setRole] = useState("administrador");

  // -------------------------
  // EMAIL HANDLERS
  // -------------------------
  const onEmailChange = useCallback((v) => {
    if (v.length >= 70) {
      setEmail(v.slice(0, 70));
      setEmailLimitMsg("Cantidad máxima 70 caracteres");
    } else {
      setEmail(v);
      setEmailLimitMsg("");
    }
  }, []);

  const validateEmail = useCallback((v) => {
    if (!v || v.trim() === "") return "";
    const at = v.indexOf("@");
    if (at === -1) return "Incluye un signo de @ en la dirección de correo electrónico";
    if (at === 0) return "Ingrese nombre de usuario antes del signo @";
    if (at === v.length - 1) return "Ingrese un dominio después del signo @";
    const domain = v.slice(at + 1);
    if (!domain.includes(".")) return "El dominio debe contener al menos un punto (por ejemplo: gmail.com)";
    if (domain.startsWith(".") || domain.endsWith(".")) return "El dominio no puede iniciar ni terminar con un punto";
    return "";
  }, []);

  // -------------------------
  // PASSWORD VALIDATION (mínimo 8)
  // -------------------------
  const validatePassword = useCallback((v) => {
    if (!v) return "";
    if (v.length < 8) return "";
    if (v.length > 25) return "";
    return "";
  }, []);

  const emailError = useMemo(() => validateEmail(email), [email, validateEmail]);
  const passwordError = useMemo(() => validatePassword(password), [password, validatePassword]);

  // 🔒 Botón solo se habilita si password >= 8, sin mostrar error visible
  const canSubmit = useMemo(() => {
    const passwordValid = password.length >= 8 && password.length <= 25;
    return !!email && passwordValid && !emailError && !loading;
  }, [email, password, emailError, loading]);

  const toggleShowPassword = useCallback(() => {
    if (!password) return;
    setShowPassword((s) => !s);
  }, [password]);

  // -------------------------
  // SUBMIT HANDLER
  // -------------------------
  const onSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    setCredError("");
    setTouchedEmail(true);
    setTouchedPass(true);
    if (!canSubmit) return;

    try {
      setLoading(true);
      const res = await login(email, password, role);

      if (res && res.token) {
        setRole(res[0]);
        onSuccess?.(); // ✅ Cierra/navega solo si fue exitoso
        return;
      }

      // ❌ Credenciales inválidas
      setCredError("Credenciales inválidas");
      setPassword(""); // limpia campo
      setShowPassword(false);
      setTouchedPass(false);
    } catch (err) {
      setCredError("Credenciales inválidas");
      setPassword("");
      setShowPassword(false);
      setTouchedPass(false);
    } finally {
      setLoading(false);
    }
  }, [canSubmit, email, password, role, onSuccess]);

  // -------------------------
  // RESET FORM
  // -------------------------
  const reset = useCallback(() => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setLoading(false);
    setCredError("");
    setTouchedEmail(false);
    setTouchedPass(false);
    setEmailLimitMsg("");
    setRole("administrador");
  }, []);

  // -------------------------
  // RETURN
  // -------------------------
  return {
    email,
    setEmail: onEmailChange,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loading,
    credError,
    setCredError,
    touchedEmail,
    setTouchedEmail,
    touchedPass,
    setTouchedPass,
    emailLimitMsg,
    role,
    setRole,
    emailError,
    passwordError,
    canSubmit,
    onSubmit,
    reset,
  };
}
