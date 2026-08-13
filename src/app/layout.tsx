import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import PlayerBar from "@/components/PlayerBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chordia · Stream Music",
  description:
    "A modern music streaming experience — browse albums, build queues, and play tracks from your browser.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <PlayerProvider>
          <MobileNav />
          <div className="flex min-h-screen w-full flex-1">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden pb-32 md:pb-32">
              {children}
            </main>
          </div>
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
