interface TaskAreaProps {
  taskId: number;
  position: { x: number; y: number };
  config: {
    icon: string;
    color: string;
    title: string;
  };
  isCompleted: boolean;
  isNearPlayer: boolean;
  onClick: () => void;
}

export default function TaskArea({ 
  position, 
  config, 
  isCompleted, 
  isNearPlayer, 
  onClick 
}: TaskAreaProps) {
  return (
    <div 
      className={`
        task-area absolute w-16 h-16 rounded-full border-4 border-white shadow-xl 
        flex items-center justify-center text-2xl cursor-pointer z-20
        ${isCompleted 
          ? 'bg-green-500/80 opacity-50 pointer-events-none' 
          : config.color
        }
        ${!isCompleted && isNearPlayer 
          ? 'animate-pulse-slow ring-4 ring-white/50' 
          : 'animate-pulse-slow'
        }
        hover:scale-110 transition-all duration-300
      `}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto'
      }}
      onClick={onClick}
    >
      {isCompleted ? '✅' : config.icon}
    </div>
  );
}
