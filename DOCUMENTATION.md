# Hand Betting Game — Full Project Documentation

> A full-stack Mahjong-based card-betting game built as a technical assessment.
> Stack: **Angular 21 · NgRx · NestJS · MongoDB Atlas · Nx Monorepo · TypeScript**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Why This Architecture](#3-why-this-architecture)
4. [Monorepo Structure](#4-monorepo-structure)
5. [Game Rules & Mechanics](#5-game-rules--mechanics)
6. [Shared Libraries (libs/)](#6-shared-libraries-libs)
   - 6.1 [shared-types](#61-shared-types)
   - 6.2 [game-engine](#62-game-engine)
7. [Frontend — Angular App](#7-frontend--angular-app)
   - 7.1 [NgRx State Shape](#71-ngrx-state-shape)
   - 7.2 [NgRx Actions](#72-ngrx-actions)
   - 7.3 [Reducer (Game State Machine)](#73-reducer-game-state-machine)
   - 7.4 [Selectors](#74-selectors)
   - 7.5 [Leaderboard Feature (NgRx)](#75-leaderboard-feature-ngrx)
   - 7.6 [Routing](#76-routing)
   - 7.7 [Pages](#77-pages)
   - 7.8 [Components](#78-components)
   - 7.9 [Design System](#79-design-system)
8. [Backend — NestJS API](#8-backend--nestjs-api)
   - 8.1 [Leaderboard Module](#81-leaderboard-module)
   - 8.2 [MongoDB Schema](#82-mongodb-schema)
   - 8.3 [Environment Config](#83-environment-config)
9. [Data Flow Diagram](#9-data-flow-diagram)
10. [Patch History (Build Log)](#10-patch-history-build-log)
11. [Running the Project](#11-running-the-project)
12. [Key Design Decisions](#12-key-design-decisions)
13. [Glossary](#13-glossary)

---

## 1. Project Overview

**Hand Betting Game** is a single-player card-comparison game using Mahjong tiles. Each round the player sees a hand of 5 tiles and bets whether the *next* hand will have a **higher** or **lower** total value. The game ends when a tile's dynamic value reaches 0 or 10, or when the draw pile has been exhausted 3 times.

The project was built as a full-stack technical assessment demonstrating:

- Clean monorepo organisation with Nx
- Reactive, unidirectional state management (NgRx)
- Pure, framework-agnostic game logic in a shared library
- REST API with NestJS + MongoDB Atlas for persisting leaderboard scores
- Polished UI with animations, keyboard shortcuts, and responsive design

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Monorepo | **Nx** | 22.x |
| Language | **TypeScript** | 5.x |
| Frontend framework | **Angular** | 21.x |
| State management | **NgRx** (Store, Effects, Selectors) | 19.x |
| Backend framework | **NestJS** | 11.x |
| Database | **MongoDB Atlas** (cloud) | via Mongoose 8.x |
| ORM/ODM | **Mongoose** + `@nestjs/mongoose` | 8.x |
| Config management | `@nestjs/config` (`.env` via dotenv) | — |
| HTTP client (FE) | Angular `HttpClient` | built-in |
| Styling | **SCSS** + CSS custom properties | — |
| Node.js | **v20.19.0** | LTS |
| Package manager | **npm** | — |

---

## 3. Why This Architecture

### Nx Monorepo
All code lives in one repository with `apps/` (deployable units) and `libs/` (shared code). This allows the Angular frontend and NestJS backend to share the same TypeScript types without duplication or package publishing. Nx also provides dependency graph analysis, affected-command optimisation, and consistent project configuration.

### Shared Libraries
`libs/shared-types` exports all domain interfaces and enums. `libs/game-engine` exports pure game-logic functions. Both are consumed by the Angular app *and* could trivially be consumed by the NestJS backend for server-side validation — no code duplication.

### Framework-Agnostic Game Engine
All business logic (tile creation, deck shuffling, bet resolution, score calculation, game-over checks) lives in `libs/game-engine` as pure TypeScript functions with zero framework imports. This makes the logic:
- **Easy to unit-test** — no Angular TestBed, no DI container needed
- **Portable** — reusable by the backend, a mobile app, or a future server-rendered version
- **Predictable** — same input always produces same output

### NgRx for State Management
The game has complex, multi-step state transitions (draw → bet → reshuffle → game-over). NgRx gives us:
- A **single source of truth** — one immutable state tree
- **Deterministic reducer** — all state changes are pure functions, easily debugged with DevTools
- **Effects** — async side-effects (API calls for leaderboard) are isolated from the reducer
- **Selectors** — memoised derived state avoids redundant recalculation

### MongoDB Atlas
Using Atlas (cloud-managed MongoDB) instead of a local MongoDB instance means:
- No local database installation required
- The project runs out-of-the-box with just a connection string in `.env`
- Free tier is sufficient for a leaderboard use case

---

## 4. Monorepo Structure

```
hand-betting-game/
├── apps/
│   ├── hand-betting-game/          # Angular 21 frontend
│   │   └── src/app/
│   │       ├── pages/              # Route-level components
│   │       │   ├── landing/        # Home page + leaderboard
│   │       │   ├── game/           # Main game page
│   │       │   └── game-over/      # End-of-game screen
│   │       ├── components/
│   │       │   └── tile/           # Reusable tile component
│   │       ├── store/              # NgRx: game feature
│   │       │   ├── game.actions.ts
│   │       │   ├── game.reducer.ts
│   │       │   ├── game.selectors.ts
│   │       │   ├── game.state.ts
│   │       │   └── leaderboard/    # NgRx: leaderboard feature
│   │       │       ├── leaderboard.actions.ts
│   │       │       ├── leaderboard.reducer.ts
│   │       │       ├── leaderboard.effects.ts
│   │       │       └── leaderboard.selectors.ts
│   │       ├── services/
│   │       │   └── leaderboard.service.ts
│   │       ├── app.config.ts       # Providers (store, router, http)
│   │       ├── app.routes.ts       # Lazy-loaded route definitions
│   │       ├── app.ts              # Root component
│   │       └── styles.scss         # Global design tokens + utilities
│   └── api/                        # NestJS backend
│       └── src/app/
│           ├── leaderboard/
│           │   ├── leaderboard.controller.ts
│           │   ├── leaderboard.service.ts
│           │   ├── leaderboard.schema.ts
│           │   ├── leaderboard.dto.ts
│           │   └── leaderboard.module.ts
│           └── app.module.ts       # Root NestJS module
├── libs/
│   ├── shared-types/               # Shared domain interfaces & enums
│   │   └── src/lib/shared-types.ts
│   └── game-engine/                # Pure game logic functions
│       └── src/lib/
│           ├── tile-definitions.ts
│           ├── deck-utils.ts
│           └── game-logic.ts
├── tsconfig.base.json              # Root TS config with path aliases
├── nx.json                         # Nx workspace configuration
└── package.json                    # Root dependencies
```

**TypeScript path aliases** (defined in `tsconfig.base.json`):
```json
{
  "paths": {
    "@hand-betting-game/shared-types": ["libs/shared-types/src/index.ts"],
    "@hand-betting-game/game-engine":  ["libs/game-engine/src/index.ts"]
  }
}
```
Both the Angular app and NestJS API import from these aliases — no relative `../../libs/...` paths needed.

---

## 5. Game Rules & Mechanics

### The Tile Set
The game uses a subset of the Mahjong tile set — 108 tiles total:

| Category | Tiles | Count |
|---|---|---|
| **Bamboo** (number) | 1–9 | 36 (4 copies each) |
| **Characters** (number) | 1–9 | 36 (4 copies each) |
| **Circles** (number) | 1–9 | 36 (4 copies each) |
| **Dragons** (special) | Red, Green, White | 3 tiles |
| **Winds** (special) | East, South, West, North | 4 tiles |

> *Note: In this implementation, only 1 copy of each Dragon/Wind tile is used to keep the deck manageable.*

### Tile Values
- **Number tiles**: their face value (1–9), static
- **Dragon / Wind tiles**: start at **5**, dynamic — change after each bet

### Dynamic Value Scaling
After every bet:
- If the player **wins**: all non-number tiles in the current hand increase by +1
- If the player **loses**: all non-number tiles in the current hand decrease by -1
- Values are clamped between 1 and 9 inclusive (but reaching 0 or 10 is a game-over trigger)

### Hand Value
A hand's total value = sum of the `value` property of all 5 tiles.

### Gameplay Loop
```
1. Start game → shuffle 108-tile deck → deal first hand of 5 tiles
2. Player sees the hand → places bet: HIGHER or LOWER
3. Next hand is dealt from the draw pile
4. Bet is resolved: compare new hand total vs previous hand total
5. Score updated: ±(new hand total value)
6. Tile values updated for non-number tiles
7. Check game-over conditions
8. If game continues → go to step 2
```

### Scoring
- **Win**: `score += currentHand.totalValue`
- **Loss**: `score -= currentHand.totalValue`
- Score can go negative

### Game-Over Conditions
| Condition | Message |
|---|---|
| Any non-number tile value hits **0** | "A tile value reached 0 — the scales have collapsed!" |
| Any non-number tile value hits **10** | "A tile value reached 10 — the balance is broken!" |
| Draw pile exhausted **3 times** | "The draw pile has been exhausted 3 times — the game ends!" |

### Reshuffle
When the draw pile has fewer than 5 tiles remaining:
- The exhaustion counter increments
- If the counter reaches 3: game over
- Otherwise: the discard pile is shuffled back into a new draw pile

---

## 6. Shared Libraries (`libs/`)

### 6.1 `shared-types`

**Path:** `libs/shared-types/src/lib/shared-types.ts`
**Import alias:** `@hand-betting-game/shared-types`

Contains all domain interfaces and enums used by both frontend and backend:

```typescript
// Enums
export enum TileSuit  { BAMBOO, CHARACTERS, CIRCLES }
export enum TileType  { NUMBER, DRAGON, WIND }
export enum DragonTile { RED, GREEN, WHITE }
export enum WindTile  { EAST, SOUTH, WEST, NORTH }

// Core interfaces
export interface Tile {
  id: string;           // unique identifier (e.g. "bamboo-3-0")
  type: TileType;
  suit?: TileSuit;      // only for NUMBER tiles
  value: number;        // face value or dynamic value (Dragon/Wind)
  name: string;         // human-readable label
  dragon?: DragonTile;  // set for DRAGON tiles
  wind?: WindTile;      // set for WIND tiles
}

export type BetDirection = 'higher' | 'lower';

export interface Hand {
  tiles: Tile[];
  totalValue: number;
}

export interface LeaderboardEntry {
  _id?: string;
  playerName: string;
  score: number;
  date: string;         // ISO 8601
}
```

---

### 6.2 `game-engine`

**Path:** `libs/game-engine/src/lib/`
**Import alias:** `@hand-betting-game/game-engine`

All pure functions — zero framework dependencies.

#### `tile-definitions.ts`

| Function / Export | Purpose |
|---|---|
| `createFullDeck(tileValues)` | Returns array of 108 `Tile` objects with correct values |
| `getInitialTileValues()` | Returns `Record<string, number>` mapping non-number tile keys → 5 |
| `getNonNumberTileKey(tile)` | Returns a stable key string for Dragon/Wind tiles |

Number tiles (1–9, 4 suits × 9 values × 4 copies = 108 tiles) have static values.
Dragon/Wind tiles are created once and their values come from the `tileValues` map.

#### `deck-utils.ts`

| Function | Signature | Purpose |
|---|---|---|
| `shuffle<T>` | `(arr: T[]) => T[]` | Fisher-Yates shuffle, returns new array |
| `drawHand` | `(pile, size) => { hand, remainingPile }` | Draws `size` tiles from top of pile |
| `calculateHandValue` | `(tiles) => number` | Sums tile values |

#### `game-logic.ts`

| Function | Signature | Purpose |
|---|---|---|
| `resolveBet` | `(prevHand, currHand, direction) => boolean` | Returns true if bet was correct |
| `updateTileValuesAfterBet` | `(tileValues, hand, won) => Record<string,number>` | ±1 on non-number tiles in hand |
| `checkGameOverFromTileValues` | `(tileValues) => string \| null` | Returns reason string if any value = 0 or 10 |
| `checkGameOverFromExhaustion` | `(count) => string \| null` | Returns reason string if count ≥ 3 |
| `reshuffleDeck` | `(discardPile, tileValues) => Tile[]` | Shuffles discard pile back, syncs values |
| `updateTilesWithCurrentValues` | `(tiles, tileValues) => Tile[]` | Applies latest tileValues map to tile objects |

**Bet resolution logic:**
```
won = (direction === 'higher' && currTotal > prevTotal)
   || (direction === 'lower'  && currTotal < prevTotal)
```
Ties always count as a **loss** (the next hand was not strictly higher/lower).

---

## 7. Frontend — Angular App

### 7.1 NgRx State Shape

**File:** `apps/hand-betting-game/src/app/store/game.state.ts`

```typescript
export type BetResult = 'win' | 'loss' | null;

export interface GameStateModel {
  drawPile:              Tile[];
  discardPile:           Tile[];
  currentHand:           Hand | null;
  previousHand:          Hand | null;
  score:                 number;
  lastScoreDelta:        number;      // score change from last bet
  lastBetResult:         BetResult;   // 'win' | 'loss' | null
  tileValues:            Record<string, number>;  // dynamic values for non-number tiles
  drawPileExhaustionCount: number;    // how many times pile has been reshuffled
  isGameOver:            boolean;
  gameOverReason:        string | null;
  roundNumber:           number;
}
```

**Initial state:** empty piles, null hands, score = 0, roundNumber = 0, all flags false.

---

### 7.2 NgRx Actions

**File:** `apps/hand-betting-game/src/app/store/game.actions.ts`

```typescript
export const GameActions = createActionGroup({
  source: 'Game',
  events: {
    'Start Game': emptyProps(),
    'Draw Hand':  emptyProps(),
    'Place Bet':  props<{ direction: BetDirection }>(),
    'Game Over':  props<{ reason: string }>(),
    'Reset Game': emptyProps(),
  },
});
```

| Action | Triggered by | Effect |
|---|---|---|
| `startGame` | `GameComponent.ngOnInit()` | Initialises fresh deck and deals first hand |
| `drawHand` | (available but superseded by placeBet) | Draws next hand without scoring |
| `placeBet` | Higher / Lower button clicks | Resolves bet, updates score, draws next hand |
| `gameOver` | Internal reducer on exhaustion | Sets game-over flag |
| `resetGame` | "Play Again" on GameOver page | Resets to `initialGameState` |

---

### 7.3 Reducer (Game State Machine)

**File:** `apps/hand-betting-game/src/app/store/game.reducer.ts`

The reducer is the heart of the game. It handles the entire game loop as a pure function.

#### `startGame`
1. Calls `getInitialTileValues()` — all Dragon/Wind tiles start at value 5
2. Calls `createFullDeck(tileValues)` — builds 108-tile deck
3. Shuffles with `shuffle(deck)`
4. Draws first hand with `drawHand(shuffled, 5)`
5. Returns clean state with `roundNumber: 1`

#### `placeBet` (main game loop)
```
Input: state + direction ('higher' | 'lower')

If no previousHand (first round):
  → Just draw next hand, no scoring, no value changes

Else:
  1. resolveBet(previousHand, currentHand, direction) → won: boolean
  2. scoreChange = won ? +currentHand.totalValue : -currentHand.totalValue
  3. newScore = state.score + scoreChange
  4. updatedTileValues = updateTileValuesAfterBet(tileValues, currentHand, won)
  5. Check game-over from tile values → if triggered, return game-over state
  6. Check if drawPile.length < 5 → if so, increment exhaustionCount
       → if exhaustionCount ≥ 3 → game-over
       → else reshuffleDeck(discardPile, updatedTileValues)
  7. updateTilesWithCurrentValues(drawPile, updatedTileValues)
  8. drawHand(drawPile, 5) → nextHand
  9. Return new state with:
       currentHand = nextHand
       previousHand = old currentHand
       score = newScore
       lastScoreDelta = scoreChange
       lastBetResult = won ? 'win' : 'loss'
       roundNumber += 1
```

#### `resetGame`
Returns `initialGameState` — clears everything.

---

### 7.4 Selectors

**File:** `apps/hand-betting-game/src/app/store/game.selectors.ts`

| Selector | Returns |
|---|---|
| `selectCurrentHand` | `Hand \| null` |
| `selectPreviousHand` | `Hand \| null` |
| `selectScore` | `number` |
| `selectDrawPileCount` | `number` |
| `selectDiscardPileCount` | `number` |
| `selectIsGameOver` | `boolean` |
| `selectGameOverReason` | `string \| null` |
| `selectTileValues` | `Record<string, number>` |
| `selectRoundNumber` | `number` |
| `selectDrawPileExhaustionCount` | `number` |
| `selectLastBetResult` | `'win' \| 'loss' \| null` |
| `selectLastScoreDelta` | `number` |

All selectors use `createFeatureSelector<GameStateModel>('game')` as root.

---

### 7.5 Leaderboard Feature (NgRx)

Located in `apps/hand-betting-game/src/app/store/leaderboard/`

#### Actions
```typescript
export const LeaderboardActions = createActionGroup({
  source: 'Leaderboard',
  events: {
    'Load Scores':         emptyProps(),
    'Load Scores Success': props<{ entries: LeaderboardEntry[] }>(),
    'Load Scores Failure': props<{ error: string }>(),
    'Save Score':          props<{ entry: Omit<LeaderboardEntry, '_id'> }>(),
    'Save Score Success':  props<{ entry: LeaderboardEntry }>(),
    'Save Score Failure':  props<{ error: string }>(),
  },
});
```

#### State
```typescript
interface LeaderboardState {
  entries:  LeaderboardEntry[];
  loading:  boolean;
  error:    string | null;
  saved:    boolean;
}
```

#### Effects
- `loadScores$`: on `loadScores` → GET `/api/leaderboard` → dispatch success/failure
- `saveScore$`: on `saveScore` → POST `/api/leaderboard` → dispatch success/failure

#### Service
`LeaderboardService` wraps `HttpClient`:
- `getTopScores(): Observable<LeaderboardEntry[]>` — GET `/api/leaderboard`
- `saveScore(entry): Observable<LeaderboardEntry>` — POST `/api/leaderboard`

Base URL: `http://localhost:3000`

---

### 7.6 Routing

**File:** `apps/hand-betting-game/src/app/app.routes.ts`

All routes are **lazy-loaded** (zero upfront bundle cost per page):

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component')
                         .then(m => m.LandingComponent),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component')
                         .then(m => m.GameComponent),
  },
  {
    path: 'game-over',
    loadComponent: () => import('./pages/game-over/game-over.component')
                         .then(m => m.GameOverComponent),
  },
];
```

Navigation flow: `Landing → Game → Game-Over → (Landing or Game)`

---

### 7.7 Pages

#### Landing Page (`/`)
- Animated hero section with decorative Mahjong tile symbols
- Gold gradient title
- "New Game" button → navigates to `/game`
- Dispatches `LeaderboardActions.loadScores()` on init
- Displays top-5 leaderboard with rank medals (🥇🥈🥉), score, date
- Loading spinner state, error state, empty state ("No scores yet")

#### Game Page (`/game`)
- Header bar: Round | Score | Draw Pile count | Discards count | Resets remaining (x/3)
- History section (appears after round 1): previous hand with small tiles + total value
- Current hand: 5 tiles with staggered `dealIn` animation (80ms delay per tile)
- Hand total in gold gradient typography
- Bet buttons: **▲ Higher** (green) and **▼ Lower** (red)
  - Keyboard shortcuts: `H` = Higher, `L` = Lower
  - Key badge hints shown on button (hidden on mobile ≤480px)
- Full-screen animated overlay after each bet:
  - Green overlay + ✓ + score delta = win
  - Red overlay + ✗ + score delta = loss
  - Auto-dismisses after 1.2 seconds
- Navigates to `/game-over` when `isGameOver` becomes true

#### Game-Over Page (`/game-over`)
- Card with entrance spring animation
- Game-over reason text
- Final score in large gold typography
- Player name input + "Submit" → saves to leaderboard
- "Score saved! ✓" confirmation on success
- "Play Again" → dispatches `resetGame` → navigates to `/game`
- "Home" → navigates to `/`

---

### 7.8 Components

#### `TileComponent` (`app-tile`)
**File:** `apps/hand-betting-game/src/app/components/tile/tile.component.ts`

A reusable standalone component that renders a single Mahjong tile.

**Inputs:**
- `tile: Tile` (required) — the tile data
- `small: boolean` (default: false) — renders smaller tile for history view

**Features:**
- Maps tile data to Mahjong Unicode emoji symbols:
  - Bamboo: 🀐–🀘, Characters: 🀇–🀏, Circles: 🀙–🀡
  - Dragons: 🀄 (Red), 🀅 (Green), 🀆 (White)
  - Winds: 🀀 (East), 🀁 (South), 🀂 (West), 🀃 (North)
- Suit-coloured value badge (green for bamboo, red for characters, blue for circles)
- `tile--danger` CSS class when non-number tile value ≤ 1 or ≥ 9 — pulsing red glow warning
- `dealIn` CSS animation on mount
- Hover lift effect

---

### 7.9 Design System

**File:** `apps/hand-betting-game/src/styles.scss`

All visual constants are defined as CSS custom properties (design tokens) on `:root`:

#### Color Tokens
```scss
--color-bg:           #0d1117   // near-black background
--color-surface:      #161b22   // card/panel background
--color-surface-alt:  #21262d   // input/tag background
--color-border:       #30363d   // subtle border
--color-text:         #e6edf3   // primary text
--color-text-muted:   #7d8590   // secondary/label text
--color-primary:      #d4af37   // gold accent
--color-win:          #2ecc71   // green for wins
--color-loss:         #e74c3c   // red for losses
--color-tile-bg:      #f5f0e8   // ivory tile face
--color-tile-border:  #c8b89a   // tan tile border
```

#### Spacing / Radius Tokens
```scss
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--shadow-card: 0 8px 32px rgba(0,0,0,0.4)
--transition: 200ms ease
```

#### Typography
```scss
--font-display: 'Cinzel', Georgia, serif  // headings
--font-body:    system-ui, sans-serif     // body text
```

#### Global Utility Classes
```scss
.btn           // base button reset + flex layout
.btn-primary   // gold filled button
.btn-secondary // muted outlined button
.btn-ghost     // transparent text-only button
```

---

## 8. Backend — NestJS API

### 8.1 Leaderboard Module

**Directory:** `apps/api/src/app/leaderboard/`

#### Controller
```
GET  /api/leaderboard   → getTopScores()   → top 10 by score desc
POST /api/leaderboard   → createScore(dto) → save new entry
```

CORS is enabled globally (NestJS `app.enableCors()`) to allow requests from `localhost:4200`.

#### Service
```typescript
// Get top 10 scores sorted descending
getTopScores(): Promise<LeaderboardEntry[]>
  → LeaderboardModel.find().sort({ score: -1 }).limit(10).exec()

// Save a score entry
create(dto: CreateScoreDto): Promise<LeaderboardEntry>
  → new LeaderboardModel(dto).save()
```

#### DTO
```typescript
export class CreateScoreDto {
  @IsString() @IsNotEmpty() @MaxLength(20)
  playerName: string;

  @IsNumber()
  score: number;

  @IsString()
  date: string;
}
```

---

### 8.2 MongoDB Schema

**File:** `apps/api/src/app/leaderboard/leaderboard.schema.ts`

```typescript
@Schema()
export class LeaderboardEntry {
  @Prop({ required: true, maxlength: 20 })
  playerName: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  date: string;  // ISO 8601 string
}
```

Collection name: `leaderboardentries` (auto-pluralised by Mongoose)

---

### 8.3 Environment Config

**File:** `apps/api/.env` (gitignored)

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
```

Loaded via `@nestjs/config`:
```typescript
ConfigModule.forRoot({ envFilePath: 'apps/api/.env', isGlobal: true })
MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.get<string>('MONGODB_URI'),
  }),
})
```

---

## 9. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         ANGULAR APP                              │
│                                                                   │
│   User Action                                                     │
│       │                                                           │
│       ▼                                                           │
│   Component dispatches NgRx Action                               │
│   (e.g. GameActions.placeBet({ direction: 'higher' }))           │
│       │                                                           │
│       ▼                                                           │
│   NgRx Store                                                      │
│       ├──► Reducer (game.reducer.ts)                             │
│       │        Pure function: old state + action → new state     │
│       │        Uses game-engine pure functions internally         │
│       │        ─────────────────────────────────────────         │
│       │        @hand-betting-game/game-engine:                   │
│       │          resolveBet()                                     │
│       │          updateTileValuesAfterBet()                       │
│       │          checkGameOverFromTileValues()                    │
│       │          reshuffleDeck()                                  │
│       │          drawHand()                                       │
│       │                                                           │
│       └──► Effects (leaderboard.effects.ts)                      │
│                Async side-effects only                            │
│                Calls LeaderboardService (HttpClient)              │
│                GET/POST http://localhost:3000/api/leaderboard     │
│                                                                   │
│   Selectors (memoised) → Component template via AsyncPipe        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NESTJS API                               │
│                                                                   │
│   GET  /api/leaderboard → LeaderboardController                  │
│   POST /api/leaderboard → LeaderboardController                  │
│                │                                                  │
│                ▼                                                  │
│        LeaderboardService                                         │
│                │                                                  │
│                ▼                                                  │
│        Mongoose Model → MongoDB Atlas                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Patch History (Build Log)

The project was built incrementally across 5 patches, each committed separately.

### Patch 1 — Workspace & Scaffolding
- `1.1` — Init Nx workspace, generate Angular app (`hand-betting-game`) and NestJS app (`api`)
- `1.2` — Create `libs/shared-types` and `libs/game-engine` Nx libraries; configure TypeScript path aliases in `tsconfig.base.json`

### Patch 2 — Game Engine (Pure Logic)
- `2.1` — Implement `tile-definitions.ts`: full 108-tile deck, initial tile values, tile key helpers
- `2.2` — Implement `deck-utils.ts`: Fisher-Yates shuffle, `drawHand`, `calculateHandValue`
- `2.3` — Implement `game-logic.ts`: `resolveBet`, `updateTileValuesAfterBet`, `checkGameOverFromTileValues`, `checkGameOverFromExhaustion`, `reshuffleDeck`, `updateTilesWithCurrentValues`

### Patch 3 — NgRx Store + Backend API
- `3.1` — Game NgRx feature: state, actions, reducer (full game state machine), selectors
- `3.2` — Leaderboard NgRx feature: actions, reducer, effects, selectors; `LeaderboardService`
- `3.3` — NestJS leaderboard module: schema, DTO, service, controller, module; MongoDB Atlas connection via `@nestjs/config`

### Patch 4 — UI Pages + Components
- `4.1` — Global design system: CSS custom properties, `styles.scss`, button utilities
- `4.2` — `TileComponent`: Mahjong Unicode symbols, suit colours, small variant, `dealIn` animation
- `4.3` — Landing page: hero, animated decorative tiles, "New Game" CTA, leaderboard display
- `4.4` — Game page: header stats, history view, current hand, Higher/Lower bet buttons, game-over navigation
- `4.5` — Game-over page: final score, save-to-leaderboard form, play again / home actions

### Patch 5 — Polish & Animations
- `5.1` — Bet result feedback: `lastBetResult`/`lastScoreDelta` in NgRx state; animated win/loss overlay with score delta (1.2s flash)
- `5.2` — Keyboard shortcuts (`H`/`L` for Higher/Lower); key badge hints on buttons; mobile responsive breakpoints; `OnDestroy` subscription cleanup
- `5.3` — Remove unused `nx-welcome` component; danger indicators on non-number tiles approaching game-over (pulsing red glow at value ≤1 or ≥9)

---

## 11. Running the Project

### Prerequisites
- Node.js **v20.19.0+** (`nvm use 20.19.0`)
- npm
- A MongoDB Atlas account with a cluster (free tier works)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create the API environment file
# Create apps/api/.env with your MongoDB connection string:
echo "MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>" > apps/api/.env
```

### Running (two terminals)

```bash
# Terminal 1 — Angular frontend (http://localhost:4200)
npx nx serve hand-betting-game

# Terminal 2 — NestJS API (http://localhost:3000)
npx nx serve api
```

### Building for production

```bash
# Build both apps
npx nx run-many --target=build --projects=hand-betting-game,api

# Or build individually
npx nx build hand-betting-game
npx nx build api
```

### Lint & Test

```bash
npx nx run-many --target=lint --all
npx nx test hand-betting-game
```

---

## 12. Key Design Decisions

### Decision 1: Pure functions for game logic
All game rules live in `libs/game-engine` as stateless functions. The NgRx reducer calls these functions — it does not contain game logic itself. This separation means game rules can be changed, tested, or reused without touching Angular or NgRx at all.

### Decision 2: Inline reshuffle in the reducer (no Effect)
The reshuffle is part of the synchronous `placeBet` action handler. Since reshuffle is deterministic and doesn't require async I/O, handling it in the reducer (with a call to `reshuffleDeck()`) keeps the state transition atomic — there's no intermediate state where the game is "waiting to reshuffle."

### Decision 3: No `NgIf` / `NgFor` directive imports
The project uses Angular 17+ built-in control flow (`@if`, `@for`, `@else`) throughout all templates. This eliminates the need to import `NgIf`/`NgFor` in every component's `imports` array, reducing boilerplate.

### Decision 4: Lazy-loaded routes
All three page components are loaded lazily. The initial bundle only contains the router and the root app shell. Each page's JavaScript is only loaded when the user navigates to it, improving time-to-interactive.

### Decision 5: `AsyncPipe` over manual subscriptions
All observable state is consumed in templates via `| async` — Angular handles subscription/unsubscription automatically, preventing memory leaks. The only manual subscriptions in components (e.g. `isGameOver$` for navigation) are managed with `OnDestroy` + a `Subscription` aggregate.

### Decision 6: MongoDB Atlas (cloud) over local MongoDB
Using Atlas means no local MongoDB installation is needed for development. A free-tier cluster is sufficient for leaderboard data. The connection string is kept in a gitignored `.env` file.

### Decision 7: Single `tileValues` map instead of mutating tile objects
The state stores `tileValues: Record<string, number>` as a flat map of tile key → current value, separate from the tile objects in the draw pile. Tile objects are synced from this map before drawing. This approach avoids having to update value across every copy of a tile in the deck on every bet.

---

## 13. Glossary

| Term | Definition |
|---|---|
| **Nx** | Build system and monorepo tool that manages multiple apps/libs in one repo |
| **NgRx** | Reactive state management for Angular based on the Redux pattern |
| **Reducer** | A pure function `(state, action) => newState` — the single place state changes happen |
| **Effect** | NgRx side-effect handler for async operations (API calls); dispatches new actions |
| **Selector** | Memoised function that derives data from the NgRx store |
| **Feature selector** | A selector targeting a named slice of the root NgRx state tree |
| **Hand** | A set of 5 tiles drawn from the deck, with a calculated total value |
| **Draw pile** | The remaining shuffled tiles to deal from |
| **Discard pile** | Tiles from played hands waiting to be reshuffled |
| **Exhaustion** | When the draw pile runs out of tiles and must be rebuilt from the discard pile |
| **Dynamic value** | The current score value of a Dragon or Wind tile — starts at 5, changes ±1 per bet |
| **Danger tile** | A non-number tile with value ≤1 or ≥9 — one bet away from triggering game-over |
| **Bet direction** | The player's prediction: `'higher'` or `'lower'` |
| **Score delta** | The change in score from a single bet — displayed in the win/loss overlay |
| **Standalone component** | An Angular component that declares its own `imports` without belonging to an NgModule |
| **Lazy-loaded route** | A route whose component is only bundled/downloaded when navigated to |
| **Path alias** | A TypeScript `paths` mapping (`@hand-betting-game/...`) that resolves to a lib's source |
| **MEAN stack** | MongoDB · Express (here: NestJS) · Angular · Node.js |
