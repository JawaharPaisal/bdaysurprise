import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGameState } from "@/hooks/use-game-state";
import PlayerAvatar from "@/components/game/player-avatar";
import TaskArea from "@/components/game/task-area";
import MobileControls from "@/components/game/mobile-controls";
import { TASK_POSITIONS, TASK_CONFIGS, TASK_PATHS, isPlayerNearTask } from "@/lib/game-utils";

export default function GameMapPage() {
  const [, setLocation] = useLocation();
  const { gameState, updatePlayerPosition, setCurrentTask, allTasksCompleted } = useGameState();

  useEffect(() => {
    if (allTasksCompleted()) {
      setTimeout(() => {
        setLocation("/final");
      }, 1000);
    }
  }, [gameState.completedTasks, allTasksCompleted, setLocation]);

  const handleTaskClick = (taskId: number) => {
    const taskPosition = TASK_POSITIONS[taskId as keyof typeof TASK_POSITIONS];
    
    if (isPlayerNearTask(gameState.playerPosition, taskPosition)) {
      setCurrentTask(taskId);
      setLocation(`/task/${taskId}`);
    } else {
      // Show hint to get closer
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-game-accent text-white px-6 py-3 rounded-xl shadow-xl z-50 font-semibold';
      toast.textContent = "Move closer to the task area!";
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

  const renderPaths = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {/* Path from spawn to task 1 */}
        <path
          d={`M 50,80 Q 42,65 35,55 Q 28,40 20,30`}
          stroke="rgba(233, 69, 96, 0.3)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="8,4"
          className="animate-dash"
        />
        {/* Path from task 1 to task 2 */}
        <path
          d={`M 20,30 Q 25,27 30,25 Q 35,22 40,20`}
          stroke="rgba(78, 205, 196, 0.3)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="8,4"
          className="animate-dash"
        />
        {/* Path from task 2 to task 3 */}
        <path
          d={`M 40,20 Q 47,23 55,27 Q 62,32 70,35`}
          stroke="rgba(69, 183, 209, 0.3)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="8,4"
          className="animate-dash"
        />
        {/* Path from task 3 to task 4 */}
        <path
          d={`M 70,35 Q 65,41 60,47 Q 55,53 50,60`}
          stroke="rgba(150, 206, 180, 0.3)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="8,4"
          className="animate-dash"
        />
        {/* Path from task 4 to task 5 */}
        <path
          d={`M 50,60 Q 57,62 65,65 Q 72,67 80,70`}
          stroke="rgba(254, 202, 87, 0.3)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="8,4"
          className="animate-dash"
        />
        
        {/* Waypoint markers */}
        <circle cx="35" cy="55" r="2" fill="rgba(233, 69, 96, 0.5)" />
        <circle cx="30" cy="25" r="2" fill="rgba(78, 205, 196, 0.5)" />
        <circle cx="55" cy="27" r="2" fill="rgba(69, 183, 209, 0.5)" />
        <circle cx="60" cy="47" r="2" fill="rgba(150, 206, 180, 0.5)" />
        <circle cx="65" cy="65" r="2" fill="rgba(254, 202, 87, 0.5)" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen gradient-professional game-container">
      {/* Game Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-game-bg via-game-surface to-game-bg"></div>
      
      {/* Decorative elements - background layer */}
      <div className="absolute inset-0 z-0">
        {/* Space-like background decorations */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-game-cyan rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-30 left-1/4 w-1.5 h-1.5 bg-game-yellow rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-game-green rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-game-red rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      {/* Map Container - main game layer */}
      <div className="relative w-full h-screen p-4 z-10">
        {/* Render paths */}
        {renderPaths()}
        
        {/* Player Avatar */}
        <PlayerAvatar
          position={gameState.playerPosition}
          onPositionChange={updatePlayerPosition}
        />
        
        {/* Task Areas */}
        {Object.entries(TASK_POSITIONS).map(([taskId, position]) => {
          const taskIdNum = parseInt(taskId);
          const config = TASK_CONFIGS[taskIdNum as keyof typeof TASK_CONFIGS];
          
          return (
            <TaskArea
              key={taskId}
              taskId={taskIdNum}
              position={position}
              config={config}
              isCompleted={gameState.completedTasks.has(taskIdNum)}
              isNearPlayer={isPlayerNearTask(gameState.playerPosition, position)}
              onClick={() => handleTaskClick(taskIdNum)}
            />
          );
        })}
        
        {/* Game Header - Non-overlapping */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-border pointer-events-auto">
              <h1 className="font-game text-lg text-game-blue">Mission Control</h1>
              <p className="text-sm text-muted-foreground">Progress: {gameState.completedTasks.size}/5 tasks</p>
            </div>
            
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-3 shadow-xl max-w-xs border border-border pointer-events-auto hidden md:block">
              <h3 className="font-semibold text-game-cyan mb-2">Controls</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Use WASD or Arrow keys to move</p>
                <p>• Get close to task areas to interact</p>
                <p>• Follow the dotted paths between tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Controls */}
      <MobileControls
        onMove={(direction) => {
          const moveDistance = 3;
          let newPosition = { ...gameState.playerPosition };
          
          switch(direction) {
            case 'up':
              newPosition.y = Math.max(5, newPosition.y - moveDistance);
              break;
            case 'down':
              newPosition.y = Math.min(95, newPosition.y + moveDistance);
              break;
            case 'left':
              newPosition.x = Math.max(5, newPosition.x - moveDistance);
              break;
            case 'right':
              newPosition.x = Math.min(95, newPosition.x + moveDistance);
              break;
          }
          
          updatePlayerPosition(newPosition);
        }}
      />
    </div>
  );
}
