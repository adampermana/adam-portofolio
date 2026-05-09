import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ADAM PERMANA | Mobile App Developer",
  description: "Portfolio of Adam Permana, Mobile App Developer specializing in Flutter, React & Next.js. East Jakarta, Indonesia.",
  icons: {
    icon: "/logo-adam.png",
    shortcut: "/logo-adam.png",
    apple: "/logo-adam.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} antialiased no-scrollbar`}
    >
      <body className="bg-space-black text-soft-white font-inter bg-noise">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
