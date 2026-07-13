"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { invitationConfig } from "@/config/invitation";

type Stage = "closed" | "opening" | "card-out" | "leaving";

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [stage, setStage] = useState<Stage>("closed");
  const { bride, groom } = invitationConfig.couple;
  const initials = `${bride[0]}${groom[0]}`;

  const handleClick = () => {
    if (stage !== "closed") return;
    setStage("opening");

    window.setTimeout(() => {
      setStage("card-out");
      confetti({
        particleCount: 90,
        spread: 75,
        startVelocity: 32,
        gravity: 0.9,
        colors: ["#b8934a", "#d4b876", "#fdf8f0", "#8f6d31"],
        origin: { y: 0.55 },
      });
    }, 650);

    window.setTimeout(() => {
      setStage("leaving");
    }, 1650);

    window.setTimeout(() => {
      onOpen();
    }, 2250);
  };

  return (
    <AnimatePresence>
      {stage !== "leaving" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="mb-8 text-center">
            <p className="font-body italic text-ink-soft tracking-[0.3em] text-xs sm:text-sm uppercase">
              Bir Davetiniz Var
            </p>
          </div>

          <button
            type="button"
            onClick={handleClick}
            disabled={stage !== "closed"}
            aria-label="Davetiyeyi aç"
            className="relative"
            style={{ perspective: 1200 }}
          >
            <div className="relative w-[260px] h-[170px] sm:w-[320px] sm:h-[210px]">
              {/* Envelope back pocket */}
              <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-cream-dark to-[#ecdfc2] shadow-[0_20px_60px_-15px_rgba(143,109,49,0.45)] border border-gold-light/60" />

              {/* Bottom triangular flap (always visible, behind card) */}
              <div
                className="absolute inset-x-0 bottom-0 h-full"
                style={{
                  clipPath: "polygon(0% 100%, 50% 40%, 100% 100%)",
                  background:
                    "linear-gradient(to top, #e9dab8, #f5ecdb)",
                }}
              />

              {/* Card that slides up out of the envelope */}
              <motion.div
                className="absolute left-1/2 top-2 w-[85%] h-[75%] -translate-x-1/2 rounded-[2px] bg-cream shadow-md border border-gold-light/70 flex flex-col items-center justify-center px-4 z-10"
                initial={{ y: 10, opacity: 0 }}
                animate={
                  stage === "card-out"
                    ? { y: -150, opacity: 1 }
                    : stage === "opening"
                    ? { y: 10, opacity: 1 }
                    : { y: 10, opacity: 0 }
                }
                transition={{ duration: 0.9, ease: "easeOut" }}
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
                animate={{
                  rotateX: stage === "closed" ? 0 : -180,
                }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              />

              {/* Wax seal */}
              <motion.div
                className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-gradient-to-br from-gold-light to-gold-dark shadow-md flex items-center justify-center border border-gold-dark/40"
                animate={{ opacity: stage === "closed" ? 1 : 0, scale: stage === "closed" ? 1 : 0.6 }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-script text-cream text-lg leading-none">
                  {initials}
                </span>
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
