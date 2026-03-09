import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LeaderboardActions } from './leaderboard.actions';
import { LeaderboardService } from '../../services/leaderboard.service';

@Injectable()
export class LeaderboardEffects {
  private actions$ = inject(Actions);
  private leaderboardService = inject(LeaderboardService);

  loadScores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaderboardActions.loadScores),
      switchMap(() =>
        this.leaderboardService.getTopScores().pipe(
          map((entries) => LeaderboardActions.loadScoresSuccess({ entries })),
          catchError((error) =>
            of(LeaderboardActions.loadScoresFailure({ error: error.message }))
          )
        )
      )
    )
  );

  saveScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaderboardActions.saveScore),
      switchMap(({ entry }) =>
        this.leaderboardService.saveScore(entry).pipe(
          map((saved) => LeaderboardActions.saveScoreSuccess({ entry: saved })),
          catchError((error) =>
            of(LeaderboardActions.saveScoreFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
