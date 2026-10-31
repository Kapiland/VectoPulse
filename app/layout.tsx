import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusSignal AI — Never Miss an Opportunity. Find Your People.",
  description:
    "AI-powered campus opportunity intelligence and collaboration platform converting scattered campus notices into structured opportunities and connecting Indian college students with complementary teammates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-blue-600/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
