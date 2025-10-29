// src/pages/auth/components/BarraFortalezaContraseña.jsx
export default function BarraFortalezaContraseña({ pass = "" }) {
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNum   = /\d/.test(pass);
  const hasSym   = /[^A-Za-z0-9]/.test(pass);
  const noSpace  = !/\s/.test(pass);
  const lenOK    = pass.length >= 12;

  const score = [hasUpper, hasLower, hasNum, hasSym, noSpace, lenOK].filter(Boolean).length; // 0..6
  const pct = (score / 6) * 100;

  return (
    <div className="mt-3">
      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, backgroundColor: pct < 50 ? "#ef4444" : pct < 83 ? "#f59e0b" : "#16a34a" }}
          aria-hidden
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Fortaleza: {pct < 50 ? "Débil" : pct < 83 ? "Media" : "Fuerte"}
      </p>
    </div>
  );
}
