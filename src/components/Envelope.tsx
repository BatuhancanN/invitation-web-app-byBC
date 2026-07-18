"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { FiMail } from "react-icons/fi";
import { invitationConfig } from "@/config/invitation";

type Stage = "closed" | "igniting" | "opening" | "card-out" | "leaving";

const GOLD_COLORS = ["#b8934a", "#d4b876", "#fdf8f0", "#8f6d31"];
const RING_CIRCUMFERENCE = 176; // 2 * PI * 28, matches .animate-ring-fill in globals.css

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [stage, setStage] = useState<Stage>("closed");
  const { bride, groom } = invitationConfig.couple;
  const initials = `${bride[0]}${groom[0]}`;

  const hasTriggeredRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const triggerOpen = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    clearTimers();

    setStage("igniting");

    const t1 = window.setTimeout(() => setStage("opening"), 250);

    const t2 = window.setTimeout(() => {
      setStage("card-out");
      confetti({
        particleCount: 90,
        spread: 70,
        startVelocity: 38,
        gravity: 0.9,
        colors: GOLD_COLORS,
        origin: { y: 0.5 },
      });
      const confettiFollowUp = window.setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 60,
          startVelocity: 25,
          scalar: 0.6,
          gravity: 0.9,
          colors: GOLD_COLORS,
          origin: { y: 0.5 },
        });
      }, 150);
      timersRef.current.push(confettiFollowUp);
    }, 750);

    const t3 = window.setTimeout(() => setStage("leaving"), 1400);
    const t4 = window.setTimeout(() => onOpen(), 1800);

    timersRef.current.push(t1, t2, t3, t4);
  };

  useEffect(() => {
    const autoId = window.setTimeout(triggerOpen, 5000);
    timersRef.current.push(autoId);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardAnimate =
    stage === "card-out" || stage === "leaving"
      ? { y: -150, opacity: 1, scale: 1 }
      : stage === "opening"
      ? { y: 10, opacity: 1, scale: 0.94 }
      : { y: 10, opacity: 0, scale: 0.94 };

  const showGleam = stage !== "closed";
  const showShimmer = stage === "opening" || stage === "card-out" || stage === "leaving";

  return (
    <AnimatePresence>
      {stage !== "leaving" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream"
          exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: "easeIn" }}
        >
          <div className="mb-8 text-center">
            <p className="font-body italic text-ink-soft tracking-[0.3em] text-xs sm:text-sm uppercase">
              Bir Davetiniz Var
            </p>
          </div>

          <button
            type="button"
            onClick={triggerOpen}
            disabled={stage !== "closed"}
            aria-label="Davetiyeyi aç"
            className="relative"
            style={{ perspective: 1200 }}
          >
            <div
              className={`relative w-[260px] h-[170px] sm:w-[320px] sm:h-[210px] ${
                stage === "closed" ? "animate-envelope-idle" : ""
              }`}
            >
              {/* Envelope silhouette — soft paper gradient with a hint of depth */}
              <div
                className="absolute inset-0 rounded-xl border border-gold shadow-[0_14px_34px_-14px_rgba(143,109,49,0.4)]"
                style={{
                  background: "radial-gradient(ellipse at 50% 35%, #fffdf8 0%, var(--color-cream) 55%, var(--color-cream-dark) 100%)",
                  boxShadow: "inset 0 0 24px rgba(143,109,49,0.06)",
                }}
              />

              {/* Embossed flourish above the seal */}
              <svg
                viewBox="0 0 200 60"
                className="absolute left-1/2 top-[8%] -translate-x-1/2 w-32 sm:w-40 opacity-80 pointer-events-none"
                style={{
                  filter:
                    "drop-shadow(1px 1px 1px rgba(255,255,255,0.75)) drop-shadow(-1px -1px 1px rgba(143,109,49,0.18))",
                }}
                fill="none"
              >
                <path
                  d="M100,8 C96,1 85,2 85,11 C85,18 100,26 100,26 C100,26 115,18 115,11 C115,2 104,1 100,8 Z"
                  fill="var(--color-cream-dark)"
                />
                <path
                  d="M100,26 C82,29 64,27 46,36 M62,31 C57,27 57,20 64,18"
                  stroke="var(--color-cream-dark)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M100,26 C118,29 136,27 154,36 M138,31 C143,27 143,20 136,18"
                  stroke="var(--color-cream-dark)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>

              {/* Inner pocket line — asymmetric, hand-drawn feel */}
              <svg
                viewBox="0 0 320 210"
                className="absolute inset-0 w-full h-full"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M14,198 Q130,112 170,96 Q238,120 306,198"
                  stroke="var(--color-gold-light)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>

              {/* Card that slides up out of the envelope */}
              <motion.div
                className="absolute left-1/2 top-2 w-[85%] h-[75%] -translate-x-1/2 rounded-md bg-cream shadow-[0_8px_24px_-12px_rgba(143,109,49,0.35)] border border-gold flex flex-col items-center justify-center px-4 z-10"
                initial={{ y: 10, opacity: 0, scale: 0.94 }}
                animate={cardAnimate}
                transition={{ type: "spring", stiffness: 100, damping: 16 }}
              >
                <p className="font-script text-2xl sm:text-3xl text-gold-dark">
                  {bride} &amp; {groom}
                </p>
                <span className="mt-1 h-px w-10 bg-gold-light" />
                <p className="mt-1 font-body text-[11px] sm:text-xs text-ink-soft tracking-widest uppercase">
                  {invitationConfig.event.dateLabel}
                </p>
              </motion.div>

              {/* Top flap that opens like a real envelope — thin gold line-art, asymmetric dip */}
              <motion.svg
                viewBox="0 0 320 210"
                className={`absolute inset-0 w-full h-full ${stage === "closed" ? "z-20" : "z-[5]"}`}
                preserveAspectRatio="none"
                style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
                animate={{ rotateX: stage === "closed" ? 0 : -180 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              >
                <path
                  d="M8,8 Q120,72 185,108 Q250,58 312,8 Z"
                  fill="var(--color-cream-dark)"
                  fillOpacity="0.96"
                  stroke="var(--color-gold)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </motion.svg>

              {/* Golden light burst from the seal, once ignited */}
              {showGleam && (
                <motion.div
                  className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-25 w-20 h-20 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%)",
                  }}
                  initial={{ scale: 0, opacity: 0.85 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              )}

              {/* One-shot golden shimmer sweep as the flap lifts */}
              {showShimmer && (
                <div
                  className="absolute inset-0 z-40 pointer-events-none animate-shimmer-once"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                  }}
                />
              )}

              {/* 5-second countdown ring around the seal */}
              {stage === "closed" && (
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 64 64"
                  className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--color-gold-light)"
                    strokeOpacity="0.25"
                    strokeWidth="2"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    className="animate-ring-fill"
                  />
                </svg>
              )}

              {/* Seal — glossy wax, pressed initials */}
              <motion.div
                className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center animate-seal-glow"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #9a3346 0%, #6b1f2e 60%, #4d1520 100%)",
                  borderRadius: "48% 52% 51% 49% / 53% 47% 53% 47%",
                }}
                animate={{
                  opacity: stage === "closed" ? 1 : 0,
                  scale: stage === "closed" ? 1 : 1.15,
                  rotate: stage === "closed" ? 0 : 25,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span
                  className="font-script text-cream text-xl leading-none"
                  style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.4), -1px -1px 1px rgba(255,255,255,0.15)" }}
                >
                  {initials}
                </span>

                {/* Tap-to-open icon badge, pinned to the lower edge of the seal */}
                {stage === "closed" && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-cream border border-gold-light/70 shadow-sm">
                    <FiMail className="text-gold-dark" size={11} />
                  </span>
                )}
              </motion.div>
            </div>
          </button>

          {stage === "closed" && (
            <motion.div
              className="mt-10 inline-flex items-center rounded-full border border-gold-light/60 bg-cream/70 backdrop-blur-sm px-6 py-2.5"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="font-body text-ink-soft text-xs sm:text-sm tracking-[0.15em] uppercase">
                Davetiyeyi açmak için dokunun
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
