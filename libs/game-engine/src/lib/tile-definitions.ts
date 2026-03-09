import {
  Tile,
  TileType,
  TileSuit,
  DragonTile,
  WindTile,
} from '@hand-betting-game/shared-types';

const SUITS = [TileSuit.BAMBOO, TileSuit.CHARACTERS, TileSuit.CIRCLES];
const DRAGONS = [DragonTile.RED, DragonTile.GREEN, DragonTile.WHITE];
const WINDS = [WindTile.EAST, WindTile.SOUTH, WindTile.WEST, WindTile.NORTH];

const NON_NUMBER_BASE_VALUE = 5;
const TILES_PER_KIND = 4;

export function createNumberTiles(): Tile[] {
  const tiles: Tile[] = [];
  for (const suit of SUITS) {
    for (let num = 1; num <= 9; num++) {
      for (let copy = 0; copy < TILES_PER_KIND; copy++) {
        tiles.push({
          id: `${suit}-${num}-${copy}`,
          type: TileType.NUMBER,
          suit,
          value: num,
          name: `${num} of ${suit}`,
        });
      }
    }
  }
  return tiles;
}

export function createDragonTiles(
  tileValues: Record<string, number>
): Tile[] {
  const tiles: Tile[] = [];
  for (const dragon of DRAGONS) {
    const key = getDragonKey(dragon);
    const value = tileValues[key] ?? NON_NUMBER_BASE_VALUE;
    for (let copy = 0; copy < TILES_PER_KIND; copy++) {
      tiles.push({
        id: `dragon-${dragon}-${copy}`,
        type: TileType.DRAGON,
        dragon,
        value,
        name: `${dragon} dragon`,
      });
    }
  }
  return tiles;
}

export function createWindTiles(
  tileValues: Record<string, number>
): Tile[] {
  const tiles: Tile[] = [];
  for (const wind of WINDS) {
    const key = getWindKey(wind);
    const value = tileValues[key] ?? NON_NUMBER_BASE_VALUE;
    for (let copy = 0; copy < TILES_PER_KIND; copy++) {
      tiles.push({
        id: `wind-${wind}-${copy}`,
        type: TileType.WIND,
        wind,
        value,
        name: `${wind} wind`,
      });
    }
  }
  return tiles;
}

export function createFullDeck(tileValues: Record<string, number>): Tile[] {
  return [
    ...createNumberTiles(),
    ...createDragonTiles(tileValues),
    ...createWindTiles(tileValues),
  ];
}

export function getInitialTileValues(): Record<string, number> {
  const values: Record<string, number> = {};
  for (const dragon of DRAGONS) {
    values[getDragonKey(dragon)] = NON_NUMBER_BASE_VALUE;
  }
  for (const wind of WINDS) {
    values[getWindKey(wind)] = NON_NUMBER_BASE_VALUE;
  }
  return values;
}

export function getDragonKey(dragon: DragonTile): string {
  return `dragon-${dragon}`;
}

export function getWindKey(wind: WindTile): string {
  return `wind-${wind}`;
}

export function getNonNumberTileKey(tile: Tile): string | null {
  if (tile.type === TileType.DRAGON && tile.dragon) {
    return getDragonKey(tile.dragon);
  }
  if (tile.type === TileType.WIND && tile.wind) {
    return getWindKey(tile.wind);
  }
  return null;
}
