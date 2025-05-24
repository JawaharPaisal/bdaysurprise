import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SafeTaskProps {
  onComplete: () => void;
}

export default function SafeTask({ onComplete }: SafeTaskProps) {
  const [combination, setCombination] = useState(['', '', '', '']);
  const [targetCombination] = useState(['2', '6', '0', '5']);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [hints, setHints] = useState<string[]>([]);

  const maxAttempts = 8;

  useEffect(() => {
    // Generate specific hints for code 2605
    const newHints = [
      `First digit: It's the only even number less than 3`,
      `Second digit: Half a dozen items`,
      `Third digit: The number of sides on a circle`,
      `Fourth digit: Number of fingers on one hand`,
      `Additional clue: This code represents a special date (26th day, 5th month)`
    ];
    setHints(newHints);
  }, [targetCombination]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCombination = [...combination];
      newCombination[index] = value;
      setCombination(newCombination);
    }
  };

  const checkCombination = () => {
    if (combination.some(digit => digit === '')) {
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (combination.join('') === targetCombination.join('')) {
      setGameWon(true);
      setFeedback(['🎉 Correct! Safe unlocked!']);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      // Provide feedback
      const correctPositions = combination.filter((digit, index) => digit === targetCombination[index]).length;
      const correctDigits = combination.filter(digit => targetCombination.includes(digit)).length;
      
      const feedbackMessage = `Attempt ${newAttempts}: ${correctPositions} correct positions, ${correctDigits} correct digits`;
      setFeedback(prev => [feedbackMessage, ...prev.slice(0, 4)]);
      
      if (newAttempts >= maxAttempts) {
        setFeedback(prev => [`Game Over! Code was: ${targetCombination.join('')}`, ...prev]);
      }
    }
  };

  const resetGame = () => {
    setCombination(['', '', '', '']);
    setAttempts(0);
    setFeedback([]);
    setGameWon(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-game-cyan mb-2">Safe Cracker</h3>
        <p className="text-gray-300 text-sm mb-2">Find the 4-digit combination</p>
        <div className="text-game-yellow font-semibold">
          Attempts: {attempts}/{maxAttempts}
        </div>
      </div>

      {/* Safe Visual */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-6 border-4 border-game-accent mb-6 shadow-2xl">
        <div className="bg-black rounded-xl p-4 mb-4">
          <div className="text-center text-game-cyan font-mono text-lg mb-2">SECURE VAULT</div>
          
          {/* Digital Display */}
          <div className="bg-green-900 rounded-lg p-3 mb-4">
            <div className="flex justify-center space-x-2">
              {combination.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  className="w-12 h-12 bg-black text-green-400 text-xl font-mono text-center rounded border-2 border-green-500 focus:border-green-300 focus:outline-none"
                  maxLength={1}
                  disabled={gameWon || attempts >= maxAttempts}
                />
              ))}
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={checkCombination}
              disabled={combination.some(digit => digit === '') || gameWon || attempts >= maxAttempts}
              className="bg-game-red hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl"
            >
              🔓 Try Code
            </Button>
            <Button
              onClick={resetGame}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-xl"
            >
              🔄 Reset
            </Button>
          </div>
        </div>

        {/* Status Light */}
        <div className="text-center">
          <div className={`inline-block w-4 h-4 rounded-full ${
            gameWon ? 'bg-green-500 animate-pulse' : 
            attempts >= maxAttempts ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <div className="text-xs text-gray-400 mt-1">
            {gameWon ? 'UNLOCKED' : attempts >= maxAttempts ? 'LOCKED' : 'STANDBY'}
          </div>
        </div>
      </div>

      {/* Hints Panel */}
      <div className="bg-game-surface/50 rounded-xl p-4 mb-4">
        <h4 className="text-game-cyan font-semibold mb-2">📋 Intelligence Report:</h4>
        <div className="space-y-1 text-sm text-gray-300">
          {hints.map((hint, index) => (
            <div key={index} className="flex items-start">
              <span className="text-game-yellow mr-2">•</span>
              <span>{hint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="bg-game-surface/30 rounded-xl p-4">
          <h4 className="text-game-cyan font-semibold mb-2">🔍 Analysis:</h4>
          <div className="space-y-1 text-sm">
            {feedback.map((message, index) => (
              <div key={index} className={`${
                message.includes('Correct!') ? 'text-game-green' :
                message.includes('Game Over') ? 'text-game-red' :
                'text-gray-300'
              }`}>
                {message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}