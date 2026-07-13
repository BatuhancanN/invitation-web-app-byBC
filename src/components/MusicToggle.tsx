"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMusic } from "react-icons/fi";
import { invitationConfig } from "@/config/invitation";

export default function MusicToggle({ autoStart }: { autoStart: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!autoStart || !audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [autoStart]);

  const toggle = () => {
    if (!audioRef.current || !available) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={invitationConfig.music.src}
        loop
        onError={() => setAvailable(false)}
      />
      {available && (
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Müziği duraklat" : "Müziği çal"}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-cream border border-gold-light/70 shadow-[0_6px_20px_-6px_rgba(184,147,74,0.5)] flex items-center justify-center text-gold-dark"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: autoStart ? 1 : 0, scale: autoStart ? 1 : 0.7 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.span
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          >
            <FiMusic size={18} />
          </motion.span>
        </motion.button>
      )}
    </>
  );
}
