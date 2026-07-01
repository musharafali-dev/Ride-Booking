import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "RideSphere - Multi-Vehicle Rental & Tourism Booking Platform",
  description: "Book city rides, rent self-drive vehicles, bikes, luxury cars, tourist buses, and customize tour packages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-[#020617] text-[#f8fafc] min-h-screen flex flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
