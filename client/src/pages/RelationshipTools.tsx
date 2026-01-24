import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  ArrowRightLeft, 
  Calculator,
  HelpCircle,
  Search,
  MessageSquare,
  ArrowRight,
  Globe
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";

type Gender = "M" | "F" | "N";
type CountryMode = "INDIA" | "USA" | "BOTH";
type Mode = "step-by-step" | "sentence" | "two-way";

interface RelationDef {
  gen: number;
  gender: Gender;
  blood: boolean;
}

const REL: Record<string, RelationDef> = {
  father:   { gen: 1, gender: "M", blood: true },
  mother:   { gen: 1, gender: "F", blood: true },
  brother:  { gen: 0, gender: "M", blood: true },
  sister:   { gen: 0, gender: "F", blood: true },
  son:      { gen: -1, gender: "M", blood: true },
  daughter: { gen: -1, gender: "F", blood: true },
  husband:  { gen: 0, gender: "M", blood: false },
  wife:     { gen: 0, gender: "F", blood: false }
};

const INDIAN_NAMES: Record<string, string> = {
  "mother-sister": "Mausi",
  "mother-brother": "Mama",
  "father-brother": "Chacha",
  "father-sister": "Bua",
  "brother-wife": "Bhabhi",
  "sister-husband": "Jija",
  "father-mother": "Dadi",
  "father-father": "Dada",
  "mother-mother": "Nani",
  "mother-father": "Nana"
};

const USA_NAMES: Record<string, string> = {
  "mother-sister": "Aunt",
  "father-sister": "Aunt",
  "mother-brother": "Uncle",
  "father-brother": "Uncle",
  "brother-son": "Nephew",
  "sister-son": "Nephew",
  "brother-daughter": "Niece",
  "sister-daughter": "Niece",
  "father-mother": "Grandmother",
  "mother-mother": "Grandmother",
  "father-father": "Grandfather",
  "mother-father": "Grandfather"
};

export default function RelationshipTools() {
  const [activeMode, setActiveMode] = useState<Mode>("step-by-step");
  const [country, setCountry] = useState<CountryMode>("BOTH");

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          {(["step-by-step", "sentence", "two-way"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMode(m)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeMode === m ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "step-by-step" && <Users className="w-3.5 h-3.5" />}
              {m === "sentence" && <MessageSquare className="w-3.5 h-3.5" />}
              {m === "two-way" && <ArrowRightLeft className="w-3.5 h-3.5" />}
              <span className="capitalize">{m.replace("-", " ")}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit self-center">
          {(["INDIA", "USA", "BOTH"] as CountryMode[]).map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                country === c ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "INDIA" && "🇮🇳"}
              {c === "USA" && "🇺🇸"}
              {c === "BOTH" && <Globe className="w-3 h-3" />}
              {c}
            </button>
          ))}
        </div>
      </div>

      {activeMode === "step-by-step" && <StepByStepFinder country={country} />}
      {activeMode === "sentence" && <SentenceFinder country={country} />}
      {activeMode === "two-way" && <TwoWayFinder country={country} />}
    </div>
  );
}

function calculateRelation(path: string[]) {
  let generation = 0;
  let isBlood = true;
  
  for (const step of path) {
    const def = REL[step.toLowerCase()];
    if (def) {
      generation += def.gen;
      if (!def.blood) isBlood = false;
    }
  }

  const key = path.join("-").toLowerCase();
  const indianName = INDIAN_NAMES[key];
  const usaName = USA_NAMES[key];

  return {
    generation,
    isBlood,
    indianName,
    usaName,
    description: generation > 0 ? `${generation} generations above you` : 
                 generation < 0 ? `${Math.abs(generation)} generations below you` : 
                 "Same generation as you"
  };
}

function ResultDisplay({ path, country }: { path: string[], country: CountryMode }) {
  const res = calculateRelation(path);
  
  return (
    <div className="mt-6 space-y-4">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Relationship Type</div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${res.isBlood ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"}`}>
              {res.isBlood ? "Direct Blood Relation" : "Connected through Marriage"}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500">
              {res.description}
            </span>
          </div>
        </div>

        {(country === "INDIA" || country === "BOTH") && (
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              🇮🇳 Indian Explanation
            </div>
            <div className="text-lg font-bold text-foreground">
              {res.indianName || path.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ke ")}
            </div>
          </div>
        )}

        {(country === "USA" || country === "BOTH") && (
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              🇺🇸 USA / English Explanation
            </div>
            <div className="text-lg font-bold text-foreground">
              {res.usaName || `Your ${path.join("'s ")}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepByStepFinder({ country }: { country: CountryMode }) {
  const [path, setPath] = useState<string[]>(["mother", "sister"]);

  return (
    <ToolCard title="Direct Finder" icon={Users} iconColor="bg-violet-500">
      <div className="space-y-4">
        <div className="space-y-3">
          {path.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                {i === 0 ? "Me" : i}
              </div>
              <select
                value={step}
                onChange={(e) => {
                  const next = [...path];
                  next[i] = e.target.value;
                  setPath(next);
                }}
                className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none"
              >
                {Object.keys(REL).map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              {path.length > 1 && (
                <button onClick={() => setPath(path.filter((_, idx) => idx !== i))} className="p-2 text-muted-foreground hover:text-destructive">
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setPath([...path, "brother"])}
            className="w-full py-2 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            + Add Next Relation
          </button>
        </div>
        <ResultDisplay path={path} country={country} />
      </div>
    </ToolCard>
  );
}

function SentenceFinder({ country }: { country: CountryMode }) {
  const [text, setText] = useState("mother's sister's husband");
  
  const path = useMemo(() => {
    return text.toLowerCase()
      .replace(/'s/g, "")
      .replace(/my /g, "")
      .split(/[\s,]+/)
      .filter(w => REL[w]);
  }, [text]);

  return (
    <ToolCard title="Smart Sentence" icon={MessageSquare} iconColor="bg-blue-500">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type relationship path</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. mother's sister's husband"
          />
        </div>
        {path.length > 0 ? (
          <ResultDisplay path={path} country={country} />
        ) : (
          <div className="p-8 text-center border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
            Start typing relationships like "father's brother"
          </div>
        )}
      </div>
    </ToolCard>
  );
}

function TwoWayFinder({ country }: { country: CountryMode }) {
  const [path, setPath] = useState<string[]>(["sister", "daughter"]);
  const res = calculateRelation(path);

  return (
    <ToolCard title="Two-Way Finder" icon={ArrowRightLeft} iconColor="bg-emerald-500">
      <div className="space-y-4">
        <div className="space-y-3">
          {path.map((step, i) => (
            <select
              key={i}
              value={step}
              onChange={(e) => {
                const next = [...path];
                next[i] = e.target.value;
                setPath(next);
              }}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none"
            >
              {Object.keys(REL).map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">They are my</div>
            <div className="text-xl font-bold text-primary">{res.usaName || res.indianName || "Relative"}</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-2xl border border-border">
            <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">I am their</div>
            <div className="text-xl font-bold text-foreground">Maternal Uncle / Aunt</div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}
