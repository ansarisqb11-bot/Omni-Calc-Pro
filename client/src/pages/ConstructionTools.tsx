import { useState } from "react";
import { motion } from "framer-motion";
import { Hammer, PaintBucket, LayoutGrid, Construction, Box, Calculator } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";

const tools = [
  { id: "cement", label: "Cement", icon: Box },
  { id: "paint", label: "Paint", icon: PaintBucket },
  { id: "tile", label: "Tiles", icon: LayoutGrid },
  { id: "steel", label: "Steel Bar", icon: Construction },
  { id: "concrete", label: "Concrete", icon: Hammer },
];

export default function ConstructionTools() {
  const [activeTool, setActiveTool] = useState("cement");

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-2xl font-bold">Construction Tools</h1>
        <p className="text-muted-foreground text-sm mt-1">Building materials estimators</p>
      </div>

      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              data-testid={`tab-${tool.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTool === tool.id
                  ? "bg-amber-500 text-foreground shadow-lg shadow-amber-500/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {activeTool === "cement" && <CementCalculator />}
        {activeTool === "paint" && <PaintCalculator />}
        {activeTool === "tile" && <TileCalculator />}
        {activeTool === "steel" && <SteelBarCalculator />}
        {activeTool === "concrete" && <ConcreteCalculator />}
      </div>
    </div>
  );
}

function CementCalculator() {
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("10");
  const [thickness, setThickness] = useState("0.15");
  const [ratio, setRatio] = useState("1:2:4");

  const calculate = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const t = parseFloat(thickness) || 0;
    const volume = l * w * t;
    const dryVolume = volume * 1.54;

    const parts = ratio.split(":").map(Number);
    const total = parts.reduce((a, b) => a + b, 0);
    const cementPart = parts[0] / total;
    const sandPart = parts[1] / total;
    const aggregatePart = parts[2] / total;

    return {
      wetVolume: volume,
      dryVolume,
      cement: (dryVolume * cementPart) / 0.035,
      sand: dryVolume * sandPart,
      aggregate: dryVolume * aggregatePart,
    };
  };

  const result = calculate();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Cement Calculator" icon={Box} iconColor="bg-amber-500">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Length (m)" value={length} onChange={setLength} type="number" />
            <InputField label="Width (m)" value={width} onChange={setWidth} type="number" />
          </div>
          <InputField label="Thickness (m)" value={thickness} onChange={setThickness} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Mix Ratio</label>
            <select
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="select-ratio"
            >
              <option value="1:1.5:3">M20 (1:1.5:3)</option>
              <option value="1:2:4">M15 (1:2:4)</option>
              <option value="1:3:6">M10 (1:3:6)</option>
              <option value="1:4:8">M7.5 (1:4:8)</option>
            </select>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Materials Required" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Cement Bags (50kg)" value={Math.ceil(result.cement).toString()} highlight color="text-amber-400" />
          <ResultDisplay label="Sand" value={`${result.sand.toFixed(2)} m3`} color="text-yellow-400" />
          <ResultDisplay label="Aggregate" value={`${result.aggregate.toFixed(2)} m3`} color="text-blue-400" />
          <ResultDisplay label="Wet Volume" value={`${result.wetVolume.toFixed(2)} m3`} />
        </div>
      </ToolCard>
    </div>
  );
}

function PaintCalculator() {
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState("3");
  const [doors, setDoors] = useState("2");
  const [windows, setWindows] = useState("3");

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const d = parseInt(doors) || 0;
  const win = parseInt(windows) || 0;

  const wallArea = 2 * (l + w) * h;
  const doorArea = d * 2.1 * 0.9;
  const windowArea = win * 1.2 * 1.0;
  const paintableArea = wallArea - doorArea - windowArea;
  const coverage = 12;
  const coats = 2;
  const litersNeeded = (paintableArea * coats) / coverage;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Paint Calculator" icon={PaintBucket} iconColor="bg-pink-500">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Length (m)" value={length} onChange={setLength} type="number" />
            <InputField label="Width (m)" value={width} onChange={setWidth} type="number" />
          </div>
          <InputField label="Height (m)" value={height} onChange={setHeight} type="number" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Doors" value={doors} onChange={setDoors} type="number" />
            <InputField label="Windows" value={windows} onChange={setWindows} type="number" />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Paint Required" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Paintable Area" value={`${paintableArea.toFixed(1)} sq.m`} />
          <ResultDisplay label="Paint Needed (2 coats)" value={`${litersNeeded.toFixed(1)} liters`} highlight color="text-pink-400" />
          <ResultDisplay label="~Gallons" value={`${(litersNeeded / 3.785).toFixed(1)} gal`} color="text-blue-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function TileCalculator() {
  const [areaL, setAreaL] = useState("5");
  const [areaW, setAreaW] = useState("4");
  const [tileL, setTileL] = useState("0.6");
  const [tileW, setTileW] = useState("0.6");
  const [wastage, setWastage] = useState("10");

  const roomArea = (parseFloat(areaL) || 0) * (parseFloat(areaW) || 0);
  const tileArea = (parseFloat(tileL) || 0) * (parseFloat(tileW) || 0);
  const tilesNeeded = tileArea > 0 ? Math.ceil(roomArea / tileArea) : 0;
  const withWastage = Math.ceil(tilesNeeded * (1 + (parseFloat(wastage) || 0) / 100));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Tile Calculator" icon={LayoutGrid} iconColor="bg-blue-500">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">Room Dimensions</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Length (m)" value={areaL} onChange={setAreaL} type="number" />
            <InputField label="Width (m)" value={areaW} onChange={setAreaW} type="number" />
          </div>
          <p className="text-muted-foreground text-sm">Tile Size</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tile Length (m)" value={tileL} onChange={setTileL} type="number" />
            <InputField label="Tile Width (m)" value={tileW} onChange={setTileW} type="number" />
          </div>
          <InputField label="Wastage %" value={wastage} onChange={setWastage} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Tiles Required" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Room Area" value={`${roomArea.toFixed(2)} sq.m`} />
          <ResultDisplay label="Tiles (exact)" value={tilesNeeded.toString()} />
          <ResultDisplay label="Tiles (with wastage)" value={withWastage.toString()} highlight color="text-blue-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function SteelBarCalculator() {
  const [diameter, setDiameter] = useState("12");
  const [length, setLength] = useState("12");
  const [quantity, setQuantity] = useState("10");

  const d = parseFloat(diameter) || 0;
  const l = parseFloat(length) || 0;
  const q = parseInt(quantity) || 0;

  const weightPerMeter = (d * d) / 162;
  const totalWeight = weightPerMeter * l * q;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Steel Bar Weight" icon={Construction} iconColor="bg-slate-500">
        <div className="space-y-4">
          <InputField label="Diameter (mm)" value={diameter} onChange={setDiameter} type="number" />
          <InputField label="Length (m)" value={length} onChange={setLength} type="number" />
          <InputField label="Quantity" value={quantity} onChange={setQuantity} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Weight" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Weight per meter" value={`${weightPerMeter.toFixed(3)} kg/m`} />
          <ResultDisplay label="Total Weight" value={`${totalWeight.toFixed(2)} kg`} highlight color="text-foreground" />
        </div>
      </ToolCard>
    </div>
  );
}

function ConcreteCalculator() {
  const [length, setLength] = useState("3");
  const [width, setWidth] = useState("3");
  const [depth, setDepth] = useState("0.1");

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const d = parseFloat(depth) || 0;
  const volume = l * w * d;
  const bags = Math.ceil(volume / 0.03);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Concrete Volume" icon={Hammer} iconColor="bg-gray-500">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Length (m)" value={length} onChange={setLength} type="number" />
            <InputField label="Width (m)" value={width} onChange={setWidth} type="number" />
          </div>
          <InputField label="Depth (m)" value={depth} onChange={setDepth} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Concrete Needed" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Volume" value={`${volume.toFixed(3)} m3`} highlight />
          <ResultDisplay label="~Bags (80lb premix)" value={bags.toString()} color="text-blue-400" />
          <ResultDisplay label="Cubic Yards" value={(volume * 1.308).toFixed(2)} />
        </div>
      </ToolCard>
    </div>
  );
}
