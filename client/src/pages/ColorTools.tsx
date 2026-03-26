import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Pipette, Blend, Layers, Copy, Check, RefreshCw, Percent } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultDisplay } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "mixer" | "match" | "gradient" | "converter" | "generator";

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }
interface HSV { h: number; s: number; v: number; }
interface CMYK { c: number; m: number; y: number; k: number; }

const COLOR_NAMES: Record<string, string> = {
  aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aqua: "#00FFFF", aquamarine: "#7FFFD4", azure: "#F0FFFF",
  beige: "#F5F5DC", bisque: "#FFE4C4", black: "#000000", blanchedalmond: "#FFEBCD", blue: "#0000FF",
  blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00",
  chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C",
  cyan: "#00FFFF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9",
  darkgreen: "#006400", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F",
  darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F",
  darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkturquoise: "#00CED1",
  darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969",
  dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", fuchsia: "#FF00FF",
  gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", gray: "#808080",
  green: "#008000", greenyellow: "#ADFF2F", honeydew: "#F0FFF0", hotpink: "#FF69B4",
  indianred: "#CD5C5C", indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA",
  lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6",
  lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgray: "#D3D3D3",
  lightgreen: "#90EE90", lightpink: "#FFB6C1", lightsalmon: "#FFA07A",
  lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899",
  lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", lime: "#00FF00", limegreen: "#32CD32", linen: "#FAF0E6",
  magenta: "#FF00FF", maroon: "#800000", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD",
  mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE",
  mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970",
  mint: "#98FF98", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD",
  navy: "#000080", oldlace: "#FDF5E6", olive: "#808000", olivedrab: "#6B8E23", orange: "#FFA500",
  orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98",
  paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peach: "#FFCBA4",
  peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6",
  purple: "#800080", rebeccapurple: "#663399", red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1",
  saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE",
  sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090",
  snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C",
  teal: "#008080", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE",
  wheat: "#F5DEB3", white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32"
};

const A_TO_Z_PALETTE = Object.entries(COLOR_NAMES).sort(([a], [b]) => a.localeCompare(b));

function parseColor(input: string): RGB | null {
  if (!input || !input.trim()) return null;
  const s = input.trim().toLowerCase();
  if (COLOR_NAMES[s]) return hexToRgb(COLOR_NAMES[s]);
  if (s.startsWith("#")) return hexToRgb(s);
  if (s.startsWith("rgb")) {
    const match = s.match(/rgba?\s*\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) {
      let r = parseFloat(match[1]), g = parseFloat(match[2]), b = parseFloat(match[3]);
      if (s.includes("%")) { r = Math.round(r * 2.55); g = Math.round(g * 2.55); b = Math.round(b * 2.55); }
      return { r: Math.min(255, Math.max(0, Math.round(r))), g: Math.min(255, Math.max(0, Math.round(g))), b: Math.min(255, Math.max(0, Math.round(b))) };
    }
  }
  if (s.startsWith("hsl")) {
    const match = s.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) return hslToRgb({ h: Math.round(parseFloat(match[1])), s: Math.round(parseFloat(match[2])), l: Math.round(parseFloat(match[3])) });
  }
  if (s.startsWith("hsv")) {
    const match = s.match(/hsva?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) return hsvToRgb({ h: Math.round(parseFloat(match[1])), s: Math.round(parseFloat(match[2])), v: Math.round(parseFloat(match[3])) });
  }
  if (s.startsWith("cmyk")) {
    const match = s.match(/cmyk\s*\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
    if (match) return cmykToRgb({ c: Math.round(parseFloat(match[1])), m: Math.round(parseFloat(match[2])), y: Math.round(parseFloat(match[3])), k: Math.round(parseFloat(match[4])) });
  }
  const rgbMatch = s.match(/^([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)$/);
  if (rgbMatch) return { r: Math.round(parseFloat(rgbMatch[1])), g: Math.round(parseFloat(rgbMatch[2])), b: Math.round(parseFloat(rgbMatch[3])) };
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
  if (s === 0) { r = g = b = l; } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0; const v = max; const d = max - min; const s = max === 0 ? 0 : d / max;
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
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break; case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return { c: Math.round(((1 - r - k) / (1 - k)) * 100), m: Math.round(((1 - g - k) / (1 - k)) * 100), y: Math.round(((1 - b - k) / (1 - k)) * 100), k: Math.round(k * 100) };
}

function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk.c / 100, m = cmyk.m / 100, y = cmyk.y / 100, k = cmyk.k / 100;
  return { r: Math.round(255 * (1 - c) * (1 - k)), g: Math.round(255 * (1 - m) * (1 - k)), b: Math.round(255 * (1 - y) * (1 - k)) };
}

function getLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getLuminance(rgb1), l2 = getLuminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function getBestTextColor(bg: RGB): "black" | "white" { return getLuminance(bg) > 0.179 ? "black" : "white"; }

function blendColors(colors: RGB[], weights: number[], mode: string): RGB {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normalized = totalWeight > 0 ? weights.map(w => w / totalWeight) : weights.map(() => 1 / weights.length);
  switch (mode) {
    case "average": return { r: Math.round(colors.reduce((sum, c, i) => sum + c.r * normalized[i], 0)), g: Math.round(colors.reduce((sum, c, i) => sum + c.g * normalized[i], 0)), b: Math.round(colors.reduce((sum, c, i) => sum + c.b * normalized[i], 0)) };
    case "multiply": return { r: Math.round(colors.reduce((prod, c) => prod * (c.r / 255), 1) * 255), g: Math.round(colors.reduce((prod, c) => prod * (c.g / 255), 1) * 255), b: Math.round(colors.reduce((prod, c) => prod * (c.b / 255), 1) * 255) };
    case "screen": return { r: Math.round((1 - colors.reduce((prod, c) => prod * (1 - c.r / 255), 1)) * 255), g: Math.round((1 - colors.reduce((prod, c) => prod * (1 - c.g / 255), 1)) * 255), b: Math.round((1 - colors.reduce((prod, c) => prod * (1 - c.b / 255), 1)) * 255) };
    case "overlay": {
      let result = { ...colors[0] };
      for (let i = 1; i < colors.length; i++) {
        const blend = colors[i];
        result = { r: result.r < 128 ? Math.round(2 * result.r * blend.r / 255) : Math.round(255 - 2 * (255 - result.r) * (255 - blend.r) / 255), g: result.g < 128 ? Math.round(2 * result.g * blend.g / 255) : Math.round(255 - 2 * (255 - result.g) * (255 - blend.g) / 255), b: result.b < 128 ? Math.round(2 * result.b * blend.b / 255) : Math.round(255 - 2 * (255 - result.b) * (255 - blend.b) / 255) };
      }
      return result;
    }
    default: return colors[0];
  }
}

function colorDistance(c1: RGB, c2: RGB): number {
  const rMean = (c1.r + c2.r) / 2; const dR = c1.r - c2.r; const dG = c1.g - c2.g; const dB = c1.b - c2.b;
  return Math.sqrt((2 + rMean / 256) * dR * dR + 4 * dG * dG + (2 + (255 - rMean) / 256) * dB * dB);
}

function findClosestColorName(rgb: RGB): string {
  let closest = "unknown"; let minDist = Infinity;
  for (const [name, hex] of Object.entries(COLOR_NAMES)) {
    const c = hexToRgb(hex);
    if (c) { const dist = colorDistance(rgb, c); if (dist < minDist) { minDist = dist; closest = name; } }
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
    case "websafe": { const vals = [0, 51, 102, 153, 204, 255]; return { r: vals[randRange(0, 5)], g: vals[randRange(0, 5)], b: vals[randRange(0, 5)] }; }
    case "material": { const hues = [0, 15, 30, 45, 120, 180, 210, 260, 290, 340]; return hslToRgb({ h: hues[randRange(0, hues.length - 1)], s: randRange(70, 85), l: randRange(45, 55) }); }
    case "bootstrap": { const colors = ["#0d6efd", "#6c757d", "#198754", "#dc3545", "#ffc107", "#0dcaf0", "#212529"]; return hexToRgb(colors[randRange(0, colors.length - 1)])!; }
    case "flatui": { const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#e74c3c", "#f39c12"]; return hexToRgb(colors[randRange(0, colors.length - 1)])!; }
    case "darkmode": return hslToRgb({ h: randRange(200, 260), s: randRange(15, 35), l: randRange(10, 25) });
    case "lightmode": return hslToRgb({ h: randRange(0, 360), s: randRange(5, 20), l: randRange(92, 98) });
    default: return { r: rand(), g: rand(), b: rand() };
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors" data-testid="button-copy">
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
    </button>
  );
}

function ColorPalettePicker({ onSelect, selectedHex }: { onSelect: (hex: string, name: string) => void; selectedHex?: string }) {
  const [showPalette, setShowPalette] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeLetters, setActiveLetters] = useState<string[]>([]);
  const letters = Array.from(new Set(A_TO_Z_PALETTE.map(([name]) => name[0].toUpperCase()))).sort();
  const filteredColors = A_TO_Z_PALETTE.filter(([name]) => {
    const matchesSearch = filter === "" || name.toLowerCase().includes(filter.toLowerCase());
    const matchesLetter = activeLetters.length === 0 || activeLetters.includes(name[0].toUpperCase());
    return matchesSearch && matchesLetter;
  });
  return (
    <div className="space-y-2">
      <button onClick={() => setShowPalette(!showPalette)}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        data-testid="button-toggle-palette">
        <Palette className="w-4 h-4" />
        {showPalette ? "Hide" : "Show"} A-Z Palette ({A_TO_Z_PALETTE.length} colors)
      </button>
      {showPalette && (
        <div className="bg-muted/30 rounded-xl p-3 space-y-3 border border-border">
          <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search colors..."
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-palette-search" />
          <div className="flex flex-wrap gap-1">
            {letters.map(letter => (
              <button key={letter} onClick={() => setActiveLetters(prev => prev.includes(letter) ? prev.filter(l => l !== letter) : [...prev, letter])}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${activeLetters.includes(letter) ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
                data-testid={`button-letter-${letter}`}>{letter}</button>
            ))}
            {activeLetters.length > 0 && (
              <button onClick={() => setActiveLetters([])}
                className="px-2 h-7 rounded-md text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                data-testid="button-clear-letters">Clear</button>
            )}
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {filteredColors.map(([name, hex]) => (
              <button key={name} onClick={() => onSelect(hex, name)}
                className={`group relative aspect-square rounded-lg border-2 transition-all hover:scale-110 ${selectedHex?.toUpperCase() === hex.toUpperCase() ? "border-primary ring-2 ring-primary/50" : "border-transparent hover:border-foreground/30"}`}
                style={{ backgroundColor: hex }} title={`${name} (${hex})`} data-testid={`button-color-${name}`}>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg text-[8px] text-white font-medium truncate px-0.5">{name}</span>
              </button>
            ))}
          </div>
          {filteredColors.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No colors found</p>}
        </div>
      )}
    </div>
  );
}

function ColorInput({ value, onChange, placeholder, showPalette = true }: { value: string; onChange: (v: string) => void; placeholder?: string; showPalette?: boolean }) {
  const parsed = parseColor(value);
  const hex = parsed ? rgbToHex(parsed) : "#888888";
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter color (HEX, RGB, HSL, name...)"}
          className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          data-testid="input-color" />
        <div className="w-12 h-12 rounded-xl border border-border shadow-inner" style={{ backgroundColor: hex }} />
      </div>
      {showPalette && <ColorPalettePicker onSelect={(hex) => onChange(hex)} selectedHex={parsed ? rgbToHex(parsed) : undefined} />}
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
    <DesktopToolGrid
      inputs={
        <InputPanel title="Multi-Color Mixer" icon={Blend} iconColor="bg-fuchsia-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Number of Colors</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setColorCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${colorCount === n ? "bg-fuchsia-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-count-${n}`}>{n}</button>
              ))}
            </div>
          </div>
          {colors.slice(0, colorCount).map((color, i) => (
            <div key={i} className="space-y-2">
              <ColorInput value={color} onChange={(v) => { const newColors = [...colors]; newColors[i] = v; setColors(newColors); }} placeholder={`Color ${i + 1}`} showPalette={false} />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Weight:</span>
                <input type="range" min={0} max={100} value={weights[i]}
                  onChange={(e) => { const newWeights = [...weights]; newWeights[i] = parseInt(e.target.value); setWeights(newWeights); }}
                  className="flex-1" data-testid={`slider-weight-${i}`} />
                <span className="text-xs font-bold w-10 text-right">{weights[i]}%</span>
              </div>
            </div>
          ))}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Blend Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {["average", "multiply", "screen", "overlay"].map(mode => (
                <button key={mode} onClick={() => setBlendMode(mode)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize ${blendMode === mode ? "bg-fuchsia-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-mode-${mode}`}>{mode}</button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Mixed Result</p>
          <div className="h-24 rounded-xl border border-border flex items-center justify-center text-lg font-bold mb-4"
            style={{ backgroundColor: hex, color: bestText }}>{hex}</div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            {[
              { label: "HEX", value: hex, copy: hex },
              { label: "RGB", value: `${mixedColor.r},${mixedColor.g},${mixedColor.b}`, copy: `rgb(${mixedColor.r},${mixedColor.g},${mixedColor.b})` },
              { label: "HSL", value: `${hsl.h},${hsl.s}%,${hsl.l}%`, copy: `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)` },
              { label: "CMYK", value: `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}`, copy: `cmyk(${cmyk.c}%,${cmyk.m}%,${cmyk.y}%,${cmyk.k}%)` },
            ].map(({ label, value, copy }) => (
              <div key={label} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span>{label}</span>
                <div className="flex items-center gap-1"><span className="font-mono">{value}</span><CopyButton text={copy} /></div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <ResultDisplay label="Best Text Color" value={bestText.toUpperCase()} />
            <ResultDisplay label="Contrast (Black)" value={contrastBlack.toFixed(2) + ":1"} color={contrastBlack >= 4.5 ? "text-emerald-400" : "text-orange-400"} />
            <ResultDisplay label="Contrast (White)" value={contrastWhite.toFixed(2) + ":1"} color={contrastWhite >= 4.5 ? "text-emerald-400" : "text-orange-400"} />
          </div>
        </motion.div>
      }
    />
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
    <DesktopToolGrid
      inputs={
        <InputPanel title="Color Match Tool" icon={Percent} iconColor="bg-violet-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Color 1</label>
            <ColorInput value={color1} onChange={setColor1} />
            <p className="text-xs text-muted-foreground mt-1">Closest name: {closestName1}</p>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Color 2</label>
            <ColorInput value={color2} onChange={setColor2} />
            <p className="text-xs text-muted-foreground mt-1">Closest name: {closestName2}</p>
          </div>
        </InputPanel>
      }
      results={
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Match Analysis</p>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 h-16 rounded-xl border border-border" style={{ backgroundColor: rgb1 ? rgbToHex(rgb1) : "#888" }} />
            <div className="flex-1 h-16 rounded-xl border border-border" style={{ backgroundColor: rgb2 ? rgbToHex(rgb2) : "#888" }} />
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-xl mb-4">
            <div className="text-4xl font-black text-violet-400">{matchPercent.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground mt-1">Match Percentage</div>
          </div>
          <ResultDisplay label="Similarity" value={similarity} color={matchPercent >= 70 ? "text-emerald-400" : "text-orange-400"} />
          <ResultDisplay label="Color Distance" value={distance.toFixed(2)} />
        </motion.div>
      }
    />
  );
}

function GradientGenerator() {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90);
  const [colorCount, setColorCount] = useState(2);
  const [colors, setColors] = useState(["#FF5733", "#3498DB", "#2ECC71", "#9B59B6", "#F1C40F"]);

  const activeColors = colors.slice(0, colorCount).map(c => { const rgb = parseColor(c); return rgb ? rgbToHex(rgb) : "#888888"; });
  const gradient = gradientType === "linear" ? `linear-gradient(${angle}deg, ${activeColors.join(", ")})` : `radial-gradient(circle, ${activeColors.join(", ")})`;
  const cssCode = `background: ${gradient};`;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Gradient Generator" icon={Layers} iconColor="bg-cyan-500">
          <div className="flex gap-2">
            {(["linear", "radial"] as const).map(type => (
              <button key={type} onClick={() => setGradientType(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize ${gradientType === type ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}>
                {type}
              </button>
            ))}
          </div>
          {gradientType === "linear" && (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full" />
            </div>
          )}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Number of Colors</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setColorCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${colorCount === n ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"}`}>{n}</button>
              ))}
            </div>
          </div>
          {colors.slice(0, colorCount).map((color, i) => (
            <ColorInput key={i} value={color} showPalette={false}
              onChange={(v) => { const newColors = [...colors]; newColors[i] = v; setColors(newColors); }}
              placeholder={`Color ${i + 1}`} />
          ))}
        </InputPanel>
      }
      results={
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Preview</p>
          <div className="h-32 rounded-xl border border-border mb-4" style={{ background: gradient }} />
          <div className="p-3 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">CSS Code</span>
              <CopyButton text={cssCode} />
            </div>
            <code className="text-xs font-mono text-foreground break-all">{cssCode}</code>
          </div>
        </motion.div>
      }
    />
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
    <DesktopToolGrid
      inputs={
        <InputPanel title="Color Code Converter" icon={Pipette} iconColor="bg-amber-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Enter Any Color Format</label>
            <ColorInput value={input} onChange={setInput} />
            <p className="text-xs text-muted-foreground mt-2">Accepts: HEX, RGB, RGBA, HSL, HSV, CMYK, or color names</p>
          </div>
        </InputPanel>
      }
      results={
        rgb ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">All Formats</p>
            <div className="h-20 rounded-xl border border-border flex items-center justify-center text-lg font-bold mb-4"
              style={{ backgroundColor: hex, color: getBestTextColor(rgb) }}>{closestName}</div>
            <div className="space-y-2">
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
          </motion.div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm text-center">Enter a valid color to see all formats</p>
          </div>
        )
      }
    />
  );
}

function ColorGenerator() {
  const [mode, setMode] = useState("random");
  const [color, setColor] = useState<RGB>({ r: 255, g: 87, b: 51 });

  const modes = ["random", "light", "dark", "pastel", "neon", "vintage", "muted", "vibrant",
    "greyscale", "warm", "cool", "skin", "earth", "metallic", "brand", "websafe", "material", "bootstrap", "flatui", "darkmode", "lightmode"];

  const generate = () => setColor(generateColor(mode));
  useEffect(() => { generate(); }, [mode]);

  const hex = rgbToHex(color);
  const hsl = rgbToHsl(color);
  const cmyk = rgbToCmyk(color);
  const closestName = findClosestColorName(color);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Color Generator" icon={Palette} iconColor="bg-rose-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Generator Mode</label>
            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
              {modes.map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize truncate ${mode === m ? "bg-rose-500 text-white" : "bg-muted text-muted-foreground"}`}
                  data-testid={`button-mode-${m}`}>{m.replace(/([A-Z])/g, " $1")}</button>
              ))}
            </div>
          </div>
          <button onClick={generate} className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
            data-testid="button-generate">
            <RefreshCw className="w-4 h-4" /> Generate New Color
          </button>
          <div className="border-t border-border pt-4">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Or Pick from A-Z Palette</label>
            <ColorPalettePicker onSelect={(selectedHex) => { const rgb = hexToRgb(selectedHex); if (rgb) setColor(rgb); }} selectedHex={hex} />
          </div>
        </InputPanel>
      }
      results={
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={hex}
          className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Generated Color</p>
          <div className="h-28 rounded-xl border border-border flex flex-col items-center justify-center mb-4"
            style={{ backgroundColor: hex, color: getBestTextColor(color) }}>
            <div className="text-2xl font-black">{hex}</div>
            <div className="text-sm opacity-80">{closestName}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "HEX", value: hex, copy: hex },
              { label: "RGB", value: `${color.r},${color.g},${color.b}`, copy: `rgb(${color.r},${color.g},${color.b})` },
              { label: "HSL", value: `${hsl.h},${hsl.s}%,${hsl.l}%`, copy: `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)` },
              { label: "CMYK", value: `${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}`, copy: `cmyk(${cmyk.c}%,${cmyk.m}%,${cmyk.y}%,${cmyk.k}%)` },
            ].map(({ label, value, copy }) => (
              <div key={label} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs">
                <span>{label}</span>
                <div className="flex items-center gap-1"><span className="font-mono">{value}</span><CopyButton text={copy} /></div>
              </div>
            ))}
          </div>
        </motion.div>
      }
    />
  );
}
