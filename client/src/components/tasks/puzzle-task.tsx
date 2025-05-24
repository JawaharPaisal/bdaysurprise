import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PuzzleTaskProps {
  onComplete: () => void;
}

export default function PuzzleTask({ onComplete }: PuzzleTaskProps) {
  const [grid, setGrid] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const shuffleGrid = () => {
    const newGrid = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    
    // Simple shuffle - swap adjacent pieces many times
    for (let i = 0; i < 200; i++) {
      const emptyIndex = newGrid.indexOf(0);
      const possibleMoves = [];
      
      // Check possible moves (up, down, left, right)
      if (emptyIndex >= 3) possibleMoves.push(emptyIndex - 3); // up
      if (emptyIndex < 6) possibleMoves.push(emptyIndex + 3); // down
      if (emptyIndex % 3 !== 0) possibleMoves.push(emptyIndex - 1); // left
      if (emptyIndex % 3 !== 2) possibleMoves.push(emptyIndex + 1); // right
      
      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        // Swap empty space with random valid move
        [newGrid[emptyIndex], newGrid[randomMove]] = [newGrid[randomMove], newGrid[emptyIndex]];
      }
    }
    
    setGrid(newGrid);
    setMoves(0);
    setGameStarted(true);
    setIsWon(false);
  };

  const canMove = (index: number): boolean => {
    const emptyIndex = grid.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    
    // Check if the clicked tile is adjacent to empty space
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const moveTile = (index: number) => {
    if (!gameStarted || isWon || !canMove(index)) return;
    
    const newGrid = [...grid];
    const emptyIndex = grid.indexOf(0);
    
    // Swap the clicked tile with empty space
    [newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]];
    
    setGrid(newGrid);
    setMoves(moves + 1);
    
    // Check if puzzle is solved
    const isSolved = newGrid.every((num, idx) => {
      if (idx === 8) return num === 0; // Empty space should be at the end
      return num === idx + 1;
    });
    
    if (isSolved) {
      setIsWon(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-game-cyan mb-2">Sliding Puzzle</h3>
        <p className="text-gray-300 text-sm mb-2">Arrange the numbers in order (1-8)</p>
        <div className="text-game-yellow font-semibold">
          Moves: {moves}
        </div>
      </div>

      {!gameStarted && (
        <div className="text-center mb-6">
          <Button 
            onClick={shuffleGrid}
            className="bg-game-accent hover:bg-game-red text-white font-bold py-3 px-6 rounded-xl"
          >
            🧩 Start Puzzle
          </Button>
        </div>
      )}

      {isWon && (
        <div className="text-center mb-6 text-game-green font-bold text-lg">
          Puzzle Solved! 🎉
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-4 border-game-accent">
        <div className="grid grid-cols-3 gap-2 w-64 h-64 mx-auto">
          {grid.map((number, index) => (
            <div
              key={index}
              className={`
                h-20 w-20 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200
                ${number === 0 
                  ? 'bg-transparent' 
                  : `bg-gradient-to-br from-game-cyan to-game-blue text-white shadow-xl
                     ${canMove(index) && gameStarted && !isWon ? 'hover:scale-105 cursor-pointer hover:from-game-blue hover:to-game-cyan' : ''}
                     ${!gameStarted || isWon ? 'cursor-not-allowed' : ''}`
                }
              `}
              onClick={() => moveTile(index)}
            >
              {number === 0 ? '' : number}
            </div>
          ))}
        </div>
      </div>

      {gameStarted && !isWon && (
        <div className="text-center mt-4">
          <Button 
            onClick={shuffleGrid}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-xl"
          >
            🔄 Restart
          </Button>
        </div>
      )}

      <div className="text-center mt-4 text-xs text-gray-400">
        Click tiles adjacent to the empty space to move them
      </div>
    </div>
  );
}