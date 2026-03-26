import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Eco360 AI — ESG Intelligence Platform",
  description: "Piattaforma AI per la gestione e il monitoraggio ESG aziendale",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
