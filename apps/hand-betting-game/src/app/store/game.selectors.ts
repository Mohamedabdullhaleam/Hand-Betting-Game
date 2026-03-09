import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameStateModel } from './game.state';

export const selectGameState = createFeatureSelector<GameStateModel>('game');

export const selectCurrentHand = createSelector(
  selectGameState,
  (state) => state.currentHand
);

export const selectPreviousHand = createSelector(
  selectGameState,
  (state) => state.previousHand
);

export const selectScore = createSelector(
  selectGameState,
  (state) => state.score
);

export const selectDrawPileCount = createSelector(
  selectGameState,
  (state) => state.drawPile.length
);

export const selectDiscardPileCount = createSelector(
  selectGameState,
  (state) => state.discardPile.length
);

export const selectIsGameOver = createSelector(
  selectGameState,
  (state) => state.isGameOver
);

export const selectGameOverReason = createSelector(
  selectGameState,
  (state) => state.gameOverReason
);

export const selectTileValues = createSelector(
  selectGameState,
  (state) => state.tileValues
);

export const selectRoundNumber = createSelector(
  selectGameState,
  (state) => state.roundNumber
);

export const selectDrawPileExhaustionCount = createSelector(
  selectGameState,
  (state) => state.drawPileExhaustionCount
);

export const selectLastBetResult = createSelector(
  selectGameState,
  (state) => state.lastBetResult
);

export const selectLastScoreDelta = createSelector(
  selectGameState,
  (state) => state.lastScoreDelta
);
