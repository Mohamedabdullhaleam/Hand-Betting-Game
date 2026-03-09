import { createReducer, on } from '@ngrx/store';
import { LeaderboardEntry } from '@hand-betting-game/shared-types';
import { LeaderboardActions } from './leaderboard.actions';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  entries: [],
  loading: false,
  error: null,
};

export const leaderboardReducer = createReducer(
  initialState,

  on(LeaderboardActions.loadScores, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeaderboardActions.loadScoresSuccess, (state, { entries }) => ({
    ...state,
    entries,
    loading: false,
  })),

  on(LeaderboardActions.loadScoresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeaderboardActions.saveScoreSuccess, (state, { entry }) => {
    const updated = [...state.entries, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return { ...state, entries: updated };
  })
);
