import { useState } from "react";
import { motion } from "framer-motion";
import { Circle, Square, Triangle, Box, Hexagon, Calculator } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";

const tools = [
  { id: "circle", label: "Circle", icon: Circle },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "triangle", label: "Triangle", icon: Triangle },
  { id: "cube", label: "Cube", icon: Box },
  { id: "cylinder", label: "Cylinder", icon: Hexagon },
];

export default function GeometryTools() {
  const [activeTool, setActiveTool] = useState("circle");

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-2xl font-bold">Geometry Tools</h1>
        <p className="text-muted-foreground text-sm mt-1">Area, perimeter, volume calculators</p>
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
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
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
        {activeTool === "circle" && <CircleCalculator />}
        {activeTool === "rectangle" && <RectangleCalculator />}
        {activeTool === "triangle" && <TriangleCalculator />}
        {activeTool === "cube" && <CubeCalculator />}
        {activeTool === "cylinder" && <CylinderCalculator />}
      </div>
    </div>
  );
}

function CircleCalculator() {
  const [radius, setRadius] = useState("5");

  const r = parseFloat(radius) || 0;
  const area = Math.PI * r * r;
  const circumference = 2 * Math.PI * r;
  const diameter = 2 * r;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Circle Calculator" icon={Circle} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <InputField label="Radius" value={radius} onChange={setRadius} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Area" value={`${area.toFixed(4)} sq units`} highlight color="text-cyan-400" />
          <ResultDisplay label="Circumference" value={`${circumference.toFixed(4)} units`} color="text-blue-400" />
          <ResultDisplay label="Diameter" value={`${diameter.toFixed(4)} units`} />
        </div>
      </ToolCard>
    </div>
  );
}

function RectangleCalculator() {
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("5");

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const area = l * w;
  const perimeter = 2 * (l + w);
  const diagonal = Math.sqrt(l * l + w * w);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Rectangle Calculator" icon={Square} iconColor="bg-blue-500">
        <div className="space-y-4">
          <InputField label="Length" value={length} onChange={setLength} type="number" />
          <InputField label="Width" value={width} onChange={setWidth} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Area" value={`${area.toFixed(4)} sq units`} highlight color="text-blue-400" />
          <ResultDisplay label="Perimeter" value={`${perimeter.toFixed(4)} units`} color="text-cyan-400" />
          <ResultDisplay label="Diagonal" value={`${diagonal.toFixed(4)} units`} />
        </div>
      </ToolCard>
    </div>
  );
}

function TriangleCalculator() {
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const [c, setC] = useState("5");

  const sideA = parseFloat(a) || 0;
  const sideB = parseFloat(b) || 0;
  const sideC = parseFloat(c) || 0;
  const s = (sideA + sideB + sideC) / 2;
  const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
  const perimeter = sideA + sideB + sideC;
  const isValid = sideA + sideB > sideC && sideB + sideC > sideA && sideA + sideC > sideB;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Triangle Calculator (Heron's)" icon={Triangle} iconColor="bg-purple-500">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Side A" value={a} onChange={setA} type="number" />
            <InputField label="Side B" value={b} onChange={setB} type="number" />
            <InputField label="Side C" value={c} onChange={setC} type="number" />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        {isValid ? (
          <div className="space-y-3">
            <ResultDisplay label="Area (Heron's)" value={`${area.toFixed(4)} sq units`} highlight color="text-purple-400" />
            <ResultDisplay label="Perimeter" value={`${perimeter.toFixed(4)} units`} color="text-blue-400" />
            <ResultDisplay label="Semi-perimeter" value={`${s.toFixed(4)} units`} />
          </div>
        ) : (
          <p className="text-red-400 text-center py-4">Invalid triangle sides</p>
        )}
      </ToolCard>
    </div>
  );
}

function CubeCalculator() {
  const [side, setSide] = useState("5");

  const s = parseFloat(side) || 0;
  const volume = s * s * s;
  const surfaceArea = 6 * s * s;
  const diagonal = s * Math.sqrt(3);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Cube Calculator" icon={Box} iconColor="bg-amber-500">
        <div className="space-y-4">
          <InputField label="Side Length" value={side} onChange={setSide} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Volume" value={`${volume.toFixed(4)} cubic units`} highlight color="text-amber-400" />
          <ResultDisplay label="Surface Area" value={`${surfaceArea.toFixed(4)} sq units`} color="text-blue-400" />
          <ResultDisplay label="Space Diagonal" value={`${diagonal.toFixed(4)} units`} />
        </div>
      </ToolCard>
    </div>
  );
}

function CylinderCalculator() {
  const [radius, setRadius] = useState("3");
  const [height, setHeight] = useState("7");

  const r = parseFloat(radius) || 0;
  const h = parseFloat(height) || 0;
  const volume = Math.PI * r * r * h;
  const lateralArea = 2 * Math.PI * r * h;
  const totalArea = 2 * Math.PI * r * (h + r);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Cylinder Calculator" icon={Hexagon} iconColor="bg-pink-500">
        <div className="space-y-4">
          <InputField label="Radius" value={radius} onChange={setRadius} type="number" />
          <InputField label="Height" value={height} onChange={setHeight} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Results" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Volume" value={`${volume.toFixed(4)} cubic units`} highlight color="text-pink-400" />
          <ResultDisplay label="Lateral Surface Area" value={`${lateralArea.toFixed(4)} sq units`} color="text-blue-400" />
          <ResultDisplay label="Total Surface Area" value={`${totalArea.toFixed(4)} sq units`} />
        </div>
      </ToolCard>
    </div>
  );
}
