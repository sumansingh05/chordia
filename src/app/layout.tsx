import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import { LibraryProvider } from "@/context/LibraryContext";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import PlayerBar from "@/components/PlayerBar";
import QueuePanel from "@/components/QueuePanel";
import NowPlaying from "@/components/NowPlaying";

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
    "A modern music streaming experience — browse albums, build queues, save playlists, and stream songs live.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <PlayerProvider>
          <LibraryProvider>
            <MobileNav />
            <div className="flex min-h-screen w-full flex-col md:flex-row md:gap-2 md:p-2">
              <Sidebar />
              <main className="min-w-0 flex-1 overflow-x-hidden rounded-lg bg-surface pb-36 md:pb-36">
                {children}
              </main>
            </div>
            <PlayerBar />
            <QueuePanel />
            <NowPlaying />
          </LibraryProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}