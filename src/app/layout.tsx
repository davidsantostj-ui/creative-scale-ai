import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Scale AI",
  description: "Gerador de criativos para TikTok Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}<Toaster richColors position="bottom-right" /></body>
    </html>
  );
}