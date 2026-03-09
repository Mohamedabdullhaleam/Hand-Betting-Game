import {
  Tile,
  Hand,
  BetDirection,
  TileType,
} from '@hand-betting-game/shared-types';
import { createFullDeck, getNonNumberTileKey } from './tile-definitions';
import { shuffle } from './deck-utils';

const MAX_DRAW_PILE_EXHAUSTIONS = 3;
const TILE_VALUE_LOWER_BOUND = 0;
const TILE_VALUE_UPPER_BOUND = 10;

export function resolveBet(
  previousHand: Hand,
  currentHand: Hand,
  bet: BetDirection
): boolean {
  if (bet === 'higher') {
    return currentHand.totalValue > previousHand.totalValue;
  }
  return currentHand.totalValue < previousHand.totalValue;
}

export function updateTileValuesAfterBet(
  tileValues: Record<string, number>,
  hand: Hand,
  won: boolean
): Record<string, number> {
  const updated = { ...tileValues };

  for (const tile of hand.tiles) {
    if (tile.type !== TileType.NUMBER) {
      const key = getNonNumberTileKey(tile);
      if (key && updated[key] !== undefined) {
        updated[key] += won ? 1 : -1;
      }
    }
  }

  return updated;
}

export function checkGameOverFromTileValues(
  tileValues: Record<string, number>
): string | null {
  for (const [key, value] of Object.entries(tileValues)) {
    if (value <= TILE_VALUE_LOWER_BOUND) {
      return `Tile "${key}" value dropped to ${value}`;
    }
    if (value >= TILE_VALUE_UPPER_BOUND) {
      return `Tile "${key}" value reached ${value}`;
    }
  }
  return null;
}

export function checkGameOverFromExhaustion(count: number): string | null {
  if (count >= MAX_DRAW_PILE_EXHAUSTIONS) {
    return `Draw pile exhausted ${count} times`;
  }
  return null;
}

export function reshuffleDeck(
  discardPile: Tile[],
  tileValues: Record<string, number>
): Tile[] {
  const freshDeck = createFullDeck(tileValues);
  const combined = [...discardPile, ...freshDeck];
  return shuffle(combined);
}

export function updateTilesWithCurrentValues(
  tiles: Tile[],
  tileValues: Record<string, number>
): Tile[] {
  return tiles.map((tile) => {
    if (tile.type === TileType.NUMBER) return tile;
    const key = getNonNumberTileKey(tile);
    if (key && tileValues[key] !== undefined) {
      return { ...tile, value: tileValues[key] };
    }
    return tile;
  });
}
