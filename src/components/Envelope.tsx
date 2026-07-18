"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { invitationConfig } from "@/config/invitation";

type Stage = "closed" | "igniting" | "opening" | "card-out" | "leaving";

const GOLD_COLORS = ["#b8934a", "#d4b876", "#fdf8f0", "#8f6d31"];
const RING_CIRCUMFERENCE = 151; // 2 * PI * 24, matches .animate-ring-fill in globals.css

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
              {/* Envelope back pocket */}
              <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-cream-dark to-[#ecdfc2] shadow-[0_20px_60px_-15px_rgba(143,109,49,0.45)] border border-gold-light/60" />

              {/* Bottom triangular flap (always visible, behind card) */}
              <div
                className="absolute inset-x-0 bottom-0 h-full"
                style={{
                  clipPath: "polygon(0% 100%, 50% 40%, 100% 100%)",
                  background: "linear-gradient(to top, #e9dab8, #f5ecdb)",
                }}
              />

              {/* Card that slides up out of the envelope */}
              <motion.div
                className="absolute left-1/2 top-2 w-[85%] h-[75%] -translate-x-1/2 rounded-[2px] bg-cream shadow-md border border-gold-light/70 flex flex-col items-center justify-center px-4 z-10"
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

              {/* Top flap that opens like a real envelope */}
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 origin-top z-20"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                  background: "linear-gradient(to bottom, #d9bf8a, #e9dab8)",
                  transformStyle: "preserve-3d",
                }}
                animate={{ rotateX: stage === "closed" ? 0 : -180 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              />

              {/* Golden light burst from the seal, once ignited */}
              {showGleam && (
                <motion.div
                  className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-25 w-16 h-16 rounded-full pointer-events-none"
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
                  width="64"
                  height="64"
                  viewBox="0 0 56 56"
                  className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="var(--color-gold-light)"
                    strokeOpacity="0.25"
                    strokeWidth="2"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    className="animate-ring-fill"
                  />
                </svg>
              )}

              {/* Wax seal */}
              <motion.div
                className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-gradient-to-br from-gold-light to-gold-dark shadow-md flex items-center justify-center border border-gold-dark/40 animate-seal-glow"
                animate={{
                  opacity: stage === "closed" ? 1 : 0,
                  scale: stage === "closed" ? 1 : 1.15,
                  rotate: stage === "closed" ? 0 : 25,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span className="font-script text-cream text-lg leading-none">{initials}</span>
              </motion.div>
            </div>
          </button>

          <motion.p
            className="mt-10 font-body text-ink-soft text-sm tracking-wide"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {stage === "closed" ? "Açmak için dokunun" : ""}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
