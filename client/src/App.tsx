import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomePage from "@/pages/welcome";
import GameMapPage from "@/pages/game-map";
import TaskPage from "@/pages/task";
import ScratchCardPage from "@/pages/scratch-card";
import FinalPage from "@/pages/final";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/game" component={GameMapPage} />
      <Route path="/task/:taskId" component={TaskPage} />
      <Route path="/scratch/:taskId" component={ScratchCardPage} />
      <Route path="/final" component={FinalPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-game-bg text-white overflow-x-hidden">
          {/* Game State Indicator */}
          <div className="fixed top-4 left-4 z-50 bg-game-surface/90 backdrop-blur-sm rounded-xl p-3 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Game Active</span>
              <div className="text-xs bg-game-accent/20 px-2 py-1 rounded-lg">
                Tasks: {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('completedTasks') || '[]').length : 0}/5
              </div>
            </div>
          </div>
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
