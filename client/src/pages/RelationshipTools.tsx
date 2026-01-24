import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  ArrowRightLeft, 
  GitBranch, 
  Calculator,
  User,
  HelpCircle,
  Search,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { ToolCard, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type Mode = "step-by-step" | "sentence" | "two-way";

const RELATIONSHIP_MAP: Record<string, any> = {
  "sister-daughter": { relation: "Niece", reverse: "Uncle/Aunt" },
  "sister-son": { relation: "Nephew", reverse: "Uncle/Aunt" },
  "brother-daughter": { relation: "Niece", reverse: "Uncle/Aunt" },
  "brother-son": { relation: "Nephew", reverse: "Uncle/Aunt" },
  "uncle-son": { relation: "Cousin", reverse: "Cousin" },
  "uncle-daughter": { relation: "Cousin", reverse: "Cousin" },
  "father-sister": { relation: "Aunt", reverse: "Nephew/Niece" },
  "mother-brother": { relation: "Uncle", reverse: "Nephew/Niece" },
  "father-brother": { relation: "Uncle", reverse: "Nephew/Niece" },
  "mother-sister": { relation: "Aunt", reverse: "Nephew/Niece" },
};

export default function RelationshipTools() {
  const [activeMode, setActiveMode] = useState<Mode>("step-by-step");

  const modes = [
    { id: "step-by-step", label: "Step-by-Step", icon: Users },
    { id: "sentence", label: "Smart Sentence", icon: MessageSquare },
    { id: "two-way", label: "Two-Way", icon: ArrowRightLeft },
  ];

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id as Mode)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeMode === m.id ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <m.icon className="w-3.5 h-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {activeTool(activeMode)}
    </div>
  );
}

function activeTool(mode: Mode) {
  switch (mode) {
    case "step-by-step": return <StepByStepFinder />;
    case "sentence": return <SentenceFinder />;
    case "two-way": return <TwoWayFinder />;
  }
}

function StepByStepFinder() {
  const [first, setFirst] = useState("sister");
  const [second, setSecond] = useState("daughter");

  const result = useMemo(() => {
    const key = `${first}-${second}`;
    return RELATIONSHIP_MAP[key]?.relation || "Relative";
  }, [first, second]);

  return (
    <ToolCard title="Direct Relationship Finder" icon={Users} iconColor="bg-violet-500">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">My / Your</label>
          <select
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none"
          >
            <option value="sister">Sister</option>
            <option value="brother">Brother</option>
            <option value="uncle">Uncle</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
          </select>
        </div>
        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Relation of that person</label>
          <select
            value={second}
            onChange={(e) => setSecond(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none"
          >
            <option value="daughter">Daughter</option>
            <option value="son">Son</option>
            <option value="sister">Sister</option>
            <option value="brother">Brother</option>
          </select>
        </div>

        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center">
          <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Result</div>
          <div className="text-2xl font-bold text-primary">She/He is your {result}</div>
        </div>
      </div>
    </ToolCard>
  );
}

function SentenceFinder() {
  const [sentence, setSentence] = useState("Who is my sister's daughter to me?");
  
  const result = useMemo(() => {
    const lower = sentence.toLowerCase();
    if (lower.includes("sister") && lower.includes("daughter")) return "Niece";
    if (lower.includes("sister") && lower.includes("son")) return "Nephew";
    if (lower.includes("brother") && lower.includes("daughter")) return "Niece";
    if (lower.includes("brother") && lower.includes("son")) return "Nephew";
    if (lower.includes("uncle") && (lower.includes("son") || lower.includes("daughter"))) return "Cousin";
    return "Relative";
  }, [sentence]);

  return (
    <ToolCard title="Smart Sentence Finder" icon={MessageSquare} iconColor="bg-blue-500">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Ask Relationship</label>
          <input
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="e.g. Who is my brother's son to me?"
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <div className="text-xs text-muted-foreground uppercase font-bold mb-1 text-center">Translation</div>
          <div className="text-lg font-medium text-blue-400 text-center">
            Your {sentence.split("'")[0].split("my ")[1] || "relative"}'s {sentence.split("'")[1]?.split(" to")[0] || "child"} is your <span className="font-bold text-white">{result}</span>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

function TwoWayFinder() {
  const [target, setTarget] = useState("sister-daughter");

  const data = RELATIONSHIP_MAP[target];

  return (
    <ToolCard title="Two-Way Relationship" icon={ArrowRightLeft} iconColor="bg-emerald-500">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Select Connection</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none"
          >
            {Object.keys(RELATIONSHIP_MAP).map(k => (
              <option key={k} value={k}>{k.replace("-", "'s ")}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-muted/30 rounded-xl border border-border">
            <div className="text-xs text-muted-foreground font-bold uppercase mb-1">She/He is my</div>
            <div className="text-xl font-bold text-emerald-400">{data?.relation || "Relative"}</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl border border-border">
            <div className="text-xs text-muted-foreground font-bold uppercase mb-1">I am her/his</div>
            <div className="text-xl font-bold text-blue-400">{data?.reverse || "Relative"}</div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}
