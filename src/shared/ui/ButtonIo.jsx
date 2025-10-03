import "./ButtonIo.css";

export default function ButtonIo({
  children,
  type = "button",
  disabled = false,
  onClick,
  icon = null,
  className = "",
  ariaLabel,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled ? "true" : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`btn-io ${className}`}
    >
      <span>{children}</span>
      <span className="btn-io__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
