"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/locations", label: "Locations" },
    { path: "/interior-design", label: "Interior Design" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-white">A</span>
            </div>
            <span className="font-['Cormorant'] text-2xl font-semibold tracking-[-0.02em]">
              AeraLiving
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-sm font-normal tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://wa.me/918544337974?text=Hi%2C%0AI%20would%20like%20to%20book%20a%20property%20from%20Aera%20Living.%20I%20have%20some%20questions%20about%20it."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="rounded-full font-medium tracking-wide px-6">
                Book a Stay
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm text-gray-600 hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <a
                href="https://wa.me/918544337974?text=Hi%2C%0AI%20would%20like%20to%20book%20a%20property%20from%20Aera%20Living.%20I%20have%20some%20questions%20about%20it."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="rounded-full w-full">Book a Stay</Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
