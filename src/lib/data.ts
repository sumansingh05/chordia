import type { Album, Track } from "./types";

const song = (n: number) =>
  `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const albums: Album[] = [
  {
    id: "midnight-drive",
    title: "Midnight Drive",
    artist: "Neon Frequencies",
    year: 2024,
    genre: "Synthwave",
    color: "#7c3aed",
    colorTo: "#db2777",
    tracks: [
      { id: "md-1", title: "Neon Skies", artist: "Neon Frequencies", albumId: "midnight-drive", duration: 372, audioUrl: song(1) },
      { id: "md-2", title: "Cruise Control", artist: "Neon Frequencies", albumId: "midnight-drive", duration: 391, audioUrl: song(2) },
      { id: "md-3", title: "Afterglow", artist: "Neon Frequencies", albumId: "midnight-drive", duration: 260, audioUrl: song(3) },
      { id: "md-4", title: "Overdrive", artist: "Neon Frequencies", albumId: "midnight-drive", duration: 333, audioUrl: song(4) },
      { id: "md-5", title: "Palm Vistas", artist: "Neon Frequencies", albumId: "midnight-drive", duration: 480, audioUrl: song(5) },
    ],
  },
  {
    id: "paper-planes",
    title: "Paper Planes",
    artist: "The Harbor Lights",
    year: 2023,
    genre: "Indie Folk",
    color: "#f59e0b",
    colorTo: "#ef4444",
    tracks: [
      { id: "pp-1", title: "Riverside", artist: "The Harbor Lights", albumId: "paper-planes", duration: 455, audioUrl: song(6) },
      { id: "pp-2", title: "Long Way Home", artist: "The Harbor Lights", albumId: "paper-planes", duration: 374, audioUrl: song(7) },
      { id: "pp-3", title: "Wildflowers", artist: "The Harbor Lights", albumId: "paper-planes", duration: 383, audioUrl: song(8) },
      { id: "pp-4", title: "Porchlight", artist: "The Harbor Lights", albumId: "paper-planes", duration: 426, audioUrl: song(9) },
    ],
  },
  {
    id: "electric-bloom",
    title: "Electric Bloom",
    artist: "Sera Volta",
    year: 2024,
    genre: "Electronic",
    color: "#06b6d4",
    colorTo: "#3b82f6",
    tracks: [
      { id: "eb-1", title: "Circuit Hearts", artist: "Sera Volta", albumId: "electric-bloom", duration: 365, audioUrl: song(10) },
      { id: "eb-2", title: "Static Garden", artist: "Sera Volta", albumId: "electric-bloom", duration: 354, audioUrl: song(11) },
      { id: "eb-3", title: "Synthetic Dawn", artist: "Sera Volta", albumId: "electric-bloom", duration: 355, audioUrl: song(12) },
      { id: "eb-4", title: "Bloom Protocol", artist: "Sera Volta", albumId: "electric-bloom", duration: 369, audioUrl: song(13) },
    ],
  },
  {
    id: "golden-hour",
    title: "Golden Hour",
    artist: "Marlow & June",
    year: 2022,
    genre: "Acoustic",
    color: "#f97316",
    colorTo: "#fbbf24",
    tracks: [
      { id: "gh-1", title: "First Light", artist: "Marlow & June", albumId: "golden-hour", duration: 368, audioUrl: song(14) },
      { id: "gh-2", title: "Honey", artist: "Marlow & June", albumId: "golden-hour", duration: 396, audioUrl: song(15) },
      { id: "gh-3", title: "Sundial", artist: "Marlow & June", albumId: "golden-hour", duration: 453, audioUrl: song(16) },
      { id: "gh-4", title: "Warm Milk", artist: "Marlow & June", albumId: "golden-hour", duration: 372, audioUrl: song(1) },
    ],
  },
  {
    id: "low-gravity",
    title: "Low Gravity",
    artist: "Orbital Pines",
    year: 2025,
    genre: "Ambient",
    color: "#10b981",
    colorTo: "#0ea5e9",
    tracks: [
      { id: "lg-1", title: "Zero G", artist: "Orbital Pines", albumId: "low-gravity", duration: 391, audioUrl: song(2) },
      { id: "lg-2", title: "Stardrift", artist: "Orbital Pines", albumId: "low-gravity", duration: 260, audioUrl: song(3) },
      { id: "lg-3", title: "Solar Wind", artist: "Orbital Pines", albumId: "low-gravity", duration: 333, audioUrl: song(4) },
      { id: "lg-4", title: "Atmospheric", artist: "Orbital Pines", albumId: "low-gravity", duration: 480, audioUrl: song(5) },
    ],
  },
  {
    id: "city-lights",
    title: "City Lights",
    artist: "Velvet Static",
    year: 2021,
    genre: "Lo-fi Hip Hop",
    color: "#8b5cf6",
    colorTo: "#ec4899",
    tracks: [
      { id: "cl-1", title: "Late Night Taxi", artist: "Velvet Static", albumId: "city-lights", duration: 455, audioUrl: song(6) },
      { id: "cl-2", title: "Rain on Glass", artist: "Velvet Static", albumId: "city-lights", duration: 374, audioUrl: song(7) },
      { id: "cl-3", title: "Metro Dreams", artist: "Velvet Static", albumId: "city-lights", duration: 383, audioUrl: song(8) },
      { id: "cl-4", title: "Skyscraper", artist: "Velvet Static", albumId: "city-lights", duration: 426, audioUrl: song(9) },
    ],
  },
  {
    id: "velvet-sky",
    title: "Velvet Sky",
    artist: "Aurora Waves",
    year: 2023,
    genre: "Chillout",
    color: "#6366f1",
    colorTo: "#a855f7",
    tracks: [
      { id: "vs-1", title: "Dusk", artist: "Aurora Waves", albumId: "velvet-sky", duration: 365, audioUrl: song(10) },
      { id: "vs-2", title: "Horizon", artist: "Aurora Waves", albumId: "velvet-sky", duration: 354, audioUrl: song(11) },
      { id: "vs-3", title: "Waves", artist: "Aurora Waves", albumId: "velvet-sky", duration: 355, audioUrl: song(12) },
      { id: "vs-4", title: "Twilight", artist: "Aurora Waves", albumId: "velvet-sky", duration: 369, audioUrl: song(13) },
    ],
  },
  {
    id: "raw-signal",
    title: "Raw Signal",
    artist: "The Analog Kids",
    year: 2024,
    genre: "Alternative Rock",
    color: "#ef4444",
    colorTo: "#f97316",
    tracks: [
      { id: "rs-1", title: "Static Shock", artist: "The Analog Kids", albumId: "raw-signal", duration: 368, audioUrl: song(14) },
      { id: "rs-2", title: "Feedback Loop", artist: "The Analog Kids", albumId: "raw-signal", duration: 396, audioUrl: song(15) },
      { id: "rs-3", title: "Overload", artist: "The Analog Kids", albumId: "raw-signal", duration: 453, audioUrl: song(16) },
      { id: "rs-4", title: "Plugged In", artist: "The Analog Kids", albumId: "raw-signal", duration: 372, audioUrl: song(1) },
    ],
  },
];

export const allTracks: Track[] = albums.flatMap((a) => a.tracks);

export function getAlbum(id: string): Album | undefined {
  return albums.find((a) => a.id === id);
}

export function getTrack(id: string): Track | undefined {
  return allTracks.find((t) => t.id === id);
}

export function coverGradient(album: Album): string {
  return `linear-gradient(135deg, ${album.color} 0%, ${album.colorTo} 100%)`;
}
