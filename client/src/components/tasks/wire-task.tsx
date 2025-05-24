import { useState, useRef, useEffect } from "react";

interface WireTaskProps {
  onComplete: () => void;
}

const WIRE_COLORS = ['red', 'blue', 'green', 'yellow'] as const;

export default function WireTask({ onComplete }: WireTaskProps) {
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const svgRef = useRef<SVGSVGElement>(null);

  const handleWireSelect = (color: string) => {
    setSelectedWire(color);
  };

  const handleWireConnect = (color: string) => {
    if (selectedWire === color) {
      setConnections(prev => {
        const newConnections = new Set(prev);
        newConnections.add(color);
        return newConnections;
      });
      
      setSelectedWire(null);
      drawConnection(color);
    }
  };

  const drawConnection = (color: string) => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    line.setAttribute('x1', '10%');
    line.setAttribute('y1', `${25 + WIRE_COLORS.indexOf(color as any) * 25}%`);
    line.setAttribute('x2', '90%');
    line.setAttribute('y2', `${25 + WIRE_COLORS.indexOf(color as any) * 25}%`);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '4');
    line.setAttribute('class', 'wire-connector animate-dash');
    line.style.strokeDasharray = '5,5';
    
    svg.appendChild(line);
  };

  useEffect(() => {
    if (connections.size >= 4) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [connections.size, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-4 border-game-accent shadow-2xl">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-game-cyan mb-2">Electrical Panel</h3>
          <p className="text-sm text-gray-300">Connect matching colored wires to restore power</p>
        </div>

        <div className="flex justify-between items-center space-x-8">
          {/* Left terminal panel */}
          <div className="bg-black rounded-xl p-4 space-y-3">
            <div className="text-center text-xs text-game-cyan font-mono mb-2">INPUT</div>
            {WIRE_COLORS.map(color => (
              <button
                key={color}
                className={`w-16 h-6 rounded-lg cursor-pointer hover:scale-110 transition-all duration-200 shadow-lg border-2 ${
                  selectedWire === color ? 'ring-4 ring-white border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleWireSelect(color)}
                disabled={connections.has(color)}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded"></div>
              </button>
            ))}
          </div>
          
          {/* Connection area */}
          <div className="flex-1 relative h-40 bg-gray-900 rounded-xl border-2 border-gray-700">
            <svg 
              ref={svgRef}
              className="w-full h-full rounded-xl" 
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="circuitGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuitGrid)" opacity="0.3"/>
              
              {/* Central circuit board design */}
              <circle cx="50" cy="50" r="20" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5"/>
              <circle cx="50" cy="50" r="10" fill="none" stroke="#6B7280" strokeWidth="0.5" opacity="0.7"/>
              <circle cx="50" cy="50" r="5" fill="#374151" opacity="0.8"/>
            </svg>
            
            {/* Status indicator */}
            <div className="absolute top-2 right-2">
              <div className={`w-3 h-3 rounded-full ${
                connections.size === 4 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
            </div>
          </div>
          
          {/* Right terminal panel */}
          <div className="bg-black rounded-xl p-4 space-y-3">
            <div className="text-center text-xs text-game-cyan font-mono mb-2">OUTPUT</div>
            {WIRE_COLORS.map(color => (
              <button
                key={color}
                className={`w-16 h-6 rounded-lg border-2 cursor-pointer hover:scale-110 transition-all duration-200 shadow-lg ${
                  connections.has(color) 
                    ? 'opacity-100 cursor-not-allowed shadow-lg' 
                    : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                }`}
                style={{ 
                  borderColor: color,
                  backgroundColor: connections.has(color) ? color : undefined,
                  boxShadow: connections.has(color) ? `0 0 10px ${color}` : undefined
                }}
                onClick={() => handleWireConnect(color)}
                disabled={connections.has(color)}
              >
                {connections.has(color) && (
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-center space-y-2">
          <div className="text-game-cyan font-semibold">
            Power Restoration: {connections.size}/4 circuits connected
          </div>
          <div className="text-xs text-gray-400">
            {selectedWire ? `Selected: ${selectedWire} wire` : 'Select a wire from the left panel'}
          </div>
          {connections.size === 4 && (
            <div className="text-game-green font-bold animate-pulse">
              ⚡ POWER RESTORED ⚡
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
