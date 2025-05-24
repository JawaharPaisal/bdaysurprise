import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScratchCanvas from "@/components/scratch/scratch-canvas";
import { SCRATCH_MESSAGES } from "@/lib/game-utils";

export default function ScratchCardPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [, setLocation] = useLocation();
  const [isRevealed, setIsRevealed] = useState(false);
  
  const taskIdNum = parseInt(taskId || "1");
  const message = SCRATCH_MESSAGES[taskIdNum as keyof typeof SCRATCH_MESSAGES] || "Great job completing this task!";

  const handleScratchComplete = () => {
    setIsRevealed(true);
  };

  const continueToGame = () => {
    setLocation("/game");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-game-bg via-purple-900 to-game-surface">
      <Card className="bg-game-surface/90 backdrop-blur-sm border-game-accent/20 max-w-lg w-full">
        <CardContent className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="font-game text-2xl md:text-3xl text-game-yellow mb-2">
              🎫 Scratch to Reveal! 🎫
            </h2>
            <p className="text-gray-300">
              Scratch away the silver coating to see your message
            </p>
          </div>
          
          {/* Scratch Card */}
          <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-4 shadow-xl">
            <div className="bg-white rounded-lg p-6 min-h-48 relative overflow-hidden">
              {/* Hidden message */}
              <div className="absolute inset-0 p-6 flex items-center justify-center text-center">
                <div>
                  <div className="text-4xl mb-4">🎉</div>
                  <p className="text-gray-800 font-bold text-lg">
                    {message}
                  </p>
                </div>
              </div>
              
              {/* Scratch overlay */}
              <ScratchCanvas onComplete={handleScratchComplete} />
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400 mb-4">
              Scratch with your mouse or finger!
            </p>
            {isRevealed && (
              <Button 
                onClick={continueToGame}
                className="bg-gradient-to-r from-game-green to-game-cyan hover:from-game-cyan hover:to-game-green text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
              >
                Continue Adventure →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
