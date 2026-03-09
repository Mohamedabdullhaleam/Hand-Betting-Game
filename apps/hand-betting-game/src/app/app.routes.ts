import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./pages/game/game.component').then((m) => m.GameComponent),
  },
  {
    path: 'game-over',
    loadComponent: () =>
      import('./pages/game-over/game-over.component').then(
        (m) => m.GameOverComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
