import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aera Living | Luxury Stays in Dehradun",
  description: "Luxury stays and interior design by Aera Living",
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
      </body>
    </html>
  );
}
