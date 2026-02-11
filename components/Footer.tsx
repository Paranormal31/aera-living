"use client";

import { ArrowRight, Instagram, Mail, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  useEffect(() => {
    if (!isEmailOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsEmailOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEmailOpen]);

  return (
    <footer className="bg-[#2b2b28] text-white">
      {/* Partner CTA */}
      <section className="py-32 text-center">
        <h2 className="font-serif text-4xl md:text-5xl">
          Partner With AeraLiving
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-neutral-300 leading-relaxed">
          Join our profit-sharing program and earn passive income while we
          manage your property with excellence.
        </p>

        <Link href="/interior-design#start-project">
          <button className="mt-10 inline-flex items-center gap-3 rounded-full bg-white text-black px-8 py-4 font-medium hover:scale-105 transition">
            Learn More <ArrowRight size={16} />
          </button>
        </Link>
      </section>

      {/* Footer Content */}
      <div className="border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/aeraliving-logo.jpeg"
                alt="AeraLiving logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-white/15"
              />
              <span className="font-serif text-xl">AeraLiving</span>
            </div>

            <p className="mt-4 text-sm text-neutral-400 max-w-xs">
              Curated luxury stays across breathtaking locations, designed for
              unforgettable experiences.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-4 font-medium">EXPLORE</p>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link href="/locations">Our Locations</Link>
              </li>
              <li>
                <Link href="/interior-design">Interior Design</Link>
              </li>
              <li>
                <Link href="/partner-portal">Partner With Us</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-4 font-medium">SUPPORT</p>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>Contact Us</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="mb-4 font-medium">CONNECT</p>
            <div className="flex gap-4 mb-4">
              <a
                href="https://www.instagram.com/aeraliving.in/"
                target="_blank"
                rel="noreferrer"
                aria-label="AeraLiving on Instagram"
                className="transition opacity-80 hover:opacity-100"
              >
                <Instagram />
              </a>
              <button
                type="button"
                onClick={() => setIsEmailOpen(true)}
                aria-label="Email AeraLiving"
                className="transition opacity-80 hover:opacity-100"
              >
                <Mail />
              </button>
            </div>
            <p className="text-sm text-neutral-400">hello@aeraliving.com</p>
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-neutral-500">
          © 2026 AeraLiving. All rights reserved.
        </p>
      </div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-all ${
          isEmailOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isEmailOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${
            isEmailOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsEmailOpen(false)}
        />
        <div
          className={`relative w-full max-w-md rounded-3xl border border-white/10 bg-[#1f1f1c] p-8 text-center shadow-2xl transition-all ${
            isEmailOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Email address"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Sparkles size={26} />
          </div>
          <h3 className="font-serif text-2xl">Reach us directly</h3>
          <p className="mt-3 text-sm text-neutral-300">
            We will get back to you within 24 hours.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-medium">
            aeraliving.llp@gmail.com
          </div>
          <button
            type="button"
            onClick={() => setIsEmailOpen(false)}
            className="mt-6 w-full rounded-full bg-white text-black px-6 py-3 text-sm font-medium transition hover:scale-[1.01]"
          >
            Close
          </button>
        </div>
      </div>
    </footer>
  );
}
