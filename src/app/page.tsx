"use client";

import { useState } from "react";
import Envelope from "@/components/Envelope";
import Hero from "@/components/Hero";
import EventDetails from "@/components/EventDetails";
import GuestGallery from "@/components/GuestGallery";
import Footer from "@/components/Footer";
import MusicToggle from "@/components/MusicToggle";
import FloatingPetals from "@/components/decor/FloatingPetals";

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Envelope onOpen={() => setOpened(true)} />

      <main className="relative">
        <FloatingPetals />
        <div className="relative z-10">
          <Hero revealed={opened} />
          <EventDetails />
          <GuestGallery />
          <Footer />
        </div>
      </main>

      <MusicToggle autoStart={opened} />
    </>
  );
}
