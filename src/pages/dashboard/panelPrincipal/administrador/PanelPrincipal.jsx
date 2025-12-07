// src/pages/dashboard/panelPrincipal/administrador/PanelPrincipal.jsx
import EntornoFinal from "../../../../components/EntornoFinal";

export default function PanelPrincipal() {
  return (
    <section className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6">
      <h2 className="text-ink text-xl font-semibold mb-2">Panel Principal</h2>
      <p className="text-ink/70">
        Aquí va el contenido del panel principal (widgets, KPIs, etc.).
      </p>
      
      {/* ✅ Reemplazamos ControlFasesTable por EntornoFinal */}
      <EntornoFinal />
    </section>
  );
}
