import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aera Living | Luxury Stays in Dehradun",
  description: "Luxury Airbnb stays in Dehradun by Aera Living",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Fixed Navbar */}
        <Navigation />

        {/* Page content offset for fixed navbar */}
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
