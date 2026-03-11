import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Code, Binary, Hash, Lock, FileText, Server, DollarSign, Youtube, Search, Globe, Wifi } from "lucide-react";
import { ToolCard, InputField } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "binary" | "ascii" | "base64" | "hash" | "filesize" | "api" | "appcpm" | "youtube" | "seo";

const CURRENCIES = [
  { code: "INR", symbol: "₹" }, { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
];
function cs(code: string) { return CURRENCIES.find(c => c.code === code)?.symbol || "$"; }
function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-sm text-foreground focus:outline-none" data-testid="select-currency">
      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
    </select>
  );
}
function ModeBar({ modes, active, onChange, color = "bg-gray-600" }: { modes: { id: string; label: string }[]; active: string; onChange: (id: string) => void; color?: string }) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4 flex-wrap">
      {modes.map(m => (
        <button key={m.id} onClick={() => onChange(m.id)} data-testid={`mode-${m.id}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex-1 ${active === m.id ? `${color} text-white shadow-sm` : "text-muted-foreground hover:text-foreground"}`}>
          {m.label}
        </button>
      ))}
    </div>
  );
}
function Row({ label, value, hi, accent }: { label: string; value: string; hi?: boolean; accent?: string }) {
  return (
    <div className={`flex justify-between items-center p-2.5 rounded-xl ${hi ? "bg-gray-500/15 border border-gray-500/20" : "bg-muted/30"}`}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold font-mono ${hi ? (accent || "text-gray-300") : "text-foreground"}`}>{value}</span>
    </div>
  );
}
function fmt(n: number, d = 2) { if (!isFinite(n) || isNaN(n)) return "—"; return parseFloat(n.toFixed(d)).toLocaleString(); }

export default function DeveloperTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("binary");
  const tools = [
    { id: "binary", label: "Binary/Hex", icon: Binary },
    { id: "ascii", label: "ASCII/URL", icon: Code },
    { id: "base64", label: "Base64", icon: Lock },
    { id: "hash", label: "Hash", icon: Hash },
    { id: "filesize", label: "File Size", icon: FileText },
    { id: "api", label: "API Cost", icon: Server },
    { id: "appcpm", label: "CPM/RPM", icon: DollarSign },
    { id: "youtube", label: "YouTube", icon: Youtube },
    { id: "seo", label: "SEO", icon: Search },
  ];
  return (
    <PageWrapper title="Developer Tools" subtitle="IT and creator calculators" accentColor="bg-gray-600" tools={tools} activeTool={activeTool} onToolChange={(id) => setActiveTool(id as ToolType)}>
      {activeTool === "binary" && <BinaryConverter />}
      {activeTool === "ascii" && <ASCIIConverter />}
      {activeTool === "base64" && <Base64Tool />}
      {activeTool === "hash" && <HashGenerator />}
      {activeTool === "filesize" && <FileSizeEstimator />}
      {activeTool === "api" && <APIRateCost />}
      {activeTool === "appcpm" && <CPMCalculator />}
      {activeTool === "youtube" && <YouTubeEarnings />}
      {activeTool === "seo" && <SEOChecker />}
    </PageWrapper>
  );
}

function BinaryConverter() {
  const [mode, setMode] = useState("number");
  const [input, setInput] = useState("255");
  const [inputType, setInputType] = useState<"decimal" | "binary" | "hex" | "octal">("decimal");
  const [ipInput, setIpInput] = useState("192.168.1.1");
  const [colorHex, setColorHex] = useState("#1a2b3c");

  const convert = () => {
    try {
      let decimal: number;
      if (inputType === "decimal") decimal = parseInt(input, 10);
      else if (inputType === "binary") decimal = parseInt(input, 2);
      else if (inputType === "octal") decimal = parseInt(input, 8);
      else decimal = parseInt(input, 16);
      if (isNaN(decimal)) return { decimal: "Invalid", binary: "Invalid", hex: "Invalid", octal: "Invalid", signed8: "Invalid" };
      return {
        decimal: decimal.toString(), binary: decimal.toString(2),
        hex: "0x" + decimal.toString(16).toUpperCase(),
        octal: "0o" + decimal.toString(8),
        signed8: decimal > 127 ? String(decimal - 256) : decimal.toString(),
      };
    } catch { return { decimal: "Error", binary: "Error", hex: "Error", octal: "Error", signed8: "Error" }; }
  };

  const convertIP = () => {
    try {
      const parts = ipInput.split(".").map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return { binary: "Invalid IP", decimal: "", hex: "" };
      const binary = parts.map(p => p.toString(2).padStart(8, "0")).join(".");
      const decimal = (parts[0] << 24 >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
      const hex = parts.map(p => p.toString(16).padStart(2, "0").toUpperCase()).join(":");
      return { binary, decimal: decimal.toString(), hex };
    } catch { return { binary: "Error", decimal: "", hex: "" }; }
  };

  const convertColor = () => {
    try {
      const hex = colorHex.replace("#", "");
      if (hex.length !== 6) return null;
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const max = Math.max(r, g, b) / 255; const min = Math.min(r, g, b) / 255;
      const l = (max + min) / 2;
      const s = max === min ? 0 : l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
      const h = max === min ? 0 : max === r / 255 ? ((g - b) / 255 / (max - min)) % 6 * 60 : max === g / 255 ? ((b - r) / 255 / (max - min) + 2) * 60 : ((r - g) / 255 / (max - min) + 4) * 60;
      return { r, g, b, hex: hex.toUpperCase(), hsl: `hsl(${Math.round(h < 0 ? h + 360 : h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`, rgb: `rgb(${r}, ${g}, ${b})` };
    } catch { return null; }
  };

  const result = convert();
  const ipResult = convertIP();
  const colorResult = convertColor();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Number Base & IP Converter" icon={Binary} iconColor="bg-blue-500">
        <ModeBar modes={[{ id: "number", label: "Number Base" }, { id: "ip", label: "IP Address" }, { id: "color", label: "Color Hex" }]} active={mode} onChange={setMode} color="bg-blue-600" />
        {mode === "number" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Input Format</label>
              <div className="flex gap-1.5">
                {(["decimal", "binary", "hex", "octal"] as const).map(t => (
                  <button key={t} onClick={() => setInputType(t)} className={`flex-1 py-2 rounded-lg text-xs capitalize font-bold ${inputType === t ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`} data-testid={`type-${t}`}>{t}</button>
                ))}
              </div>
            </div>
            <InputField label={`Input (${inputType})`} value={input} onChange={setInput} />
            <div className="space-y-2">
              <Row label="Decimal" value={result.decimal} hi />
              <Row label="Binary" value={result.binary} />
              <Row label="Hexadecimal" value={result.hex} />
              <Row label="Octal" value={result.octal} />
              <Row label="Signed 8-bit" value={result.signed8} />
            </div>
          </div>
        )}
        {mode === "ip" && (
          <div className="space-y-3">
            <InputField label="IPv4 Address" value={ipInput} onChange={setIpInput} placeholder="192.168.1.1" />
            <div className="space-y-2">
              <Row label="Binary (dotted)" value={ipResult.binary} hi />
              <Row label="32-bit Decimal" value={ipResult.decimal} />
              <Row label="Hex (colon)" value={ipResult.hex} />
            </div>
            <div className="p-2.5 bg-muted/20 rounded-xl text-xs text-muted-foreground">
              <p className="font-bold mb-1">IP Classes:</p>
              <p>• Class A: 1.0.0.0 – 126.255.255.255</p>
              <p>• Class B: 128.0.0.0 – 191.255.255.255</p>
              <p>• Class C: 192.0.0.0 – 223.255.255.255</p>
              <p>• Private: 10.x.x.x | 172.16-31.x.x | 192.168.x.x</p>
            </div>
          </div>
        )}
        {mode === "color" && (
          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} className="w-16 h-12 rounded-xl border-0 cursor-pointer bg-transparent" data-testid="input-color" />
              <InputField label="Hex Color" value={colorHex} onChange={setColorHex} placeholder="#1a2b3c" />
            </div>
            {colorResult && (
              <div className="space-y-2">
                <div className="w-full h-12 rounded-xl border border-border" style={{ backgroundColor: colorHex }} />
                <Row label="HEX" value={`#${colorResult.hex}`} hi />
                <Row label="RGB" value={colorResult.rgb} />
                <Row label="HSL" value={colorResult.hsl} />
                <Row label="R G B values" value={`${colorResult.r} / ${colorResult.g} / ${colorResult.b}`} />
              </div>
            )}
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function ASCIIConverter() {
  const [mode, setMode] = useState("ascii");
  const [text, setText] = useState("Hello, World!");

  const toAscii = () => text.split("").map(c => c.charCodeAt(0)).join(" ");
  const fromAscii = () => { try { return text.split(/\s+/).map(n => String.fromCharCode(parseInt(n))).join(""); } catch { return "Invalid"; } }
  const toURL = () => encodeURIComponent(text);
  const fromURL = () => { try { return decodeURIComponent(text); } catch { return "Invalid URL encoding"; } }
  const toHTMLEntity = () => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const fromHTMLEntity = () => text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  const toUnicode = () => text.split("").map(c => "U+" + c.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")).join(" ");

  const results: Record<string, () => string> = { ascii: toAscii, "from_ascii": fromAscii, "url_encode": toURL, "url_decode": fromURL, "html_encode": toHTMLEntity, "html_decode": fromHTMLEntity, "unicode": toUnicode };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="ASCII / URL / Unicode Converter" icon={Code} iconColor="bg-purple-500">
        <ModeBar modes={[{ id: "ascii", label: "→ ASCII" }, { id: "from_ascii", label: "ASCII →" }, { id: "url_encode", label: "URL Encode" }, { id: "url_decode", label: "URL Decode" }, { id: "html_encode", label: "HTML Enc" }, { id: "unicode", label: "Unicode" }]} active={mode} onChange={setMode} color="bg-purple-600" />
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Input</label>
          <textarea value={text} onChange={e => setText(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 min-h-[80px] text-sm resize-none focus:outline-none" data-testid="textarea-input" />
        </div>
        <div className="mt-3 p-4 bg-muted/30 rounded-xl">
          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Result</div>
          <div className="break-all font-mono text-xs text-purple-400 max-h-32 overflow-y-auto">{(results[mode] || toAscii)()}</div>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => { navigator.clipboard.writeText((results[mode] || toAscii)()); }} className="flex-1 py-2 bg-muted rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-all">Copy Result</button>
          <button onClick={() => setText((results[mode] || toAscii)())} className="flex-1 py-2 bg-muted rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-all">Use as Input</button>
        </div>
      </ToolCard>
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("Hello World");
  const [mode, setMode] = useState<"encode" | "decode" | "url">("encode");
  const convert = () => {
    try {
      if (mode === "encode") return btoa(unescape(encodeURIComponent(input)));
      if (mode === "decode") return decodeURIComponent(escape(atob(input)));
      return btoa(unescape(encodeURIComponent(input))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } catch { return "Invalid input"; }
  };
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Base64 Encoder/Decoder" icon={Lock} iconColor="bg-indigo-500">
        <ModeBar modes={[{ id: "encode", label: "Encode" }, { id: "decode", label: "Decode" }, { id: "url", label: "URL-Safe Base64" }]} active={mode} onChange={(m) => setMode(m as any)} color="bg-indigo-600" />
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 min-h-[80px] text-sm resize-none focus:outline-none" data-testid="textarea-input" />
        </div>
        <div className="mt-3 p-4 bg-muted/30 rounded-xl">
          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Result</div>
          <div className="break-all font-mono text-xs text-indigo-400">{convert()}</div>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => navigator.clipboard.writeText(convert())} className="flex-1 py-2 bg-muted rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">Copy</button>
          <button onClick={() => setInput(convert())} className="flex-1 py-2 bg-muted rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">Use as Input</button>
        </div>
        <div className="p-2 bg-muted/20 rounded-xl text-xs text-muted-foreground mt-2">
          {mode === "encode" ? "Converts text to Base64 (padded)" : mode === "decode" ? "Decodes Base64 back to text" : "URL-safe variant — replaces + with - and / with _"}
        </div>
      </ToolCard>
    </div>
  );
}

function HashGenerator() {
  const [input, setInput] = useState("Hello World");
  const [mode, setMode] = useState("hash");
  const [password, setPassword] = useState("");

  const simpleHash = (str: string, algorithm: string) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) + hash) + str.charCodeAt(i); hash = hash & hash; }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    if (algorithm === "md5") return hex.repeat(4);
    if (algorithm === "sha1") return (hex + hex.split("").reverse().join("")).repeat(2).slice(0, 40);
    if (algorithm === "sha256") return (hex.repeat(8)).slice(0, 64);
    return hex.repeat(16).slice(0, 128);
  };

  const checkPassword = (pwd: string) => {
    const hasUpper = /[A-Z]/.test(pwd); const hasLower = /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd); const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const len = pwd.length;
    const score = [len >= 8, len >= 12, hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;
    const level = score <= 2 ? { label: "Weak", color: "text-red-400" } : score <= 4 ? { label: "Medium", color: "text-yellow-400" } : { label: "Strong", color: "text-emerald-400" };
    const entropy = len > 0 ? len * Math.log2((hasUpper ? 26 : 0) + (hasLower ? 26 : 0) + (hasNum ? 10 : 0) + (hasSpecial ? 32 : 0) || 26) : 0;
    return { level, score, hasUpper, hasLower, hasNum, hasSpecial, entropy, len };
  };

  const pwdResult = checkPassword(password);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Hash & Password Tool" icon={Hash} iconColor="bg-rose-500">
        <ModeBar modes={[{ id: "hash", label: "Hash Generator" }, { id: "password", label: "Password Strength" }]} active={mode} onChange={setMode} color="bg-rose-600" />
        {mode === "hash" ? (
          <>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Input Text</label>
              <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 min-h-[80px] text-sm resize-none focus:outline-none" data-testid="textarea-hash-input" />
            </div>
            <div className="space-y-2 mt-2">
              {[{ algo: "md5", label: "MD5 (32 hex)", color: "text-rose-400" }, { algo: "sha1", label: "SHA1 (40 hex)", color: "text-blue-400" }, { algo: "sha256", label: "SHA256 (64 hex)", color: "text-purple-400" }, { algo: "sha512", label: "SHA512 (128 hex)", color: "text-emerald-400" }].map(h => (
                <div key={h.algo} className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-[10px] text-muted-foreground mb-1">{h.label}</p>
                  <p className={`font-mono text-[10px] break-all ${h.color}`}>{simpleHash(input, h.algo)}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">⚠️ Simulated hashes for demo — use crypto libraries for real hashing.</p>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Enter Password to Check</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="Type your password..." data-testid="input-password" />
            </div>
            <div className="p-4 text-center rounded-2xl" style={{ background: `rgba(0,0,0,0.1)` }}>
              <div className={`text-2xl font-black mb-1 ${pwdResult.level.color}`}>{pwdResult.len > 0 ? pwdResult.level.label : "—"}</div>
              <div className="text-xs text-muted-foreground">Score: {pwdResult.score}/6 | Entropy: {fmt(pwdResult.entropy, 0)} bits</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{ l: "Uppercase (A-Z)", v: pwdResult.hasUpper }, { l: "Lowercase (a-z)", v: pwdResult.hasLower }, { l: "Numbers (0-9)", v: pwdResult.hasNum }, { l: "Symbols (!@#)", v: pwdResult.hasSpecial }, { l: "≥ 8 characters", v: pwdResult.len >= 8 }, { l: "≥ 12 characters", v: pwdResult.len >= 12 }].map((r, i) => (
                <div key={i} className={`p-2 rounded-xl text-xs font-semibold ${r.v ? "bg-emerald-500/15 text-emerald-400" : "bg-muted/30 text-muted-foreground"}`}>{r.v ? "✅" : "❌"} {r.l}</div>
              ))}
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function FileSizeEstimator() {
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState("storage");
  const [files, setFiles] = useState("100");
  const [avgSize, setAvgSize] = useState("5");
  const [sizeUnit, setSizeUnit] = useState("MB");
  const [bandwidth, setBandwidth] = useState("100");
  const [bwUnit, setBwUnit] = useState("Mbps");
  const [fileTransfer, setFileTransfer] = useState("1");
  const [ftUnit, setFtUnit] = useState("GB");
  const [storageCostPerGB, setStorageCostPerGB] = useState("0.023");

  const units: Record<string, number> = { B: 1 / (1024 * 1024), KB: 1 / 1024, MB: 1, GB: 1024, TB: 1024 * 1024 };
  const bwUnits: Record<string, number> = { Kbps: 0.001, Mbps: 1, Gbps: 1000 };

  const f = parseInt(files)||0; const s = parseFloat(avgSize)||0;
  const totalMB = f * s * (units[sizeUnit]||1);
  const bwMbps = (parseFloat(bandwidth)||0) * (bwUnits[bwUnit]||1);
  const fileSizeMB = (parseFloat(fileTransfer)||0) * (units[ftUnit]||1024);
  const transferSeconds = bwMbps > 0 ? (fileSizeMB * 8) / bwMbps : 0;
  const storageGB = totalMB / 1024;
  const monthlyCost = storageGB * (parseFloat(storageCostPerGB)||0.023) * 30;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="File Size & Bandwidth" icon={FileText} iconColor="bg-cyan-500">
        <ModeBar modes={[{ id: "storage", label: "Storage Size" }, { id: "transfer", label: "Transfer Time" }, { id: "cost", label: "Cloud Cost" }]} active={mode} onChange={setMode} color="bg-cyan-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        {(mode === "storage" || mode === "cost") && (
          <>
            <InputField label="Number of Files" value={files} onChange={setFiles} type="number" />
            <div className="flex gap-2">
              <div className="flex-1"><InputField label="Avg File Size" value={avgSize} onChange={setAvgSize} type="number" /></div>
              <div className="mt-6">
                <select value={sizeUnit} onChange={e => setSizeUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {["B","KB","MB","GB","TB"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
        {mode === "transfer" && (
          <>
            <div className="flex gap-2">
              <div className="flex-1"><InputField label="File to Transfer" value={fileTransfer} onChange={setFileTransfer} type="number" /></div>
              <div className="mt-6">
                <select value={ftUnit} onChange={e => setFtUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {["B","KB","MB","GB","TB"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><InputField label="Connection Speed" value={bandwidth} onChange={setBandwidth} type="number" /></div>
              <div className="mt-6">
                <select value={bwUnit} onChange={e => setBwUnit(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-2.5 text-sm text-foreground focus:outline-none">
                  {["Kbps","Mbps","Gbps"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
        {mode === "cost" && <InputField label={`Cloud Storage Cost (${cs(currency)}/GB/month)`} value={storageCostPerGB} onChange={setStorageCostPerGB} type="number" step={0.001} />}
        <div className="space-y-2 mt-3">
          {mode === "storage" && (
            <>
              <Row label="Total in MB" value={`${fmt(totalMB, 2)} MB`} hi />
              <Row label="Total in GB" value={`${fmt(totalMB / 1024, 3)} GB`} />
              <Row label="Total in TB" value={`${fmt(totalMB / 1024 / 1024, 6)} TB`} />
            </>
          )}
          {mode === "transfer" && (
            <>
              <Row label="File Size (MB)" value={`${fmt(fileSizeMB, 2)} MB`} />
              <Row label="Transfer Time" value={transferSeconds < 60 ? `${fmt(transferSeconds, 1)} sec` : transferSeconds < 3600 ? `${fmt(transferSeconds / 60, 1)} min` : `${fmt(transferSeconds / 3600, 2)} hrs`} hi accent="text-cyan-400" />
              <Row label="Speed" value={`${fmt(bwMbps, 1)} Mbps (${fmt(bwMbps / 8, 1)} MB/s)`} />
            </>
          )}
          {mode === "cost" && (
            <>
              <Row label="Storage Volume" value={`${fmt(storageGB, 3)} GB`} hi />
              <Row label="Monthly Cost" value={`${cs(currency)}${fmt(monthlyCost, 4)}`} hi accent="text-cyan-400" />
              <Row label="Annual Cost" value={`${cs(currency)}${fmt(monthlyCost * 12, 2)}`} />
              <div className="p-2 bg-muted/20 rounded-xl text-xs text-muted-foreground">AWS S3 ≈ $0.023/GB | GCP ≈ $0.020/GB | Azure ≈ $0.018/GB</div>
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function APIRateCost() {
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState("simple");
  const [requests, setRequests] = useState("100000");
  const [costPer1k, setCostPer1k] = useState("0.002");
  const [provider, setProvider] = useState("custom");
  const [inputTokens, setInputTokens] = useState("1000");
  const [outputTokens, setOutputTokens] = useState("500");
  const [monthlyBudget, setMonthlyBudget] = useState("10");

  const apiProviders: Record<string, { input: number; output: number; label: string; unit: string }> = {
    "gpt4o": { input: 0.005, output: 0.015, label: "GPT-4o", unit: "per 1K tokens" },
    "gpt4o-mini": { input: 0.00015, output: 0.0006, label: "GPT-4o Mini", unit: "per 1K tokens" },
    "claude-haiku": { input: 0.00025, output: 0.00125, label: "Claude Haiku", unit: "per 1K tokens" },
    "claude-sonnet": { input: 0.003, output: 0.015, label: "Claude Sonnet", unit: "per 1K tokens" },
    "gemini-flash": { input: 0.000075, output: 0.0003, label: "Gemini 1.5 Flash", unit: "per 1K tokens" },
    custom: { input: parseFloat(costPer1k)||0, output: 0, label: "Custom", unit: "per 1K req" },
  };

  const prov = apiProviders[provider];
  const r = parseInt(requests)||0;
  const inTok = parseInt(inputTokens)||0;
  const outTok = parseInt(outputTokens)||0;
  const budget = parseFloat(monthlyBudget)||10;

  const perReqCost = provider === "custom" ? parseFloat(costPer1k)||0 / 1000 : (prov.input * inTok / 1000 + prov.output * outTok / 1000);
  const dailyCost = (r / 1000) * (parseFloat(costPer1k)||0);
  const aiDailyCost = r * (prov.input * inTok / 1000 + prov.output * outTok / 1000);
  const maxRequests = aiDailyCost > 0 ? Math.floor(budget / (aiDailyCost / r)) : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="API Cost Calculator" icon={Server} iconColor="bg-orange-500">
        <ModeBar modes={[{ id: "simple", label: "Per Request" }, { id: "llm", label: "LLM Tokens" }, { id: "budget", label: "Budget Planner" }]} active={mode} onChange={setMode} color="bg-orange-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        {(mode === "llm" || mode === "budget") && (
          <div className="mb-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">AI Model</label>
            <select value={provider} onChange={e => setProvider(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none">
              {Object.entries(apiProviders).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        )}
        <InputField label="Daily API Requests" value={requests} onChange={setRequests} type="number" />
        {mode === "simple" && <InputField label={`Cost per 1K Requests (${cs(currency)})`} value={costPer1k} onChange={setCostPer1k} type="number" step={0.0001} />}
        {(mode === "llm" || mode === "budget") && (
          <div className="grid grid-cols-2 gap-2">
            <InputField label="Input Tokens/req" value={inputTokens} onChange={setInputTokens} type="number" />
            <InputField label="Output Tokens/req" value={outputTokens} onChange={setOutputTokens} type="number" />
          </div>
        )}
        {mode === "budget" && <InputField label={`Monthly Budget (${cs(currency)})`} value={monthlyBudget} onChange={setMonthlyBudget} type="number" />}
        <div className="space-y-2 mt-3">
          {mode === "simple" ? (
            <>
              <Row label="Daily Cost" value={`${cs(currency)}${fmt(dailyCost, 4)}`} hi />
              <Row label="Monthly Cost" value={`${cs(currency)}${fmt(dailyCost * 30, 2)}`} />
              <Row label="Annual Cost" value={`${cs(currency)}${fmt(dailyCost * 365, 2)}`} />
            </>
          ) : mode === "llm" ? (
            <>
              <Row label={`Input cost (${prov.input} per 1K)`} value={`${cs(currency)}${(prov.input * inTok / 1000).toFixed(6)}/req`} />
              <Row label={`Output cost (${prov.output} per 1K)`} value={`${cs(currency)}${(prov.output * outTok / 1000).toFixed(6)}/req`} />
              <Row label="Cost per Request" value={`${cs(currency)}${(prov.input * inTok / 1000 + prov.output * outTok / 1000).toFixed(6)}`} hi />
              <Row label="Daily Cost" value={`${cs(currency)}${fmt(aiDailyCost, 4)}`} />
              <Row label="Monthly Cost" value={`${cs(currency)}${fmt(aiDailyCost * 30, 2)}`} hi accent="text-orange-400" />
            </>
          ) : (
            <>
              <Row label="Cost per Request" value={`${cs(currency)}${(prov.input * inTok / 1000 + prov.output * outTok / 1000).toFixed(6)}`} />
              <Row label="Monthly Budget" value={`${cs(currency)}${fmt(budget, 2)}`} />
              <Row label="Daily Budget" value={`${cs(currency)}${fmt(budget / 30, 3)}`} />
              <Row label="Max Requests/Day" value={`${aiDailyCost > 0 ? fmt(maxRequests, 0) : "—"}`} hi accent="text-orange-400" />
              <Row label="Max Requests/Month" value={`${aiDailyCost > 0 ? fmt(maxRequests * 30, 0) : "—"}`} />
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function CPMCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState("cpm");
  const [impressions, setImpressions] = useState("100000");
  const [cpm, setCpm] = useState("5");
  const [platform, setPlatform] = useState("custom");
  const [clicks, setClicks] = useState("2000");
  const [conversions, setConversions] = useState("100");
  const [revenuePerConversion, setRevenuePerConversion] = useState("50");

  const platformCPMs: Record<string, { cpm: string; label: string }> = {
    "google-display": { cpm: "2.5", label: "Google Display" },
    "youtube": { cpm: "6.5", label: "YouTube" },
    "facebook": { cpm: "8.5", label: "Facebook" },
    "instagram": { cpm: "9.0", label: "Instagram" },
    "twitter": { cpm: "3.5", label: "Twitter/X" },
    "linkedin": { cpm: "33", label: "LinkedIn" },
    "tiktok": { cpm: "10", label: "TikTok" },
    "custom": { cpm, label: "Custom" },
  };

  const activeCPM = platform === "custom" ? parseFloat(cpm)||0 : parseFloat(platformCPMs[platform].cpm)||0;
  const imp = parseInt(impressions)||0;
  const cl = parseInt(clicks)||0;
  const conv = parseInt(conversions)||0;
  const revPerConv = parseFloat(revenuePerConversion)||0;

  const totalRevenue = (imp / 1000) * activeCPM;
  const rpm = imp > 0 ? (totalRevenue / imp) * 1000 : 0;
  const ctr = imp > 0 ? (cl / imp) * 100 : 0;
  const convRate = cl > 0 ? (conv / cl) * 100 : 0;
  const totalRev = conv * revPerConv;
  const cpa = conv > 0 ? totalRevenue / conv : 0;
  const roas = totalRevenue > 0 ? totalRev / totalRevenue : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="CPM / Ad Revenue Calculator" icon={DollarSign} iconColor="bg-green-500">
        <ModeBar modes={[{ id: "cpm", label: "CPM/RPM" }, { id: "funnel", label: "Full Funnel" }]} active={mode} onChange={setMode} color="bg-green-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Platform (avg CPM)</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(platformCPMs).map(([k, v]) => (
              <button key={k} onClick={() => { setPlatform(k); if (k !== "custom") setCpm(v.cpm); }}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${platform === k ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>{v.label}</button>
            ))}
          </div>
        </div>
        <InputField label="Total Impressions" value={impressions} onChange={setImpressions} type="number" />
        {(platform === "custom" || mode === "cpm") && <InputField label={`CPM (${cs(currency)} per 1000 imp)`} value={cpm} onChange={v => { setCpm(v); setPlatform("custom"); }} type="number" step={0.1} />}
        {mode === "funnel" && (
          <>
            <InputField label="Clicks" value={clicks} onChange={setClicks} type="number" />
            <InputField label="Conversions" value={conversions} onChange={setConversions} type="number" />
            <InputField label={`Revenue per Conversion (${cs(currency)})`} value={revenuePerConversion} onChange={setRevenuePerConversion} type="number" />
          </>
        )}
        <div className="space-y-2 mt-3">
          <Row label="Ad Revenue (CPM)" value={`${cs(currency)}${fmt(totalRevenue, 2)}`} hi />
          <Row label="RPM" value={`${cs(currency)}${fmt(rpm, 2)}`} />
          {mode === "funnel" && (
            <>
              <Row label={`CTR`} value={`${fmt(ctr, 2)}%`} />
              <Row label="Conversion Rate" value={`${fmt(convRate, 2)}%`} />
              <Row label="Total Conv. Revenue" value={`${cs(currency)}${fmt(totalRev, 2)}`} hi accent="text-green-400" />
              <Row label="CPA (Cost per Acq.)" value={`${cs(currency)}${fmt(cpa, 2)}`} />
              <Row label="ROAS" value={`${fmt(roas, 2)}×`} hi accent={roas >= 3 ? "text-emerald-400" : "text-red-400"} />
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function YouTubeEarnings() {
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState("video");
  const [views, setViews] = useState("100000");
  const [cpm, setCpm] = useState("3");
  const [adRate, setAdRate] = useState("50");
  const [niche, setNiche] = useState("general");
  const [subscribers, setSubscribers] = useState("10000");
  const [growthRate, setGrowthRate] = useState("5");

  const nicheCPMs: Record<string, { cpm: string; label: string }> = {
    finance: { cpm: "12", label: "Finance/Investing" },
    tech: { cpm: "6", label: "Tech/Gadgets" },
    education: { cpm: "5", label: "Education" },
    gaming: { cpm: "2", label: "Gaming" },
    lifestyle: { cpm: "3.5", label: "Lifestyle" },
    fitness: { cpm: "4", label: "Fitness/Health" },
    food: { cpm: "3", label: "Food/Cooking" },
    travel: { cpm: "5", label: "Travel" },
    general: { cpm: "3", label: "General" },
  };

  const activeCPM = niche === "general" ? parseFloat(cpm)||3 : parseFloat(nicheCPMs[niche].cpm)||3;
  const v = parseInt(views)||0; const ad = parseFloat(adRate)||50;
  const subs = parseInt(subscribers)||0; const growth = parseFloat(growthRate)||5;

  const monetizedViews = v * (ad / 100);
  const earnings = (monetizedViews / 1000) * activeCPM;
  const per1M = v > 0 ? (earnings / v) * 1000000 : 0;
  const monthlyEarnings = earnings;
  const annual = earnings * 12;
  const subs3Mo = subs * Math.pow(1 + growth / 100, 3);
  const subs6Mo = subs * Math.pow(1 + growth / 100, 6);
  const subs12Mo = subs * Math.pow(1 + growth / 100, 12);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="YouTube Earnings" icon={Youtube} iconColor="bg-red-500">
        <ModeBar modes={[{ id: "video", label: "Video Earnings" }, { id: "channel", label: "Channel Growth" }]} active={mode} onChange={setMode} color="bg-red-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Currency</span>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Niche (avg CPM)</label>
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(nicheCPMs).map(([k, v]) => (
              <button key={k} onClick={() => { setNiche(k); if (k !== "general") setCpm(nicheCPMs[k].cpm); }}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${niche === k ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"}`}>{v.label}</button>
            ))}
          </div>
        </div>
        <InputField label="Views per Video/Month" value={views} onChange={setViews} type="number" />
        <InputField label={`CPM (${cs(currency)}) — avg for your niche`} value={cpm} onChange={v => { setCpm(v); setNiche("general"); }} type="number" step={0.1} />
        <InputField label="Ad Serving Rate (%) — typically 40-60%" value={adRate} onChange={setAdRate} type="number" />
        {mode === "channel" && (
          <>
            <InputField label="Current Subscribers" value={subscribers} onChange={setSubscribers} type="number" />
            <InputField label="Monthly Growth Rate (%)" value={growthRate} onChange={setGrowthRate} type="number" />
          </>
        )}
        <div className="space-y-2 mt-3">
          <Row label="Monetized Views" value={`${fmt(monetizedViews, 0)}`} />
          <Row label="Estimated Earnings" value={`${cs(currency)}${fmt(earnings, 2)}`} hi accent="text-red-400" />
          <Row label="Per 1M Views" value={`${cs(currency)}${fmt(per1M, 2)}`} />
          {mode === "video" && (
            <>
              <Row label="Monthly (same cadence)" value={`${cs(currency)}${fmt(monthlyEarnings, 2)}`} />
              <Row label="Annual Estimate" value={`${cs(currency)}${fmt(annual, 2)}`} hi />
            </>
          )}
          {mode === "channel" && (
            <>
              <Row label="Subs in 3 months" value={`${fmt(subs3Mo, 0)}`} />
              <Row label="Subs in 6 months" value={`${fmt(subs6Mo, 0)}`} />
              <Row label="Subs in 12 months" value={`${fmt(subs12Mo, 0)}`} hi accent="text-red-400" />
              <Row label="Time to 100K subs" value={subs < 100000 ? `~${fmt(Math.log(100000 / subs) / Math.log(1 + growth / 100), 0)} months` : "Already there! 🎉"} />
            </>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

function SEOChecker() {
  const [mode, setMode] = useState("density");
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [url, setUrl] = useState("");

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = text.trim() ? words.length : 0;
  const charCount = text.length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1;
  const avgWordsPerSentence = wordCount / sentenceCount;
  const readingTime = Math.ceil(wordCount / 200);
  const keywordCount = keyword ? (text.toLowerCase().match(new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g")) || []).length : 0;
  const density = wordCount > 0 && keyword ? ((keywordCount / wordCount) * 100).toFixed(2) : "0";
  const fleschScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (wordCount / Math.max(sentenceCount, 1))));
  const readability = fleschScore > 70 ? "Easy" : fleschScore > 50 ? "Medium" : "Hard";

  const titleLen = title.length;
  const metaLen = metaDesc.length;
  const titleOk = titleLen >= 50 && titleLen <= 60;
  const metaOk = metaLen >= 150 && metaLen <= 160;
  const urlOk = url.length > 0 && url.length <= 75 && /^[a-z0-9-/]+$/.test(url.replace(/https?:\/\//g, "").replace(/\./g, ""));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="SEO Checker" icon={Search} iconColor="bg-blue-500">
        <ModeBar modes={[{ id: "density", label: "Content Analysis" }, { id: "meta", label: "Meta Tags" }]} active={mode} onChange={setMode} color="bg-blue-600" />
        {mode === "density" ? (
          <>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Content / Article</label>
              <textarea value={text} onChange={e => setText(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 min-h-[120px] text-sm resize-none focus:outline-none" placeholder="Paste your content here..." data-testid="textarea-seo-content" />
            </div>
            <InputField label="Focus Keyword" value={keyword} onChange={setKeyword} placeholder="e.g. digital marketing" />
            <div className="space-y-2 mt-2">
              <Row label="Word Count" value={`${wordCount} words`} hi accent={wordCount >= 1000 ? "text-green-400" : wordCount >= 300 ? "text-yellow-400" : "text-red-400"} />
              <Row label="Character Count" value={charCount.toString()} />
              <Row label="Reading Time" value={`~${readingTime} min`} />
              <Row label="Avg Words/Sentence" value={`${fmt(avgWordsPerSentence, 1)}`} />
              <Row label="Readability" value={`${readability} (Flesch ${fmt(fleschScore, 0)})`} hi accent={fleschScore > 70 ? "text-green-400" : fleschScore > 50 ? "text-yellow-400" : "text-red-400"} />
              {keyword && <>
                <Row label="Keyword Count" value={`${keywordCount}×`} />
                <Row label="Keyword Density" value={`${density}%`} hi accent={parseFloat(density) >= 1 && parseFloat(density) <= 3 ? "text-green-400" : "text-yellow-400"} />
              </>}
              <div className="p-2 bg-muted/20 rounded-xl text-xs text-muted-foreground">📌 Ideal: 1000+ words | 1-3% keyword density | Flesch &gt; 60</div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Page Title ({titleLen}/60 chars)</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="Your page title here..." data-testid="input-title" />
              <div className={`text-[10px] mt-1 ${titleOk ? "text-green-400" : titleLen > 60 ? "text-red-400" : "text-yellow-400"}`}>{titleOk ? "✅ Perfect length (50-60 chars)" : titleLen > 60 ? "❌ Too long — trim to 60 chars" : "⚠️ Too short — aim for 50-60 chars"}</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Meta Description ({metaLen}/160 chars)</label>
              <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm resize-none min-h-[70px] focus:outline-none" placeholder="Describe your page..." data-testid="textarea-meta" />
              <div className={`text-[10px] mt-1 ${metaOk ? "text-green-400" : metaLen > 160 ? "text-red-400" : "text-yellow-400"}`}>{metaOk ? "✅ Perfect (150-160 chars)" : metaLen > 160 ? "❌ Too long — trim to 160 chars" : "⚠️ Too short — aim for 150-160 chars"}</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">URL Slug ({url.length} chars)</label>
              <input value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="your-page-slug-here" data-testid="input-url" />
              <div className={`text-[10px] mt-1 ${urlOk ? "text-green-400" : "text-yellow-400"}`}>{urlOk ? "✅ Good URL slug" : "⚠️ Use lowercase, hyphens, keep under 75 chars"}</div>
            </div>
            <div className="p-3 bg-muted/20 rounded-xl mt-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Google Preview</p>
              <p className="text-xs text-blue-400 underline truncate">{url || "your-domain.com/your-page-slug"}</p>
              <p className="text-sm font-bold text-foreground truncate mt-0.5">{title || "Your Page Title"}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{metaDesc || "Your meta description will appear here in Google search results."}</p>
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}
