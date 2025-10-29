// src/pages/auth/EstablecerContraseñaPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { RiLock2Line } from "react-icons/ri";
import { FiEye, FiEyeOff } from "react-icons/fi";
import BarraFortalezaContraseña from "./components/BarraFortalezaContraseña";
import ModalExito from "./components/ModalExito";
import ModalTokenExpirado from "./components/ModalTokenExpirado";

const validateToken = async (token) => {
  const res = await fetch(
    `http://localhost:8000/api/invitaciones/verificar-token/${token}`
  );
  if (!res.ok) return { ok: false };
  return await res.json();
};

const policyCheck = (pass) => {
  const len = pass?.length ?? 0;
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNum = /\d/.test(pass);
  const hasSym = /[^A-Za-z0-9]/.test(pass);
  const noSpace = !/\s/.test(pass);
  const ok = len >= 12 && hasUpper && hasLower && hasNum && hasSym && noSpace;
  let msg = "";
  if (!ok) {
    const req = [];
    if (len < 12) req.push("12+ caracteres");
    if (!hasUpper) req.push("1 mayúscula");
    if (!hasLower) req.push("1 minúscula");
    if (!hasNum) req.push("1 número");
    if (!hasSym) req.push("1 carácter especial");
    if (!noSpace) req.push("sin espacios");
    msg = `La contraseña debe tener ${req.join(", ")}.`;
  }
  return { ok, len, hasUpper, hasLower, hasNum, hasSym, noSpace, msg };
};

export default function EstablecerContraseñaPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get("token");

  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(false);

  // form
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [touched1, setTouched1] = useState(false);
  const [touched2, setTouched2] = useState(false);

  // modals
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openExpired, setOpenExpired] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await validateToken(token);
      if (!mounted) return;
      setValidToken(res.ok);
      setChecking(false);
      if (!res.ok) setOpenExpired(true);
    })();
    return () => (mounted = false);
  }, [token]);

  const policy = useMemo(() => policyCheck(p1), [p1]);
  const confirmErr = useMemo(() => {
    if (!touched2) return "";
    if (!p2) return "Confirma tu contraseña";
    if (p1 !== p2) return "Las contraseñas no coinciden";
    return "";
  }, [p1, p2, touched2]);

  const canSubmit = policy.ok && !confirmErr;

  // ⚠️ Solo front: simulamos guardar.
  // En real harías:
  //   await api.post("/auth/password-setup", { token, password: p1 })
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log(token);
    try {
      const res = await fetch(
        "http://localhost:8000/api/invitaciones/establecer-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: p1 }),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Error al establecer la contraseña");

      setOpenSuccess(true);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Tarjeta */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <RiLock2Line className="text-blue-600" size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Establece tu contraseña
              </h1>
              <p className="text-slate-600">
                Por seguridad, crea una nueva contraseña antes de ingresar al
                sistema.
              </p>
            </div>
          </div>

          {/* Estados de token */}
          {checking && (
            <div className="mt-8 text-slate-600">Validando enlace…</div>
          )}

          {!checking && validToken && (
            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              {/* Nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Nueva contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    type={show1 ? "text" : "password"}
                    value={p1}
                    onChange={(e) => {
                      setP1(e.target.value);
                      if (!touched1) setTouched1(true);
                    }}
                    onBlur={() => setTouched1(true)}
                    className={`w-full rounded-xl border px-3 py-2 pr-11 outline-none
                      ${
                        touched1 && !policy.ok
                          ? "border-red-500"
                          : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                      }
                    `}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    aria-invalid={touched1 && !policy.ok}
                    aria-describedby="policy-help"
                  />
                  <button
                    type="button"
                    onClick={() => setShow1((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100"
                    aria-label={show1 ? "Ocultar" : "Mostrar"}
                  >
                    {show1 ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <BarraFortalezaContraseña pass={p1} />

                {!policy.ok && touched1 && (
                  <p id="policy-help" className="text-sm text-red-600 mt-1">
                    {policy.msg}
                  </p>
                )}
              </div>

              {/* Confirmar */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Confirmar contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    type={show2 ? "text" : "password"}
                    value={p2}
                    onChange={(e) => {
                      setP2(e.target.value);
                      if (!touched2) setTouched2(true);
                    }}
                    onBlur={() => setTouched2(true)}
                    className={`w-full rounded-xl border px-3 py-2 pr-11 outline-none
                      ${
                        confirmErr
                          ? "border-red-500"
                          : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                      }
                    `}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    aria-invalid={!!confirmErr}
                    aria-describedby="confirm-help"
                  />
                  <button
                    type="button"
                    onClick={() => setShow2((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100"
                    aria-label={show2 ? "Ocultar" : "Mostrar"}
                  >
                    {show2 ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {confirmErr && (
                  <p id="confirm-help" className="text-sm text-red-600 mt-1">
                    {confirmErr}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  to="/"
                  className="text-slate-600 hover:text-slate-800 underline underline-offset-4"
                >
                  Volver al inicio
                </Link>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`px-4 py-2 rounded-xl text-white 
                    ${
                      canSubmit
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-300 cursor-not-allowed"
                    }
                  `}
                >
                  Guardar contraseña
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modales */}
      <ModalExito
        open={openSuccess}
        onClose={() => {
          setOpenSuccess(false);
          navigate("/");
        }}
      />
      <ModalTokenExpirado
        open={openExpired}
        onClose={() => {
          setOpenExpired(false);
          navigate("/");
        }}
        onResend={() => alert("Solo front: aquí dispararías el reenvío")}
      />
    </div>
  );
}
