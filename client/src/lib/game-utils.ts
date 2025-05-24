export function calculateDistance(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

export function isPlayerNearTask(
  playerPosition: { x: number; y: number },
  taskPosition: { x: number; y: number },
  threshold: number = 8
): boolean {
  return calculateDistance(playerPosition, taskPosition) < threshold;
}

export const TASK_POSITIONS = {
  1: { x: 20, y: 30 },
  2: { x: 40, y: 20 },
  3: { x: 70, y: 35 },
  4: { x: 50, y: 60 },
  5: { x: 80, y: 70 },
};

export const TASK_PATHS = [
  // Path from spawn (50, 80) to task 1 (20, 30)
  { from: { x: 50, y: 80 }, to: { x: 20, y: 30 }, waypoints: [{ x: 35, y: 55 }] },
  // Path from task 1 to task 2
  { from: { x: 20, y: 30 }, to: { x: 40, y: 20 }, waypoints: [{ x: 30, y: 25 }] },
  // Path from task 2 to task 3
  { from: { x: 40, y: 20 }, to: { x: 70, y: 35 }, waypoints: [{ x: 55, y: 27 }] },
  // Path from task 3 to task 4
  { from: { x: 70, y: 35 }, to: { x: 50, y: 60 }, waypoints: [{ x: 60, y: 47 }] },
  // Path from task 4 to task 5
  { from: { x: 50, y: 60 }, to: { x: 80, y: 70 }, waypoints: [{ x: 65, y: 65 }] },
];

export const TASK_CONFIGS = {
  1: { 
    title: "Wire Connection", 
    description: "Connect the colored wires to complete the circuit",
    icon: "⚡",
    color: "bg-game-cyan/80",
    type: "wire" as const
  },
  2: { 
    title: "Pattern Recognition", 
    description: "Recreate the pattern sequence shown",
    icon: "🧠",
    color: "bg-game-green/80",
    type: "swipe" as const
  },
  3: { 
    title: "Simon Says", 
    description: "Remember and repeat the color sequence",
    icon: "🎨",
    color: "bg-game-yellow/80",
    type: "simon" as const
  },
  4: { 
    title: "Sliding Puzzle", 
    description: "Arrange the numbered tiles in order",
    icon: "🧩",
    color: "bg-game-blue/80",
    type: "shooter" as const
  },
  5: { 
    title: "Safe Unlock", 
    description: "Find the correct 4-digit combination",
    icon: "🔐",
    color: "bg-purple-500/80",
    type: "safe" as const
  }
};

export function showToast(message: string) {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-game-accent text-white px-6 py-3 rounded-xl shadow-xl z-50 font-semibold transition-opacity duration-300';
  toast.textContent = message;
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

export const SCRATCH_MESSAGES = {
  1: "26/05/2022 last year un bday olunga pannalanu unakaga avlo efforts eduthu panna bday.una santhoshathula azhavacha day.💖",
  2: "12/01/2022 una enoda babf nu kupda aarambicha naal apothula irunthu ippo varaikum nee than enoda best and best friend eppome 🎉",
  3: "05/02/2021 namma first meet nyabagam iruka? rose milk vangi tharenu class aye kootitu ponathu and annaiku than namma first pic ✨",
  4: "22/09/2020 namma frndship start ana day nyabagam iruka unoda first message number save pannika solli .thanks for coming into my life!🌟",
  5: "20/04/2023 namma last outing super ana day romba nalla pochu .neraya memories sethuvachom.kudiya seekirame inoru outing antha mathiri pogalam 🎊"
};
