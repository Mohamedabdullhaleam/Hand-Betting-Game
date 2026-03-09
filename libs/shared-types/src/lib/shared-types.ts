export enum TileSuit {
  BAMBOO = 'bamboo',
  CHARACTERS = 'characters',
  CIRCLES = 'circles',
}

export enum TileType {
  NUMBER = 'number',
  DRAGON = 'dragon',
  WIND = 'wind',
}

export enum DragonTile {
  RED = 'red',
  GREEN = 'green',
  WHITE = 'white',
}

export enum WindTile {
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
  NORTH = 'north',
}

export interface Tile {
  id: string;
  type: TileType;
  suit?: TileSuit;
  value: number;
  name: string;
  dragon?: DragonTile;
  wind?: WindTile;
}

export type BetDirection = 'higher' | 'lower';

export interface Hand {
  tiles: Tile[];
  totalValue: number;
}

export interface GameState {
  drawPile: Tile[];
  discardPile: Tile[];
  currentHand: Hand | null;
  previousHand: Hand | null;
  score: number;
  tileValues: Record<string, number>;
  drawPileExhaustionCount: number;
  isGameOver: boolean;
  gameOverReason: string | null;
}

export interface LeaderboardEntry {
  _id?: string;
  playerName: string;
  score: number;
  date: string;
}
