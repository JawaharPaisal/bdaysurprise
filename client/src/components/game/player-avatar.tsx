import { useEffect, useRef } from "react";

interface PlayerAvatarProps {
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function PlayerAvatar({ position, onPositionChange }: PlayerAvatarProps) {
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();

  const updatePosition = () => {
    if (keysPressed.current.size === 0) return;

    const moveDistance = 1.5;
    let deltaX = 0;
    let deltaY = 0;

    if (keysPressed.current.has('up')) deltaY -= moveDistance;
    if (keysPressed.current.has('down')) deltaY += moveDistance;
    if (keysPressed.current.has('left')) deltaX -= moveDistance;
    if (keysPressed.current.has('right')) deltaX += moveDistance;

    if (deltaX !== 0 || deltaY !== 0) {
      const newX = Math.max(5, Math.min(95, position.x + deltaX));
      const newY = Math.max(5, Math.min(95, position.y + deltaY));
      
      onPositionChange({ x: newX, y: newY });
    }

    animationFrameRef.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      let direction = '';
      
      switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          direction = 'up';
          break;
        case 'arrowdown':
        case 's':
          direction = 'down';
          break;
        case 'arrowleft':
        case 'a':
          direction = 'left';
          break;
        case 'arrowright':
        case 'd':
          direction = 'right';
          break;
      }

      if (direction && !keysPressed.current.has(direction)) {
        keysPressed.current.add(direction);
        if (keysPressed.current.size === 1) {
          updatePosition();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let direction = '';
      
      switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          direction = 'up';
          break;
        case 'arrowdown':
        case 's':
          direction = 'down';
          break;
        case 'arrowleft':
        case 'a':
          direction = 'left';
          break;
        case 'arrowright':
        case 'd':
          direction = 'right';
          break;
      }

      if (direction) {
        keysPressed.current.delete(direction);
        if (keysPressed.current.size === 0 && animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position, onPositionChange]);

  return (
    <div 
      className="absolute w-12 h-12 bg-gradient-to-r from-game-red to-game-accent rounded-full border-4 border-white shadow-xl player-avatar flex items-center justify-center text-xl transform -translate-x-1/2 -translate-y-1/2"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`
      }}
    >
      👤
    </div>
  );
}
