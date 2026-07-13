"use client";

import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
};

function Petal({ left, delay, duration, size, drift, opacity }: Omit<Petal, "id">) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      className="absolute top-0 animate-petal-fall"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity,
        // @ts-expect-error custom property consumed by keyframes
        "--drift": `${drift}px`,
      }}
    >
      <path
        d="M10 0C14 4 20 8 10 20C0 8 6 4 10 0Z"
        fill="var(--color-gold-light)"
      />
    </svg>
  );
}

export default function FloatingPetals({ count = 14 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      setPetals(
        Array.from({ length: count }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 12,
          duration: 14 + Math.random() * 10,
          size: 10 + Math.random() * 10,
          drift: Math.random() * 120 - 60,
          opacity: 0.35 + Math.random() * 0.35,
        }))
      );
    }, 0);
    return () => clearTimeout(kickoff);
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <Petal key={p.id} {...p} />
      ))}
    </div>
  );
}
