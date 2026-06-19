import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aera Living | Luxury Stays in Dehradun",
  description: "Luxury stays and interior design by Aera Living",
  icons: {
    icon: "/brand/aeraliving-logo.jpeg",
    shortcut: "/brand/aeraliving-logo.jpeg",
    apple: "/brand/aeraliving-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Fixed Navigation */}
        <Navigation />

        {/* Page Content */}
        <main className="pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
