import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGameState } from "@/hooks/use-game-state";
import { TASK_CONFIGS } from "@/lib/game-utils";
import WireTask from "@/components/tasks/wire-task";
import PatternTask from "@/components/tasks/pattern-task";
import SimonTask from "@/components/tasks/simon-task";
import PuzzleTask from "@/components/tasks/puzzle-task";
import SafeTask from "@/components/tasks/safe-task";

export default function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [, setLocation] = useLocation();
  const { completeTask } = useGameState();
  
  const taskIdNum = parseInt(taskId || "1");
  const taskConfig = TASK_CONFIGS[taskIdNum as keyof typeof TASK_CONFIGS];

  const handleTaskComplete = () => {
    completeTask(taskIdNum);
    setLocation(`/scratch/${taskId}`);
  };

  const backToGame = () => {
    setLocation("/game");
  };

  const renderTask = () => {
    switch (taskConfig.type) {
      case "wire":
        return <WireTask onComplete={handleTaskComplete} />;
      case "swipe":
        return <PatternTask onComplete={handleTaskComplete} />;
      case "simon":
        return <SimonTask onComplete={handleTaskComplete} />;
      case "shooter":
        return <PuzzleTask onComplete={handleTaskComplete} />;
      case "safe":
        return <SafeTask onComplete={handleTaskComplete} />;
      default:
        return <div>Unknown task type</div>;
    }
  };

  if (!taskConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Task not found</p>
            <Button onClick={backToGame} className="mt-4">
              Back to Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-game-surface via-game-bg to-game-surface">
      <Card className="bg-game-surface/90 backdrop-blur-sm border-game-accent/20 max-w-2xl w-full">
        <CardContent className="p-6 md:p-8">
          {/* Task Header */}
          <div className="text-center mb-6">
            <h2 className="font-game text-2xl md:text-3xl text-game-cyan mb-2">
              {taskConfig.title}
            </h2>
            <p className="text-gray-300">
              {taskConfig.description}
            </p>
          </div>
          
          {/* Task Content */}
          <div className="min-h-64 flex items-center justify-center">
            {renderTask()}
          </div>
          
          {/* Task Controls */}
          <div className="flex justify-between items-center mt-6">
            <Button 
              onClick={backToGame}
              variant="secondary"
              className="bg-gray-600 hover:bg-gray-500"
            >
              ← Back to Map
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
