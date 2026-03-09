import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
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
export class GameComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private subs = new Subscription();

  currentHand$    = this.store.select(selectCurrentHand);
  previousHand$   = this.store.select(selectPreviousHand);
  score$          = this.store.select(selectScore);
  drawCount$      = this.store.select(selectDrawPileCount);
  discardCount$   = this.store.select(selectDiscardPileCount);
  isGameOver$     = this.store.select(selectIsGameOver);
  round$          = this.store.select(selectRoundNumber);
  exhaustion$     = this.store.select(selectDrawPileExhaustionCount);
  lastBetResult$  = this.store.select(selectLastBetResult);
  lastScoreDelta$ = this.store.select(selectLastScoreDelta);

  showResult = false;
  resultWon  = false;
  resultDelta = 0;
  private resultTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.store.dispatch(GameActions.startGame());

    this.subs.add(
      this.isGameOver$.subscribe((over) => {
        if (over) this.router.navigate(['/game-over']);
      })
    );

    this.subs.add(
      this.lastBetResult$.subscribe((result) => {
        if (!result) return;
        this.resultWon = result === 'win';
        this.showResult = true;
        if (this.resultTimer) clearTimeout(this.resultTimer);
        this.resultTimer = setTimeout(() => (this.showResult = false), 1200);
      })
    );

    this.subs.add(
      this.lastScoreDelta$.subscribe((delta) => (this.resultDelta = delta))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.resultTimer) clearTimeout(this.resultTimer);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (event.key === 'h' || event.key === 'H') this.betHigher();
    if (event.key === 'l' || event.key === 'L') this.betLower();
  }

  betHigher(): void {
    this.store.dispatch(GameActions.placeBet({ direction: 'higher' }));
  }

  betLower(): void {
    this.store.dispatch(GameActions.placeBet({ direction: 'lower' }));
  }
}
