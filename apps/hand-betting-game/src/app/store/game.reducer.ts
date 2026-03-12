import { createReducer, on } from '@ngrx/store';
import { GameActions } from './game.actions';
import { GameStateModel, initialGameState } from './game.state';
import {
  createFullDeck,
  getInitialTileValues,
  shuffle,
  drawHand,
  resolveBet,
  updateTileValuesAfterBet,
  checkGameOverFromTileValues,
  checkGameOverFromExhaustion,
  reshuffleDeck,
  updateTilesWithCurrentValues,
} from '@hand-betting-game/game-engine';

const HAND_SIZE = 5;

export const gameReducer = createReducer(
  initialGameState,

  on(GameActions.startGame, (): GameStateModel => {
    const tileValues = getInitialTileValues();
    const deck = createFullDeck(tileValues);
    const shuffledDeck = shuffle(deck);
    const { hand, remainingPile } = drawHand(shuffledDeck, HAND_SIZE);

    return {
      ...initialGameState,
      tileValues,
      drawPile: remainingPile,
      discardPile: [],
      currentHand: hand,
      previousHand: null,
      roundNumber: 1,
    };
  }),

  on(GameActions.drawHand, (state): GameStateModel => {
    if (state.isGameOver || !state.currentHand) return state;

    let drawPile = [...state.drawPile];
    let discardPile = [
      ...state.discardPile,
      ...state.currentHand.tiles,
    ];
    let exhaustionCount = state.drawPileExhaustionCount;

    // Check if we need to reshuffle
    if (drawPile.length < HAND_SIZE) {
      exhaustionCount++;

      const exhaustionReason = checkGameOverFromExhaustion(exhaustionCount);
      if (exhaustionReason) {
        return {
          ...state,
          drawPileExhaustionCount: exhaustionCount,
          isGameOver: true,
          gameOverReason: exhaustionReason,
        };
      }

      drawPile = reshuffleDeck(discardPile, state.tileValues);
      discardPile = [];
    }

    // Update tile values in the draw pile
    drawPile = updateTilesWithCurrentValues(drawPile, state.tileValues);

    const { hand, remainingPile } = drawHand(drawPile, HAND_SIZE);

    return {
      ...state,
      drawPile: remainingPile,
      discardPile,
      previousHand: state.currentHand,
      currentHand: hand,
      drawPileExhaustionCount: exhaustionCount,
      roundNumber: state.roundNumber + 1,
    };
  }),

  on(GameActions.placeBet, (state, { direction }): GameStateModel => {
    if (state.isGameOver || !state.currentHand) return state;

    // --- 1. Draw next hand ---
    let drawPile = [...state.drawPile];
    let discardPile = [
      ...state.discardPile,
      ...state.currentHand.tiles,
    ];
    let exhaustionCount = state.drawPileExhaustionCount;
    let tileValues = state.tileValues;

    if (drawPile.length < HAND_SIZE) {
      exhaustionCount++;
      const exhaustionReason = checkGameOverFromExhaustion(exhaustionCount);
      if (exhaustionReason) {
        return {
          ...state,
          drawPileExhaustionCount: exhaustionCount,
          isGameOver: true,
          gameOverReason: exhaustionReason,
        };
      }
      drawPile = reshuffleDeck(discardPile, tileValues);
      discardPile = [];
    }

    drawPile = updateTilesWithCurrentValues(drawPile, tileValues);
    const { hand: nextHand, remainingPile } = drawHand(drawPile, HAND_SIZE);

    // --- 2. Resolve bet: compare nextHand vs currentHand ---
    const won = resolveBet(state.currentHand, nextHand, direction);
    const scoreChange = won ? nextHand.totalValue : -nextHand.totalValue;
    const newScore = state.score + scoreChange;

    // --- 3. Update non-number tile values based on win/loss ---
    const updatedTileValues = updateTileValuesAfterBet(
      tileValues,
      nextHand,
      won
    );

    // --- 4. Check game over from tile values ---
    const tileValueReason = checkGameOverFromTileValues(updatedTileValues);
    if (tileValueReason) {
      return {
        ...state,
        drawPile: remainingPile,
        discardPile,
        previousHand: state.currentHand,
        currentHand: nextHand,
        score: newScore,
        lastScoreDelta: scoreChange,
        lastBetResult: won ? 'win' : 'loss',
        tileValues: updatedTileValues,
        drawPileExhaustionCount: exhaustionCount,
        isGameOver: true,
        gameOverReason: tileValueReason,
        roundNumber: state.roundNumber + 1,
      };
    }

    return {
      ...state,
      drawPile: remainingPile,
      discardPile,
      previousHand: state.currentHand,
      currentHand: nextHand,
      score: newScore,
      lastScoreDelta: scoreChange,
      lastBetResult: won ? 'win' : 'loss',
      tileValues: updatedTileValues,
      drawPileExhaustionCount: exhaustionCount,
      roundNumber: state.roundNumber + 1,
    };
  }),

  on(GameActions.gameOver, (state, { reason }): GameStateModel => ({
    ...state,
    isGameOver: true,
    gameOverReason: reason,
  })),

  on(GameActions.resetGame, (): GameStateModel => initialGameState)
);
