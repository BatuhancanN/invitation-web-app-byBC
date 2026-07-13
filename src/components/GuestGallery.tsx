"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FiUploadCloud, FiHeart, FiRefreshCw, FiX } from "react-icons/fi";
import { invitationConfig } from "@/config/invitation";
import Divider from "@/components/decor/Divider";
import type { GuestPhoto } from "@/lib/gallery-store";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const PIN_STORAGE_KEY = "guestUploadPin";

export default function GuestGallery() {
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [pin, setPin] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GuestPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const enabled = invitationConfig.features.guestUpload;
  const autoRefresh = invitationConfig.features.autoRefreshGallery;
  const autoRefreshMs = invitationConfig.features.autoRefreshIntervalSeconds * 1000;

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data?.photos)) {
        setPhotos(data.photos);
      }
    } catch {
      // sessizce yok say, kullanıcı "Yenile" ile tekrar deneyebilir
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const restorePin = setTimeout(() => {
      const storedPin = window.sessionStorage.getItem(PIN_STORAGE_KEY);
      if (storedPin) setPin(storedPin);
    }, 0);

    const initialFetch = setTimeout(fetchPhotos, 0);
    const intervalId = autoRefresh ? setInterval(fetchPhotos, autoRefreshMs) : undefined;

    return () => {
      clearTimeout(restorePin);
      clearTimeout(initialFetch);
      if (intervalId) clearInterval(intervalId);
    };
  }, [enabled, autoRefresh, autoRefreshMs]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  };

  if (!enabled) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus("error");
      setMessage("Lütfen bir fotoğraf seçin.");
      return;
    }

    setStatus("uploading");
    setMessage("");

    try {
      const body = new FormData();
      body.set("pin", pin);
      body.set("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Bir şeyler ters gitti, tekrar deneyin.");
        return;
      }

      window.sessionStorage.setItem(PIN_STORAGE_KEY, pin);
      setPhotos((prev) => [...prev, { url: data.url, uploadedAt: new Date().toISOString() }]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus("success");
      setMessage("Teşekkürler! Fotoğrafınız galeriye eklendi.");
    } catch {
      setStatus("error");
      setMessage("Bağlantı hatası, lütfen tekrar deneyin.");
    }
  };

  return (
    <section className="relative px-6 py-24 sm:py-32 bg-cream-dark/30">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
      >
        <p className="font-body tracking-[0.4em] text-xs sm:text-sm uppercase text-gold-dark">
          Anılarımız
        </p>
        <h2 className="mt-4 font-serif text-3xl sm:text-4xl text-ink">
          Fotoğraflarınızı Bizimle Paylaşın
        </h2>
        <Divider />
        <p className="font-body text-ink-soft max-w-md mx-auto">
          O gün çektiğiniz kareleri buradan yükleyerek anılarımıza ortak olun.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto flex flex-col gap-4 mb-16 rounded-lg border border-gold-light/50 bg-cream p-6 sm:p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
      >
        <div>
          <label className="block font-body text-sm text-ink-soft mb-1" htmlFor="guest-pin">
            Paylaşım Kodu
          </label>
          <input
            id="guest-pin"
            type="password"
            autoComplete="off"
            autoCapitalize="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            className="w-full rounded-md border border-gold-light/60 bg-cream px-4 py-2 font-body text-ink outline-none focus:border-gold"
            placeholder="Davetiyede paylaşılan kod"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-ink-soft mb-1" htmlFor="guest-file">
            Fotoğraf
          </label>
          <input
            id="guest-file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="w-full rounded-md border border-gold-light/60 bg-cream px-4 py-2 font-body text-ink outline-none focus:border-gold file:mr-3 file:rounded file:border-0 file:bg-gold-light/40 file:px-3 file:py-1 file:font-body"
          />
        </div>

        <button
          type="submit"
          disabled={status === "uploading"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-body text-sm tracking-wide uppercase text-cream transition-colors hover:bg-gold-dark disabled:opacity-60"
        >
          <FiUploadCloud size={16} />
          {status === "uploading" ? "Yükleniyor..." : "Fotoğrafı Yükle"}
        </button>

        {message && (
          <p
            className={`text-center font-body text-sm ${
              status === "error" ? "text-red-700" : "text-gold-dark"
            }`}
          >
            {message}
          </p>
        )}
      </motion.form>

      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-full border border-gold-light/60 px-5 py-2 font-body text-sm text-gold-dark hover:bg-gold-light/20 transition-colors disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} size={14} />
          {refreshing ? "Yenileniyor..." : "Galeriyi Yenile"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {photos.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 text-ink-soft">
            <FiHeart className="text-gold-light" size={28} />
            <p className="font-body">Henüz paylaşılan fotoğraf yok, ilk paylaşan siz olun.</p>
          </div>
        )}
        {photos.map((photo, i) => (
          <motion.button
            type="button"
            key={photo.url + i}
            onClick={() => setSelectedPhoto(photo)}
            className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gold-light/50 shadow-[0_10px_30px_-12px_rgba(184,147,74,0.35)] cursor-zoom-in"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            transition={{ delay: (i % 3) * 0.1 }}
          >
            <Image
              src={photo.url}
              alt="Misafir paylaşımı"
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.img
              src={selectedPhoto.url}
              alt="Misafir paylaşımı - tam boyut"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Kapat"
              className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center text-ink hover:bg-cream transition-colors"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
