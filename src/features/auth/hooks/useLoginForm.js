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
  const [role, setRole] = useState("Administrador");

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
  if (!v || v.trim() === "") return ;

  const at = v.indexOf("@");
  if (at === -1) return "Incluye un signo de @ en la dirección de correo electrónico";
  if (at === 0) return "Ingrese nombre de usuario antes del signo @";
  if (at === v.length - 1) return "Ingrese un dominio después del signo @";

  const domain = v.slice(at + 1);
  if (!domain.includes(".")) return "El dominio debe contener al menos un punto (por ejemplo: gmail.com)";
  if (domain.startsWith(".") || domain.endsWith("."))
    return "El dominio no puede iniciar ni terminar con un punto";

  return "";
}, []);

  const validatePassword = useCallback((v) => {
    if (!v) return ""; // el botón ya se deshabilita; mostramos rangos solo si hay algo
    if (v.length < 8 || v.length > 25)
      return "La cantidad mínima es de 8 caracteres y el máximo es de 25 caracteres";
    return "";
  }, []);

  const emailError = useMemo(() => validateEmail(email), [email, validateEmail]);
  const passwordError = useMemo(() => validatePassword(password), [password, validatePassword]);

  const canSubmit = useMemo(() => {
    return !!email && !!password && !emailError && !passwordError && !loading;
  }, [email, password, emailError, passwordError, loading]);

  const toggleShowPassword = useCallback(() => {
    if (!password) return;
    setShowPassword((s) => !s);
  }, [password]);

const onSubmit = useCallback(async (e) => {
  e?.preventDefault?.();
  setCredError("");
  setTouchedEmail(true);
  setTouchedPass(true);
  if (!canSubmit) return;

  try {
    setLoading(true);
    const res = await login(email, password);

    // ⚙️ Validamos si el backend devuelve un token válido
    if (res && res.token) {
      onSuccess?.(); // login exitoso → redirige
    } else {
      setCredError("Credenciales inválidas");
    }
  } catch (err) {
    // 🚨 Error HTTP (401, 404, 500, etc.)
    console.log("Error en login:", err);
    setCredError("Credenciales inválidas");
  } finally {
      e?.preventDefault?.();
    setLoading(false);
  }
}, [canSubmit, email, password, onSuccess]);
  // 🔄 reset para limpiar todo al cerrar el modal
const reset = useCallback(() => {
  setEmailState("");
  setEmail("");
  setPassword("");
  setShowPassword(false);
  setLoading(false);
  setCredError("");
  setTouchedEmail(false);
  setTouchedPass(false);
  setEmailLimitMsg("");
  setRole("Administrador");
}, []);

  return {
    // state
    email, setEmail: onEmailChange,
    password, setPassword,
    showPassword, toggleShowPassword,
    loading, credError, setCredError,
    touchedEmail, setTouchedEmail,
    touchedPass, setTouchedPass,
    emailLimitMsg,
    role,setRole,

    // derived
    emailError, passwordError, canSubmit,
    // actions
    onSubmit,
    reset,
  };
}
