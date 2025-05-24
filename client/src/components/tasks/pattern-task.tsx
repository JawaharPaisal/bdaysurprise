import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PatternTaskProps {
  onComplete: () => void;
}

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const SHAPES = ['circle', 'square', 'triangle', 'diamond'];

interface PatternElement {
  id: number;
  color: string;
  shape: string;
}

export default function PatternTask({ onComplete }: PatternTaskProps) {
  const [targetPattern, setTargetPattern] = useState<PatternElement[]>([]);
  const [playerPattern, setPlayerPattern] = useState<PatternElement[]>([]);
  const [availableElements, setAvailableElements] = useState<PatternElement[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [round, setRound] = useState(1);

  const generatePattern = () => {
    // Create target pattern (4 elements)
    const pattern: PatternElement[] = [];
    for (let i = 0; i < 4; i++) {
      pattern.push({
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
      });
    }
    setTargetPattern(pattern);

    // Create available elements (target + 4 decoys)
    const available = [...pattern];
    for (let i = 0; i < 4; i++) {
      available.push({
        id: i + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
      });
    }
    
    // Shuffle available elements
    const shuffled = available.sort(() => Math.random() - 0.5);
    setAvailableElements(shuffled);
    setPlayerPattern([]);
    setGameStarted(true);
  };

  const handleElementClick = (element: PatternElement) => {
    if (!gameStarted || isComplete) return;

    const newPlayerPattern = [...playerPattern, element];
    setPlayerPattern(newPlayerPattern);

    // Check if pattern matches so far
    const isCorrectSoFar = newPlayerPattern.every((el, index) => 
      el.color === targetPattern[index]?.color && el.shape === targetPattern[index]?.shape
    );

    if (!isCorrectSoFar) {
      // Wrong element - reset
      setTimeout(() => {
        setPlayerPattern([]);
      }, 500);
      return;
    }

    // Check if complete
    if (newPlayerPattern.length === targetPattern.length) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const renderShape = (shape: string, color: string, size: string = "w-8 h-8") => {
    const baseClasses = `${size} transition-all duration-200`;
    
    switch (shape) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`} style={{ backgroundColor: color }} />;
      case 'square':
        return <div className={`${baseClasses} rounded-lg`} style={{ backgroundColor: color }} />;
      case 'triangle':
        return (
          <div 
            className={`${baseClasses} transform rotate-0`}
            style={{ 
              width: 0, 
              height: 0, 
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderBottom: `28px solid ${color}`
            }} 
          />
        );
      case 'diamond':
        return (
          <div 
            className={`${baseClasses} transform rotate-45`}
            style={{ backgroundColor: color }}
          />
        );
      default:
        return <div className={`${baseClasses} rounded-full`} style={{ backgroundColor: color }} />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-game-cyan mb-2">Pattern Recognition</h3>
        <p className="text-gray-300 text-sm mb-2">Recreate the pattern shown above</p>
        <div className="text-game-yellow font-semibold">
          Round: {round} | Progress: {playerPattern.length}/4
        </div>
      </div>

      {!gameStarted && (
        <div className="text-center mb-6">
          <Button 
            onClick={generatePattern}
            className="bg-game-accent hover:bg-game-red text-white font-bold py-3 px-6 rounded-xl"
          >
            🧠 Start Pattern Test
          </Button>
        </div>
      )}

      {isComplete && (
        <div className="text-center mb-6 text-game-green font-bold text-lg">
          Pattern Matched! 🎯
        </div>
      )}

      {gameStarted && (
        <div className="space-y-6">
          {/* Target Pattern Display */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-4 border-game-accent">
            <h4 className="text-center text-game-cyan font-semibold mb-4">🎯 Target Pattern</h4>
            <div className="flex justify-center space-x-4">
              {targetPattern.map((element, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                    {renderShape(element.shape, element.color, "w-8 h-8")}
                  </div>
                  <span className="text-xs text-gray-400">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Player Pattern Progress */}
          <div className="bg-game-surface/50 rounded-xl p-4">
            <h4 className="text-center text-game-yellow font-semibold mb-4">Your Pattern</h4>
            <div className="flex justify-center space-x-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-500">
                    {playerPattern[index] && renderShape(playerPattern[index].shape, playerPattern[index].color, "w-8 h-8")}
                  </div>
                  <span className="text-xs text-gray-400">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Elements */}
          <div className="bg-black/30 rounded-xl p-4">
            <h4 className="text-center text-white font-semibold mb-4">Available Elements</h4>
            <div className="grid grid-cols-4 gap-3">
              {availableElements.map((element) => (
                <Button
                  key={element.id}
                  onClick={() => handleElementClick(element)}
                  className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                  disabled={isComplete}
                >
                  {renderShape(element.shape, element.color, "w-8 h-8")}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={generatePattern}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-xl"
            >
              🔄 New Pattern
            </Button>
          </div>
        </div>
      )}

      <div className="text-center mt-4 text-xs text-gray-400">
        Click the elements in the same order as the target pattern
      </div>
    </div>
  );
}