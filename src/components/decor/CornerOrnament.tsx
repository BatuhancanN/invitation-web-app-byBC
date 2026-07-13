type Props = {
  className?: string;
  flip?: "h" | "v" | "hv" | "none";
};

export default function CornerOrnament({ className = "", flip = "none" }: Props) {
  const transform =
    flip === "h"
      ? "scale(-1,1)"
      : flip === "v"
      ? "scale(1,-1)"
      : flip === "hv"
      ? "scale(-1,-1)"
      : undefined;

  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      style={{ transform }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8C8 8 60 4 90 30C120 56 118 100 140 118"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 8C8 8 4 60 30 90C56 120 100 118 118 140"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="90" cy="30" r="4" fill="var(--color-gold-light)" />
      <circle cx="120" cy="56" r="3" fill="var(--color-gold)" />
      <circle cx="30" cy="90" r="4" fill="var(--color-gold-light)" />
      <circle cx="56" cy="120" r="3" fill="var(--color-gold)" />
      <path
        d="M8 8C20 20 20 34 8 42"
        stroke="var(--color-gold-light)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M8 8C20 20 34 20 42 8"
        stroke="var(--color-gold-light)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
