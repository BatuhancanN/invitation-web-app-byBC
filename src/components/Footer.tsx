"use client";

import { motion, type Variants } from "framer-motion";
import { invitationConfig } from "@/config/invitation";
import Divider from "@/components/decor/Divider";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Footer() {
  const { bride, groom, brideFamily, groomFamily } = invitationConfig.couple;

  return (
    <motion.footer
      className="relative px-6 py-20 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <p className="font-script text-3xl sm:text-4xl text-gold-dark">
        {bride} &amp; {groom}
      </p>
      <Divider />
      <p className="font-body text-ink-soft text-sm tracking-wide max-w-md mx-auto">
        {brideFamily} &amp; {groomFamily}
      </p>
      <p className="mt-6 font-body text-xs tracking-[0.3em] uppercase text-ink-soft/70">
        Sizi aramızda görmekten mutluluk duyarız
      </p>
    </motion.footer>
  );
}
