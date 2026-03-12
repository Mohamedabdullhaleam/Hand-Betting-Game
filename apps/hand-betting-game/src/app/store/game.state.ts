import { Hand, Tile } from '@hand-betting-game/shared-types';

export type BetResult = 'win' | 'loss' | null;

export interface GameStateModel {
  drawPile: Tile[];
  discardPile: Tile[];
  currentHand: Hand | null;
  previousHand: Hand | null;
  score: number;
  lastScoreDelta: number;
  lastBetResult: BetResult;
  tileValues: Record<string, number>;
  drawPileExhaustionCount: number;
  isGameOver: boolean;
  gameOverReason: string | null;
  roundNumber: number;
  betCount: number;
}

export const initialGameState: GameStateModel = {
  drawPile: [],
  discardPile: [],
  currentHand: null,
  previousHand: null,
  score: 0,
  lastScoreDelta: 0,
  lastBetResult: null,
  tileValues: {},
  drawPileExhaustionCount: 0,
  isGameOver: false,
  gameOverReason: null,
  roundNumber: 0,
  betCount: 0,
};
