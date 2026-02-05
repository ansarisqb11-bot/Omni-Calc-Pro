import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Pipette, Blend, Layers, Copy, Check, RefreshCw, Percent } from "lucide-react";
import { ToolCard, ResultDisplay } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "mixer" | "match" | "gradient" | "converter" | "generator";

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }
interface HSV { h: number; s: number; v: number; }
interface CMYK { c: number; m: number; y: number; k: number; }

const COLOR_NAMES: Record<string, string> = {
  red: "#FF0000", green: "#00FF00", blue: "#0000FF", white: "#FFFFFF", black: "#000000",
  yellow: "#FFFF00", cyan: "#00FFFF", magenta: "#FF00FF", orange: "#FFA500", pink: "#FFC0CB",
  purple: "#800080", brown: "#A52A2A", gray: "#808080", grey: "#808080", beige: "#F5F5DC",
  navy: "#000080", teal: "#008080", olive: "#808000", maroon: "#800000", lime: "#00FF00",
  aqua: "#00FFFF", silver: "#C0C0C0", gold: "#FFD700", coral: "#FF7F50", salmon: "#FA8072",
  turquoise: "#40E0D0", violet: "#EE82EE", indigo: "#4B0082", crimson: "#DC143C", khaki: "#F0E68C",
  lavender: "#E6E6FA", mint: "#98FF98", peach: "#FFCBA4", plum: "#DDA0DD", tan: "#D2B48C"
};

function parseColor(input: string): RGB | null {
  if (!input || !input.trim()) return null;
  const s = input.trim().toLowerCase();
  
  if (COLOR_NAMES[s]) {
    return hexToRgb(COLOR_NAMES[s]);
  }
  if (s.startsWith("#")) {
    return hexToRgb(s);
  }
  if (s.startsWith("rgb")) {
    const match = s.match(/rgba?\s*\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) {
      let r = parseFloat(match[1]), g = parseFloat(match[2]), b = parseFloat(match[3]);
      if (s.includes("%")) {
        r = Math.round(r * 2.55);
        g = Math.round(g * 2.55);
        b = Math.round(b * 2.55);
      }
      return { r: Math.min(255, Math.max(0, Math.round(r))), g: Math.min(255, Math.max(0, Math.round(g))), b: Math.min(255, Math.max(0, Math.round(b))) };
    }
  }
  if (s.startsWith("hsl")) {
    const match = s.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) {
      return hslToRgb({ h: Math.round(parseFloat(match[1])), s: Math.round(parseFloat(match[2])), l: Math.round(parseFloat(match[3])) });
    }
  }
  if (s.startsWith("hsv")) {
    const match = s.match(/hsva?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) {
      return hsvToRgb({ h: Math.round(parseFloat(match[1])), s: Math.round(parseFloat(match[2])), v: Math.round(parseFloat(match[3])) });
    }
  }
  if (s.startsWith("cmyk")) {
    const match = s.match(/cmyk\s*\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) {
      return cmykToRgb({ c: Math.round(parseFloat(match[1])), m: Math.round(parseFloat(match[2])), y: Math.round(parseFloat(match[3])), k: Math.round(parseFloat(match[4])) });
    }
  }
  const rgbMatch = s.match(/^([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)$/);
  if (rgbMatch) {
    return { r: Math.round(parseFloat(rgbMatch[1])), g: Math.round(parseFloat(rgbMatch[2])), b: Math.round(parseFloat(rgbMatch[3])) };
  }
  return null;
}

function hexToRgb(hex: string): RGB | null {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (h.length !== 6) return null;
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(rgb: RGB): string {
  return "#" + [rgb.r, rgb.g, rgb.b].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h / 360, s = hsv.s / 100, v = hsv.v / 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk.c / 100, m = cmyk.m / 100, y = cmyk.y / 100, k = cmyk.k / 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k))
  };
}

function getLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getBestTextColor(bg: RGB): "black" | "white" {
  return getLuminance(bg) > 0.179 ? "black" : "white";
}

function blendColors(colors: RGB[], weights: number[], mode: string): RGB {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normalized = totalWeight > 0 ? weights.map(w => w / totalWeight) : weights.map(() => 1 / weights.length);
  
  switch (mode) {
    case "average":
      return {
        r: Math.round(colors.reduce((sum, c, i) => sum + c.r * normalized[i], 0)),
        g: Math.round(colors.reduce((sum, c, i) => sum + c.g * normalized[i], 0)),
        b: Math.round(colors.reduce((sum, c, i) => sum + c.b * normalized[i], 0))
      };
    case "multiply":
      return {
        r: Math.round(colors.reduce((prod, c) => prod * (c.r / 255), 1) * 255),
        g: Math.round(colors.reduce((prod, c) => prod * (c.g / 255), 1) * 255),
        b: Math.round(colors.reduce((prod, c) => prod * (c.b / 255), 1) * 255)
      };
    case "screen":
      return {
        r: Math.round((1 - colors.reduce((prod, c) => prod * (1 - c.r / 255), 1)) * 255),
        g: Math.round((1 - colors.reduce((prod, c) => prod * (1 - c.g / 255), 1)) * 255),
        b: Math.round((1 - colors.reduce((prod, c) => prod * (1 - c.b / 255), 1)) * 255)
      };
    case "overlay":
      const base = colors[0];
      let result = { ...base };
      for (let i = 1; i < colors.length; i++) {
        const blend = colors[i];
        result = {
          r: result.r < 128 ? Math.round(2 * result.r * blend.r / 255) : Math.round(255 - 2 * (255 - result.r) * (255 - blend.r) / 255),
          g: result.g < 128 ? Math.round(2 * result.g * blend.g / 255) : Math.round(255 - 2 * (255 - result.g) * (255 - blend.g) / 255),
          b: result.b < 128 ? Math.round(2 * result.b * blend.b / 255) : Math.round(255 - 2 * (255 - result.b) * (255 - blend.b) / 255)
        };
      }
      return result;
    default:
      return colors[0];
  }
}

function colorDistance(c1: RGB, c2: RGB): number {
  const rMean = (c1.r + c2.r) / 2;
  const dR = c1.r - c2.r;
  const dG = c1.g - c2.g;
  const dB = c1.b - c2.b;
  return Math.sqrt((2 + rMean / 256) * dR * dR + 4 * dG * dG + (2 + (255 - rMean) / 256) * dB * dB);
}

function findClosestColorName(rgb: RGB): string {
  let closest = "unknown";
  let minDist = Infinity;
  for (const [name, hex] of Object.entries(COLOR_NAMES)) {
    const c = hexToRgb(hex);
    if (c) {
      const dist = colorDistance(rgb, c);
      if (dist < minDist) {
        minDist = dist;
        closest = name;
      }
    }
  }
  return closest.charAt(0).toUpperCase() + closest.slice(1);
}

function generateColor(mode: string): RGB {
  const rand = () => Math.floor(Math.random() * 256);
  const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  switch (mode) {
    case "random": return { r: rand(), g: rand(), b: rand() };
    case "light": return hslToRgb({ h: randRange(0, 360), s: randRange(20, 60), l: randRange(70, 95) });
    case "dark": return hslToRgb({ h: randRange(0, 360), s: randRange(30, 70), l: randRange(10, 30) });
    case "pastel": return hslToRgb({ h: randRange(0, 360), s: randRange(40, 70), l: randRange(75, 90) });
    case "neon": return hslToRgb({ h: randRange(0, 360), s: 100, l: 50 });
    case "vintage": return hslToRgb({ h: randRange(20, 60), s: randRange(20, 50), l: randRange(40, 70) });
    case "muted": return hslToRgb({ h: randRange(0, 360), s: randRange(10, 40), l: randRange(40, 60) });
    case "vibrant": return hslToRgb({ h: randRange(0, 360), s: randRange(80, 100), l: randRange(45, 60) });
    case "greyscale": { const v = randRange(20, 230); return { r: v, g: v, b: v }; }
    case "warm": return hslToRgb({ h: randRange(0, 60), s: randRange(60, 90), l: randRange(45, 65) });
    case "cool": return hslToRgb({ h: randRange(180, 270), s: randRange(50, 80), l: randRange(45, 65) });
    case "skin": return hslToRgb({ h: randRange(15, 45), s: randRange(25, 60), l: randRange(50, 80) });
    case "earth": return hslToRgb({ h: randRange(20, 50), s: randRange(30, 60), l: randRange(25, 55) });
    case "metallic": return hslToRgb({ h: randRange(35, 55), s: randRange(10, 40), l: randRange(50, 75) });
    case "brand": return hslToRgb({ h: [0, 210, 120, 45, 280][randRange(0, 4)], s: randRange(70, 90), l: randRange(40, 55) });
    case "websafe": {
      const vals = [0, 51, 102, 153, 204, 255];
      return { r: vals[randRange(0, 5)], g: vals[randRange(0, 5)], b: vals[randRange(0, 5)] };
    }
    case "material": {
      const hues = [0, 15, 30, 45, 120, 180, 210, 260, 290, 340];
      return hslToRgb({ h: hues[randRange(0, hues.length - 1)], s: randRange(70, 85), l: randRange(45, 55) });
    }
    case "bootstrap": {
      const colors = ["#0d6efd", "#6c757d", "#198754", "#dc3545", "#ffc107", "#0dcaf0", "#212529"];
      return hexToRgb(colors[randRange(0, colors.length - 1)])!;
    }
    case "flatui": {
      const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#e74c3c", "#f39c12"];
      return hexToRgb(colors[randRange(0, colors.length - 1)])!;
    }
    case "darkmode": return hslToRgb({ h: randRange(200, 260), s: randRange(15, 35), l: randRange(10, 25) });
    case "lightmode": return hslToRgb({ h: randRange(0, 360), s: randRange(5, 20), l: randRange(92, 98) });
    default: return { r: rand(), g: rand(), b: rand() };
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors" data-testid="button-copy">
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
    </button>
  );
}

function ColorInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const parsed = parseColor(value);
  const hex = parsed ? rgbToHex(parsed) : "#888888";
  
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter color (HEX, RGB, HSL, name...)"}
        className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        data-testid="input-color"
      />
      <div className="w-12 h-12 rounded-xl border border-border shadow-inner" style={{ backgroundColor: hex }} />
    </div>
  );
}

export default function ColorTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("mixer");

  const tools = [
    { id: "mixer", label: "Color Mixer", icon: Blend },
    { id: "match", label: "Match %", icon: Percent },
    { id: "gradient", label: "Gradient", icon: Layers },
    { id: "converter", label: "Converter", icon: Pipette },
    { id: "generator", label: "Generator", icon: Palette },
  ];

  return (
    <PageWrapper
      title="Color Tools"
      subtitle="Mix, match, convert and generate colors"
      accentColor="bg-fuchsia-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "mixer" && <ColorMixer />}
      {activeTool === "match" && <ColorMatch />}
      {activeTool === "gradient" && <GradientGenerator />}
      {activeTool === "converter" && <ColorConverter />}
      {activeTool === "generator" && <ColorGenerator />}
    </PageWrapper>
  );
}

function ColorMixer() {
  const [colorCount, setColorCount] = useState(2);
  const [colors, setColors] = useState(["#FF5733", "#3498DB", "#2ECC71", "#9B59B6", "#F1C40F"]);
  const [weights, setWeights] = useState([50, 50, 50, 50, 50]);
  const [blendMode, setBlendMode] = useState("average");

  const parsedColors = colors.slice(0, colorCount).map(c => parseColor(c)).filter(Boolean) as RGB[];
  const activeWeights = weights.slice(0, colorCount);
  
  const mixedColor = parsedColors.length >= 2 ? blendColors(parsedColors, activeWeights, blendMode) : parsedColors[0] || { r: 128, g: 128, b: 128 };
  const hex = rgbToHex(mixedColor);
  const hsl = rgbToHsl(mixedColor);
  const cmyk = rgbToCmyk(mixedColor);
  const bestText = getBestTextColor(mixedColor);
  const contrastBlack = getContrastRatio(mixedColor, { r: 0, g: 0, b: 0 });
  const contrastWhite = getContrastRatio(mixedColor, { r: 255, g: 255, b: 255 });

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Multi-Color Mixer" icon={Blend} iconColor="bg-fuchsia-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Number of Colors</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setColorCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${colorCount === n ? "bg-fuchsia-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-count-${n}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {colors.slice(0, colorCount).map((color, i) => (
            <div key={i} className="space-y-2">
              <ColorInput
                value={color}
                onChange={(v) => {
                  const newColors = [...colors];
                  newColors[i] = v;
                  setColors(newColors);
                }}
                placeholder={`Color ${i + 1}`}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Weight:</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[i]}
                  onChange={(e) => {
                    const newWeights = [...weights];
                    newWeights[i] = parseInt(e.target.value);
                    setWeights(newWeights);
                  }}
                  className="flex-1"
                  data-testid={`slider-weight-${i}`}
                />
                <span className="text-xs font-bold w-10 text-right">{weights[i]}%</span>
              </div>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Blend Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {["average", "multiply", "screen", "overlay"].map(mode => (
                <button
                  key={mode}
                  onClick={() => setBlendMode(mode)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize ${blendMode === mode ? "bg-fuchsia-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-mode-${mode}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <ToolCard title="Mixed Result" icon={Palette} iconColor="bg-emerald-500">
          <div className="space-y-4">
            <div 
              className="h-24 rounded-xl border border-border flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: hex, color: bestText }}
            >
              {hex}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span>HEX</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{hex}</span>
                  <CopyButton text={hex} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span>RGB</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{mixedColor.r},{mixedColor.g},{mixedColor.b}</span>
                  <CopyButton text={`rgb(${mixedColor.r},${mixedColor.g},${mixedColor.b})`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span>HSL</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{hsl.h},{hsl.s}%,{hsl.l}%</span>
                  <CopyButton text={`hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span>CMYK</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{cmyk.c},{cmyk.m},{cmyk.y},{cmyk.k}</span>
                  <CopyButton text={`cmyk(${cmyk.c}%,${cmyk.m}%,${cmyk.y}%,${cmyk.k}%)`} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <ResultDisplay label="Best Text Color" value={bestText.toUpperCase()} color={bestText === "white" ? "text-white" : "text-black"} />
              <ResultDisplay label="Light/Dark" value={getLuminance(mixedColor) > 0.5 ? "Light" : "Dark"} />
              <ResultDisplay label="Contrast (Black)" value={contrastBlack.toFixed(2) + ":1"} color={contrastBlack >= 4.5 ? "text-emerald-400" : "text-orange-400"} />
              <ResultDisplay label="Contrast (White)" value={contrastWhite.toFixed(2) + ":1"} color={contrastWhite >= 4.5 ? "text-emerald-400" : "text-orange-400"} />
            </div>
          </div>
        </ToolCard>
      </motion.div>
    </div>
  );
}

function ColorMatch() {
  const [color1, setColor1] = useState("#FF5733");
  const [color2, setColor2] = useState("#E74C3C");

  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  const distance = rgb1 && rgb2 ? colorDistance(rgb1, rgb2) : 0;
  const maxDistance = 764.83;
  const matchPercent = Math.max(0, 100 - (distance / maxDistance) * 100);
  const similarity = matchPercent >= 90 ? "Excellent" : matchPercent >= 70 ? "Good" : matchPercent >= 50 ? "Moderate" : "Low";

  const closestName1 = rgb1 ? findClosestColorName(rgb1) : "-";
  const closestName2 = rgb2 ? findClosestColorName(rgb2) : "-";

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Color Match Tool" icon={Percent} iconColor="bg-violet-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Color 1</label>
            <ColorInput value={color1} onChange={setColor1} />
            <p className="text-xs text-muted-foreground mt-1">Closest name: {closestName1}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Color 2</label>
            <ColorInput value={color2} onChange={setColor2} />
            <p className="text-xs text-muted-foreground mt-1">Closest name: {closestName2}</p>
          </div>
        </div>
      </ToolCard>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <ToolCard title="Match Analysis" icon={Pipette} iconColor="bg-emerald-500">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 h-16 rounded-xl border border-border" style={{ backgroundColor: rgb1 ? rgbToHex(rgb1) : "#888" }} />
              <div className="flex-1 h-16 rounded-xl border border-border" style={{ backgroundColor: rgb2 ? rgbToHex(rgb2) : "#888" }} />
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-xl">
              <div className="text-4xl font-black text-violet-400">{matchPercent.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground mt-1">Match Percentage</div>
            </div>

            <ResultDisplay label="Similarity" value={similarity} color={matchPercent >= 70 ? "text-emerald-400" : "text-orange-400"} />
            <ResultDisplay label="Color Distance" value={distance.toFixed(2)} />
          </div>
        </ToolCard>
      </motion.div>
    </div>
  );
}

function GradientGenerator() {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90);
  const [colorCount, setColorCount] = useState(2);
  const [colors, setColors] = useState(["#FF5733", "#3498DB", "#2ECC71", "#9B59B6", "#F1C40F"]);

  const activeColors = colors.slice(0, colorCount).map(c => {
    const rgb = parseColor(c);
    return rgb ? rgbToHex(rgb) : "#888888";
  });

  const gradient = gradientType === "linear"
    ? `linear-gradient(${angle}deg, ${activeColors.join(", ")})`
    : `radial-gradient(circle, ${activeColors.join(", ")})`;

  const cssCode = `background: ${gradient};`;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Gradient Generator" icon={Layers} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Gradient Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGradientType("linear")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${gradientType === "linear" ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                Linear
              </button>
              <button
                onClick={() => setGradientType("radial")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${gradientType === "radial" ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                Radial
              </button>
            </div>
          </div>

          {gradientType === "linear" && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Angle: {angle}°</label>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Number of Colors</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setColorCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${colorCount === n ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {colors.slice(0, colorCount).map((color, i) => (
            <ColorInput
              key={i}
              value={color}
              onChange={(v) => {
                const newColors = [...colors];
                newColors[i] = v;
                setColors(newColors);
              }}
              placeholder={`Color ${i + 1}`}
            />
          ))}
        </div>
      </ToolCard>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <ToolCard title="Preview" icon={Palette} iconColor="bg-emerald-500">
          <div className="space-y-4">
            <div className="h-32 rounded-xl border border-border" style={{ background: gradient }} />
            
            <div className="p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">CSS Code</span>
                <CopyButton text={cssCode} />
              </div>
              <code className="text-xs font-mono text-foreground break-all">{cssCode}</code>
            </div>
          </div>
        </ToolCard>
      </motion.div>
    </div>
  );
}

function ColorConverter() {
  const [input, setInput] = useState("#FF5733");

  const rgb = parseColor(input);
  const hex = rgb ? rgbToHex(rgb) : "-";
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const hsv = rgb ? rgbToHsv(rgb) : null;
  const cmyk = rgb ? rgbToCmyk(rgb) : null;
  const closestName = rgb ? findClosestColorName(rgb) : "-";

  const formats = rgb ? [
    { label: "HEX", value: hex, copy: hex },
    { label: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}`, copy: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "RGBA", value: `${rgb.r}, ${rgb.g}, ${rgb.b}, 1`, copy: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { label: "HSL", value: hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : "-", copy: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "" },
    { label: "HSV", value: hsv ? `${hsv.h}°, ${hsv.s}%, ${hsv.v}%` : "-", copy: hsv ? `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` : "" },
    { label: "CMYK", value: cmyk ? `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%` : "-", copy: cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : "" },
  ] : [];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Color Code Converter" icon={Pipette} iconColor="bg-amber-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Enter Any Color Format</label>
            <ColorInput value={input} onChange={setInput} />
            <p className="text-xs text-muted-foreground mt-2">
              Accepts: HEX, RGB, RGBA, HSL, HSV, CMYK, or color names
            </p>
          </div>
        </div>
      </ToolCard>

      {rgb && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ToolCard title="All Formats" icon={Palette} iconColor="bg-emerald-500">
            <div className="space-y-3">
              <div 
                className="h-20 rounded-xl border border-border flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: hex, color: getBestTextColor(rgb) }}
              >
                {closestName}
              </div>

              {formats.map(({ label, value, copy }) => (
                <div key={label} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <span className="text-sm font-medium">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{value}</span>
                    <CopyButton text={copy} />
                  </div>
                </div>
              ))}
            </div>
          </ToolCard>
        </motion.div>
      )}
    </div>
  );
}

function ColorGenerator() {
  const [mode, setMode] = useState("random");
  const [color, setColor] = useState<RGB>({ r: 255, g: 87, b: 51 });

  const modes = [
    "random", "light", "dark", "pastel", "neon", "vintage", "muted", "vibrant",
    "greyscale", "warm", "cool", "skin", "earth", "metallic", "brand", "websafe",
    "material", "bootstrap", "flatui", "darkmode", "lightmode"
  ];

  const generate = () => setColor(generateColor(mode));

  useEffect(() => {
    generate();
  }, [mode]);

  const hex = rgbToHex(color);
  const hsl = rgbToHsl(color);
  const cmyk = rgbToCmyk(color);
  const closestName = findClosestColorName(color);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Color Generator" icon={Palette} iconColor="bg-rose-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Generator Mode</label>
            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
              {modes.map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize truncate ${mode === m ? "bg-rose-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-mode-${m}`}
                >
                  {m.replace(/([A-Z])/g, " $1")}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
            data-testid="button-generate"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Color
          </button>
        </div>
      </ToolCard>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={hex}>
        <ToolCard title="Generated Color" icon={Pipette} iconColor="bg-emerald-500">
          <div className="space-y-4">
            <div 
              className="h-28 rounded-xl border border-border flex flex-col items-center justify-center"
              style={{ backgroundColor: hex, color: getBestTextColor(color) }}
            >
              <div className="text-2xl font-black">{hex}</div>
              <div className="text-sm opacity-80">{closestName}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs">
                <span>HEX</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{hex}</span>
                  <CopyButton text={hex} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs">
                <span>RGB</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{color.r},{color.g},{color.b}</span>
                  <CopyButton text={`rgb(${color.r},${color.g},${color.b})`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs">
                <span>HSL</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{hsl.h},{hsl.s}%,{hsl.l}%</span>
                  <CopyButton text={`hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs">
                <span>CMYK</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{cmyk.c},{cmyk.m},{cmyk.y},{cmyk.k}</span>
                  <CopyButton text={`cmyk(${cmyk.c}%,${cmyk.m}%,${cmyk.y}%,${cmyk.k}%)`} />
                </div>
              </div>
            </div>
          </div>
        </ToolCard>
      </motion.div>
    </div>
  );
}