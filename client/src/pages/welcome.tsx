import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function WelcomePage() {
  const [, setLocation] = useLocation();

  const startGame = () => {
    setLocation("/game");
  };

  return (
    <div className="min-h-screen flex items-center justify-center container-mobile-fix gradient-professional">
      <div className="text-center max-w-2xl mx-auto game-container">
        {/* Professional title */}
        <h1 className="font-game heading-responsive bg-gradient-to-r from-game-blue via-game-cyan to-game-green bg-clip-text text-transparent mb-4">
          Welcome to the Game, Sandy Machi!
        </h1>
        <h2 className="font-game text-xl md:text-2xl text-muted-foreground mb-8">
          Happy Birthday di Santhiya! 🎉
        </h2>
        
        {/* Personal message area */}
        <Card className="bg-card/95 backdrop-blur-md border-border mb-8 shadow-2xl">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <div className="w-16 h-16 gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                🎮
              </div>
            </div>
            <p className="text-responsive leading-relaxed text-foreground mb-4">
              Hey babf! I created this special game just for you! Remember all those times we talked about Us? 
              Well, I've hidden some surprises throughout this interactive adventure.
            </p>
            <p className="text-responsive text-game-cyan font-medium">
              Complete all the tasks to unlock your final surprise!
            </p>
          </CardContent>
        </Card>
        
        <Button 
          onClick={startGame}
          className="gradient-accent hover:opacity-90 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-xl transform hover:scale-105 transition-all btn-professional btn-mobile"
        >
          Start Adventure
        </Button>
      </div>
    </div>
  );
}
