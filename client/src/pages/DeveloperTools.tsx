import { useState } from "react";
import { Code, Binary, Hash, Lock, FileText, Server, DollarSign, Globe, Wifi } from "lucide-react";
import { DesktopToolGrid, InputPanel, ResultPanel, SummaryCard, BreakdownRow, InputField, ModeSelector } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "base64" | "json" | "regex" | "hash" | "units" | "color" | "timestamp" | "ip" | "bandwidth";

const CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" }, { code: "INR", symbol: "₹" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
  { code: "AUD", symbol: "A$" }, { code: "CAD", symbol: "C$" },
  { code: "AED", symbol: "د.إ" }, { code: "SGD", symbol: "S$" },
];
const cs = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || "$";
const fmt = (n: number, d = 2) => isFinite(n) && !isNaN(n) ? parseFloat(n.toFixed(d)).toLocaleString() : "—";

export default function DeveloperTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("base64");
  const tools = [
    { id: "base64", label: "Base64", icon: Binary },
    { id: "json", label: "JSON", icon: FileText },
    { id: "regex", label: "Regex", icon: Code },
    { id: "hash", label: "Hash", icon: Hash },
    { id: "units", label: "Data Units", icon: Server },
    { id: "color", label: "Color", icon: Globe },
    { id: "timestamp", label: "Timestamp", icon: Code },
    { id: "ip", label: "IP / CIDR", icon: Wifi },
    { id: "bandwidth", label: "Bandwidth", icon: DollarSign },
  ];
  return (
    <PageWrapper title="Developer Tools" subtitle="Encoding, hashing, conversion and network utilities" accentColor="bg-violet-600" tools={tools} activeTool={activeTool} onToolChange={id => setActiveTool(id as ToolType)}>
      {activeTool === "base64" && <Base64Tool />}
      {activeTool === "json" && <JsonTool />}
      {activeTool === "regex" && <RegexTool />}
      {activeTool === "hash" && <HashInfo />}
      {activeTool === "units" && <DataUnits />}
      {activeTool === "color" && <ColorConverter />}
      {activeTool === "timestamp" && <TimestampTool />}
      {activeTool === "ip" && <IpCIDR />}
      {activeTool === "bandwidth" && <BandwidthCost />}
    </PageWrapper>
  );
}

function Base64Tool() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("Hello, World!");
  const [urlSafe, setUrlSafe] = useState(false);

  const encode = (s: string) => {
    try {
      let out = btoa(unescape(encodeURIComponent(s)));
      if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      return out;
    } catch { return "Error encoding — check input characters"; }
  };
  const decode = (s: string) => {
    try {
      let padded = s.replace(/-/g, "+").replace(/_/g, "/");
      while (padded.length % 4) padded += "=";
      return decodeURIComponent(escape(atob(padded)));
    } catch { return "Error decoding — invalid Base64 string"; }
  };

  const output = mode === "encode" ? encode(input) : decode(input);
  const byteLen = new TextEncoder().encode(input).length;
  const ratio = byteLen > 0 ? output.length / byteLen : 0;

  return (
    <DesktopToolGrid wide
      inputs={
        <InputPanel title="Input" icon={Binary} iconColor="bg-violet-500">
          <ModeSelector modes={[{ id:"encode", label:"Encode" }, { id:"decode", label:"Decode" }]} active={mode} onChange={setMode} />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{mode === "encode" ? "Plain Text" : "Base64 String"}</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="urlsafe" checked={urlSafe} onChange={e => setUrlSafe(e.target.checked)} className="accent-primary" />
            <label htmlFor="urlsafe" className="text-sm text-muted-foreground cursor-pointer">URL-safe mode (no +, /, =)</label>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Output" primary={`${output.length} chars`}
          summaries={<>
            <SummaryCard label="Input bytes" value={`${byteLen}`} />
            <SummaryCard label="Size ratio" value={`${fmt(ratio, 2)}×`} />
          </>}
        >
          <div className="font-mono text-xs bg-muted/30 rounded-xl p-4 break-all max-h-40 overflow-y-auto text-foreground/90 select-all leading-relaxed">{output || "—"}</div>
          <BreakdownRow label="Input length" value={`${input.length} chars`} dot="bg-violet-400" />
          <BreakdownRow label="Output length" value={`${output.length} chars`} dot="bg-blue-400" />
          <BreakdownRow label="Input bytes" value={`${byteLen} bytes`} dot="bg-green-500" />
          <BreakdownRow label="Overhead" value={`${fmt((ratio-1)*100, 1)}%`} />
        </ResultPanel>
      }
    />
  );
}

function JsonTool() {
  const [mode, setMode] = useState("format");
  const [input, setInput] = useState('{"name":"John","age":30,"city":"Mumbai","active":true}');
  const [indent, setIndent] = useState("2");

  let output = ""; let error = ""; let parsed: any = null;
  try {
    parsed = JSON.parse(input);
    if (mode === "format") output = JSON.stringify(parsed, null, parseInt(indent)||2);
    else if (mode === "minify") output = JSON.stringify(parsed);
    else if (mode === "analyze") output = JSON.stringify(parsed, null, 2);
  } catch (e: any) { error = e.message; }

  const countKeys = (obj: any, depth = 0): number => {
    if (typeof obj !== "object" || obj === null) return 0;
    const keys = Object.keys(obj);
    return keys.length + keys.reduce((sum, k) => sum + countKeys(obj[k], depth+1), 0);
  };
  const keyCount = parsed ? countKeys(parsed) : 0;

  return (
    <DesktopToolGrid wide
      inputs={
        <InputPanel title="JSON Input" icon={FileText} iconColor="bg-yellow-500">
          <ModeSelector modes={[{ id:"format", label:"Format" }, { id:"minify", label:"Minify" }, { id:"analyze", label:"Analyze" }]} active={mode} onChange={setMode} />
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={8}
            className={`w-full bg-muted/30 border rounded-xl px-4 py-3 text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${error ? "border-red-400" : "border-border"}`}
            placeholder="Paste JSON here..." />
          {mode === "format" && <InputField label="Indent Spaces" value={indent} onChange={setIndent} type="number" />}
          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
        </InputPanel>
      }
      results={
        <ResultPanel label="Result" primary={error ? "Invalid JSON" : `${output.length} chars`}
          summaries={<>
            <SummaryCard label="Total Keys" value={`${keyCount}`} />
            <SummaryCard label={`Saved`} value={error ? "—" : `${Math.max(0, input.length - output.length)} chars`} />
          </>}
        >
          {!error ? (
            <div className="font-mono text-xs bg-muted/30 rounded-xl p-4 max-h-48 overflow-y-auto text-foreground/90 select-all leading-relaxed whitespace-pre">{output}</div>
          ) : (
            <div className="font-mono text-xs bg-red-500/10 rounded-xl p-4 text-red-400">{error}</div>
          )}
          <BreakdownRow label="Input chars" value={`${input.length}`} dot="bg-yellow-400" />
          <BreakdownRow label="Output chars" value={error ? "—" : `${output.length}`} dot="bg-blue-400" />
          <BreakdownRow label="Total keys" value={`${keyCount}`} dot="bg-green-500" />
        </ResultPanel>
      }
    />
  );
}

function RegexTool() {
  const [pattern, setPattern] = useState("[A-Z][a-z]+");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("Hello World from Mumbai, India. Nice Weather Today!");

  let matches: RegExpMatchArray[] = []; let error = "";
  try {
    const re = new RegExp(pattern, flags);
    let m; const src = flags.includes("g");
    if (src) {
      while ((m = re.exec(testText)) !== null) { matches.push([...m] as RegExpMatchArray); if (matches.length > 50) break; }
    } else {
      m = testText.match(re);
      if (m) matches.push([...m] as RegExpMatchArray);
    }
  } catch (e: any) { error = e.message; }

  const highlighted = () => {
    if (error || !pattern) return testText;
    try {
      return testText.replace(new RegExp(pattern, flags.replace("g","") + "g"), m => `<mark class="bg-primary/30 text-primary rounded px-0.5">${m}</mark>`);
    } catch { return testText; }
  };

  const allFlags = ["g","i","m","s","u"];

  return (
    <DesktopToolGrid wide
      inputs={
        <InputPanel title="Regex Parameters" icon={Code} iconColor="bg-blue-500">
          <InputField label="Pattern" value={pattern} onChange={setPattern} placeholder="e.g. [A-Z][a-z]+" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Flags</label>
            <div className="flex gap-1.5">
              {allFlags.map(f => (
                <button key={f} onClick={() => setFlags(prev => prev.includes(f) ? prev.replace(f,"") : prev+f)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold font-mono ${flags.includes(f) ? "bg-blue-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Test Text</label>
            <textarea value={testText} onChange={e => setTestText(e.target.value)} rows={5}
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
        </InputPanel>
      }
      results={
        <ResultPanel label="Matches" primary={`${matches.length}`} primarySub="found"
          summaries={<>
            <SummaryCard label="Pattern" value={`/${pattern}/${flags}`} />
            <SummaryCard label="Text Length" value={`${testText.length} chars`} />
          </>}
        >
          <div className="text-sm leading-relaxed bg-muted/20 rounded-xl p-3 font-mono text-xs break-all" dangerouslySetInnerHTML={{ __html: highlighted() }} />
          <div className="mt-2 space-y-0">
            {matches.slice(0, 10).map((m, i) => (
              <BreakdownRow key={i} label={`Match ${i+1}`} value={`"${m[0]}"`} dot="bg-blue-400" />
            ))}
            {matches.length > 10 && <BreakdownRow label="..." value={`+${matches.length-10} more`} />}
          </div>
        </ResultPanel>
      }
    />
  );
}

function HashInfo() {
  const [input, setInput] = useState("Hello, World!");

  const algorithms = [
    { name: "MD5", bits: 128, note: "❌ Insecure — collision vulnerable" },
    { name: "SHA-1", bits: 160, note: "❌ Deprecated — use SHA-2+" },
    { name: "SHA-256", bits: 256, note: "✅ Secure — recommended" },
    { name: "SHA-384", bits: 384, note: "✅ Strong — good for TLS" },
    { name: "SHA-512", bits: 512, note: "✅ Very strong — max security" },
    { name: "bcrypt", bits: null, note: "✅ Best for passwords" },
    { name: "Argon2", bits: null, note: "✅ Modern password hashing" },
    { name: "BLAKE3", bits: 256, note: "⚡ Fast + secure" },
  ];
  const strLen = new TextEncoder().encode(input).length;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Hash Input" icon={Hash} iconColor="bg-orange-500">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Text to Hash</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={5}
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl leading-relaxed">
            Input: {input.length} chars / {strLen} bytes<br/>
            Note: Browser-based hashing is limited. Use server-side for production.
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Algorithm Guide" primary={`${strLen} bytes`} primarySub="input size"
          summaries={<>
            <SummaryCard label="Recommended" value="SHA-256" accent="text-green-500" />
            <SummaryCard label="For Passwords" value="bcrypt/Argon2" accent="text-green-500" />
          </>}
          tip="Never use MD5 or SHA-1 for security. Use SHA-256+ for data integrity, bcrypt/Argon2 for passwords."
        >
          {algorithms.map(a => (
            <BreakdownRow key={a.name} label={a.name} value={a.bits ? `${a.bits} bits` : "variable"} dot={a.note.startsWith("✅") ? "bg-green-500" : a.note.startsWith("⚡") ? "bg-blue-400" : "bg-red-400"} />
          ))}
        </ResultPanel>
      }
    />
  );
}

function DataUnits() {
  const [value, setValue] = useState("1"); const [fromUnit, setFromUnit] = useState("GB");

  const units: Record<string, number> = {
    Bit:1, Byte:8, KB:8*1024, MB:8*1024**2, GB:8*1024**3,
    TB:8*1024**4, PB:8*1024**5, Kbit:1024, Mbit:1024**2, Gbit:1024**3, Tbit:1024**4,
  };
  const inBits = (parseFloat(value)||0) * (units[fromUnit]||1);
  const display = Object.entries(units).filter(([k]) => k !== fromUnit);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Data Unit Input" icon={Server} iconColor="bg-teal-500">
          <InputField label="Value" value={value} onChange={setValue} type="number" />
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">From Unit</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(units).map(u => (
                <button key={u} onClick={() => setFromUnit(u)} className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${fromUnit === u ? "bg-teal-500 text-white" : "bg-muted/50 text-muted-foreground border border-border"}`}>{u}</button>
              ))}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Conversion Results" primary={`${(inBits).toLocaleString(undefined, { maximumFractionDigits: 0 })} bits`}>
          {display.map(([unit, factor]) => {
            const converted = inBits / factor;
            const formatted = converted >= 1000 ? converted.toLocaleString(undefined, { maximumFractionDigits: 2 }) : converted.toPrecision(4);
            return <BreakdownRow key={unit} label={unit} value={formatted} dot="bg-teal-400" />;
          })}
        </ResultPanel>
      }
    />
  );
}

function ColorConverter() {
  const [mode, setMode] = useState("hex");
  const [hex, setHex] = useState("#22C55E");
  const [r, setR] = useState("34"); const [g, setG] = useState("197"); const [b, setB] = useState("94");
  const [h, setH] = useState("142"); const [s, setS] = useState("71"); const [l, setL] = useState("45");

  const hexToRgb = (hex: string) => {
    const clean = hex.replace("#","");
    const n = parseInt(clean, 16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  };
  const rgbToHex = (r:number,g:number,b:number) => "#"+[r,g,b].map(v=>Math.min(255,Math.max(0,v)).toString(16).padStart(2,"0")).join("").toUpperCase();
  const rgbToHsl = (r:number,g:number,b:number) => {
    const rr=r/255,gg=g/255,bb=b/255;
    const max=Math.max(rr,gg,bb),min=Math.min(rr,gg,bb);
    let h=0,s=0; const l=(max+min)/2;
    if (max!==min) { const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
      h=max===rr?((gg-bb)/d+(gg<bb?6:0)):max===gg?((bb-rr)/d+2):((rr-gg)/d+4); h/=6; }
    return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
  };

  let displayHex=hex; let displayR=parseInt(r)||0; let displayG=parseInt(g)||0; let displayB=parseInt(b)||0;
  if (mode==="hex") { const rgb=hexToRgb(hex); displayR=rgb.r; displayG=rgb.g; displayB=rgb.b; }
  else if (mode==="rgb") { displayHex=rgbToHex(displayR,displayG,displayB); }
  const hsl = rgbToHsl(displayR,displayG,displayB);
  const safeHex = displayHex.match(/^#[0-9A-Fa-f]{6}$/) ? displayHex : "#22C55E";

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Color Input" icon={Globe} iconColor="bg-pink-500">
          <ModeSelector modes={[{ id:"hex", label:"HEX" }, { id:"rgb", label:"RGB" }]} active={mode} onChange={setMode} />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-border shadow-inner flex-shrink-0" style={{ backgroundColor: safeHex }} />
            <div className="flex-1">
              {mode === "hex" ? (
                <InputField label="HEX Color" value={hex} onChange={setHex} placeholder="#22C55E" />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <InputField label="R" value={r} onChange={setR} type="number" />
                  <InputField label="G" value={g} onChange={setG} type="number" />
                  <InputField label="B" value={b} onChange={setB} type="number" />
                </div>
              )}
            </div>
          </div>
        </InputPanel>
      }
      results={
        <ResultPanel label="Color Values" primary={displayHex.toUpperCase()}
          summaries={<>
            <SummaryCard label="RGB" value={`${displayR}, ${displayG}, ${displayB}`} />
            <SummaryCard label="HSL" value={`${hsl.h}° ${hsl.s}% ${hsl.l}%`} accent="text-pink-500" />
          </>}
        >
          <BreakdownRow label="HEX" value={displayHex.toUpperCase()} dot="bg-pink-400" bold />
          <BreakdownRow label="RGB" value={`rgb(${displayR}, ${displayG}, ${displayB})`} dot="bg-blue-400" />
          <BreakdownRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} dot="bg-green-500" />
          <BreakdownRow label="CSS rgba" value={`rgba(${displayR},${displayG},${displayB},1)`} dot="bg-purple-400" />
          <BreakdownRow label="R" value={`${displayR} / 0x${displayR.toString(16).padStart(2,"0").toUpperCase()}`} />
          <BreakdownRow label="G" value={`${displayG} / 0x${displayG.toString(16).padStart(2,"0").toUpperCase()}`} />
          <BreakdownRow label="B" value={`${displayB} / 0x${displayB.toString(16).padStart(2,"0").toUpperCase()}`} />
        </ResultPanel>
      }
    />
  );
}

function TimestampTool() {
  const [mode, setMode] = useState("now");
  const [tsInput, setTsInput] = useState(String(Math.floor(Date.now()/1000)));
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0,19));

  const now = Date.now();
  const ts = mode === "now" ? Math.floor(now/1000) : mode === "toDate" ? parseInt(tsInput)||0 : Math.floor(new Date(dateInput+"Z").getTime()/1000);
  const msTs = ts * 1000;
  const d = new Date(msTs);
  const isValid = !isNaN(d.getTime());

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Timestamp Input" icon={Code} iconColor="bg-cyan-500">
          <ModeSelector modes={[{ id:"now", label:"Current Time" }, { id:"toDate", label:"Unix → Date" }, { id:"fromDate", label:"Date → Unix" }]} active={mode} onChange={setMode} />
          {mode === "toDate" && <InputField label="Unix Timestamp (sec)" value={tsInput} onChange={setTsInput} />}
          {mode === "fromDate" && (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Date Time (UTC)</label>
              <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          )}
          {mode === "now" && (
            <div className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-xl">Shows current UTC timestamp and conversions in real-time.</div>
          )}
        </InputPanel>
      }
      results={
        <ResultPanel label="Unix Timestamp" primary={`${ts}`} primarySub="seconds"
          summaries={<>
            <SummaryCard label="MS Timestamp" value={`${msTs}`} />
            <SummaryCard label="Valid" value={isValid ? "✅ Yes" : "❌ No"} accent={isValid ? "text-green-500" : "text-red-500"} />
          </>}
        >
          {isValid && (
            <>
              <BreakdownRow label="Unix (sec)" value={`${ts}`} dot="bg-cyan-400" bold />
              <BreakdownRow label="Unix (ms)" value={`${msTs}`} dot="bg-blue-400" />
              <BreakdownRow label="UTC Date" value={d.toUTCString()} dot="bg-green-500" />
              <BreakdownRow label="ISO 8601" value={d.toISOString()} dot="bg-purple-400" />
              <BreakdownRow label="Local" value={d.toLocaleString()} dot="bg-amber-400" />
              <BreakdownRow label="Day of Week" value={d.toLocaleDateString("en",{ weekday:"long" })} />
              <BreakdownRow label="Week Number" value={`Week ${Math.ceil(d.getDate()/7)}`} />
            </>
          )}
        </ResultPanel>
      }
    />
  );
}

function IpCIDR() {
  const [cidr, setCidr] = useState("192.168.1.0/24");
  const [mode, setMode] = useState("cidr");

  const parseCIDR = (input: string) => {
    try {
      const [ipStr, prefixStr] = input.split("/");
      const prefix = parseInt(prefixStr)||24;
      const parts = ipStr.split(".").map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
      const ip32 = (parts[0]<<24)|(parts[1]<<16)|(parts[2]<<8)|parts[3];
      const mask32 = prefix === 0 ? 0 : (~0 << (32-prefix)) >>> 0;
      const net32 = (ip32 & mask32) >>> 0;
      const bc32 = (net32 | ~mask32) >>> 0;
      const toIp = (n: number) => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".");
      const hosts = prefix >= 31 ? Math.pow(2,32-prefix) : Math.max(0, Math.pow(2,32-prefix)-2);
      return {
        network: toIp(net32), broadcast: toIp(bc32),
        first: toIp(net32+1), last: toIp(bc32-1),
        mask: toIp(mask32), wildcard: toIp(~mask32 >>> 0),
        hosts, prefix,
        ipClass: parts[0] < 128 ? "A" : parts[0] < 192 ? "B" : parts[0] < 224 ? "C" : parts[0] < 240 ? "D" : "E",
        isPrivate: (parts[0]===10)||(parts[0]===172&&parts[1]>=16&&parts[1]<=31)||(parts[0]===192&&parts[1]===168),
      };
    } catch { return null; }
  };

  const info = parseCIDR(cidr);

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="IP / CIDR Input" icon={Wifi} iconColor="bg-emerald-500">
          <ModeSelector modes={[{ id:"cidr", label:"CIDR" }, { id:"examples", label:"Examples" }]} active={mode} onChange={setMode} />
          <InputField label="CIDR Notation" value={cidr} onChange={setCidr} placeholder="e.g. 192.168.1.0/24" />
          {mode === "examples" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">Common Subnets</label>
              {["/8 – Class A (16M hosts)","10.0.0.0/8","/16 – Class B (65K hosts)","172.16.0.0/16","/24 – Class C (254 hosts)","192.168.1.0/24","/32 – Single host","192.168.1.1/32"].filter((_,i) => i%2!==0).map(e => (
                <button key={e} onClick={() => setCidr(e)} className="w-full text-left px-3 py-2 bg-muted/20 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">{e}</button>
              ))}
            </div>
          )}
        </InputPanel>
      }
      results={
        info ? (
          <ResultPanel label="Network Info" primary={`${info.hosts.toLocaleString()}`} primarySub="usable hosts"
            summaries={<>
              <SummaryCard label="Class" value={`Class ${info.ipClass}`} />
              <SummaryCard label="Type" value={info.isPrivate ? "🏠 Private" : "🌐 Public"} />
            </>}
          >
            <BreakdownRow label="Network Address" value={info.network} dot="bg-blue-400" bold />
            <BreakdownRow label="Broadcast" value={info.broadcast} dot="bg-red-400" />
            <BreakdownRow label="First Host" value={info.first} dot="bg-green-500" />
            <BreakdownRow label="Last Host" value={info.last} dot="bg-green-400" />
            <BreakdownRow label="Subnet Mask" value={info.mask} dot="bg-purple-400" />
            <BreakdownRow label="Wildcard Mask" value={info.wildcard} dot="bg-amber-400" />
            <BreakdownRow label="Usable Hosts" value={info.hosts.toLocaleString()} bold />
          </ResultPanel>
        ) : (
          <ResultPanel label="Result" primary="Invalid">
            <BreakdownRow label="Format" value="Enter valid CIDR e.g. 192.168.1.0/24" />
          </ResultPanel>
        )
      }
    />
  );
}

function BandwidthCost() {
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState("transfer");
  const [dataGB, setDataGB] = useState("100");
  const [costPerGB, setCostPerGB] = useState("0.09"); const [freeGB, setFreeGB] = useState("100");
  const [speedMbps, setSpeedMbps] = useState("100"); const [fileSizeGB, setFileSizeGB] = useState("10");
  const [users, setUsers] = useState("1000"); const [avgGB, setAvgGB] = useState("5");

  const data = parseFloat(dataGB)||0; const cpg = parseFloat(costPerGB)||0.09;
  const free = parseFloat(freeGB)||0; const speed = parseFloat(speedMbps)||100;
  const fileGB = parseFloat(fileSizeGB)||10; const usersN = parseInt(users)||1000; const avgData = parseFloat(avgGB)||5;
  const billable = Math.max(0, data - free);
  const cost = billable * cpg;
  const timeSec = fileGB > 0 && speed > 0 ? (fileGB * 8192) / speed : 0;
  const totalData = usersN * avgData;
  const totalCost = Math.max(0, totalData - free) * cpg;

  return (
    <DesktopToolGrid
      inputs={
        <InputPanel title="Bandwidth Parameters" icon={DollarSign} iconColor="bg-indigo-500" currency={currency} currencies={CURRENCIES} onCurrencyChange={setCurrency}>
          <ModeSelector modes={[{ id:"transfer", label:"Transfer Cost" }, { id:"download", label:"Download Time" }, { id:"cdn", label:"CDN Cost" }]} active={mode} onChange={setMode} />
          <InputField label={`Cost per GB (${cs(currency)})`} value={costPerGB} onChange={setCostPerGB} type="number" prefix={cs(currency)} />
          <InputField label="Free Tier (GB)" value={freeGB} onChange={setFreeGB} type="number" />
          {mode === "transfer" && <InputField label="Data Transfer (GB)" value={dataGB} onChange={setDataGB} type="number" />}
          {mode === "download" && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="File Size (GB)" value={fileSizeGB} onChange={setFileSizeGB} type="number" />
              <InputField label="Speed (Mbps)" value={speedMbps} onChange={setSpeedMbps} type="number" />
            </div>
          )}
          {mode === "cdn" && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Monthly Users" value={users} onChange={setUsers} type="number" />
              <InputField label="Avg Data / User (GB)" value={avgGB} onChange={setAvgGB} type="number" />
            </div>
          )}
        </InputPanel>
      }
      results={
        mode === "transfer" ? (
          <ResultPanel label="Transfer Cost"
            primary={`${cs(currency)}${fmt(cost)}`}
            summaries={<>
              <SummaryCard label="Billable GB" value={`${fmt(billable, 0)} GB`} accent="text-indigo-500" />
              <SummaryCard label="Per GB" value={`${cs(currency)}${cpg}`} />
            </>}
          >
            <BreakdownRow label="Total Data" value={`${fmt(data, 0)} GB`} dot="bg-blue-400" />
            <BreakdownRow label="Free Tier" value={`${fmt(free, 0)} GB`} dot="bg-green-500" />
            <BreakdownRow label="Billable" value={`${fmt(billable, 0)} GB`} dot="bg-amber-400" />
            <BreakdownRow label="Cost" value={`${cs(currency)}${fmt(cost)}`} dot="bg-indigo-400" bold />
            <BreakdownRow label="Annual (est)" value={`${cs(currency)}${fmt(cost*12)}`} />
          </ResultPanel>
        ) : mode === "download" ? (
          <ResultPanel label="Download Time"
            primary={timeSec >= 3600 ? `${fmt(timeSec/3600, 2)} hrs` : timeSec >= 60 ? `${fmt(timeSec/60, 1)} min` : `${fmt(timeSec, 1)} sec`}
            summaries={<>
              <SummaryCard label="File Size" value={`${fileGB} GB`} accent="text-indigo-500" />
              <SummaryCard label="Speed" value={`${speedMbps} Mbps`} />
            </>}
          >
            <BreakdownRow label="File Size" value={`${fileGB} GB = ${fmt(fileGB*1024, 0)} MB`} dot="bg-blue-400" />
            <BreakdownRow label="Speed" value={`${speedMbps} Mbps = ${fmt(parseFloat(speedMbps)/8, 2)} MB/s`} dot="bg-green-500" />
            <BreakdownRow label="Time (sec)" value={`${fmt(timeSec, 1)} s`} dot="bg-indigo-400" bold />
            <BreakdownRow label="Time (min)" value={`${fmt(timeSec/60, 1)} min`} dot="bg-purple-400" />
            <BreakdownRow label="Time (hrs)" value={`${fmt(timeSec/3600, 2)} hrs`} />
          </ResultPanel>
        ) : (
          <ResultPanel label="Monthly CDN Cost"
            primary={`${cs(currency)}${fmt(totalCost)}`}
            summaries={<>
              <SummaryCard label="Total Data" value={`${fmt(totalData, 0)} GB`} accent="text-indigo-500" />
              <SummaryCard label="Annual" value={`${cs(currency)}${fmt(totalCost*12, 0)}`} />
            </>}
          >
            <BreakdownRow label="Users" value={`${usersN.toLocaleString()}`} dot="bg-blue-400" />
            <BreakdownRow label="Data per User" value={`${avgData} GB`} dot="bg-green-500" />
            <BreakdownRow label="Total Data" value={`${fmt(totalData, 0)} GB`} dot="bg-amber-400" />
            <BreakdownRow label="Billable" value={`${fmt(Math.max(0,totalData-free), 0)} GB`} dot="bg-indigo-400" bold />
            <BreakdownRow label="Monthly Cost" value={`${cs(currency)}${fmt(totalCost)}`} bold />
            <BreakdownRow label="Annual Cost" value={`${cs(currency)}${fmt(totalCost*12, 0)}`} />
          </ResultPanel>
        )
      }
    />
  );
}
