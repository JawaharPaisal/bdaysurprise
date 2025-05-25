import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useGameState } from "@/hooks/use-game-state";

export default function FinalPage() {
  const [, setLocation] = useLocation();
  const { resetGame } = useGameState();

  const handleResetGame = () => {
    resetGame();
    setLocation("/");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pixel Surprise: Among Us Edition',
        text: 'Check out this amazing personalized game!',
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin).then(() => {
        const toast = document.createElement('div');
        toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-game-accent text-white px-6 py-3 rounded-xl shadow-xl z-50 font-semibold';
        toast.textContent = "Link copied to clipboard!";
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast);
            }
          }, 300);
        }, 2000);
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-game-bg via-pink-900 to-purple-900">
      <Card className="bg-game-surface/90 backdrop-blur-sm border-game-accent/20 max-w-3xl w-full">
        <CardContent className="p-6 md:p-8 text-center">
          <div className="mb-8">
            <h1 className="font-game text-3xl md:text-5xl bg-gradient-to-r from-game-red via-game-cyan to-game-yellow bg-clip-text text-transparent mb-4">
              🎊 MISSION COMPLETE! 🎊
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-6">
              You've completed all the tasks! This was made with love 💖
            </p>
          </div>
          
          {/* Final Video */}
          <div className="bg-black rounded-2xl mb-8 relative overflow-hidden shadow-2xl">
            <video 
              controls 
              className="w-full aspect-video rounded-2xl"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3CRect fill='%23000' width='1200' height='675'/%3E%3Cg transform='translate(600,337.5)'%3E%3Ccircle r='60' fill='%23ef4444'/%3E%3Cpolygon points='-20,-25 -20,25 25,0' fill='%23fff'/%3E%3C/g%3E%3Ctext x='50%25' y='75%25' fill='%23fff' text-anchor='middle' font-size='24'%3EClick to play your special video%3C/text%3E%3C/svg%3E"
            >
             <source src="/bdaysurprise/final-video.mp4" type="video/mp4" />
              <p className="text-gray-400">Your browser doesn't support video playback.</p>
            </video>
          </div>
          
          {/* Final message */}
          <div className="bg-gradient-to-r from-game-surface/50 to-transparent rounded-xl p-6 mb-8">
            <p className="text-lg text-gray-200 leading-relaxed">
              Thank you for playing this special game I created just for you! 
              Every task, every message, every surprise was designed with our friendship in mind. 
              Hope this brought a smile to your face! 🌟
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Button 
              onClick={handleResetGame}
              className="bg-gradient-to-r from-game-cyan to-game-blue hover:from-game-blue hover:to-game-cyan text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
            >
              🔄 Play Again
            </Button>
            <Button 
              onClick={handleShare}
              className="bg-gradient-to-r from-game-yellow to-game-red hover:from-game-red hover:to-game-yellow text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
            >
              📱 Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
