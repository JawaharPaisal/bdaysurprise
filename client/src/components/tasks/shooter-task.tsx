import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PuzzleTaskProps {
  onComplete: () => void;
}

interface PuzzlePiece {
  id: number;
  value: number;
  position: number;
}

export default function PuzzleTask({ onComplete }: PuzzleTaskProps) {
  const [puzzle, setPuzzle] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const PUZZLE_SIZE = 3; // 3x3 puzzle
  const EMPTY_POSITION = 8; // Position of empty space

  const initializePuzzle = () => {
    const pieces: PuzzlePiece[] = [];
    for (let i = 0; i < 9; i++) {
      if (i < 8) {
        pieces.push({
          id: i,
          value: i + 1,
          position: i
        });
      }
    }
    
    // Shuffle the puzzle
    const shuffled = [...pieces];
    for (let i = 0; i < 100; i++) {
      const randomIndex = Math.floor(Math.random() * shuffled.length);
      const temp = shuffled[randomIndex];
      const emptyIndex = shuffled.findIndex(p => p.position === EMPTY_POSITION);
      if (emptyIndex === -1) continue;
      
      // Swap positions
      const tempPos = temp.position;
      temp.position = shuffled[emptyIndex] ? shuffled[emptyIndex].position : EMPTY_POSITION;
      if (shuffled[emptyIndex]) shuffled[emptyIndex].position = tempPos;
    }
    
    setPuzzle(shuffled);
    setMoves(0);
    setIsComplete(false);
    setGameStarted(true);
  };

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver || won) return;

    // Move asteroids down
    setAsteroids(prev => prev
      .map(asteroid => ({ ...asteroid, y: asteroid.y + asteroid.speed }))
      .filter(asteroid => asteroid.y < 105)
    );

    // Move bullets up
    setBullets(prev => prev
      .map(bullet => ({ ...bullet, y: bullet.y - 2 }))
      .filter(bullet => bullet.y > -5)
    );

    // Check for collisions and update state
    setAsteroids(prevAsteroids => {
      setBullets(prevBullets => {
        const newBullets: Bullet[] = [];
        const newAsteroids: Asteroid[] = [];
        let hitCount = 0;

        // Check each bullet against each asteroid
        prevBullets.forEach(bullet => {
          let bulletHit = false;
          prevAsteroids.forEach(asteroid => {
            const distance = Math.sqrt(
              Math.pow(bullet.x - asteroid.x, 2) + Math.pow(bullet.y - asteroid.y, 2)
            );
            if (distance < asteroid.size + 2 && !bulletHit) {
              bulletHit = true;
              hitCount++;
            }
          });
          if (!bulletHit) {
            newBullets.push(bullet);
          }
        });

        // Keep asteroids that weren't hit
        prevAsteroids.forEach(asteroid => {
          let asteroidHit = false;
          prevBullets.forEach(bullet => {
            const distance = Math.sqrt(
              Math.pow(bullet.x - asteroid.x, 2) + Math.pow(bullet.y - asteroid.y, 2)
            );
            if (distance < asteroid.size + 2) {
              asteroidHit = true;
            }
          });
          if (!asteroidHit) {
            newAsteroids.push(asteroid);
          }
        });

        // Update score
        const newScore = score + hitCount;
        setScore(newScore);
        
        if (newScore >= TARGET_SCORE) {
          setWon(true);
          setTimeout(() => onComplete(), 1000);
        }

        return newBullets;
      });
      
      return asteroids.filter(asteroid => {
        // Remove asteroids that were hit
        let asteroidHit = false;
        bullets.forEach(bullet => {
          const distance = Math.sqrt(
            Math.pow(bullet.x - asteroid.x, 2) + Math.pow(bullet.y - asteroid.y, 2)
          );
          if (distance < asteroid.size + 2) {
            asteroidHit = true;
          }
        });
        return !asteroidHit;
      });
    });

    // Spawn new asteroids occasionally
    if (Math.random() < 0.02) {
      spawnAsteroid();
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, won, score, asteroids, bullets, spawnAsteroid, onComplete]);

  useEffect(() => {
    if (gameStarted) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      keysRef.current.add(e.key.toLowerCase());

      if (e.key === ' ') {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const movePlayer = () => {
      if (!gameStarted) return;
      
      setPlayerX(prev => {
        let newX = prev;
        if (keysRef.current.has('arrowleft') || keysRef.current.has('a')) {
          newX = Math.max(5, prev - 1);
        }
        if (keysRef.current.has('arrowright') || keysRef.current.has('d')) {
          newX = Math.min(95, prev + 1);
        }
        return newX;
      });
      
      requestAnimationFrame(movePlayer);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    if (gameStarted) {
      movePlayer();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, shoot]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-game-cyan mb-2">Asteroid Shooter</h3>
        <p className="text-gray-300 text-sm mb-2">Use A/D or arrows to move, SPACE to shoot</p>
        <div className="text-game-yellow font-semibold">
          Score: {score}/{TARGET_SCORE}
        </div>
      </div>

      {!gameStarted && (
        <div className="text-center mb-4">
          <Button 
            onClick={startGame}
            className="bg-game-accent hover:bg-game-red text-white font-bold py-3 px-6 rounded-xl"
          >
            🚀 Start Mission
          </Button>
        </div>
      )}

      {won && (
        <div className="text-center mb-4 text-game-green font-bold text-lg">
          Mission Complete! 🎯
        </div>
      )}

      <div 
        className="relative bg-gradient-to-b from-purple-900 via-blue-900 to-black rounded-xl border-4 border-game-accent mx-auto overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {gameStarted && (
          <>
            {/* Player ship */}
            <div
              className="absolute bottom-4 w-6 h-6 bg-game-red rounded-t-full transform -translate-x-1/2 transition-all duration-75"
              style={{ left: `${playerX}%` }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs">🚀</div>
            </div>

            {/* Bullets */}
            {bullets.map(bullet => (
              <div
                key={bullet.id}
                className="absolute w-1 h-3 bg-game-yellow rounded-full"
                style={{ 
                  left: `${bullet.x}%`, 
                  top: `${bullet.y}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            ))}

            {/* Asteroids */}
            {asteroids.map(asteroid => (
              <div
                key={asteroid.id}
                className="absolute bg-gray-600 rounded-full border border-gray-400"
                style={{ 
                  left: `${asteroid.x}%`, 
                  top: `${asteroid.y}%`,
                  width: `${asteroid.size * 2}%`,
                  height: `${asteroid.size * 2}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="text-xs text-center">☄️</div>
              </div>
            ))}
          </>
        )}
      </div>

      {gameStarted && (
        <div className="text-center mt-4 text-xs text-gray-400">
          Move: A/D or ← → | Shoot: SPACEBAR
        </div>
      )}
    </div>
  );
}