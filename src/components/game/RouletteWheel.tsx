import { useEffect, useState, useRef } from 'react';
import { NUMBER_OPTIONS } from '@/types/game';

interface RouletteWheelProps {
  isSpinning: boolean;
  winningNumber: number | null;
  onSpinComplete?: () => void;
}

export const RouletteWheel = ({ isSpinning, winningNumber, onSpinComplete }: RouletteWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (spinning && audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
    } else if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [spinning]);

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      setSpinning(true);

      // Calculate the final rotation to land on winning number
      // Each segment is 36 degrees (360/10)
      const segmentAngle = 360 / NUMBER_OPTIONS.length;
      // Winning number's position (0-indexed from top)
      const winningIndex = NUMBER_OPTIONS.indexOf(winningNumber);
      // Target angle to land on winning number (arrow at top, so we subtract from 360)
      const targetAngle = 360 - (winningIndex * segmentAngle) - (segmentAngle / 2);
      // Add multiple full rotations for effect
      const fullRotations = Math.floor(Math.random() * 5 + 8) * 360;
      const finalRotation = rotation + fullRotations + targetAngle - (rotation % 360);

      setRotation(finalRotation);
    } else if (!isSpinning) {
      setSpinning(false);
    }
  }, [isSpinning, winningNumber]);

  const handleTransitionEnd = () => {
    if (spinning) {
      setSpinning(false);
      onSpinComplete?.();
    }
  };

  const getSegmentColor = (number: number) => {
    if (winningNumber === number && !spinning) {
      return 'fill-accent';
    }
    return number % 2 === 0 ? 'fill-destructive' : 'fill-secondary';
  };

  const segmentAngle = 360 / NUMBER_OPTIONS.length;

  return (
    <div className="relative flex items-center justify-center">
      <audio ref={audioRef} src="/sound.mp3" loop preload="auto" />

      {/* Arrow indicator at top */}
      <div className="absolute -top-2 z-20">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>

      {/* Outer ring */}
      <div className="absolute w-[340px] h-[340px] rounded-full bg-gradient-to-br from-casino-gold to-casino-gold-dark opacity-80" />

      {/* Wheel container */}
      <div
        ref={wheelRef}
        className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Wheel segments */}
          {NUMBER_OPTIONS.map((number, index) => {
            const startAngle = index * segmentAngle - 90;
            const endAngle = startAngle + segmentAngle;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 100 + 100 * Math.cos(startRad);
            const y1 = 100 + 100 * Math.sin(startRad);
            const x2 = 100 + 100 * Math.cos(endRad);
            const y2 = 100 + 100 * Math.sin(endRad);

            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

            const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            // Text position (middle of segment)
            const textAngle = startAngle + segmentAngle / 2;
            const textRad = (textAngle * Math.PI) / 180;
            const textX = 100 + 70 * Math.cos(textRad);
            const textY = 100 + 70 * Math.sin(textRad);

            return (
              <g key={number}>
                <path
                  d={pathData}
                  className={`${getSegmentColor(number)} transition-colors duration-300`}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-bold text-lg"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {number}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx="100"
            cy="100"
            r="25"
            className="fill-card stroke-border"
            strokeWidth="2"
          />

          <image
            href="src/assets/logo.svg"
            x="75"
            y="75"
            width="50"
            height="50"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      {/* Glow effect when spinning */}
      {spinning && (
        <div className="absolute inset-0 w-80 h-80 rounded-full animate-pulse-gold pointer-events-none" />
      )}
    </div>
  );
};
