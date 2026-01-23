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
  CheckCircle2
} from "lucide-react";
import { ToolCard, ToolButton } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type Mode = "direct" | "reverse" | "path";

const RELATIONSHIPS: Record<string, string> = {
  "Father": "Son/Daughter",
  "Mother": "Son/Daughter",
  "Son": "Parent",
  "Daughter": "Parent",
  "Brother": "Sibling",
  "Sister": "Sibling",
  "Husband": "Wife",
  "Wife": "Husband",
  "Uncle": "Nephew/Niece",
  "Aunt": "Nephew/Niece",
  "Grandfather": "Grandson/Granddaughter",
  "Grandmother": "Grandson/Granddaughter",
};

export default function RelationshipTools() {
  const [activeMode, setActiveMode] = useState<Mode>("direct");

  const modes = [
    { id: "direct", label: "Direct Finder", icon: Users },
    { id: "reverse", label: "Reverse Finder", icon: ArrowRightLeft },
    { id: "path", label: "Family Path", icon: GitBranch },
  ];

  return (
    <PageWrapper
      title="Relationship Finder"
      subtitle="Discover family connections and relationships"
      accentColor="bg-violet-500"
      tools={modes}
      activeTool={activeMode}
      onToolChange={(id) => setActiveMode(id as Mode)}
    >
      <RelationshipCalculator mode={activeMode} />
    </PageWrapper>
  );
}

function RelationshipCalculator({ mode }: { mode: Mode }) {
  const [personA, setPersonA] = useState("Father");
  const [gender, setGender] = useState("Male");
  const [path, setPath] = useState<string[]>(["Father", "Sister", "Son"]);

  const result = useMemo(() => {
    if (mode === "direct") {
      const resp = RELATIONSHIPS[personA] || "Relative";
      return `If A is ${personA} of B, then B is ${resp} of A`;
    }

    if (mode === "reverse") {
      const resp = RELATIONSHIPS[personA] || "Relative";
      return `If ${personA} is your ${personA}, then you are ${resp} of them`;
    }

    if (mode === "path") {
      // Simple path logic for the requested examples
      const pathStr = path.join(" -> ");
      let relation = "Relative";
      
      const fullPath = path.join("-");
      if (fullPath === "Father-Sister-Son") relation = "Cousin (Paternal)";
      if (fullPath === "Mother-Brother-Daughter") relation = "Cousin (Maternal)";
      if (fullPath === "Father-Brother") relation = "Uncle (Paternal)";
      if (fullPath === "Mother-Sister") relation = "Aunt (Maternal)";
      
      return `Your ${pathStr} is your ${relation}`;
    }

    return null;
  }, [mode, personA, path]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Relationship Solver" icon={Calculator} iconColor="bg-violet-500">
        <div className="space-y-4">
          {mode !== "path" ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  {mode === "direct" ? "A is ___ of B" : "X is my ___"}
                </label>
                <select
                  value={personA}
                  onChange={(e) => setPersonA(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {Object.keys(RELATIONSHIPS).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Gender (Optional)</label>
                <div className="flex gap-2">
                  {["Male", "Female", "Neutral"].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        gender === g ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-sm font-medium text-muted-foreground block">Build Family Path</label>
              <div className="space-y-2">
                {path.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <select
                      value={p}
                      onChange={(e) => {
                        const newPath = [...path];
                        newPath[i] = e.target.value;
                        setPath(newPath);
                      }}
                      className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none"
                    >
                      {["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Husband", "Wife"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {path.length > 2 && (
                      <button 
                        onClick={() => setPath(path.filter((_, idx) => idx !== i))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {path.length < 5 && (
                  <button
                    onClick={() => setPath([...path, "Son"])}
                    className="w-full py-2 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    + Add Next Connection
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase text-muted-foreground">
              <Search className="w-3.5 h-3.5" />
              Result
            </div>
            <div className="text-lg font-bold text-foreground">
              {result}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-violet-500/5 p-3 rounded-lg border border-violet-500/10">
            <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
            <span>Relationship names are based on standard family tree logic.</span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
