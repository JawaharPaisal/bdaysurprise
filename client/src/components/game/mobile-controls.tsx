import { useState, useCallback } from "react";

interface MobileControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export default function MobileControls({ onMove }: MobileControlsProps) {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const handleButtonPress = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setActiveDirection(direction);
    onMove(direction);
  }, [onMove]);

  const handleButtonRelease = useCallback(() => {
    setActiveDirection(null);
  }, []);

  const ControlButton = ({ direction, children }: { direction: 'up' | 'down' | 'left' | 'right', children: React.ReactNode }) => (
    <button
      className={`w-12 h-12 bg-game-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg select-none touch-manipulation transition-all duration-150 ${
        activeDirection === direction ? 'bg-game-red scale-95' : 'active:scale-95 active:bg-game-red'
      }`}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleButtonPress(direction);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleButtonRelease();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        handleButtonPress(direction);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        handleButtonRelease();
      }}
      onMouseLeave={handleButtonRelease}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </button>
  );

  return (
    <div className="mobile-controls">
      <div className="grid grid-cols-3 gap-3 bg-card/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-border">
        <div></div>
        <ControlButton direction="up">↑</ControlButton>
        <div></div>
        
        <ControlButton direction="left">←</ControlButton>
        <div className="w-12 h-12 bg-muted/50 rounded-xl border border-border/20"></div>
        <ControlButton direction="right">→</ControlButton>
        
        <div></div>
        <ControlButton direction="down">↓</ControlButton>
        <div></div>
      </div>
    </div>
  );
}
