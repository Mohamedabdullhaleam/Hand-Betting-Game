import { Component, Input, OnChanges } from '@angular/core';
import { Tile, TileType, TileSuit, DragonTile, WindTile } from '@hand-betting-game/shared-types';

/** Readable suit icons that render well on all platforms */
const SUIT_ICONS: Record<TileSuit, string> = {
  [TileSuit.BAMBOO]:     '竹',
  [TileSuit.CHARACTERS]: '万',
  [TileSuit.CIRCLES]:    '●',
};

const SUIT_CSS: Record<TileSuit, string> = {
  [TileSuit.BAMBOO]:     'bamboo',
  [TileSuit.CHARACTERS]: 'characters',
  [TileSuit.CIRCLES]:    'circles',
};

const DRAGON_INFO: Record<DragonTile, { icon: string; label: string; cssClass: string }> = {
  [DragonTile.RED]:   { icon: '中', label: 'Red',   cssClass: 'dragon-red' },
  [DragonTile.GREEN]: { icon: '發', label: 'Green', cssClass: 'dragon-green' },
  [DragonTile.WHITE]: { icon: '白', label: 'White', cssClass: 'dragon-white' },
};

const WIND_INFO: Record<WindTile, { icon: string; label: string }> = {
  [WindTile.EAST]:  { icon: '東', label: 'East' },
  [WindTile.SOUTH]: { icon: '南', label: 'South' },
  [WindTile.WEST]:  { icon: '西', label: 'West' },
  [WindTile.NORTH]: { icon: '北', label: 'North' },
};

@Component({
  selector: 'app-tile',
  template: `
    <div class="tile"
         [class.tile--small]="small"
         [class.tile--number]="isNumber"
         [class.tile--dragon]="isDragon"
         [class.tile--wind]="isWind"
         [class.tile--danger]="isDanger"
         [attr.data-suit]="suitAttr"
         [attr.data-dragon]="dragonClass">
      <span class="tile__label">{{ topLabel }}</span>
      <span class="tile__icon">{{ icon }}</span>
      <span class="tile__value-badge">{{ tile.value }}</span>
    </div>
  `,
  styleUrl: './tile.component.scss',
})
export class TileComponent implements OnChanges {
  @Input({ required: true }) tile!: Tile;
  @Input() small = false;

  icon       = '';
  topLabel   = '';
  isNumber   = false;
  isDragon   = false;
  isWind     = false;
  isDanger   = false;
  suitAttr   = '';
  dragonClass = '';

  ngOnChanges(): void {
    this.isNumber = this.tile.type === TileType.NUMBER;
    this.isDragon = this.tile.type === TileType.DRAGON;
    this.isWind   = this.tile.type === TileType.WIND;
    this.isDanger = !this.isNumber && (this.tile.value <= 1 || this.tile.value >= 9);

    this.resolve();
  }

  private resolve(): void {
    if (this.isNumber && this.tile.suit !== undefined) {
      this.icon     = SUIT_ICONS[this.tile.suit];
      this.topLabel = String(this.tile.value);
      this.suitAttr = SUIT_CSS[this.tile.suit];
      this.dragonClass = '';
    } else if (this.isDragon && this.tile.dragon !== undefined) {
      const info = DRAGON_INFO[this.tile.dragon];
      this.icon       = info.icon;
      this.topLabel   = info.label;
      this.suitAttr   = 'dragon';
      this.dragonClass = info.cssClass;
    } else if (this.isWind && this.tile.wind !== undefined) {
      const info = WIND_INFO[this.tile.wind];
      this.icon     = info.icon;
      this.topLabel = info.label;
      this.suitAttr = 'wind';
      this.dragonClass = '';
    } else {
      this.icon     = '?';
      this.topLabel = '?';
      this.suitAttr = '';
      this.dragonClass = '';
    }
  }
}
