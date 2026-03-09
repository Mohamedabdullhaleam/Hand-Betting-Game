import { Tile, Hand } from '@hand-betting-game/shared-types';

const HAND_SIZE = 5;

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawHand(
  drawPile: Tile[],
  handSize: number = HAND_SIZE
): { hand: Hand; remainingPile: Tile[] } {
  const drawnTiles = drawPile.slice(0, handSize);
  const remainingPile = drawPile.slice(handSize);
  const totalValue = drawnTiles.reduce((sum, tile) => sum + tile.value, 0);

  return {
    hand: { tiles: drawnTiles, totalValue },
    remainingPile,
  };
}

export function calculateHandValue(tiles: Tile[]): number {
  return tiles.reduce((sum, tile) => sum + tile.value, 0);
}
