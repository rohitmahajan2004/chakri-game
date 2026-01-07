import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GamePhase, BETTING_TIME, INITIAL_BALANCE, NUMBER_OPTIONS } from '@/types/game';

export const useGameState = () => {
  const [state, setState] = useState<GameState>({
    phase: 'betting',
    walletBalance: INITIAL_BALANCE,
    roundNumber: 1058,
    timer: BETTING_TIME,
    selectedAmount: null,
    selectedNumbers: [],
    winningNumber: null,
    lastResults: [],
    lastWinAmount: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown
  useEffect(() => {
    if (state.phase === 'betting' && state.timer > 0) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timer <= 1) {
            return { ...prev, timer: 0, phase: 'locked' };
          }
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.phase, state.timer]);

  const selectAmount = useCallback((amount: number) => {
    if (state.phase !== 'betting') return;
    setState(prev => ({
      ...prev,
      selectedAmount: prev.selectedAmount === amount ? null : amount,
    }));
  }, [state.phase]);

  const toggleNumber = useCallback((number: number) => {
    if (state.phase !== 'betting') return;
    setState(prev => {
      const isSelected = prev.selectedNumbers.includes(number);
      const newNumbers = isSelected
        ? prev.selectedNumbers.filter(n => n !== number)
        : [...prev.selectedNumbers, number];
      return { ...prev, selectedNumbers: newNumbers };
    });
  }, [state.phase]);

  const clearBets = useCallback(() => {
    if (state.phase !== 'betting') return;
    setState(prev => ({
      ...prev,
      selectedAmount: null,
      selectedNumbers: [],
    }));
  }, [state.phase]);

  const getTotalBet = useCallback(() => {
    if (!state.selectedAmount || state.selectedNumbers.length === 0) return 0;
    return state.selectedAmount * state.selectedNumbers.length;
  }, [state.selectedAmount, state.selectedNumbers]);

  const getPotentialReward = useCallback(() => {
    if (!state.selectedAmount || state.selectedNumbers.length === 0) return 0;
    // 10x multiplier for winning
    return state.selectedAmount * 10;
  }, [state.selectedAmount]);

  const canBet = useCallback(() => {
    const totalBet = getTotalBet();
    return totalBet > 0 && totalBet <= state.walletBalance;
  }, [getTotalBet, state.walletBalance]);

  const spin = useCallback(() => {
    if (state.phase !== 'locked') return;

    setState(prev => ({ ...prev, phase: 'spinning' }));

    // Random spin duration between 10-30 seconds
    const spinDuration = Math.random() * 20000 + 10000;

    // Random winning number
    const winningNumber = NUMBER_OPTIONS[Math.floor(Math.random() * NUMBER_OPTIONS.length)];

    setTimeout(() => {
      setState(prev => {
        const isWinner = prev.selectedNumbers.includes(winningNumber);
        const winAmount = isWinner ? (prev.selectedAmount || 0) * 10 : 0;
        const totalBet = (prev.selectedAmount || 0) * prev.selectedNumbers.length;
        const newBalance = prev.walletBalance - totalBet + winAmount;

        return {
          ...prev,
          phase: 'result',
          winningNumber,
          walletBalance: newBalance,
          lastWinAmount: isWinner ? winAmount : 0,
          lastResults: [winningNumber, ...prev.lastResults].slice(0, 10),
        };
      });
    }, spinDuration);

    return { spinDuration, winningNumber };
  }, [state.phase]);

  const startNewRound = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'betting',
      timer: BETTING_TIME,
      roundNumber: prev.roundNumber + 1,
      selectedAmount: null,
      selectedNumbers: [],
      winningNumber: null,
      lastWinAmount: null,
    }));
  }, []);

  return {
    state,
    selectAmount,
    toggleNumber,
    clearBets,
    getTotalBet,
    getPotentialReward,
    canBet,
    spin,
    startNewRound,
  };
};
