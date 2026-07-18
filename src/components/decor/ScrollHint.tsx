"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScrollHint({ visible }: { visible: boolean }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setHasScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && !hasScrolled;

  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: show ? 0.6 : 0.3, delay: show ? 1.4 : 0 }}
      aria-hidden
    >
      <svg width="24" height="38" viewBox="0 0 24 38" fill="none">
        <rect x="1" y="1" width="22" height="36" rx="11" stroke="currentColor" strokeWidth="1.5" />
        <motion.circle
          cx="12"
          r="2.5"
          fill="currentColor"
          animate={{ cy: [9, 23], opacity: [1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <span className="font-body text-[11px] tracking-[0.3em] uppercase">Kaydırın</span>
    </motion.div>
  );
}
