import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { gameReducer } from './store';
import { leaderboardReducer } from './store/leaderboard/leaderboard.reducer';
import { LeaderboardEffects } from './store/leaderboard/leaderboard.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideStore({ game: gameReducer, leaderboard: leaderboardReducer }),
    provideEffects([LeaderboardEffects]),
    provideStoreDevtools({ logOnly: !isDevMode() }),
  ],
};
