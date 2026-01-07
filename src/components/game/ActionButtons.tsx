import { RotateCcw, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GamePhase } from '@/types/game';

interface ActionButtonsProps {
  phase: GamePhase;
  canSpin: boolean;
  onClear: () => void;
  onSpin: () => void;
  onNewRound: () => void;
}

export const ActionButtons = ({ phase, canSpin, onClear, onSpin, onNewRound }: ActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      {phase === 'result' ? (
        <Button
          onClick={onNewRound}
          className="flex-1 h-14 text-lg font-display tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground gold-glow"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          New Round
        </Button>
      ) : (
        <>
          <Button
            onClick={onClear}
            disabled={phase !== 'betting'}
            variant="outline"
            className="w-full h-14 text-lg font-display tracking-wider border-border hover:bg-muted disabled:opacity-50"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Clear
          </Button>
        </>
      )}
    </div>
  );
};
