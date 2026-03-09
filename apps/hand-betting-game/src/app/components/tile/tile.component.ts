import { Component, Input, OnChanges } from '@angular/core';
import { Tile, TileType, TileSuit, DragonTile, WindTile } from '@hand-betting-game/shared-types';

const SUIT_SYMBOLS: Record<TileSuit, string[]> = {
  [TileSuit.BAMBOO]:     ['🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘'],
  [TileSuit.CHARACTERS]: ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏'],
  [TileSuit.CIRCLES]:    ['🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡'],
};

const DRAGON_SYMBOLS: Record<DragonTile, string> = {
  [DragonTile.RED]:   '🀄',
  [DragonTile.GREEN]: '🀅',
  [DragonTile.WHITE]: '🀆',
};

const WIND_SYMBOLS: Record<WindTile, string> = {
  [WindTile.EAST]:  '🀀',
  [WindTile.SOUTH]: '🀁',
  [WindTile.WEST]:  '🀂',
  [WindTile.NORTH]: '🀃',
};

@Component({
  selector: 'app-tile',
  template: `
    <div class="tile"
         [class.tile--small]="small"
         [class.tile--number]="isNumber"
         [class.tile--danger]="isDanger"
         [attr.data-suit]="suit">
      <span class="tile__symbol">{{ symbol }}</span>
      <span class="tile__value">{{ tile.value }}</span>
    </div>
  `,
  styleUrl: './tile.component.scss',
})
export class TileComponent implements OnChanges {
  @Input({ required: true }) tile!: Tile;
  @Input() small = false;

  symbol   = '';
  isNumber = false;
  isDanger = false;
  suit     = '';

  ngOnChanges(): void {
    this.isNumber = this.tile.type === TileType.NUMBER;
    this.suit     = this.tile.suit ?? this.tile.type;
    this.symbol   = this.resolveSymbol();
    // Danger: non-number tile is 1 step from game-over (value 0 or 10 ends game)
    this.isDanger = !this.isNumber && (this.tile.value <= 1 || this.tile.value >= 9);
  }

  private resolveSymbol(): string {
    if (this.tile.type === TileType.NUMBER && this.tile.suit) {
      const idx = this.tile.value - 1;
      return SUIT_SYMBOLS[this.tile.suit]?.[idx] ?? '🀫';
    }
    if (this.tile.type === TileType.DRAGON && this.tile.dragon) {
      return DRAGON_SYMBOLS[this.tile.dragon];
    }
    if (this.tile.type === TileType.WIND && this.tile.wind) {
      return WIND_SYMBOLS[this.tile.wind];
    }
    return '🀫';
  }
}
