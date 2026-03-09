import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BetDirection } from '@hand-betting-game/shared-types';

export const GameActions = createActionGroup({
  source: 'Game',
  events: {
    'Start Game': emptyProps(),
    'Draw Hand': emptyProps(),
    'Place Bet': props<{ direction: BetDirection }>(),
    'Game Over': props<{ reason: string }>(),
    'Reset Game': emptyProps(),
  },
});
