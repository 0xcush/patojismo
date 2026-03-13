import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patojismo — Calibración",
  description: "Coffee calibration tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
