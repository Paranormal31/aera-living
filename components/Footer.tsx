import { ArrowRight, Instagram, Facebook, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
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

        <Link href="/partner-portal">
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
              <div className="w-10 h-10 bg-[#9aaa94] rounded-full flex items-center justify-center font-semibold">
                A
              </div>
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
              <Instagram />
              <Facebook />
              <Mail />
            </div>
            <p className="text-sm text-neutral-400">hello@aeraliving.com</p>
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-neutral-500">
          © 2026 AeraLiving. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
