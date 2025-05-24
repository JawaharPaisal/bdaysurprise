import { useState, useEffect } from 'react';

export interface GameState {
  completedTasks: Set<number>;
  playerPosition: { x: number; y: number };
  currentTask: number | null;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    completedTasks: new Set(),
    playerPosition: { x: 50, y: 80 },
    currentTask: null,
  });

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('completedTasks');
    const savedPosition = localStorage.getItem('playerPosition');
    
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        setGameState(prev => ({
          ...prev,
          completedTasks: new Set(tasks)
        }));
      } catch (e) {
        console.error('Failed to parse saved tasks:', e);
      }
    }
    
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        setGameState(prev => ({
          ...prev,
          playerPosition: position
        }));
      } catch (e) {
        console.error('Failed to parse saved position:', e);
      }
    }
  }, []);

  const completeTask = (taskId: number) => {
    setGameState(prev => {
      const newCompletedTasks = new Set(prev.completedTasks);
      newCompletedTasks.add(taskId);
      
      // Save to localStorage
      localStorage.setItem('completedTasks', JSON.stringify(Array.from(newCompletedTasks)));
      
      return {
        ...prev,
        completedTasks: newCompletedTasks,
        currentTask: null
      };
    });
  };

  const updatePlayerPosition = (position: { x: number; y: number }) => {
    setGameState(prev => {
      // Save to localStorage
      localStorage.setItem('playerPosition', JSON.stringify(position));
      
      return {
        ...prev,
        playerPosition: position
      };
    });
  };

  const setCurrentTask = (taskId: number | null) => {
    setGameState(prev => ({
      ...prev,
      currentTask: taskId
    }));
  };

  const resetGame = () => {
    localStorage.removeItem('completedTasks');
    localStorage.removeItem('playerPosition');
    setGameState({
      completedTasks: new Set(),
      playerPosition: { x: 50, y: 80 },
      currentTask: null,
    });
  };

  const isTaskCompleted = (taskId: number) => gameState.completedTasks.has(taskId);
  const allTasksCompleted = () => gameState.completedTasks.size >= 5;

  return {
    gameState,
    completeTask,
    updatePlayerPosition,
    setCurrentTask,
    resetGame,
    isTaskCompleted,
    allTasksCompleted,
  };
}
