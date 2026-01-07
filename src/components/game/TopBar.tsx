import { Wallet, Clock, Hash } from 'lucide-react';
import { GamePhase } from '@/types/game';

interface TopBarProps {
  walletBalance: number;
  timer: number;
  roundNumber: number;
  phase: GamePhase;
}

export const TopBar = ({ walletBalance, timer, roundNumber, phase }: TopBarProps) => {
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimerUrgent = timer <= 10 && phase === 'betting';

  return (
    <div className="flex items-center justify-between px-6 py-4 card-elevated">
      {/* Wallet */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Balance</p>
          <p className="text-xl font-bold text-primary font-display">₹{walletBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isTimerUrgent ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {phase === 'betting' ? 'Betting Time' : phase === 'spinning' ? 'Spinning...' : phase === 'result' ? 'Result' : 'Locked'}
          </span>
        </div>
        <p className={`text-4xl font-display tracking-wider ${isTimerUrgent ? 'text-destructive' : 'text-foreground'}`}>
          {phase === 'betting' || phase === 'locked' ? formatTimer(timer) : '--:--'}
        </p>
      </div>

      {/* Round Number */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider text-right">Round</p>
          <p className="text-xl font-bold font-display text-foreground">#{roundNumber}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Hash className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
