import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { TopBar } from '@/components/game/TopBar';
import { RouletteWheel } from '@/components/game/RouletteWheel';
import { BetControls } from '@/components/game/BetControls';
import { BetSummary } from '@/components/game/BetSummary';
import { LastResults } from '@/components/game/LastResults';
import { ActionButtons } from '@/components/game/ActionButtons';

const Index = () => {
  const {
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
  } = useGameState();

  const [spinData, setSpinData] = useState<{ winningNumber: number } | null>(null);

  const handleSpin = async () => {
    const result = await spin();
    if (result) {
      setSpinData({ winningNumber: result.winningNumber });
    }
  };

  // Auto-spin when timer hits 0
  useEffect(() => {
    if (state.phase === 'locked') {
      handleSpin();
    }
  }, [state.phase]);

  const totalBet = getTotalBet();
  const remainingBalance = state.walletBalance - totalBet;

  return (
    <div className="min-h-screen casino-gradient">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Top Bar */}
        <TopBar
          walletBalance={state.walletBalance}
          timer={state.timer}
          roundNumber={state.roundNumber}
          phase={state.phase}
          onAddFunds={addFunds}
        />

        {/* Main Game Area */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Roulette Wheel */}
          <div className="lg:col-span-2 flex items-center justify-center py-8">
            <RouletteWheel
              isSpinning={state.phase === 'spinning'}
              winningNumber={spinData?.winningNumber ?? state.winningNumber}
            />
          </div>

          {/* Right: Game Controls */}
          <div className="space-y-4">
            <LastResults results={state.lastResults} />

            <BetSummary
              totalBet={totalBet}
              potentialReward={getPotentialReward()}
              remainingBalance={remainingBalance}
              selectedNumbers={state.selectedNumbers}
              phase={state.phase}
              lastWinAmount={state.lastWinAmount}
              winningNumber={state.winningNumber}
            />

            <ActionButtons
              phase={state.phase}
              canSpin={canBet()}
              onClear={clearBets}
              onSpin={handleSpin}
              onNewRound={() => {
                setSpinData(null);
                startNewRound();
              }}
            />
          </div>
        </div>

        {/* Bottom: Bet Controls */}
        <div className="mt-6">
          <BetControls
            selectedAmount={state.selectedAmount}
            selectedNumbers={state.selectedNumbers}
            winningNumber={state.winningNumber}
            phase={state.phase}
            onSelectAmount={selectAmount}
            onToggleNumber={toggleNumber}
          />
        </div>

        {/* Game Status Message */}
        <div className="mt-6 text-center">
          {state.phase === 'betting' && (
            <p className="text-muted-foreground">
              Place your bets! Select an amount and one or more numbers.
            </p>
          )}
          {state.phase === 'locked' && (
            <p className="text-primary font-semibold animate-pulse">
              Betting closed. Click SPIN to start!
            </p>
          )}
          {state.phase === 'spinning' && (
            <p className="text-primary font-semibold">
              The wheel is spinning... Good luck!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
