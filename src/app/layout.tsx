import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FilterProvider } from "@/context/FilterContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interregdatabas för svenska partners",
  description: "Dashboard för Interreg-data om svenska projektpartners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.className}>
      <body className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <FilterProvider>{children}</FilterProvider>
      </body>
    </html>
  );
}
