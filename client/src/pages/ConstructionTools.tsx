import { useState } from "react";
import { motion } from "framer-motion";
import { Hammer, PaintBucket, LayoutGrid, Construction, Box, Calculator, Home, Layers } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "cement" | "paint" | "tile" | "steel" | "concrete" | "brick" | "roofing" | "flooring";

export default function ConstructionTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("cement");

  const tools = [
    { id: "cement", label: "Cement", icon: Box },
    { id: "paint", label: "Paint", icon: PaintBucket },
    { id: "tile", label: "Tiles", icon: LayoutGrid },
    { id: "brick", label: "Brick", icon: Layers },
    { id: "concrete", label: "Concrete", icon: Hammer },
    { id: "roofing", label: "Roofing", icon: Home },
    { id: "flooring", label: "Flooring", icon: LayoutGrid },
    { id: "steel", label: "Steel Bar", icon: Construction },
  ];

  return (
    <PageWrapper
      title="Construction Tools"
      subtitle="Building materials estimators"
      accentColor="bg-orange-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "cement" && <CementCalculator />}
      {activeTool === "paint" && <PaintCalculator />}
      {activeTool === "tile" && <TileCalculator />}
      {activeTool === "brick" && <BrickCalculator />}
      {activeTool === "concrete" && <ConcreteCalculator />}
      {activeTool === "roofing" && <RoofingCalculator />}
      {activeTool === "flooring" && <FlooringCalculator />}
      {activeTool === "steel" && <SteelBarCalculator />}
    </PageWrapper>
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
          <ResultDisplay label="Sand" value={`${result.sand.toFixed(2)} m³`} color="text-yellow-400" />
          <ResultDisplay label="Aggregate" value={`${result.aggregate.toFixed(2)} m³`} color="text-blue-400" />
          <ResultDisplay label="Wet Volume" value={`${result.wetVolume.toFixed(2)} m³`} />
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

function BrickCalculator() {
  const [length, setLength] = useState("10");
  const [height, setHeight] = useState("3");
  const [thickness, setThickness] = useState("0.23");
  const [brickType, setBrickType] = useState("standard");

  const brickSizes = {
    standard: { l: 0.19, h: 0.057, w: 0.09, name: "Standard (190x90x57mm)" },
    modular: { l: 0.194, h: 0.057, w: 0.092, name: "Modular (194x92x57mm)" },
    jumbo: { l: 0.203, h: 0.067, w: 0.092, name: "Jumbo (203x92x67mm)" },
  };

  const mortar = 0.01;
  const brick = brickSizes[brickType as keyof typeof brickSizes];
  const wallArea = (parseFloat(length) || 0) * (parseFloat(height) || 0);
  const brickArea = (brick.l + mortar) * (brick.h + mortar);
  const bricksPerSqM = 1 / brickArea;
  const totalBricks = Math.ceil(wallArea * bricksPerSqM);
  const withWastage = Math.ceil(totalBricks * 1.05);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Brick Calculator" icon={Layers} iconColor="bg-red-500">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Wall Length (m)" value={length} onChange={setLength} type="number" />
            <InputField label="Wall Height (m)" value={height} onChange={setHeight} type="number" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Brick Type</label>
            <div className="space-y-2">
              {Object.entries(brickSizes).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setBrickType(key)}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                    brickType === key
                      ? "bg-red-500 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-brick-${key}`}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Bricks Required" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Wall Area" value={`${wallArea.toFixed(2)} sq.m`} />
          <ResultDisplay label="Bricks per sq.m" value={Math.ceil(bricksPerSqM).toString()} />
          <ResultDisplay label="Total Bricks (exact)" value={totalBricks.toString()} />
          <ResultDisplay label="With 5% Wastage" value={withWastage.toString()} highlight color="text-red-400" />
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
          <ResultDisplay label="Volume" value={`${volume.toFixed(3)} m³`} highlight />
          <ResultDisplay label="~Bags (80lb premix)" value={bags.toString()} color="text-blue-400" />
          <ResultDisplay label="Cubic Yards" value={(volume * 1.308).toFixed(2)} />
        </div>
      </ToolCard>
    </div>
  );
}

function RoofingCalculator() {
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("8");
  const [pitch, setPitch] = useState("4");
  const [roofType, setRoofType] = useState("shingles");

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const p = parseFloat(pitch) || 0;

  const pitchFactor = Math.sqrt(1 + Math.pow(p / 12, 2));
  const roofArea = l * w * pitchFactor;
  const squares = roofArea / 9.29;

  const materials = {
    shingles: { bundles: Math.ceil(squares * 3), name: "Shingles", unit: "bundles" },
    metal: { bundles: Math.ceil(roofArea / 2.79), name: "Metal Panels", unit: "panels" },
    tiles: { bundles: Math.ceil(roofArea * 10), name: "Roof Tiles", unit: "tiles" },
  };

  const selected = materials[roofType as keyof typeof materials];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Roofing Calculator" icon={Home} iconColor="bg-slate-500">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Length (m)" value={length} onChange={setLength} type="number" />
            <InputField label="Width (m)" value={width} onChange={setWidth} type="number" />
          </div>
          <InputField label="Roof Pitch (rise/12)" value={pitch} onChange={setPitch} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Material Type</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(materials).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setRoofType(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    roofType === key
                      ? "bg-slate-600 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-roof-${key}`}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Roofing Materials" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Roof Area" value={`${roofArea.toFixed(2)} sq.m`} />
          <ResultDisplay label="Roofing Squares" value={squares.toFixed(2)} />
          <ResultDisplay label={`${selected.name} Needed`} value={`${selected.bundles} ${selected.unit}`} highlight color="text-slate-400" />
        </div>
      </ToolCard>
    </div>
  );
}

function FlooringCalculator() {
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [floorType, setFloorType] = useState("hardwood");
  const [wastage, setWastage] = useState("10");

  const area = (parseFloat(length) || 0) * (parseFloat(width) || 0);
  const waste = parseFloat(wastage) || 0;
  const totalArea = area * (1 + waste / 100);

  const costs = {
    hardwood: { price: 80, name: "Hardwood" },
    laminate: { price: 40, name: "Laminate" },
    vinyl: { price: 30, name: "Vinyl" },
    carpet: { price: 25, name: "Carpet" },
    tile: { price: 60, name: "Ceramic Tile" },
  };

  const selected = costs[floorType as keyof typeof costs];
  const totalCost = totalArea * selected.price;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Flooring Calculator" icon={LayoutGrid} iconColor="bg-amber-600">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Length (m)" value={length} onChange={setLength} type="number" />
            <InputField label="Width (m)" value={width} onChange={setWidth} type="number" />
          </div>
          <InputField label="Wastage %" value={wastage} onChange={setWastage} type="number" />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Floor Type</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(costs).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFloorType(key)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    floorType === key
                      ? "bg-amber-600 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-floor-${key}`}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Flooring Estimate" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Room Area" value={`${area.toFixed(2)} sq.m`} />
          <ResultDisplay label="With Wastage" value={`${totalArea.toFixed(2)} sq.m`} />
          <ResultDisplay label="Estimated Cost" value={`$${totalCost.toFixed(0)}`} highlight color="text-amber-400" />
          <ResultDisplay label="Per sq.m" value={`$${selected.price}/sq.m`} />
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
