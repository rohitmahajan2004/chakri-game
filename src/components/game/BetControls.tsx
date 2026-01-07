import { MONEY_OPTIONS, NUMBER_OPTIONS, GamePhase } from '@/types/game';

interface BetControlsProps {
  selectedAmount: number | null;
  selectedNumbers: number[];
  winningNumber: number | null;
  phase: GamePhase;
  onSelectAmount: (amount: number) => void;
  onToggleNumber: (number: number) => void;
}

export const BetControls = ({
  selectedAmount,
  selectedNumbers,
  winningNumber,
  phase,
  onSelectAmount,
  onToggleNumber,
}: BetControlsProps) => {
  const isDisabled = phase !== 'betting';

  const getNumberButtonClass = (number: number) => {
    if (winningNumber === number && phase === 'result') {
      return 'btn-number btn-number-winner';
    }
    if (selectedNumbers.includes(number)) {
      return 'btn-number btn-number-selected';
    }
    return 'btn-number';
  };

  return (
    <div className="space-y-6">
      {/* Money Selection */}
      <div className="card-elevated p-4">
        <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Select Bet Amount</h3>
        <div className="flex flex-wrap gap-2">
          {MONEY_OPTIONS.map(amount => (
            <button
              key={amount}
              onClick={() => onSelectAmount(amount)}
              disabled={isDisabled}
              className={`btn-money ${selectedAmount === amount ? 'btn-money-selected' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ₹{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Number Selection */}
      <div className="card-elevated p-4">
        <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Select Numbers</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {NUMBER_OPTIONS.map(number => (
            <button
              key={number}
              onClick={() => onToggleNumber(number)}
              disabled={isDisabled}
              className={`${getNumberButtonClass(number)} ${isDisabled && phase !== 'result' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
