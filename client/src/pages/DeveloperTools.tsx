import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Binary, Hash, Lock, FileText, Server, DollarSign, Youtube, Search } from "lucide-react";
import { ToolCard, InputField, ResultDisplay, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType = "binary" | "ascii" | "base64" | "hash" | "filesize" | "api" | "appcpm" | "youtube" | "seo";

export default function DeveloperTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("binary");

  const tools = [
    { id: "binary", label: "Binary/Hex", icon: Binary },
    { id: "ascii", label: "ASCII", icon: Code },
    { id: "base64", label: "Base64", icon: Lock },
    { id: "hash", label: "Hash", icon: Hash },
    { id: "filesize", label: "File Size", icon: FileText },
    { id: "api", label: "API Cost", icon: Server },
    { id: "appcpm", label: "CPM/RPM", icon: DollarSign },
    { id: "youtube", label: "YouTube", icon: Youtube },
    { id: "seo", label: "SEO", icon: Search },
  ];

  return (
    <PageWrapper
      title="Developer Tools"
      subtitle="IT and creator calculators"
      accentColor="bg-gray-600"
      tools={tools}
      activeTool={activeTool}
      onToolChange={(id) => setActiveTool(id as ToolType)}
    >
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
  const [input, setInput] = useState("255");
  const [inputType, setInputType] = useState<"decimal" | "binary" | "hex">("decimal");

  const convert = () => {
    try {
      let decimal: number;
      if (inputType === "decimal") {
        decimal = parseInt(input, 10);
      } else if (inputType === "binary") {
        decimal = parseInt(input, 2);
      } else {
        decimal = parseInt(input, 16);
      }

      if (isNaN(decimal)) return { decimal: "Invalid", binary: "Invalid", hex: "Invalid", octal: "Invalid" };

      return {
        decimal: decimal.toString(),
        binary: decimal.toString(2),
        hex: decimal.toString(16).toUpperCase(),
        octal: decimal.toString(8),
      };
    } catch {
      return { decimal: "Error", binary: "Error", hex: "Error", octal: "Error" };
    }
  };

  const result = convert();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Number Base Converter" icon={Binary} iconColor="bg-blue-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["decimal", "binary", "hex"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setInputType(t)}
                className={`flex-1 py-2 rounded-lg text-sm capitalize ${
                  inputType === t ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-type-${t}`}
              >
                {t}
              </button>
            ))}
          </div>
          <InputField label={`Input (${inputType})`} value={input} onChange={setInput} />
        </div>
      </ToolCard>

      <ToolCard title="Conversions" icon={Code} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Decimal" value={result.decimal} highlight color="text-blue-400" />
          <ResultDisplay label="Binary" value={result.binary} />
          <ResultDisplay label="Hexadecimal" value={result.hex} />
          <ResultDisplay label="Octal" value={result.octal} />
        </div>
      </ToolCard>
    </div>
  );
}

function ASCIIConverter() {
  const [text, setText] = useState("Hello");
  const [mode, setMode] = useState<"toAscii" | "toText">("toAscii");

  const convert = () => {
    if (mode === "toAscii") {
      return text.split("").map((c) => c.charCodeAt(0)).join(" ");
    } else {
      return text.split(" ").map((n) => String.fromCharCode(parseInt(n))).join("");
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="ASCII Converter" icon={Code} iconColor="bg-purple-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("toAscii")}
              className={`flex-1 py-2 rounded-lg text-sm ${
                mode === "toAscii" ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-to-ascii"
            >
              Text to ASCII
            </button>
            <button
              onClick={() => setMode("toText")}
              className={`flex-1 py-2 rounded-lg text-sm ${
                mode === "toText" ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-to-text"
            >
              ASCII to Text
            </button>
          </div>
          <InputField label={mode === "toAscii" ? "Text" : "ASCII (space separated)"} value={text} onChange={setText} />
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Hash} iconColor="bg-emerald-500">
        <div className="p-4 bg-muted/30 rounded-xl break-all font-mono text-sm">
          {convert() || "Enter text to convert"}
        </div>
      </ToolCard>
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("Hello World");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    try {
      if (mode === "encode") {
        return btoa(input);
      } else {
        return atob(input);
      }
    } catch {
      return "Invalid input";
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Base64 Encoder/Decoder" icon={Lock} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("encode")}
              className={`flex-1 py-2 rounded-lg text-sm ${
                mode === "encode" ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-encode"
            >
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`flex-1 py-2 rounded-lg text-sm ${
                mode === "decode" ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground"
              }`}
              data-testid="button-decode"
            >
              Decode
            </button>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 min-h-[80px] text-sm resize-none"
              data-testid="textarea-input"
            />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Result" icon={Hash} iconColor="bg-emerald-500">
        <div className="p-4 bg-muted/30 rounded-xl break-all font-mono text-sm">
          {convert()}
        </div>
      </ToolCard>
    </div>
  );
}

function HashGenerator() {
  const [input, setInput] = useState("Hello World");

  const simpleHash = (str: string, algorithm: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    if (algorithm === "md5") return hex.repeat(4);
    if (algorithm === "sha1") return hex.repeat(5);
    return hex.repeat(8);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Hash Generator" icon={Hash} iconColor="bg-rose-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 min-h-[80px] text-sm resize-none"
              data-testid="textarea-hash-input"
            />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Hashes (Simulated)" icon={Lock} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">MD5-like (32 char)</p>
            <p className="font-mono text-xs break-all text-rose-400">{simpleHash(input, "md5")}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">SHA1-like (40 char)</p>
            <p className="font-mono text-xs break-all text-blue-400">{simpleHash(input, "sha1")}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">SHA256-like (64 char)</p>
            <p className="font-mono text-xs break-all text-purple-400">{simpleHash(input, "sha256")}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Note: These are simulated hashes for demonstration.</p>
      </ToolCard>
    </div>
  );
}

function FileSizeEstimator() {
  const [files, setFiles] = useState("100");
  const [avgSize, setAvgSize] = useState("5");
  const [sizeUnit, setSizeUnit] = useState("MB");

  const f = parseInt(files) || 0;
  const s = parseFloat(avgSize) || 0;

  const multipliers = { KB: 1 / 1024, MB: 1, GB: 1024 };
  const totalMB = f * s * multipliers[sizeUnit as keyof typeof multipliers];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="File Size Estimator" icon={FileText} iconColor="bg-cyan-500">
        <div className="space-y-4">
          <InputField label="Number of Files" value={files} onChange={setFiles} type="number" />
          <InputField label="Average File Size" value={avgSize} onChange={setAvgSize} type="number" />
          <div className="flex gap-2">
            {["KB", "MB", "GB"].map((u) => (
              <button
                key={u}
                onClick={() => setSizeUnit(u)}
                className={`flex-1 py-2 rounded-lg text-sm ${
                  sizeUnit === u ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`button-size-${u}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Total Size" icon={Hash} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="In MB" value={`${totalMB.toFixed(2)} MB`} highlight color="text-cyan-400" />
          <ResultDisplay label="In GB" value={`${(totalMB / 1024).toFixed(2)} GB`} />
          <ResultDisplay label="In TB" value={`${(totalMB / 1024 / 1024).toFixed(4)} TB`} />
        </div>
      </ToolCard>
    </div>
  );
}

function APIRateCost() {
  const [requests, setRequests] = useState("100000");
  const [costPer1k, setCostPer1k] = useState("0.002");

  const r = parseInt(requests) || 0;
  const cost = parseFloat(costPer1k) || 0;

  const totalCost = (r / 1000) * cost;
  const dailyCost = totalCost;
  const monthlyCost = totalCost * 30;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="API Rate Cost" icon={Server} iconColor="bg-orange-500">
        <div className="space-y-4">
          <InputField label="Daily API Requests" value={requests} onChange={setRequests} type="number" />
          <InputField label="Cost per 1K Requests ($)" value={costPer1k} onChange={setCostPer1k} type="number" step={0.001} />
        </div>
      </ToolCard>

      <ToolCard title="Cost Estimate" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Daily Cost" value={`$${dailyCost.toFixed(2)}`} />
          <ResultDisplay label="Monthly Cost" value={`$${monthlyCost.toFixed(2)}`} highlight color="text-orange-400" />
          <ResultDisplay label="Yearly Cost" value={`$${(monthlyCost * 12).toFixed(2)}`} />
        </div>
      </ToolCard>
    </div>
  );
}

function CPMCalculator() {
  const [impressions, setImpressions] = useState("100000");
  const [cpm, setCpm] = useState("5");

  const imp = parseInt(impressions) || 0;
  const rate = parseFloat(cpm) || 0;

  const revenue = (imp / 1000) * rate;
  const rpm = (revenue / imp) * 1000;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="CPM/RPM Calculator" icon={DollarSign} iconColor="bg-green-500">
        <div className="space-y-4">
          <InputField label="Total Impressions" value={impressions} onChange={setImpressions} type="number" />
          <InputField label="CPM (Cost per 1000)" value={cpm} onChange={setCpm} type="number" step={0.1} />
        </div>
      </ToolCard>

      <ToolCard title="Revenue" icon={Hash} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Total Revenue" value={`$${revenue.toFixed(2)}`} highlight color="text-green-400" />
          <ResultDisplay label="RPM" value={`$${rpm.toFixed(2)}`} />
        </div>
      </ToolCard>
    </div>
  );
}

function YouTubeEarnings() {
  const [views, setViews] = useState("100000");
  const [cpm, setCpm] = useState("3");
  const [adRate, setAdRate] = useState("50");

  const v = parseInt(views) || 0;
  const rate = parseFloat(cpm) || 0;
  const ad = parseFloat(adRate) || 0;

  const monetizedViews = v * (ad / 100);
  const earnings = (monetizedViews / 1000) * rate;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="YouTube Earnings" icon={Youtube} iconColor="bg-red-500">
        <div className="space-y-4">
          <InputField label="Total Views" value={views} onChange={setViews} type="number" />
          <InputField label="CPM ($)" value={cpm} onChange={setCpm} type="number" step={0.1} />
          <InputField label="Ad Serving Rate (%)" value={adRate} onChange={setAdRate} type="number" />
        </div>
      </ToolCard>

      <ToolCard title="Estimated Earnings" icon={DollarSign} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Monetized Views" value={monetizedViews.toLocaleString()} />
          <ResultDisplay label="Estimated Earnings" value={`$${earnings.toFixed(2)}`} highlight color="text-red-400" />
          <ResultDisplay label="Per 1M Views" value={`$${((earnings / v) * 1000000).toFixed(2)}`} />
        </div>
      </ToolCard>
    </div>
  );
}

function SEOChecker() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = text.trim() ? words.length : 0;
  const charCount = text.length;
  const keywordCount = keyword ? (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || []).length : 0;
  const density = wordCount > 0 && keyword ? ((keywordCount / wordCount) * 100).toFixed(2) : "0";

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="SEO Word Density" icon={Search} iconColor="bg-blue-500">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 min-h-[120px] text-sm resize-none"
              placeholder="Paste your content here..."
              data-testid="textarea-seo-content"
            />
          </div>
          <InputField label="Target Keyword" value={keyword} onChange={setKeyword} />
        </div>
      </ToolCard>

      <ToolCard title="Analysis" icon={Hash} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <ResultDisplay label="Word Count" value={wordCount.toString()} />
          <ResultDisplay label="Character Count" value={charCount.toString()} />
          <ResultDisplay label="Keyword Count" value={keywordCount.toString()} color="text-blue-400" />
          <ResultDisplay label="Keyword Density" value={`${density}%`} highlight color={parseFloat(density) >= 1 && parseFloat(density) <= 3 ? "text-green-400" : "text-yellow-400"} />
        </div>
        <p className="text-xs text-muted-foreground mt-3">Ideal keyword density: 1-3%</p>
      </ToolCard>
    </div>
  );
}
