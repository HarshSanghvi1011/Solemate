export function LogoMark({ className = "", skew = true }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center bg-brand-orange font-black text-black ${className}`}
      style={skew ? { transform: "skewX(-6deg)" } : undefined}
    >
      <span
        style={skew ? { transform: "skewX(6deg)" } : undefined}
        className="text-sm"
      >
        SM
      </span>
    </div>
  );
}

export function LogoText({ variant = "store" }) {
  if (variant === "store") {
    return (
      <span className="text-lg font-black uppercase tracking-tight text-white">
        SOLEMATE
      </span>
    );
  }
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-lg font-black uppercase tracking-tight text-brand-orange">
        SOLE MATE
      </span>
      <span className="text-xs font-bold uppercase tracking-widest text-white">
        ADMIN
      </span>
    </div>
  );
}
