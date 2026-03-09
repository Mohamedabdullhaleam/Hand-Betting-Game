import { Hand } from '@hand-betting-game/shared-types';
import { Tile } from '@hand-betting-game/shared-types';

export interface GameStateModel {
  drawPile: Tile[];
  discardPile: Tile[];
  currentHand: Hand | null;
  previousHand: Hand | null;
  score: number;
  tileValues: Record<string, number>;
  drawPileExhaustionCount: number;
  isGameOver: boolean;
  gameOverReason: string | null;
  roundNumber: number;
}

export const initialGameState: GameStateModel = {
  drawPile: [],
  discardPile: [],
  currentHand: null,
  previousHand: null,
  score: 0,
  tileValues: {},
  drawPileExhaustionCount: 0,
  isGameOver: false,
  gameOverReason: null,
  roundNumber: 0,
};
