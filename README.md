# Chordia

A Spotify-inspired music streaming web app built with Next.js. Stream full-length tracks online via the Audius API, build your own library of liked songs and playlists, and search the whole catalog — all with a clean, dark, player-style UI.

**Live site:** https://chordia.netlify.app

## Features

- **Online streaming** — full-length tracks from the Audius API (`/api/trending`, `/api/search`)
- **Spotify-like UI** — dark theme, responsive player bar, sidebar navigation
- **Your Library** — like tracks, create playlists, and see recently played (persisted in `localStorage`)
- **Now Playing & Queue** — full-screen now-playing view with a playback queue
- **Discover & Search** — browse by genre and time range, with live search suggestions
- **Album pages** — per-album track lists with cover art

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React
- [Tailwind CSS](https://tailwindcss.com)
- [Audius API](https://docs.audius.org) for streaming
- Deployed on [Netlify](https://www.netlify.com)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Production Build

```bash
npm run build
npm run start
```

## Deploying to Netlify

```bash
netlify deploy --prod --build
```

The repo is configured with `netlify.toml` (Node 22 + `@netlify/plugin-nextjs`). When connected to GitHub, every push to `main`/`master` triggers an automatic deploy.

## Project Structure

- `src/app/` — pages (`/`, `/search`, `/discover`, `/library`, `/albums/[id]`) and API routes
- `src/components/` — player bar, sidebar, track lists, now playing, queue, library views
- `src/context/` — `PlayerContext` (audio playback) and `LibraryContext` (likes/playlists)
- `src/lib/` — shared types, genres, and helpers