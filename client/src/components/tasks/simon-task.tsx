import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SimonTaskProps {
  onComplete: () => void;
}

const COLORS = [
  { name: 'red', bg: 'bg-red-500', active: 'bg-red-300', sound: 400 },
  { name: 'blue', bg: 'bg-blue-500', active: 'bg-blue-300', sound: 500 },
  { name: 'green', bg: 'bg-green-500', active: 'bg-green-300', sound: 600 },
  { name: 'yellow', bg: 'bg-yellow-500', active: 'bg-yellow-300', sound: 700 }
];

export default function SimonTask({ onComplete }: SimonTaskProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'playing' | 'completed'>('waiting');
  const audioContext = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const playSound = (frequency: number) => {
    if (!audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.3);
  };

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setRound(1);
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(seq[i]);
      playSound(COLORS[seq[i]].sound);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(null);
    }
    
    setIsShowingSequence(false);
    setGameState('playing');
  };

  const handleColorClick = (colorIndex: number) => {
    if (isShowingSequence || gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);
    playSound(COLORS[colorIndex].sound);

    // Check if the player's input matches the sequence so far
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong! Reset the game
      setGameState('waiting');
      setPlayerSequence([]);
      return;
    }

    // Check if the player completed the current sequence
    if (newPlayerSequence.length === sequence.length) {
      if (round >= 5) {
        // Game completed!
        setGameState('completed');
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        // Next round
        setTimeout(() => {
          const newSequence = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(newSequence);
          setPlayerSequence([]);
          setRound(round + 1);
          setGameState('showing');
          showSequence(newSequence);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-game-cyan mb-2">Simon Says</h3>
        <p className="text-gray-300 mb-2">Watch the sequence, then repeat it!</p>
        <div className="text-sm text-game-yellow">
          Round: {round}/5 | Sequence Length: {sequence.length}
        </div>
      </div>

      {gameState === 'waiting' && (
        <div className="text-center mb-6">
          <Button 
            onClick={startGame}
            className="bg-game-accent hover:bg-game-red text-white font-bold py-3 px-6 rounded-xl"
          >
            Start Game
          </Button>
        </div>
      )}

      {gameState === 'showing' && (
        <div className="text-center mb-6 text-game-cyan font-semibold">
          Watch the sequence...
        </div>
      )}

      {gameState === 'playing' && (
        <div className="text-center mb-6 text-game-green font-semibold">
          Your turn! Repeat the sequence
        </div>
      )}

      {gameState === 'completed' && (
        <div className="text-center mb-6 text-game-yellow font-bold text-lg">
          Perfect! Sequence completed! 🎉
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {COLORS.map((color, index) => (
          <Button
            key={color.name}
            className={`w-24 h-24 rounded-xl border-4 border-white/20 transition-all duration-200 ${
              activeColor === index ? color.active : color.bg
            } ${
              !isShowingSequence && gameState === 'playing' 
                ? 'hover:scale-105 hover:brightness-110' 
                : 'cursor-not-allowed'
            }`}
            onClick={() => handleColorClick(index)}
            disabled={isShowingSequence || gameState !== 'playing'}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="text-xs text-gray-400">
          Progress: {playerSequence.length}/{sequence.length}
        </div>
      </div>
    </div>
  );
}