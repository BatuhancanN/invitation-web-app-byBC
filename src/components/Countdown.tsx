"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { invitationConfig } from "@/config/invitation";

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const units: { key: keyof ReturnType<typeof getTimeLeft>; label: string }[] = [
  { key: "days", label: "Gün" },
  { key: "hours", label: "Saat" },
  { key: "minutes", label: "Dakika" },
  { key: "seconds", label: "Saniye" },
];

export default function Countdown({ isoDate }: { isoDate: string }) {
  const target = new Date(isoDate).getTime();
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const tick = () => {
      setTimeLeft(getTimeLeft(target));
      setIsPast(Date.now() >= target);
    };
    const id = setInterval(tick, 1000);
    const kickoff = setTimeout(tick, 0);
    return () => {
      clearInterval(id);
      clearTimeout(kickoff);
    };
  }, [target]);

  return (
    <AnimatePresence mode="wait">
      {isPast ? (
        <motion.div
          key="thank-you"
          className="flex flex-col items-center gap-3 text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FiHeart className="text-gold" size={28} />
          <p className="font-serif text-xl sm:text-2xl text-gold-dark">
            {invitationConfig.event.postEventTitle}
          </p>
          <p className="font-body text-ink-soft">{invitationConfig.event.postEventNote}</p>
        </motion.div>
      ) : (
        <motion.div
          key="countdown"
          className="flex items-center justify-center gap-3 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {units.map((unit, i) => (
            <motion.div
              key={unit.key}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gold-light/70 bg-cream flex items-center justify-center shadow-[0_4px_20px_-8px_rgba(184,147,74,0.5)]">
                <span className="font-serif text-xl sm:text-2xl text-gold-dark tabular-nums">
                  {timeLeft ? String(timeLeft[unit.key]).padStart(2, "0") : "--"}
                </span>
              </div>
              <span className="mt-2 font-body text-xs sm:text-sm tracking-widest uppercase text-ink-soft">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
