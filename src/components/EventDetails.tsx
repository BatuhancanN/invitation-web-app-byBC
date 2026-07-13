"use client";

import { motion, type Variants } from "framer-motion";
import { FiMapPin, FiClock, FiNavigation } from "react-icons/fi";
import { invitationConfig } from "@/config/invitation";
import Divider from "@/components/decor/Divider";
import Countdown from "@/components/Countdown";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function buildOsmEmbedSrc(lat: number, lng: number, delta = 0.01) {
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function EventDetails() {
  const { venue, event } = invitationConfig;
  const mapEmbedSrc = buildOsmEmbedSrc(venue.lat, venue.lng);

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
      >
        <p className="font-body tracking-[0.4em] text-xs sm:text-sm uppercase text-gold-dark">
          Ne Zaman &amp; Nerede
        </p>
        <h2 className="mt-4 font-serif text-3xl sm:text-4xl text-ink">
          Bizi Bulabileceğiniz Yer ve Zaman
        </h2>
        <Divider />
      </motion.div>

      <motion.div
        className="max-w-2xl mx-auto mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
      >
        <Countdown isoDate={event.isoDate} />
      </motion.div>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 mb-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="rounded-lg border border-gold-light/50 bg-cream-dark/40 p-8 text-center flex flex-col items-center gap-3"
        >
          <FiClock className="text-gold-dark" size={28} />
          <h3 className="font-serif text-xl text-ink">Tarih &amp; Saat</h3>
          <p className="font-body text-lg text-ink-soft">
            {event.dateLabel} · {event.dayLabel}
          </p>
          <p className="font-body text-lg text-gold-dark">{event.timeLabel}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-gold-light/50 bg-cream-dark/40 p-8 text-center flex flex-col items-center gap-3"
        >
          <FiMapPin className="text-gold-dark" size={28} />
          <h3 className="font-serif text-xl text-ink">Mekan</h3>
          <p className="font-body text-lg text-ink-soft">{venue.name}</p>
          <p className="font-body text-sm text-ink-soft/80 max-w-xs">{venue.address}</p>
        </motion.div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
      >
        <div className="rounded-lg overflow-hidden border border-gold-light/50 shadow-[0_10px_40px_-15px_rgba(184,147,74,0.35)]">
          <iframe
            src={mapEmbedSrc}
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mekan Konumu"
          />
        </div>
        <div className="flex justify-center mt-6">
          <a
            href={venue.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 font-body text-sm tracking-wide uppercase text-gold-dark hover:bg-gold hover:text-cream transition-colors"
          >
            <FiNavigation size={16} />
            Yol Tarifi Al
          </a>
        </div>
      </motion.div>
    </section>
  );
}
