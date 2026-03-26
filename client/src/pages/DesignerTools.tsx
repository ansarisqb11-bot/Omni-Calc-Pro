import { useState, useMemo } from "react";
import { Proportions, Monitor, ImageIcon, RulerIcon, FileText } from "lucide-react";
import { DesktopToolGrid, InputPanel } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "aspect-ratio" | "dpi-ppi" | "image-resize" | "cm-px-inch" | "paper-size";

const tools = [
  { id: "aspect-ratio", label: "Aspect Ratio", icon: Proportions },
  { id: "dpi-ppi", label: "DPI / PPI", icon: Monitor },
  { id: "image-resize", label: "Image Resize", icon: ImageIcon },
  { id: "cm-px-inch", label: "CM/PX/Inch", icon: RulerIcon },
  { id: "paper-size", label: "Paper Size", icon: FileText },
];

export default function DesignerTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("aspect-ratio");

  return (
    <PageWrapper
      title="Designer / Creator Tools"
      subtitle="Aspect ratio, DPI, image resize & more"
      accentColor="bg-pink-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
      {activeTool === "aspect-ratio" && <AspectRatioCalc />}
      {activeTool === "dpi-ppi" && <DpiPpiCalc />}
      {activeTool === "image-resize" && <ImageResizeCalc />}
      {activeTool === "cm-px-inch" && <CmPxInchConverter />}
      {activeTool === "paper-size" && <PaperSizeCalc />}
    </PageWrapper>
  );
}

function SolverInput({ label, value, onChange, placeholder, suffix }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function SolverSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ModeToggle({ modes, mode, setMode }: { modes: { id: string; label: string }[]; mode: string; setMode: (m: string) => void }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map((m) => (
        <button key={m.id} onClick={() => setMode(m.id)} data-testid={`mode-${m.id}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === m.id ? "bg-pink-500 text-white shadow-sm" : "text-muted-foreground"}`}>
          {m.label}
        </button>
      ))}
    </div>
  );
}

function StepsDisplay({ steps }: { steps: string[] }) {
  if (steps.length === 0) return null;
  return (
    <div className="bg-muted/20 p-3 rounded-xl border border-border/50 space-y-1.5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Step-by-step</p>
      {steps.map((s, i) => (
        <p key={i} className="text-xs text-foreground" data-testid={`step-${i + 1}`}>
          <span className="font-bold text-pink-500 mr-1">Step {i + 1}:</span> {s}
        </p>
      ))}
    </div>
  );
}

function MultiResult({ results }: { results: { label: string; value: string }[] }) {
  return (
    <div className="space-y-2">
      {results.map((r, i) => (
        <div key={i} className="flex justify-between items-center p-2.5 bg-muted/30 rounded-xl">
          <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
          <span className="text-sm font-bold text-pink-500" data-testid={`result-${i}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function fmt(n: number, d = 2): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "\u2014";
  return parseFloat(n.toFixed(d)).toLocaleString();
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function AspectRatioCalc() {
  const [mode, setMode] = useState("calculate");
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [targetWidth, setTargetWidth] = useState("1280");
  const [targetHeight, setTargetHeight] = useState("");
  const [preset, setPreset] = useState("16:9");

  const presets = [
    { value: "16:9", label: "16:9 (Widescreen)" },
    { value: "4:3", label: "4:3 (Standard)" },
    { value: "1:1", label: "1:1 (Square)" },
    { value: "21:9", label: "21:9 (Ultrawide)" },
    { value: "9:16", label: "9:16 (Vertical/Mobile)" },
    { value: "3:2", label: "3:2 (Photography)" },
    { value: "5:4", label: "5:4 (Monitor)" },
    { value: "2:1", label: "2:1 (Univisium)" },
  ];

  const result = useMemo(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;

    switch (mode) {
      case "calculate": {
        if (w <= 0 || h <= 0) return { results: [], steps: [] };
        const g = gcd(w, h);
        const rw = w / g;
        const rh = h / g;
        const decimal = w / h;
        const megapixels = (w * h) / 1e6;
        const orientation = w > h ? "Landscape" : w < h ? "Portrait" : "Square";
        return {
          results: [
            { label: "Aspect Ratio", value: `${rw}:${rh}` },
            { label: "Decimal Ratio", value: fmt(decimal, 4) },
            { label: "Orientation", value: orientation },
            { label: "Total Pixels", value: `${fmt(w * h, 0)} (${fmt(megapixels, 2)} MP)` },
          ],
          steps: [
            `Width = ${fmt(w, 0)}, Height = ${fmt(h, 0)}`,
            `GCD(${fmt(w, 0)}, ${fmt(h, 0)}) = ${g}`,
            `Ratio = ${fmt(w, 0)}/${g} : ${fmt(h, 0)}/${g} = ${rw}:${rh}`,
            `Decimal = ${fmt(w, 0)} / ${fmt(h, 0)} = ${fmt(decimal, 4)}`,
            `Megapixels = ${fmt(w, 0)} \u00D7 ${fmt(h, 0)} / 1,000,000 = ${fmt(megapixels, 2)} MP`,
          ],
        };
      }
      case "resize": {
        if (w <= 0 || h <= 0) return { results: [], steps: [] };
        const ratio = w / h;
        const tw = parseFloat(targetWidth) || 0;
        const th = parseFloat(targetHeight) || 0;
        let newW = 0, newH = 0;
        if (tw > 0) {
          newW = tw;
          newH = tw / ratio;
        } else if (th > 0) {
          newH = th;
          newW = th * ratio;
        }
        const scaleFactor = newW > 0 ? newW / w : 0;
        return {
          results: [
            { label: "Original", value: `${fmt(w, 0)} \u00D7 ${fmt(h, 0)}` },
            { label: "New Size", value: `${fmt(Math.round(newW), 0)} \u00D7 ${fmt(Math.round(newH), 0)}` },
            { label: "Scale Factor", value: `${fmt(scaleFactor * 100)}%` },
            { label: "Aspect Ratio", value: fmt(ratio, 4) },
          ],
          steps: [
            `Original: ${fmt(w, 0)} \u00D7 ${fmt(h, 0)} (ratio ${fmt(ratio, 4)})`,
            tw > 0
              ? `Target width = ${fmt(tw, 0)}, New height = ${fmt(tw, 0)} / ${fmt(ratio, 4)} = ${fmt(Math.round(newH), 0)}`
              : `Target height = ${fmt(th, 0)}, New width = ${fmt(th, 0)} \u00D7 ${fmt(ratio, 4)} = ${fmt(Math.round(newW), 0)}`,
            `Scale = ${fmt(scaleFactor * 100)}%`,
          ],
        };
      }
      case "preset": {
        const parts = preset.split(":").map(Number);
        const rw = parts[0] || 16;
        const rh = parts[1] || 9;
        const commonResolutions = [
          { w: 640, label: "SD" }, { w: 1280, label: "HD" }, { w: 1920, label: "Full HD" },
          { w: 2560, label: "QHD" }, { w: 3840, label: "4K" }, { w: 7680, label: "8K" },
        ];
        const resolutions = commonResolutions.map(r => ({
          ...r,
          h: Math.round(r.w * rh / rw),
          mp: (r.w * Math.round(r.w * rh / rw)) / 1e6,
        }));
        return {
          results: resolutions.map(r => ({
            label: r.label,
            value: `${r.w} \u00D7 ${r.h} (${fmt(r.mp, 1)} MP)`,
          })),
          steps: [
            `Selected ratio: ${rw}:${rh}`,
            `For each width: height = width \u00D7 ${rh} / ${rw}`,
            ...resolutions.map(r => `${r.label}: ${r.w} \u00D7 (${rh}/${rw}) = ${r.w} \u00D7 ${r.h}`),
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, width, height, targetWidth, targetHeight, preset]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Aspect Ratio Calculator" icon={Proportions} iconColor="bg-pink-500">
        <ModeToggle modes={[
          { id: "calculate", label: "Calculate" },
          { id: "resize", label: "Resize" },
          { id: "preset", label: "Presets" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          {mode === "calculate" && (
            <>
              <SolverInput label="Width (px)" value={width} onChange={setWidth} placeholder="1920" suffix="px" />
              <SolverInput label="Height (px)" value={height} onChange={setHeight} placeholder="1080" suffix="px" />
            </>
          )}
          {mode === "resize" && (
            <>
              <SolverInput label="Original Width (px)" value={width} onChange={setWidth} placeholder="1920" />
              <SolverInput label="Original Height (px)" value={height} onChange={setHeight} placeholder="1080" />
              <SolverInput label="Target Width (leave empty to use height)" value={targetWidth} onChange={(v) => { setTargetWidth(v); setTargetHeight(""); }} placeholder="1280" />
              <SolverInput label="Target Height (leave empty to use width)" value={targetHeight} onChange={(v) => { setTargetHeight(v); setTargetWidth(""); }} placeholder="" />
            </>
          )}
          {mode === "preset" && (
            <SolverSelect label="Aspect Ratio Preset" value={preset} onChange={setPreset} options={presets} />
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function DpiPpiCalc() {
  const [mode, setMode] = useState("mobile-ppi");
  const [widthPx, setWidthPx] = useState("1080");
  const [heightPx, setHeightPx] = useState("2400");
  const [diagonal, setDiagonal] = useState("6.5");
  const [unit, setUnit] = useState("inch");
  const [dpi, setDpi] = useState("300");
  const [widthIn, setWidthIn] = useState("8.5");
  const [heightIn, setHeightIn] = useState("11");
  const [ppiInput, setPpiInput] = useState("405");

  const result = useMemo(() => {
    switch (mode) {
      case "mobile-ppi": {
        const wp = parseFloat(widthPx) || 0;
        const hp = parseFloat(heightPx) || 0;
        const diag = parseFloat(diagonal) || 0;
        const diagFactor = unit === "cm" ? 2.54 : 1;
        const diagInch = diag / diagFactor;
        if (wp <= 0 || hp <= 0 || diagInch <= 0) return { results: [], steps: [] };
        const diagPx = Math.sqrt(wp * wp + hp * hp);
        const ppi = diagPx / diagInch;
        const dotPitch = 25.4 / ppi;
        const quality =
          ppi >= 500 ? "Retina+ (Exceptional)" :
          ppi >= 400 ? "Retina (Excellent)" :
          ppi >= 300 ? "HD (Very Good)" :
          ppi >= 200 ? "Standard (Good)" : "Low (Average)";
        return {
          results: [
            { label: "Pixel Density (PPI)", value: `${fmt(ppi, 0)} PPI` },
            { label: "DPI (same as PPI for screens)", value: `${fmt(ppi, 0)} DPI` },
            { label: "Diagonal Pixels", value: `${fmt(diagPx, 0)} px` },
            { label: "Dot Pitch", value: `${fmt(dotPitch, 4)} mm` },
            { label: "Display Quality", value: quality },
          ],
          steps: [
            `Resolution: ${fmt(wp, 0)} × ${fmt(hp, 0)} px`,
            `Screen size: ${fmt(diag, 1)} ${unit}${unit === "cm" ? ` = ${fmt(diagInch, 2)} inches` : ""}`,
            `Diagonal pixels = √(${fmt(wp, 0)}² + ${fmt(hp, 0)}²)`,
            `= √(${fmt(wp * wp, 0)} + ${fmt(hp * hp, 0)})`,
            `= √${fmt(wp * wp + hp * hp, 0)}`,
            `≈ ${fmt(diagPx, 0)} px`,
            `PPI = ${fmt(diagPx, 0)} ÷ ${fmt(diagInch, 2)} ≈ ${fmt(ppi, 0)}`,
          ],
        };
      }
      case "mobile-size": {
        const wp = parseFloat(widthPx) || 0;
        const hp = parseFloat(heightPx) || 0;
        const ppi = parseFloat(ppiInput) || 0;
        if (wp <= 0 || hp <= 0 || ppi <= 0) return { results: [], steps: [] };
        const diagPx = Math.sqrt(wp * wp + hp * hp);
        const screenSize = diagPx / ppi;
        const physW = wp / ppi;
        const physH = hp / ppi;
        const screenSizeCm = screenSize * 2.54;
        return {
          results: [
            { label: "Screen Size (inches)", value: `${fmt(screenSize, 2)}"` },
            { label: "Screen Size (cm)", value: `${fmt(screenSizeCm, 2)} cm` },
            { label: "Diagonal Pixels", value: `${fmt(diagPx, 0)} px` },
            { label: "Physical Width", value: `${fmt(physW, 2)}" (${fmt(physW * 2.54, 2)} cm)` },
            { label: "Physical Height", value: `${fmt(physH, 2)}" (${fmt(physH * 2.54, 2)} cm)` },
          ],
          steps: [
            `Resolution: ${fmt(wp, 0)} × ${fmt(hp, 0)} px`,
            `Given PPI: ${fmt(ppi, 0)}`,
            `Diagonal pixels = √(${fmt(wp, 0)}² + ${fmt(hp, 0)}²) = ${fmt(diagPx, 0)} px`,
            `Screen size = diagonal px ÷ PPI`,
            `= ${fmt(diagPx, 0)} ÷ ${fmt(ppi, 0)}`,
            `≈ ${fmt(screenSize, 2)} inches`,
          ],
        };
      }
      case "screen": {
        const wp = parseFloat(widthPx) || 0;
        const hp = parseFloat(heightPx) || 0;
        const diag = parseFloat(diagonal) || 0;
        const diagFactor = unit === "cm" ? 2.54 : 1;
        const diagInch = diag / diagFactor;
        if (wp <= 0 || hp <= 0 || diagInch <= 0) return { results: [], steps: [] };
        const diagPx = Math.sqrt(wp * wp + hp * hp);
        const ppi = diagPx / diagInch;
        const dotPitch = 25.4 / ppi;
        const physW = wp / ppi;
        const physH = hp / ppi;
        return {
          results: [
            { label: "PPI (Pixels Per Inch)", value: fmt(ppi, 1) },
            { label: "Dot Pitch", value: `${fmt(dotPitch, 4)} mm` },
            { label: "Diagonal (px)", value: fmt(diagPx, 0) },
            { label: "Physical Size", value: `${fmt(physW, 1)}" × ${fmt(physH, 1)}"` },
            { label: "Total Pixels", value: `${fmt(wp * hp, 0)}` },
          ],
          steps: [
            `Resolution: ${fmt(wp, 0)} × ${fmt(hp, 0)} px`,
            `Diagonal = ${fmt(diag, 1)} ${unit} = ${fmt(diagInch, 2)} inches`,
            `Diagonal pixels = √(${fmt(wp, 0)}² + ${fmt(hp, 0)}²) = ${fmt(diagPx, 1)} px`,
            `PPI = ${fmt(diagPx, 1)} / ${fmt(diagInch, 2)} = ${fmt(ppi, 1)}`,
            `Dot pitch = 25.4 / ${fmt(ppi, 1)} = ${fmt(dotPitch, 4)} mm`,
          ],
        };
      }
      case "print": {
        const d = parseFloat(dpi) || 0;
        const wi = parseFloat(widthIn) || 0;
        const hi = parseFloat(heightIn) || 0;
        if (d <= 0 || wi <= 0 || hi <= 0) return { results: [], steps: [] };
        const pxW = Math.round(wi * d);
        const pxH = Math.round(hi * d);
        const mp = (pxW * pxH) / 1e6;
        const fileSize300 = (pxW * pxH * 3) / 1e6;
        return {
          results: [
            { label: "Image Size (px)", value: `${fmt(pxW, 0)} × ${fmt(pxH, 0)}` },
            { label: "Megapixels", value: `${fmt(mp, 2)} MP` },
            { label: "Print Size", value: `${fmt(wi, 1)}" × ${fmt(hi, 1)}"` },
            { label: "Est. File Size (RGB)", value: `${fmt(fileSize300, 1)} MB` },
          ],
          steps: [
            `Print size: ${fmt(wi, 1)}" × ${fmt(hi, 1)}" at ${fmt(d, 0)} DPI`,
            `Width in px = ${fmt(wi, 1)} × ${fmt(d, 0)} = ${fmt(pxW, 0)} px`,
            `Height in px = ${fmt(hi, 1)} × ${fmt(d, 0)} = ${fmt(pxH, 0)} px`,
            `Megapixels = ${fmt(pxW, 0)} × ${fmt(pxH, 0)} / 1M = ${fmt(mp, 2)} MP`,
          ],
        };
      }
      case "compare": {
        const devices = [
          { name: "Samsung S24 Ultra", w: 3088, h: 1440, diag: 6.8 },
          { name: "iPhone 15 Pro Max", w: 2796, h: 1290, diag: 6.7 },
          { name: "OnePlus 12", w: 3168, h: 1440, diag: 6.82 },
          { name: "Pixel 8 Pro", w: 2992, h: 1344, diag: 6.7 },
          { name: "iPhone 15", w: 2556, h: 1179, diag: 6.1 },
          { name: "Samsung A55", w: 2340, h: 1080, diag: 6.6 },
          { name: "Redmi Note 13 Pro", w: 2712, h: 1220, diag: 6.67 },
          { name: "iPad Air 11\"", w: 2360, h: 1640, diag: 10.9 },
          { name: "Full HD Monitor 24\"", w: 1920, h: 1080, diag: 24 },
          { name: "4K Monitor 27\"", w: 3840, h: 2160, diag: 27 },
        ];
        return {
          results: devices.map(d => {
            const diagPx = Math.sqrt(d.w * d.w + d.h * d.h);
            const ppi = diagPx / d.diag;
            return { label: d.name, value: `${fmt(ppi, 0)} PPI (${d.w}×${d.h})` };
          }),
          steps: [
            `PPI = √(width² + height²) / diagonal`,
            ...devices.slice(0, 3).map(d => {
              const diagPx = Math.sqrt(d.w * d.w + d.h * d.h);
              return `${d.name}: √(${d.w}²+${d.h}²) / ${d.diag}" = ${fmt(diagPx / d.diag, 0)} PPI`;
            }),
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, widthPx, heightPx, diagonal, unit, dpi, widthIn, heightIn, ppiInput]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Mobile DPI / PPI Calculator" icon={Monitor} iconColor="bg-pink-500">
        <ModeToggle modes={[
          { id: "mobile-ppi", label: "Resolution → PPI" },
          { id: "mobile-size", label: "PPI → Screen Size" },
          { id: "screen", label: "Any Screen" },
          { id: "print", label: "Print DPI" },
          { id: "compare", label: "Compare Phones" },
        ]} mode={mode} setMode={setMode} />

        <div className="space-y-3">
          {(mode === "mobile-ppi" || mode === "screen") && (
            <>
              <SolverInput label="Screen Width (px)" value={widthPx} onChange={setWidthPx} placeholder="1080" suffix="px" />
              <SolverInput label="Screen Height (px)" value={heightPx} onChange={setHeightPx} placeholder="2400" suffix="px" />
              <SolverInput label={`Screen Size (${unit})`} value={diagonal} onChange={setDiagonal} placeholder="6.5" />
              <SolverSelect label="Unit" value={unit} onChange={setUnit} options={[
                { value: "inch", label: "Inches" },
                { value: "cm", label: "Centimeters" },
              ]} />
            </>
          )}
          {mode === "mobile-size" && (
            <>
              <SolverInput label="Screen Width (px)" value={widthPx} onChange={setWidthPx} placeholder="1080" suffix="px" />
              <SolverInput label="Screen Height (px)" value={heightPx} onChange={setHeightPx} placeholder="2400" suffix="px" />
              <SolverInput label="PPI (pixels per inch)" value={ppiInput} onChange={setPpiInput} placeholder="405" suffix="PPI" />
            </>
          )}
          {mode === "print" && (
            <>
              <SolverInput label="DPI (dots per inch)" value={dpi} onChange={setDpi} placeholder="300" />
              <SolverInput label="Print Width (inches)" value={widthIn} onChange={setWidthIn} placeholder="8.5" />
              <SolverInput label="Print Height (inches)" value={heightIn} onChange={setHeightIn} placeholder="11" />
            </>
          )}
        </div>

        {mode === "mobile-ppi" && (
          <div className="mt-3 p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <p className="text-xs font-semibold text-pink-500 mb-1">Formula</p>
            <p className="text-xs text-muted-foreground font-mono">PPI = √(width² + height²) ÷ screen size</p>
          </div>
        )}
        {mode === "mobile-size" && (
          <div className="mt-3 p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <p className="text-xs font-semibold text-pink-500 mb-1">Formula</p>
            <p className="text-xs text-muted-foreground font-mono">Screen size = √(width² + height²) ÷ PPI</p>
          </div>
        )}

        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function ImageResizeCalc() {
  const [mode, setMode] = useState("percentage");
  const [origW, setOrigW] = useState("1920");
  const [origH, setOrigH] = useState("1080");
  const [percent, setPercent] = useState("50");
  const [maxW, setMaxW] = useState("800");
  const [maxH, setMaxH] = useState("600");
  const [targetDpi, setTargetDpi] = useState("300");
  const [printW, setPrintW] = useState("8");
  const [printH, setPrintH] = useState("6");

  const result = useMemo(() => {
    const ow = parseFloat(origW) || 0;
    const oh = parseFloat(origH) || 0;
    if (ow <= 0 || oh <= 0) return { results: [], steps: [] };
    const ratio = ow / oh;
    const origMP = (ow * oh) / 1e6;

    switch (mode) {
      case "percentage": {
        const pct = parseFloat(percent) || 0;
        const nw = Math.round(ow * pct / 100);
        const nh = Math.round(oh * pct / 100);
        const newMP = (nw * nh) / 1e6;
        return {
          results: [
            { label: "New Size", value: `${fmt(nw, 0)} \u00D7 ${fmt(nh, 0)} px` },
            { label: "Original", value: `${fmt(ow, 0)} \u00D7 ${fmt(oh, 0)} px` },
            { label: "Scale", value: `${fmt(pct)}%` },
            { label: "Megapixels", value: `${fmt(origMP, 2)} \u2192 ${fmt(newMP, 2)} MP` },
          ],
          steps: [
            `Original: ${fmt(ow, 0)} \u00D7 ${fmt(oh, 0)}`,
            `Scale factor = ${fmt(pct)}%`,
            `New width = ${fmt(ow, 0)} \u00D7 ${fmt(pct / 100, 2)} = ${fmt(nw, 0)}`,
            `New height = ${fmt(oh, 0)} \u00D7 ${fmt(pct / 100, 2)} = ${fmt(nh, 0)}`,
          ],
        };
      }
      case "fit": {
        const mw = parseFloat(maxW) || 0;
        const mh = parseFloat(maxH) || 0;
        if (mw <= 0 && mh <= 0) return { results: [], steps: [] };
        let nw: number, nh: number;
        if (mw > 0 && mh > 0) {
          const scaleW = mw / ow;
          const scaleH = mh / oh;
          const scale = Math.min(scaleW, scaleH);
          nw = Math.round(ow * scale);
          nh = Math.round(oh * scale);
        } else if (mw > 0) {
          nw = mw;
          nh = Math.round(mw / ratio);
        } else {
          nh = mh;
          nw = Math.round(mh * ratio);
        }
        const scalePct = (nw / ow) * 100;
        return {
          results: [
            { label: "Fitted Size", value: `${fmt(nw, 0)} \u00D7 ${fmt(nh, 0)} px` },
            { label: "Max Bounds", value: `${mw > 0 ? fmt(mw, 0) : "\u2014"} \u00D7 ${mh > 0 ? fmt(mh, 0) : "\u2014"} px` },
            { label: "Scale", value: `${fmt(scalePct)}%` },
            { label: "Aspect Ratio", value: fmt(ratio, 4) },
          ],
          steps: [
            `Original: ${fmt(ow, 0)} \u00D7 ${fmt(oh, 0)} (ratio ${fmt(ratio, 4)})`,
            `Max bounds: ${mw > 0 ? fmt(mw, 0) : "\u221E"} \u00D7 ${mh > 0 ? fmt(mh, 0) : "\u221E"}`,
            `Fitted to: ${fmt(nw, 0)} \u00D7 ${fmt(nh, 0)} (${fmt(scalePct)}%)`,
          ],
        };
      }
      case "print": {
        const dpi = parseFloat(targetDpi) || 0;
        const pw = parseFloat(printW) || 0;
        const ph = parseFloat(printH) || 0;
        if (dpi <= 0) return { results: [], steps: [] };
        const neededW = Math.round(pw * dpi);
        const neededH = Math.round(ph * dpi);
        const maxPrintW = ow / dpi;
        const maxPrintH = oh / dpi;
        const canPrint = ow >= neededW && oh >= neededH;
        return {
          results: [
            { label: "Pixels Needed", value: `${fmt(neededW, 0)} \u00D7 ${fmt(neededH, 0)} px` },
            { label: "You Have", value: `${fmt(ow, 0)} \u00D7 ${fmt(oh, 0)} px` },
            { label: "Can Print?", value: canPrint ? "Yes" : "No (need more pixels)" },
            { label: `Max Print at ${fmt(dpi, 0)} DPI`, value: `${fmt(maxPrintW, 1)}" \u00D7 ${fmt(maxPrintH, 1)}"` },
          ],
          steps: [
            `Target: ${fmt(pw, 1)}" \u00D7 ${fmt(ph, 1)}" at ${fmt(dpi, 0)} DPI`,
            `Pixels needed: ${fmt(pw, 1)} \u00D7 ${fmt(dpi, 0)} = ${fmt(neededW, 0)}, ${fmt(ph, 1)} \u00D7 ${fmt(dpi, 0)} = ${fmt(neededH, 0)}`,
            `Your image: ${fmt(ow, 0)} \u00D7 ${fmt(oh, 0)}`,
            canPrint ? `Sufficient resolution for this print` : `Need at least ${fmt(neededW, 0)} \u00D7 ${fmt(neededH, 0)} px`,
            `Max print size = ${fmt(ow, 0)}/${fmt(dpi, 0)} \u00D7 ${fmt(oh, 0)}/${fmt(dpi, 0)} = ${fmt(maxPrintW, 1)}" \u00D7 ${fmt(maxPrintH, 1)}"`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, origW, origH, percent, maxW, maxH, targetDpi, printW, printH]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Image Resize Calculator" icon={ImageIcon} iconColor="bg-pink-500">
        <ModeToggle modes={[
          { id: "percentage", label: "By %" },
          { id: "fit", label: "Fit to Box" },
          { id: "print", label: "Print Check" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverInput label="Original Width (px)" value={origW} onChange={setOrigW} placeholder="1920" />
          <SolverInput label="Original Height (px)" value={origH} onChange={setOrigH} placeholder="1080" />
          {mode === "percentage" && (
            <SolverInput label="Scale Percentage (%)" value={percent} onChange={setPercent} placeholder="50" suffix="%" />
          )}
          {mode === "fit" && (
            <>
              <SolverInput label="Max Width (px)" value={maxW} onChange={setMaxW} placeholder="800" />
              <SolverInput label="Max Height (px)" value={maxH} onChange={setMaxH} placeholder="600" />
            </>
          )}
          {mode === "print" && (
            <>
              <SolverInput label="Target DPI" value={targetDpi} onChange={setTargetDpi} placeholder="300" />
              <SolverInput label="Print Width (inches)" value={printW} onChange={setPrintW} placeholder="8" />
              <SolverInput label="Print Height (inches)" value={printH} onChange={setPrintH} placeholder="6" />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function CmPxInchConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("cm");
  const [dpi, setDpi] = useState("96");

  const units = [
    { value: "cm", label: "Centimeters (cm)" },
    { value: "px", label: "Pixels (px)" },
    { value: "inch", label: "Inches (in)" },
    { value: "mm", label: "Millimeters (mm)" },
    { value: "pt", label: "Points (pt)" },
    { value: "em", label: "Em (16px base)" },
  ];

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const d = parseFloat(dpi) || 96;
    if (v === 0) return { results: [], steps: [] };

    let inches = 0;
    switch (fromUnit) {
      case "cm": inches = v / 2.54; break;
      case "px": inches = v / d; break;
      case "inch": inches = v; break;
      case "mm": inches = v / 25.4; break;
      case "pt": inches = v / 72; break;
      case "em": inches = (v * 16) / d; break;
    }

    const cm = inches * 2.54;
    const px = inches * d;
    const mm = inches * 25.4;
    const pt = inches * 72;
    const em = px / 16;

    return {
      results: [
        { label: "Centimeters", value: `${fmt(cm, 4)} cm` },
        { label: "Pixels", value: `${fmt(px, 2)} px` },
        { label: "Inches", value: `${fmt(inches, 4)} in` },
        { label: "Millimeters", value: `${fmt(mm, 4)} mm` },
        { label: "Points", value: `${fmt(pt, 2)} pt` },
        { label: "Em (16px base)", value: `${fmt(em, 4)} em` },
      ],
      steps: [
        `Input: ${v} ${fromUnit} at ${fmt(d, 0)} DPI`,
        `Convert to inches first: ${v} ${fromUnit} = ${fmt(inches, 6)} inches`,
        `1 inch = 2.54 cm = ${fmt(d, 0)} px = 25.4 mm = 72 pt`,
        `cm = ${fmt(inches, 6)} \u00D7 2.54 = ${fmt(cm, 4)}`,
        `px = ${fmt(inches, 6)} \u00D7 ${fmt(d, 0)} = ${fmt(px, 2)}`,
        `pt = ${fmt(inches, 6)} \u00D7 72 = ${fmt(pt, 2)}`,
      ],
    };
  }, [value, fromUnit, dpi]);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="CM / Pixel / Inch Converter" icon={RulerIcon} iconColor="bg-pink-500">
        <div className="space-y-3">
          <SolverInput label="Value" value={value} onChange={setValue} placeholder="1" />
          <SolverSelect label="From Unit" value={fromUnit} onChange={setFromUnit} options={units} />
          <SolverInput label="DPI / PPI (for pixel calculations)" value={dpi} onChange={setDpi} placeholder="96" />
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}

function PaperSizeCalc() {
  const [mode, setMode] = useState("lookup");
  const [series, setSeries] = useState("A");
  const [selectedSize, setSelectedSize] = useState("A4");
  const [unit, setUnit] = useState("mm");
  const [dpi, setDpi] = useState("300");

  const paperSizes: Record<string, { w: number; h: number; label: string }[]> = {
    A: [
      { w: 841, h: 1189, label: "A0" }, { w: 594, h: 841, label: "A1" },
      { w: 420, h: 594, label: "A2" }, { w: 297, h: 420, label: "A3" },
      { w: 210, h: 297, label: "A4" }, { w: 148, h: 210, label: "A5" },
      { w: 105, h: 148, label: "A6" }, { w: 74, h: 105, label: "A7" },
      { w: 52, h: 74, label: "A8" },
    ],
    B: [
      { w: 1000, h: 1414, label: "B0" }, { w: 707, h: 1000, label: "B1" },
      { w: 500, h: 707, label: "B2" }, { w: 353, h: 500, label: "B3" },
      { w: 250, h: 353, label: "B4" }, { w: 176, h: 250, label: "B5" },
      { w: 125, h: 176, label: "B6" },
    ],
    C: [
      { w: 917, h: 1297, label: "C0" }, { w: 648, h: 917, label: "C1" },
      { w: 458, h: 648, label: "C2" }, { w: 324, h: 458, label: "C3" },
      { w: 229, h: 324, label: "C4" }, { w: 162, h: 229, label: "C5" },
      { w: 114, h: 162, label: "C6" },
    ],
    US: [
      { w: 216, h: 279, label: "Letter" }, { w: 216, h: 356, label: "Legal" },
      { w: 279, h: 432, label: "Tabloid" }, { w: 184, h: 267, label: "Executive" },
      { w: 105, h: 241, label: "#10 Envelope" },
    ],
    Indian: [
      { w: 210, h: 330, label: "Legal (India)" }, { w: 215, h: 330, label: "Foolscap" },
      { w: 210, h: 297, label: "A4 (Standard)" }, { w: 203, h: 254, label: "Govt. Letter" },
    ],
  };

  const convert = (mm: number): { val: number; suffix: string } => {
    switch (unit) {
      case "cm": return { val: mm / 10, suffix: "cm" };
      case "inch": return { val: mm / 25.4, suffix: "in" };
      default: return { val: mm, suffix: "mm" };
    }
  };

  const result = useMemo(() => {
    const d = parseFloat(dpi) || 300;

    switch (mode) {
      case "lookup": {
        const sizes = paperSizes[series] || [];
        return {
          results: sizes.map(s => {
            const w = convert(s.w);
            const h = convert(s.h);
            return {
              label: s.label,
              value: `${fmt(w.val, 1)} \u00D7 ${fmt(h.val, 1)} ${w.suffix}`,
            };
          }),
          steps: [
            `${series}-series paper sizes (ISO 216${series === "US" ? " / ANSI" : series === "Indian" ? " / Indian Std" : ""})`,
            `Displaying in ${unit === "mm" ? "millimeters" : unit === "cm" ? "centimeters" : "inches"}`,
            series === "A" ? `A-series: A0 = 1m\u00B2, each size is half the previous` : "",
          ].filter(Boolean),
        };
      }
      case "detail": {
        const allSizes = Object.values(paperSizes).flat();
        const paper = allSizes.find(s => s.label === selectedSize);
        if (!paper) return { results: [], steps: [] };
        const w = convert(paper.w);
        const h = convert(paper.h);
        const wPx = Math.round(paper.w / 25.4 * d);
        const hPx = Math.round(paper.h / 25.4 * d);
        const areaMM2 = paper.w * paper.h;
        const areaCM2 = areaMM2 / 100;
        const areaIn2 = (paper.w / 25.4) * (paper.h / 25.4);
        const mp = (wPx * hPx) / 1e6;
        const g = gcd(paper.w, paper.h);
        return {
          results: [
            { label: "Size", value: `${fmt(w.val, 1)} \u00D7 ${fmt(h.val, 1)} ${w.suffix}` },
            { label: "Pixels at DPI", value: `${fmt(wPx, 0)} \u00D7 ${fmt(hPx, 0)} px (${fmt(d, 0)} DPI)` },
            { label: "Megapixels", value: `${fmt(mp, 2)} MP` },
            { label: "Area", value: `${fmt(areaCM2, 1)} cm\u00B2 / ${fmt(areaIn2, 2)} in\u00B2` },
            { label: "Aspect Ratio", value: `${paper.w / g}:${paper.h / g}` },
          ],
          steps: [
            `${selectedSize} = ${paper.w} \u00D7 ${paper.h} mm`,
            `Width px = ${paper.w} / 25.4 \u00D7 ${fmt(d, 0)} = ${fmt(wPx, 0)}`,
            `Height px = ${paper.h} / 25.4 \u00D7 ${fmt(d, 0)} = ${fmt(hPx, 0)}`,
            `Area = ${paper.w} \u00D7 ${paper.h} = ${fmt(areaMM2, 0)} mm\u00B2 = ${fmt(areaCM2, 1)} cm\u00B2`,
          ],
        };
      }
      default: return { results: [], steps: [] };
    }
  }, [mode, series, selectedSize, unit, dpi]);

  const allSizeOptions = Object.values(paperSizes).flat().map(s => ({ value: s.label, label: s.label }));

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Paper Size Calculator" icon={FileText} iconColor="bg-pink-500">
        <ModeToggle modes={[
          { id: "lookup", label: "All Sizes" },
          { id: "detail", label: "Detail / Pixels" },
        ]} mode={mode} setMode={setMode} />
        <div className="space-y-3">
          <SolverSelect label="Display Unit" value={unit} onChange={setUnit} options={[
            { value: "mm", label: "Millimeters" }, { value: "cm", label: "Centimeters" }, { value: "inch", label: "Inches" },
          ]} />
          {mode === "lookup" && (
            <SolverSelect label="Paper Series" value={series} onChange={setSeries} options={[
              { value: "A", label: "A-Series (A0\u2013A8)" },
              { value: "B", label: "B-Series (B0\u2013B6)" },
              { value: "C", label: "C-Series / Envelopes" },
              { value: "US", label: "US / ANSI" },
              { value: "Indian", label: "Indian Standard" },
            ]} />
          )}
          {mode === "detail" && (
            <>
              <SolverSelect label="Paper Size" value={selectedSize} onChange={setSelectedSize} options={allSizeOptions} />
              <SolverInput label="DPI for Pixel Calculation" value={dpi} onChange={setDpi} placeholder="300" />
            </>
          )}
        </div>
        </InputPanel>
      }
      results={
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
          <StepsDisplay steps={result.steps} />
          <MultiResult results={result.results} />
        </div>
      }
    />
  );
}
