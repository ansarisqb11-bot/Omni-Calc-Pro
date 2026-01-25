import { useState, useMemo } from "react";
import { 
  Users, 
  ArrowRightLeft, 
  Globe,
  MessageSquare,
  Plus,
  Trash2,
  Info
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";

type Gender = "M" | "F" | "N";
type CountryMode = "INDIA" | "USA" | "NEUTRAL";
type Mode = "step-by-step" | "sentence" | "two-way";

interface RelationDef {
  gen: number;
  gender: Gender;
  blood: boolean;
  type: "blood" | "marriage" | "step";
}

const REL: Record<string, RelationDef> = {
  father:   { gen: 1, gender: "M", blood: true, type: "blood" },
  mother:   { gen: 1, gender: "F", blood: true, type: "blood" },
  brother:  { gen: 0, gender: "M", blood: true, type: "blood" },
  sister:   { gen: 0, gender: "F", blood: true, type: "blood" },
  son:      { gen: -1, gender: "M", blood: true, type: "blood" },
  daughter: { gen: -1, gender: "F", blood: true, type: "blood" },
  husband:  { gen: 0, gender: "M", blood: false, type: "marriage" },
  wife:     { gen: 0, gender: "F", blood: false, type: "marriage" },
  stepfather: { gen: 1, gender: "M", blood: false, type: "step" },
  stepmother: { gen: 1, gender: "F", blood: false, type: "step" },
  stepbrother: { gen: 0, gender: "M", blood: false, type: "step" },
  stepsister: { gen: 0, gender: "F", blood: false, type: "step" },
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
  "mother-father": "Nana",
  "mother-brother-wife": "Mami",
  "father-brother-wife": "Chachi",
  "mother-sister-husband": "Mausa",
  "father-sister-husband": "Fufa",
  "wife-brother": "Saala",
  "wife-sister": "Saali",
  "husband-brother": "Dewar/Jeth",
  "husband-sister": "Nanad",
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
  "mother-father": "Grandfather",
  "husband-father": "Father-in-law",
  "wife-father": "Father-in-law",
  "husband-mother": "Mother-in-law",
  "wife-mother": "Mother-in-law",
  "husband-brother": "Brother-in-law",
  "wife-brother": "Brother-in-law",
  "husband-sister": "Sister-in-law",
  "wife-sister": "Sister-in-law",
};

export default function RelationshipTools() {
  const [activeMode, setActiveMode] = useState<Mode>("step-by-step");
  const [country, setCountry] = useState<CountryMode>("INDIA");

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-10">
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
          {(["INDIA", "USA", "NEUTRAL"] as CountryMode[]).map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                country === c ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "INDIA" && "🇮🇳"}
              {c === "USA" && "🇺🇸"}
              {c === "NEUTRAL" && <Globe className="w-3 h-3" />}
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
  let relationType: "blood" | "marriage" | "step" = "blood";
  
  for (const step of path) {
    const def = REL[step.toLowerCase()];
    if (def) {
      generation += def.gen;
      if (def.type === "marriage") relationType = "marriage";
      if (def.type === "step") relationType = "step";
    }
  }

  const key = path.join("-").toLowerCase();
  const indianName = INDIAN_NAMES[key];
  const usaName = USA_NAMES[key];

  return {
    generation,
    relationType,
    indianName,
    usaName,
    description: generation > 0 ? `${generation} generation${generation > 1 ? 's' : ''} above you` : 
                 generation < 0 ? `${Math.abs(generation)} generation${Math.abs(generation) > 1 ? 's' : ''} below you` : 
                 "Same generation as you"
  };
}

function ResultDisplay({ path, country }: { path: string[], country: CountryMode }) {
  const res = calculateRelation(path);
  
  const getDisplayValue = () => {
    if (country === "INDIA") {
      return res.indianName || path.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ke ");
    } else if (country === "USA") {
      return res.usaName || `Your ${path.join("'s ")}`;
    }
    return `Your ${path.join("'s ")}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Relationship Result</div>
            <div className="text-2xl font-bold text-foreground">{getDisplayValue()}</div>
          </div>
          <div className="flex flex-col gap-1 items-end">
             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
               res.relationType === "blood" ? "bg-emerald-500/10 text-emerald-500" : 
               res.relationType === "marriage" ? "bg-orange-500/10 text-orange-500" : 
               "bg-blue-500/10 text-blue-500"
             }`}>
              {res.relationType.toUpperCase()}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">{res.description}</span>
          </div>
        </div>

        {country === "NEUTRAL" && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">🇮🇳 India</div>
              <div className="text-sm font-semibold">{res.indianName || "Descriptive"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">🇺🇸 USA</div>
              <div className="text-sm font-semibold">{res.usaName || "Descriptive"}</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StepByStepFinder({ country }: { country: CountryMode }) {
  const [path, setPath] = useState<string[]>(["mother", "sister"]);

  return (
    <ToolCard title="Step-by-Step Chain" icon={Users} iconColor="bg-violet-500">
      <div className="space-y-4">
        <div className="space-y-3">
          {path.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                {i === 0 ? "Me" : i}
              </div>
              <select
                value={step}
                onChange={(e) => {
                  const next = [...path];
                  next[i] = e.target.value;
                  setPath(next);
                }}
                className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                {Object.keys(REL).map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1).replace("step", "Step-")}</option>)}
              </select>
              {path.length > 1 && (
                <button 
                  onClick={() => setPath(path.filter((_, idx) => idx !== i))} 
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setPath([...path, "brother"])}
            className="w-full py-3 border border-dashed border-border rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Next Relation in Chain
          </button>
        </div>
        
        <ResultDisplay path={path} country={country} />
        
        <div className="bg-primary/5 p-4 rounded-xl flex gap-3 items-start">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            This tool calculates complex chains without limits. Select "Me" as the starting point and build your tree step-by-step.
          </p>
        </div>
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
      .replace(/-/g, "")
      .split(/[\s,]+/)
      .filter(w => REL[w]);
  }, [text]);

  return (
    <ToolCard title="Smart Text Input" icon={MessageSquare} iconColor="bg-blue-500">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-tight">Describe the relation</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="e.g. my mother's brother's wife"
            />
          </div>
        </div>
        
        {path.length > 0 ? (
          <ResultDisplay path={path} country={country} />
        ) : (
          <div className="p-10 text-center border border-dashed border-border rounded-2xl bg-muted/10">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-xs font-medium italic">
              "Who is my father's sister's son?"
            </p>
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
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Path from Me</div>
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

        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
               They are my <ArrowRight className="w-2.5 h-2.5" />
            </div>
            <div className="text-xl font-bold text-primary">
              {country === "INDIA" ? (res.indianName || "Relative") : (res.usaName || "Relative")}
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-2xl border border-border">
            <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
               I am their <ArrowRight className="w-2.5 h-2.5 rotate-180" />
            </div>
            <div className="text-xl font-bold text-foreground">
               {res.generation > 0 ? "Nephew / Niece" : res.generation < 0 ? "Uncle / Aunt" : "Cousin / Sibling"}
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
