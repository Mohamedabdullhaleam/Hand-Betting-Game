import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { LeaderboardActions } from '../../store/leaderboard/leaderboard.actions';
import {
  selectLeaderboardEntries,
  selectLeaderboardLoading,
  selectLeaderboardError,
} from '../../store/leaderboard/leaderboard.selectors';

@Component({
  selector: 'app-landing',
  imports: [RouterModule, AsyncPipe, DecimalPipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  private store = inject(Store);

  entries$ = this.store.select(selectLeaderboardEntries);
  loading$ = this.store.select(selectLeaderboardLoading);
  error$ = this.store.select(selectLeaderboardError);

  ngOnInit(): void {
    this.store.dispatch(LeaderboardActions.loadScores());
  }
}
