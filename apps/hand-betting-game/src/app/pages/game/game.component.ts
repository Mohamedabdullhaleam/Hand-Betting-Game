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

  currentHand$  = this.store.select(selectCurrentHand);
  previousHand$ = this.store.select(selectPreviousHand);
  score$        = this.store.select(selectScore);
  drawCount$    = this.store.select(selectDrawPileCount);
  discardCount$ = this.store.select(selectDiscardPileCount);
  isGameOver$   = this.store.select(selectIsGameOver);
  round$        = this.store.select(selectRoundNumber);
  exhaustion$   = this.store.select(selectDrawPileExhaustionCount);

  ngOnInit(): void {
    this.store.dispatch(GameActions.startGame());

    // Navigate to game-over when state changes
    this.isGameOver$.subscribe((over) => {
      if (over) this.router.navigate(['/game-over']);
    });
  }

  betHigher(): void {
    this.store.dispatch(GameActions.placeBet({ direction: 'higher' }));
  }

  betLower(): void {
    this.store.dispatch(GameActions.placeBet({ direction: 'lower' }));
  }
}
