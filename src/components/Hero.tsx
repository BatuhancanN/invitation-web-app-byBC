"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { invitationConfig } from "@/config/invitation";
import CornerOrnament from "@/components/decor/CornerOrnament";
import Divider from "@/components/decor/Divider";
import ScrollHint from "@/components/decor/ScrollHint";

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Hero({ revealed }: { revealed: boolean }) {
  const { bride, groom } = invitationConfig.couple;
  const { title, dateLabel, dayLabel, timeLabel, invitationNote } = invitationConfig.event;
  const hasNudgedRef = useRef(false);

  useEffect(() => {
    if (!revealed || hasNudgedRef.current) return;

    const timer = window.setTimeout(() => {
      if (hasNudgedRef.current || window.scrollY > 0) return;
      hasNudgedRef.current = true;

      const distance = 50;
      const downMs = 500;
      const holdMs = 150;
      const upMs = 500;
      const total = downMs + holdMs + upMs;
      const start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        let y = 0;
        if (elapsed < downMs) {
          y = distance * easeInOutQuad(elapsed / downMs);
        } else if (elapsed < downMs + holdMs) {
          y = distance;
        } else if (elapsed < total) {
          y = distance * (1 - easeInOutQuad((elapsed - downMs - holdMs) / upMs));
        }
        window.scrollTo(0, y);
        if (elapsed < total) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [revealed]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <CornerOrnament className="absolute top-4 left-4 w-16 h-16 sm:w-24 sm:h-24" />
      <CornerOrnament className="absolute top-4 right-4 w-16 h-16 sm:w-24 sm:h-24" flip="h" />
      <CornerOrnament className="absolute bottom-4 left-4 w-16 h-16 sm:w-24 sm:h-24" flip="v" />
      <CornerOrnament className="absolute bottom-4 right-4 w-16 h-16 sm:w-24 sm:h-24" flip="hv" />

      <motion.div
        className="relative z-10 max-w-xl w-full text-center"
        initial="hidden"
        animate={revealed ? "visible" : "hidden"}
        variants={container}
      >
        <motion.p
          variants={item}
          className="font-body tracking-[0.4em] text-xs sm:text-sm uppercase text-gold-dark"
        >
          {title}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 font-script text-5xl sm:text-7xl text-ink text-shadow-gold leading-tight"
        >
          {bride} <span className="text-gold">&amp;</span> {groom}
        </motion.h1>

        <motion.div variants={item}>
          <Divider />
        </motion.div>

        <motion.p
          variants={item}
          className="font-body text-lg sm:text-xl text-ink-soft leading-relaxed px-4"
        >
          {invitationNote}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 inline-flex flex-col items-center gap-1 rounded-full border border-gold-light/60 px-8 py-4 bg-cream/60 backdrop-blur-sm"
        >
          <span className="font-serif text-2xl sm:text-3xl text-gold-dark">
            {dateLabel}
          </span>
          <span className="font-body text-sm tracking-widest uppercase text-ink-soft">
            {dayLabel} · {timeLabel}
          </span>
        </motion.div>
      </motion.div>

      <ScrollHint visible={revealed} />
    </section>
  );
}
