// src/pages/dashboard/publicacion/components/PhaseToggle.jsx
import { MdOutlineTimeline, MdFlag } from "react-icons/md";

export default function PhaseToggle({ fase, onChange }) {
  const Item = ({ keyPhase, label, Icon }) => (
    <button
      type="button"
      onClick={() => onChange(keyPhase)}
      className={`px-4 py-2 rounded-2xl border flex items-center gap-2
        ${fase === keyPhase ? "ring-2 ring-blue-500" : ""}`}
    >
      <Icon /> {label}
    </button>
  );

  return (
    <div className="flex gap-2">
      <Item keyPhase="clasificatoria" label="Fase clasificatoria" Icon={MdOutlineTimeline} />
      <Item keyPhase="final" label="Fase final" Icon={MdFlag} />
    </div>
  );
}
