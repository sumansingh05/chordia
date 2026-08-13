export type Track = {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  albumTitle?: string;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  color: string;
  colorTo: string;
  tracks: Track[];
};
