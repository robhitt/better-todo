# Teenie ToDo

A simple, shared todo list app built to replace Microsoft ToDo. Focused on two things Microsoft ToDo lacks: **search** (find and uncheck completed items) and **fast scrolling** (alphabet scroller for long lists).

Live at [teenietodo.com](https://teenietodo.com)

## Features

- **Fuzzy search** across active and completed items — find that completed grocery item and uncheck it
- **Alphabet scroller** for jumping through long lists
- **Real-time sync** — share a list and see changes instantly
- **List sharing** by email
- **Confetti celebration** when all items are completed
- **PWA** — installable on iOS/Android from the browser
- **Offline detection** with reconnect banner

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite |
| State | Redux Toolkit |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Supabase (Postgres, Auth, Realtime) |
| Search | Fuse.js (client-side fuzzy) |
| Hosting | Vercel |
| Auth | Google OAuth via Supabase |

## Local Development

```bash
pnpm install

# Create .env.local from template
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key

pnpm dev
# Runs at http://localhost:5173
```

## Setup from Scratch

See [SETUP.md](./SETUP.md) for step-by-step instructions on configuring Supabase, Google OAuth, Vercel, and custom domain DNS.
