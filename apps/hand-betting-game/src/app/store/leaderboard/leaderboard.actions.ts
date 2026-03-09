import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LeaderboardEntry } from '@hand-betting-game/shared-types';

export const LeaderboardActions = createActionGroup({
  source: 'Leaderboard',
  events: {
    'Load Scores': emptyProps(),
    'Load Scores Success': props<{ entries: LeaderboardEntry[] }>(),
    'Load Scores Failure': props<{ error: string }>(),
    'Save Score': props<{ entry: Omit<LeaderboardEntry, '_id'> }>(),
    'Save Score Success': props<{ entry: LeaderboardEntry }>(),
    'Save Score Failure': props<{ error: string }>(),
  },
});
