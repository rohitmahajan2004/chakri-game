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

  // Fetch initial state
  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        setState(prev => ({
          ...prev,
          walletBalance: data.walletBalance,
          roundNumber: data.roundNumber,
          lastResults: data.lastResults,
        }));
      })
      .catch(err => console.error("Failed to fetch initial state:", err));
  }, []);

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
    return state.selectedAmount * 10;
  }, [state.selectedAmount]);

  const canBet = useCallback(() => {
    const totalBet = getTotalBet();
    return totalBet > 0 && totalBet <= state.walletBalance;
  }, [getTotalBet, state.walletBalance]);

  const spin = useCallback(async () => {
    if (state.phase !== 'locked') return;

    setState(prev => ({ ...prev, phase: 'spinning' }));

    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedAmount: state.selectedAmount!,
          selectedNumbers: state.selectedNumbers,
        }),
      });

      if (!res.ok) throw new Error('Spin failed');

      const result = await res.json();

      // We got the result, but we wait for the spin duration to show it
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          phase: 'result',
          winningNumber: result.winningNumber,
          walletBalance: result.newBalance,
          lastWinAmount: result.winAmount,
          lastResults: result.lastResults,
        }));
      }, result.spinDuration);

      return {
        spinDuration: result.spinDuration,
        winningNumber: result.winningNumber
      };

    } catch (error) {
      console.error("Spin error:", error);
      // Reset to betting on error so user isn't stuck
      setState(prev => ({ ...prev, phase: 'betting' }));
    }

  }, [state.phase, state.selectedAmount, state.selectedNumbers]);

  const startNewRound = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'betting',
      timer: BETTING_TIME,
      roundNumber: prev.roundNumber + 1, // Ideally fetch this from server too, but +1 works for now
      selectedAmount: null,
      selectedNumbers: [],
      winningNumber: null,
      lastWinAmount: null,
    }));
  }, []);

  const addFunds = useCallback(async (amount: number, accountNumber: string) => {
    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, accountNumber }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Deposit failed:", err);
        throw new Error(err.detail || 'Deposit failed');
      }

      const data = await res.json();
      setState(prev => ({
        ...prev,
        walletBalance: data.walletBalance,
      }));
    } catch (error) {
      console.error("Deposit error:", error);
    }
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
    addFunds,
  };
};
