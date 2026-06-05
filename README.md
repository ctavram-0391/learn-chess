# ♟️ Learn Chess

Learn chess with an AI tutor — play Stockfish at any level, get move-by-move coaching, and review every game.

Learn Chess pairs a world-class chess engine with an AI coach that explains the *why*, not just the *what*. Play a real engine at a difficulty that fits you, ask the tutor to analyze the position or suggest the best move, and revisit your finished games to see where they turned.

---

## ✨ Overview

- **Play Stockfish at any level** — choose your side and engine strength before each game.
- **AI chess tutor** — three modes powered by Claude:
  - **Analyze board** — Socratic hints about threats, weak squares, and plans *without* spoiling the move.
  - **Best move** — the engine's strongest move, explained in plain language, drawn as an arrow on the board.
  - **Free-form Q&A** — ask anything about the current position.
- **Live move tracker** — the full game stays in view as you play.
- **Game persistence** — your in-progress game *and* the tutor conversation are saved locally, so a reload or navigating away resumes exactly where you left off. Signing out clears it so the next person starts fresh.
- **Game history** — completed games are saved to your account for later review.
- **Accounts & protected routes** — email/password or Google sign-in; every dashboard page is guarded server-side.

## 🧠 How it works

- **Chess rules & board** — [`chess.js`](https://github.com/jhlywa/chess.js) holds the game state; [`react-chessboard`](https://github.com/Clariity/react-chessboard) renders it.
- **Engine** — [Stockfish](https://stockfishchess.org/) (single-threaded WASM build) runs entirely in the browser inside a Web Worker (`/public/stockfish/stockfish.js`), so engine replies and best-move lookups are instant and cost no server time.
- **Tutor** — a Next.js API route (`/api/chat`) sends the live position (FEN) and move history to Anthropic's Claude and returns coaching text. Playing and reviewing work without it; coaching is enabled once an `ANTHROPIC_API_KEY` is set.
- **Persistence** — the live session is stored in `localStorage` (`learn-chess:session:v1`); completed games are written to a Supabase `games` table.

## 🛠️ Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **UI:** Tailwind CSS v4 + shadcn/ui (Radix UI)
- **Auth & database:** Supabase (PostgreSQL + Auth)
- **Chess engine:** Stockfish (WASM, in-browser Web Worker)
- **Chess logic / board:** chess.js + react-chessboard
- **AI tutor:** Anthropic Claude (`claude-sonnet-4-5`) via the API route
- **Deployment:** Vercel

---

## 🚦 Getting started

### Prerequisites

- Node.js 18+
- Docker (for local Supabase)
- An [Anthropic API key](https://console.anthropic.com/) (optional — only needed for the AI tutor)

### 1. Clone & install

```bash
git clone https://github.com/ctavram-0391/learn-chess.git
cd learn-chess
npm install
```

### 2. Start local Supabase

```bash
npm run db:start   # boots PostgreSQL + Auth locally and prints your credentials
npm run db:reset   # applies the migrations (creates the games table, etc.)
```

The first run downloads Docker images and may take a few minutes.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Set the following in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>   # from `npm run db:start`
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional — enables the AI tutor
ANTHROPIC_API_KEY=<your-anthropic-api-key>

# Optional — branding/SEO
NEXT_PUBLIC_SITE_NAME=Learn Chess
NEXT_PUBLIC_SITE_DESCRIPTION=Learn chess with an AI tutor — play Stockfish, get move-by-move coaching, and review every game.
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Local Supabase Studio is available at [http://127.0.0.1:54323](http://127.0.0.1:54323).

---

## 🎮 Usage

1. **Sign up or log in** from the landing page (email/password or Google).
2. You'll land on **Play Chess** with a **New game** prompt — pick your **difficulty** (Easy / Medium / Hard) and **side** (White / Black / Random), then **Start game**.
3. **Make moves** by dragging a piece or clicking from-square → to-square. Stockfish replies automatically.
4. **Ask the tutor** anytime:
   - **Analyze board** for hints without spoilers,
   - **Best move** for the engine's pick (drawn as an arrow) with an explanation,
   - or type a question in the chat.
5. **Leave and come back** — reloading or navigating away resumes your game and chat. Click **New game** to start over.
6. **Review** finished games from **Game History** in the sidebar.
7. **Sign out** clears the saved game so a shared device starts clean.

---

## 📁 Project structure

```
src/
├── app/
│   ├── (marketing)/            # Public landing page
│   ├── (auth)/                 # Login & signup
│   ├── dashboard/
│   │   ├── chess/              # Play Chess page (board + tutor + moves)
│   │   └── games/              # Game history
│   └── api/chat/               # AI tutor endpoint (Anthropic)
├── modules/
│   ├── auth/                   # Auth context, service, route protection
│   └── games/
│       ├── components/         # chess-board, tutor-chat, move-tracker, setup dialog
│       ├── hooks/              # useStockfish (Web Worker engine), useGames
│       └── lib/                # session-storage (localStorage persistence)
└── components/ui/              # shadcn/ui components
public/stockfish/              # Stockfish WASM engine
supabase/migrations/           # Database schema
```

### Useful scripts

```bash
npm run dev          # start the dev server
npm run build        # production build
npm run lint         # lint
npm test             # run tests
npm run db:start     # start local Supabase
npm run db:reset     # re-apply migrations
```

---

## 🤖 AI usage disclosure

- **In the product:** the chess tutor is powered by **Anthropic's Claude** (`claude-sonnet-4-5`). When you use the tutor, the current board position (FEN) and move history are sent to the Anthropic API to generate coaching responses. No tutoring data is sent unless you interact with the tutor, and the feature is entirely optional (the app plays and reviews games without an API key).
- **In development:** this project was built with the help of AI coding assistants (Anthropic's Claude / Claude Code) for implementation, refactoring, and documentation. All code was reviewed and tested before merging.

---

## 🙏 Acknowledgements & citations

- **[next-launch-ts](https://github.com/zphelps/next-launch-ts)** by [@zphelps](https://github.com/zphelps) — the Next.js + Supabase + shadcn/ui starter this project was bootstrapped from.
- **[Stockfish](https://stockfishchess.org/)** — the open-source chess engine (GPL), used here as an in-browser WASM build.
- **[chess.js](https://github.com/jhlywa/chess.js)** — move generation, validation, and PGN/FEN handling.
- **[react-chessboard](https://github.com/Clariity/react-chessboard)** — the board UI component.
- **[Anthropic Claude](https://www.anthropic.com/)** — the AI model behind the tutor.

## 🔗 External resources

- Starter template: https://github.com/zphelps/next-launch-ts
- Next.js — https://nextjs.org/
- Supabase — https://supabase.com/
- shadcn/ui — https://ui.shadcn.com/
- Tailwind CSS — https://tailwindcss.com/
- Stockfish — https://stockfishchess.org/
- chess.js — https://github.com/jhlywa/chess.js
- react-chessboard — https://github.com/Clariity/react-chessboard
- Anthropic API — https://docs.anthropic.com/

## 📄 License

Application code is available under the MIT License. Note that the bundled **Stockfish** engine is licensed separately under the **GPL** — see the [Stockfish license](https://github.com/official-stockfish/Stockfish/blob/master/Copying.txt).
