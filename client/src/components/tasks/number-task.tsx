import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NumberTaskProps {
  onComplete: () => void;
}

const NUMBERS = [7, 3, 9, 1, 5, 2, 8, 4, 10, 6];

export default function NumberTask({ onComplete }: NumberTaskProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [expectedNext, setExpectedNext] = useState(1);
  const [clickedNumbers, setClickedNumbers] = useState<Set<number>>(new Set());

  const handleNumberClick = (number: number) => {
    if (number === expectedNext) {
      setSequence(prev => [...prev, number]);
      setClickedNumbers(prev => new Set([...prev, number]));
      setExpectedNext(prev => prev + 1);
    } else {
      // Wrong number - show shake animation
      const button = document.querySelector(`[data-number="${number}"]`);
      if (button) {
        button.classList.add('animate-shake');
        setTimeout(() => {
          button.classList.remove('animate-shake');
        }, 500);
      }
      
      // Show toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-game-accent text-white px-6 py-3 rounded-xl shadow-xl z-50 font-semibold';
      toast.textContent = "Wrong order! Try again.";
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 2000);
    }
  };

  useEffect(() => {
    if (sequence.length >= 10) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [sequence.length, onComplete]);

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <p className="text-game-cyan">Click the numbers in order: 1 → 10</p>
      </div>
      
      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
        {NUMBERS.map(number => (
          <Button
            key={number}
            data-number={number}
            className={`w-12 h-12 font-bold transition-all ${
              clickedNumbers.has(number)
                ? 'bg-game-green text-game-bg border-game-green'
                : 'bg-game-surface border-2 border-game-cyan text-white hover:bg-game-cyan hover:text-game-bg'
            }`}
            onClick={() => handleNumberClick(number)}
            disabled={clickedNumbers.has(number)}
          >
            {number}
          </Button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400">Next: </span>
        <span className="text-game-yellow font-bold">
          {expectedNext <= 10 ? expectedNext : 'Complete!'}
        </span>
      </div>
    </div>
  );
}
