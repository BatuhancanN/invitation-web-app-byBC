"use client";

import { motion, type Variants } from "framer-motion";
import { invitationConfig } from "@/config/invitation";
import CornerOrnament from "@/components/decor/CornerOrnament";
import Divider from "@/components/decor/Divider";

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

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.4, duration: 0.6 }, y: { duration: 1.8, repeat: Infinity } }}
        aria-hidden
      >
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
          <path d="M10 0V28M10 28L2 20M10 28L18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </section>
  );
}
