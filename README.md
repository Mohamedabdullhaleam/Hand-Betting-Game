# Hand Betting Game

A full-stack Mahjong tile betting game built with the **MEAN stack** in an **Nx monorepo**.

**Stack:** Angular 21 | NgRx | NestJS | MongoDB Atlas | Nx 22 | TypeScript

---

## Setup & Run

### Prerequisites

- **Node.js v20.19.0+** (LTS)
- **npm**
- A **MongoDB Atlas** account (free tier works) — [create one here](https://www.mongodb.com/cloud/atlas)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd hand-betting-game

# 2. Install dependencies
npm install

# 3. Create the API environment file
#    Replace the URI with your MongoDB Atlas connection string
echo "MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>" > apps/api/.env
```

### Running

Open **two terminals**:

```bash
# Terminal 1 — Angular frontend (http://localhost:4200)
npx nx serve hand-betting-game

# Terminal 2 — NestJS API (http://localhost:3000)
npx nx serve api
```

### Building for Production

```bash
npx nx build hand-betting-game
npx nx build api
```

---

## Project Structure

```
hand-betting-game/
├── apps/
│   ├── hand-betting-game/     # Angular 21 frontend (NgRx state management)
│   └── api/                   # NestJS backend (REST API + MongoDB)
├── libs/
│   ├── shared-types/          # Shared TypeScript interfaces & enums
│   └── game-engine/           # Pure game logic functions (framework-agnostic)
├── DOCUMENTATION.md           # Full technical documentation
└── README.md
```

### Key Architecture Decisions

- **Nx Monorepo** — Frontend and backend share types via `libs/shared-types`, no code duplication
- **Pure Game Engine** — All game rules live in `libs/game-engine` as pure functions with zero framework imports, making them easy to test and reuse
- **NgRx** — Single source of truth for game state; deterministic reducer handles the entire game loop; Effects handle async API calls
- **Lazy-loaded routes** — Each page is loaded on demand for fast initial load

---

## Game Overview

The player is dealt a hand of 5 Mahjong tiles and bets whether the **next** hand will have a **higher** or **lower** total value.

- **136 tiles** — Bamboo, Characters, Circles (face value 1-9), Dragons, and Winds
- **Dynamic values** — Dragon/Wind tiles start at 5 and shift +1/-1 based on wins/losses
- **Game over** when any tile value hits 0 or 10, or the draw pile is exhausted 3 times
- **Leaderboard** — Top scores saved to MongoDB Atlas via NestJS API

### Controls

- Click **Higher** / **Lower** buttons, or press **H** / **L** on keyboard

---

## Handwritten vs. AI-Assisted

### What was handwritten

- **Architecture planning** — Technology choices (MEAN stack, Nx monorepo, NgRx for state), project structure decisions, and the patch-by-patch build strategy were planned and directed by the developer
- **Game design decisions** — How the game loop works, scoring rules, tile value scaling, game-over conditions, and UX flow were all developer-directed based on the assessment requirements
- **Code review & validation** — Every piece of generated code was reviewed, tested, and corrected by the developer. Bugs were caught and fixes were directed manually
- **MongoDB Atlas setup** — Database cluster creation, connection configuration, and environment setup were done manually

### Where AI was utilized

- **Code generation** — AI (Claude) was used as a coding assistant to generate boilerplate and implementation code across all layers: Angular components/templates/SCSS, NgRx store (actions, reducer, selectors, effects), NestJS modules (controller, service, schema), and the game engine's pure logic functions
- **Scaffolding** — Nx workspace setup commands, library generation, and project configuration were guided by AI
- **Styling** — CSS design tokens, component styles, animations (tile deal-in, win/loss overlay, danger pulse), and responsive breakpoints were AI-generated
- **Documentation** — The full technical documentation (`DOCUMENTATION.md`) was AI-generated based on the actual codebase
- **Bug fixing** — AI assisted in identifying and fixing build errors (TypeScript config issues, Angular compatibility, Node.js version requirements) and logic bugs (bet resolution timing, duplicate tile value scaling)

### Summary

The developer directed all architectural decisions, reviewed all code, and validated correctness against the assessment requirements. AI was used as a productivity tool to accelerate implementation across the full stack.

---

## Full Documentation

See [DOCUMENTATION.md](./DOCUMENTATION.md) for comprehensive technical documentation including:

- Complete game rules and mechanics
- NgRx state shape, actions, reducer logic, and selectors
- Game engine API reference
- NestJS API endpoints
- Data flow diagrams
- Design system tokens
- Full build/patch history
