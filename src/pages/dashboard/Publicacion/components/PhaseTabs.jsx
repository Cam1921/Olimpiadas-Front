import { MdOutlineTimeline, MdOutlineHourglassEmpty } from "react-icons/md";

export default function PhaseTabs({ fase, setFase, disableFinal = true }) {
  const Item = ({ keyPhase, label, Icon, disabled }) => (
    <button
      type="button"
      onClick={() => !disabled && setFase(keyPhase)}
      disabled={disabled}
      className={`flex-1 rounded-full py-2 text-sm flex items-center justify-center gap-2
        ${fase === keyPhase ? "bg-white shadow text-ink" : "text-ink/50"}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
      title={disabled ? "Disponible próximamente" : undefined}
    >
      <Icon /> {label}
    </button>
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full md:w-1/2 bg-surface rounded-full p-1 flex items-center gap-1">
        <Item keyPhase="clasificatoria" label="Fase Clasificatoria" Icon={MdOutlineTimeline} disabled={false} />
        <Item keyPhase="final" label="Fase Final" Icon={MdOutlineHourglassEmpty} disabled={disableFinal} />
      </div>
    </div>
  );
}
