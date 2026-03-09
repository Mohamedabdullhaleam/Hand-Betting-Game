import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectScore, selectGameOverReason } from '../../store/game.selectors';
import { GameActions } from '../../store/game.actions';
import { LeaderboardActions } from '../../store/leaderboard/leaderboard.actions';

@Component({
  selector: 'app-game-over',
  imports: [RouterModule, AsyncPipe, DecimalPipe, FormsModule],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent implements OnInit {
  private store = inject(Store);

  score$  = this.store.select(selectScore);
  reason$ = this.store.select(selectGameOverReason);

  playerName = '';
  submitted = false;

  ngOnInit(): void {
    // Snapshot the score for submission
    this.score$.subscribe((s) => (this._score = s));
  }

  private _score = 0;

  submitScore(): void {
    if (!this.playerName.trim()) return;
    this.store.dispatch(
      LeaderboardActions.saveScore({
        entry: {
          playerName: this.playerName.trim(),
          score: this._score,
          date: new Date().toISOString(),
        },
      })
    );
    this.submitted = true;
  }

  playAgain(): void {
    this.store.dispatch(GameActions.resetGame());
  }
}
