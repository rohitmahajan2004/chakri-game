export type GamePhase = 'betting' | 'locked' | 'spinning' | 'result';

export interface BetSelection {
  amount: number;
  numbers: number[];
}

export interface GameState {
  phase: GamePhase;
  walletBalance: number;
  roundNumber: number;
  timer: number;
  selectedAmount: number | null;
  selectedNumbers: number[];
  winningNumber: number | null;
  lastResults: number[];
  lastWinAmount: number | null;
}

export const MONEY_OPTIONS = [50, 100, 200, 500, 1000];
export const NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const BETTING_TIME = 60;
export const INITIAL_BALANCE = 9850;
