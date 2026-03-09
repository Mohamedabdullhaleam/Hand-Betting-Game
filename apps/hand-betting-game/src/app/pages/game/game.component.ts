import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { GameActions } from '../../store/game.actions';
import {
  selectCurrentHand,
  selectPreviousHand,
  selectScore,
  selectDrawPileCount,
  selectDiscardPileCount,
  selectIsGameOver,
  selectRoundNumber,
  selectDrawPileExhaustionCount,
  selectLastBetResult,
  selectLastScoreDelta,
} from '../../store/game.selectors';
import { TileComponent } from '../../components/tile/tile.component';

@Component({
  selector: 'app-game',
  imports: [RouterModule, AsyncPipe, DecimalPipe, TileComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  currentHand$   = this.store.select(selectCurrentHand);
  previousHand$  = this.store.select(selectPreviousHand);
  score$         = this.store.select(selectScore);
  drawCount$     = this.store.select(selectDrawPileCount);
  discardCount$  = this.store.select(selectDiscardPileCount);
  isGameOver$    = this.store.select(selectIsGameOver);
  round$         = this.store.select(selectRoundNumber);
  exhaustion$    = this.store.select(selectDrawPileExhaustionCount);
  lastBetResult$ = this.store.select(selectLastBetResult);
  lastScoreDelta$ = this.store.select(selectLastScoreDelta);

  /** Controls visibility of the result overlay */
  showResult = false;
  resultWon = false;
  resultDelta = 0;
  private resultTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.store.dispatch(GameActions.startGame());

    this.isGameOver$.subscribe((over) => {
      if (over) this.router.navigate(['/game-over']);
    });

    // Flash overlay whenever a bet resolves
    this.lastBetResult$.subscribe((result) => {
      if (!result) return;
      this.resultWon = result === 'win';
      this.showResult = true;
      if (this.resultTimer) clearTimeout(this.resultTimer);
      this.resultTimer = setTimeout(() => (this.showResult = false), 1200);
    });

    this.lastScoreDelta$.subscribe((delta) => (this.resultDelta = delta));
  }

  betHigher(): void {
    this.store.dispatch(GameActions.placeBet({ direction: 'higher' }));
  }

  betLower(): void {
    this.store.dispatch(GameActions.placeBet({ direction: 'lower' }));
  }
}
