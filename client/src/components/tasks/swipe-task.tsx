import { useState, useRef, useEffect } from "react";

interface SwipeTaskProps {
  onComplete: () => void;
}

export default function SwipeTask({ onComplete }: SwipeTaskProps) {
  const [cardPosition, setCardPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !cardRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const cardWidth = cardRef.current.offsetWidth;
    const maxPosition = containerRect.width - cardWidth;
    
    const newPosition = Math.max(0, Math.min(maxPosition, e.clientX - containerRect.left - cardWidth / 2));
    setCardPosition(newPosition);
    
    // Check if swiped far enough (70% of container width)
    if (newPosition > maxPosition * 0.7 && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap back if not completed
    if (!isCompleted) {
      setCardPosition(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !cardRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const cardWidth = cardRef.current.offsetWidth;
    const maxPosition = containerRect.width - cardWidth;
    const touch = e.touches[0];
    
    const newPosition = Math.max(0, Math.min(maxPosition, touch.clientX - containerRect.left - cardWidth / 2));
    setCardPosition(newPosition);
    
    // Check if swiped far enough
    if (newPosition > maxPosition * 0.7 && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap back if not completed
    if (!isCompleted) {
      setCardPosition(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isCompleted]);

  return (
    <div className="w-full">
      <div className="relative bg-gray-800 rounded-xl p-6 border-2 border-game-accent">
        <div className="text-center mb-4">
          <div className="w-16 h-10 bg-gradient-to-r from-game-red to-game-accent rounded mx-auto mb-2 flex items-center justify-center text-white font-bold">
            ID
          </div>
          <p className="text-sm text-gray-400">Drag the card through the reader</p>
        </div>
        
        <div 
          ref={containerRef}
          className="relative h-20 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden"
        >
          {/* Card slot indicator */}
          <div className="absolute left-0 w-full h-2 bg-game-accent/30 top-1/2 transform -translate-y-1/2"></div>
          
          {/* ID Card */}
          <div
            ref={cardRef}
            className={`absolute w-20 h-12 bg-gradient-to-r from-game-red to-game-accent rounded cursor-grab active:cursor-grabbing top-1/2 transform -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold select-none transition-all ${
              isCompleted ? 'bg-game-green' : ''
            }`}
            style={{ 
              left: `${cardPosition}px`,
              transition: isDragging ? 'none' : 'left 0.3s ease'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {isCompleted ? '✅ ACCEPTED' : 'SWIPE →'}
          </div>
        </div>
      </div>
    </div>
  );
}
