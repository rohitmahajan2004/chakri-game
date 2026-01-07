import { GamePhase } from '@/types/game';

interface BetSummaryProps {
  totalBet: number;
  potentialReward: number;
  remainingBalance: number;
  selectedNumbers: number[];
  phase: GamePhase;
  lastWinAmount: number | null;
  winningNumber: number | null;
}

export const BetSummary = ({
  totalBet,
  potentialReward,
  remainingBalance,
  selectedNumbers,
  phase,
  lastWinAmount,
  winningNumber,
}: BetSummaryProps) => {
  const isWinner = phase === 'result' && lastWinAmount !== null && lastWinAmount > 0;
  const isLoser = phase === 'result' && lastWinAmount === 0;

  return (
    <div className="card-elevated p-5 space-y-4">
      <h3 className="font-display text-xl tracking-wider text-primary">Bet Summary</h3>
      
      {phase === 'result' && (
        <div className={`p-4 rounded-lg text-center ${isWinner ? 'bg-accent/20 border border-accent' : 'bg-destructive/20 border border-destructive'}`}>
          <p className="text-sm uppercase tracking-wider mb-1">Result</p>
          {isWinner ? (
            <>
              <p className="font-display text-3xl text-accent animate-result-pop">WIN!</p>
              <p className="text-xl font-bold text-accent">+₹{lastWinAmount.toLocaleString()}</p>
            </>
          ) : (
            <>
              <p className="font-display text-3xl text-destructive animate-result-pop">LOSS</p>
              <p className="text-muted-foreground">Winning number: {winningNumber}</p>
            </>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">Numbers Selected</span>
          <span className="font-semibold">
            {selectedNumbers.length > 0 ? selectedNumbers.sort((a, b) => a - b).join(', ') : '-'}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">Total Bet</span>
          <span className="font-bold text-lg">₹{totalBet.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">Potential Win</span>
          <span className="font-bold text-lg text-accent">₹{potentialReward.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-muted-foreground">After Bet Balance</span>
          <span className={`font-bold text-lg ${remainingBalance < 0 ? 'text-destructive' : ''}`}>
            ₹{remainingBalance.toLocaleString()}
          </span>
        </div>

        {remainingBalance < 0 && (
          <p className="text-sm text-destructive text-center">Insufficient balance!</p>
        )}
      </div>
    </div>
  );
};
