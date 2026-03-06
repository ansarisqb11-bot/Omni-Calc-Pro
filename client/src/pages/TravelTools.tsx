import { useState } from "react";
import {
  Plane, Car, Fuel, Luggage, Globe, Clock, Train,
  Gauge, Zap, Route, Scale, Map, Package, ArrowRightLeft, Plus, Trash2, Calculator
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { PageWrapper } from "@/components/PageWrapper";

type ToolType =
  | "travel-time" | "train" | "fuel-cost" | "luggage"
  | "distance" | "timezone" | "flight" | "packing"
  | "vehicle-range" | "fuel-compare";

// ─── Unit tables ─────────────────────────────────────────────────────────────
const DIST_UNITS  = [{v:"km",l:"km",f:1},{v:"mi",l:"mi",f:1.60934},{v:"m",l:"m",f:0.001},{v:"ft",l:"ft",f:0.000305},{v:"nmi",l:"nmi",f:1.852}];
const SPEED_UNITS = [{v:"kmh",l:"km/h",f:1},{v:"mph",l:"mph",f:1.60934},{v:"ms",l:"m/s",f:3.6},{v:"kn",l:"knots",f:1.852}];
const MASS_UNITS  = [{v:"kg",l:"kg",f:1},{v:"lb",l:"lb",f:0.453592},{v:"g",l:"g",f:0.001}];
const VOL_UNITS   = [{v:"L",l:"L",f:1},{v:"gal",l:"gal",f:3.78541},{v:"kg",l:"kg",f:1}];

function toBase(val:number, unit:string, table:{v:string;l:string;f:number}[]): number {
  return val * (table.find(u=>u.v===unit)?.f ?? 1);
}
function fromBase(val:number, unit:string, table:{v:string;l:string;f:number}[]): number {
  return val / (table.find(u=>u.v===unit)?.f ?? 1);
}
function cvtUnit(val:number, from:string, to:string, table:{v:string;l:string;f:number}[]): number {
  return fromBase(toBase(val, from, table), to, table);
}

// Speed to km/h and back
const toKmh  = (v:number, u:string) => toBase(v, u, SPEED_UNITS);
const frmKmh = (v:number, u:string) => fromBase(v, u, SPEED_UNITS);
const toKm   = (v:number, u:string) => toBase(v, u, DIST_UNITS);
const frmKm  = (v:number, u:string) => fromBase(v, u, DIST_UNITS);
const toKg   = (v:number, u:string) => toBase(v, u, MASS_UNITS);
const frmKg  = (v:number, u:string) => fromBase(v, u, MASS_UNITS);

const n2 = (v:number) => (isNaN(v)||!isFinite(v)?"—":v.toFixed(2));
const n1 = (v:number) => (isNaN(v)||!isFinite(v)?"—":v.toFixed(1));
const n0 = (v:number) => (isNaN(v)||!isFinite(v)?"—":Math.ceil(v).toString());
const fmtDur = (mins:number) => {
  if(!isFinite(mins)||isNaN(mins)) return "—";
  const h=Math.floor(Math.abs(mins)/60), m=Math.round(Math.abs(mins)%60);
  return h>0 ? `${h}h ${m}m` : `${m}m`;
};
const fmt12 = (h:number, m:number) => {
  const hh=Math.floor(((h%24)+24)%24), mm=Math.round(((m%60)+60)%60);
  const ap=hh<12?"AM":"PM"; const h12=hh%12||12;
  return `${h12}:${mm.toString().padStart(2,"0")} ${ap}`;
};
const to24 = (h:number, m:number, ap:string) => {
  let hh=h; if(ap==="AM"){if(hh===12)hh=0;}else{if(hh!==12)hh+=12;} return {h:hh,m};
};

// ─── Timezones (offline, no DST) ─────────────────────────────────────────────
const ZONES = [
  {l:"IST — India (New Delhi, Mumbai, Kolkata)",o:5.5},
  {l:"UTC — Universal Time",o:0},
  {l:"GMT / WET — London (winter)",o:0},
  {l:"BST / WEST — London (summer)",o:1},
  {l:"CET — Paris, Berlin, Rome (winter)",o:1},
  {l:"CEST — Paris, Berlin (summer)",o:2},
  {l:"EET — Cairo, Athens, Beirut",o:2},
  {l:"MSK — Moscow, St. Petersburg",o:3},
  {l:"AST — Saudi Arabia, Kuwait",o:3},
  {l:"IRST — Tehran (Iran)",o:3.5},
  {l:"GST — Dubai, Abu Dhabi",o:4},
  {l:"AFT — Kabul (Afghanistan)",o:4.5},
  {l:"PKT — Islamabad, Karachi",o:5},
  {l:"NPT — Kathmandu (Nepal)",o:5.75},
  {l:"BDT — Dhaka, Bangladesh",o:6},
  {l:"MMT — Yangon, Myanmar",o:6.5},
  {l:"ICT — Bangkok, Jakarta",o:7},
  {l:"SGT/CST — Beijing, Singapore, HK",o:8},
  {l:"JST — Tokyo, Japan",o:9},
  {l:"KST — Seoul, South Korea",o:9},
  {l:"ACST — Adelaide (Australia)",o:9.5},
  {l:"AEST — Sydney, Melbourne",o:10},
  {l:"NZST — Auckland, Wellington",o:12},
  {l:"BRT — São Paulo, Buenos Aires",o:-3},
  {l:"NST — Newfoundland, Canada",o:-3.5},
  {l:"EDT — New York, Miami (summer)",o:-4},
  {l:"EST — New York, Miami (winter)",o:-5},
  {l:"CDT — Chicago, Dallas (summer)",o:-5},
  {l:"CST — Chicago, Dallas (winter)",o:-6},
  {l:"MDT — Denver (summer)",o:-6},
  {l:"MST — Denver, Phoenix (winter)",o:-7},
  {l:"PDT — Los Angeles (summer)",o:-7},
  {l:"PST — Los Angeles (winter)",o:-8},
  {l:"AKST — Alaska (winter)",o:-9},
  {l:"HST — Hawaii",o:-10},
];

// ─── Shared UI components ─────────────────────────────────────────────────────
function UnitField({label, value, onChange, unit, onUnitChange, units, hint}: {
  label:string; value:string; onChange:(v:string)=>void;
  unit:string; onUnitChange:(u:string)=>void;
  units:{v:string;l:string;f:number}[]; hint?:string;
}) {
  const handleUnitChange = (newU: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      const conv = cvtUnit(num, unit, newU, units);
      onChange(parseFloat(conv.toPrecision(5)).toString());
    }
    onUnitChange(newU);
  };
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
        <input type="number" value={value} onChange={e=>onChange(e.target.value)}
          className="flex-1 min-w-0 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none"
          data-testid={`input-${label.toLowerCase().replace(/\s+/g,"-")}`} />
        <select value={unit} onChange={e=>handleUnitChange(e.target.value)}
          className="bg-muted border-l border-border px-2 py-2.5 text-sm font-bold text-muted-foreground focus:outline-none cursor-pointer"
          data-testid={`unit-${label.toLowerCase().replace(/\s+/g,"-")}`}>
          {units.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
      {hint && <p className="text-xs text-muted-foreground/60 mt-1">{hint}</p>}
    </div>
  );
}

function Field({label, value, onChange, suffix, hint, type="number"}: {
  label:string; value:string; onChange:(v:string)=>void;
  suffix?:string; hint?:string; type?:string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
        <input type={type} value={value} onChange={e=>onChange(e.target.value)}
          className="flex-1 min-w-0 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none"
          data-testid={`input-${label.toLowerCase().replace(/\s+/g,"-")}`} />
        {suffix && <span className="bg-muted border-l border-border px-3 py-2.5 text-xs font-bold text-muted-foreground flex items-center shrink-0">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-muted-foreground/60 mt-1">{hint}</p>}
    </div>
  );
}

function SelectField({label, value, onChange, options}: {
  label:string; value:string; onChange:(v:string)=>void;
  options:{value:string;label:string}[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
        data-testid={`select-${label.toLowerCase().replace(/\s+/g,"-")}`}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ModeToggle({mode, onChange, modes, color="bg-sky-500"}: {
  mode:string; onChange:(m:string)=>void;
  modes:{key:string;label:string}[]; color?:string;
}) {
  return (
    <div className="flex flex-wrap gap-1 p-1 bg-muted rounded-xl mb-4">
      {modes.map(({key,label})=>(
        <button key={key} onClick={()=>onChange(key)}
          className={`flex-1 min-w-0 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${mode===key?`${color} text-white`:"text-muted-foreground"}`}
          data-testid={`mode-${key}`}>{label}</button>
      ))}
    </div>
  );
}

function TimeInput({label, hour, min, ampm, onHour, onMin, onAmpm}: {
  label:string; hour:string; min:string; ampm:string;
  onHour:(v:string)=>void; onMin:(v:string)=>void; onAmpm:(v:string)=>void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">{label}</label>
      <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
        <input type="number" min={1} max={12} value={hour} onChange={e=>onHour(e.target.value)}
          className="w-14 bg-muted/50 px-2 py-2.5 text-center text-foreground text-sm focus:outline-none"
          placeholder="HH" data-testid={`input-${label.toLowerCase().replace(/\s+/g,"-")}-h`}/>
        <span className="bg-muted/50 py-2.5 text-muted-foreground font-bold">:</span>
        <input type="number" min={0} max={59} value={min} onChange={e=>onMin(e.target.value)}
          className="w-14 bg-muted/50 px-2 py-2.5 text-center text-foreground text-sm focus:outline-none"
          placeholder="MM" data-testid={`input-${label.toLowerCase().replace(/\s+/g,"-")}-m`}/>
        <select value={ampm} onChange={e=>onAmpm(e.target.value)}
          className="bg-muted border-l border-border px-2 py-2.5 text-sm font-bold text-muted-foreground focus:outline-none cursor-pointer">
          <option value="AM">AM</option><option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

function Step({label, value, sub}: {label:string; value:string; sub?:string}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
      <div>
        <span className="text-sm text-muted-foreground">{label}</span>
        {sub && <p className="text-xs text-muted-foreground/60">{sub}</p>}
      </div>
      <span className="font-bold text-foreground text-sm ml-4 text-right">{value}</span>
    </div>
  );
}

function Highlight({label, value, color="text-sky-400", sub}: {label:string; value:string; color?:string; sub?:string}) {
  return (
    <div className="bg-muted/60 rounded-xl p-4 text-center mt-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TravelTools() {
  const [activeTool, setActiveTool] = useState<ToolType>("travel-time");

  const tools = [
    {id:"travel-time",   label:"Travel Time",    icon:Clock},
    {id:"train",         label:"Train",           icon:Train},
    {id:"fuel-cost",     label:"Fuel Cost",       icon:Fuel},
    {id:"luggage",       label:"Luggage",         icon:Luggage},
    {id:"distance",      label:"Distance",        icon:Route},
    {id:"timezone",      label:"Time Zone",       icon:Globe},
    {id:"flight",        label:"Flight",          icon:Plane},
    {id:"packing",       label:"Packing List",    icon:Package},
    {id:"vehicle-range", label:"Vehicle Range",   icon:Gauge},
    {id:"fuel-compare",  label:"Fuel Compare",    icon:Scale},
  ];

  return (
    <PageWrapper
      title="Travel Tools"
      subtitle="Smart trip planning for India & worldwide"
      accentColor="bg-sky-500"
      tools={tools}
      activeTool={activeTool}
      onToolChange={id=>setActiveTool(id as ToolType)}
    >
      {activeTool==="travel-time"   && <TravelTimeCalc />}
      {activeTool==="train"         && <TrainCalc />}
      {activeTool==="fuel-cost"     && <FuelCostCalc />}
      {activeTool==="luggage"       && <LuggageCalc />}
      {activeTool==="distance"      && <DistanceConverter />}
      {activeTool==="timezone"      && <TimeZoneConverter />}
      {activeTool==="flight"        && <FlightCalc />}
      {activeTool==="packing"       && <PackingList />}
      {activeTool==="vehicle-range" && <VehicleRange />}
      {activeTool==="fuel-compare"  && <FuelCompare />}
    </PageWrapper>
  );
}

// ─── 1. Travel Time Calculator ────────────────────────────────────────────────
function TravelTimeCalc() {
  const [mode, setMode] = useState("a");
  const [depH, setDepH] = useState("10"); const [depM, setDepM] = useState("30"); const [depAp, setDepAp] = useState("AM");
  const [arrH, setArrH] = useState("03"); const [arrM, setArrM] = useState("30"); const [arrAp, setArrAp] = useState("PM");
  const [dist, setDist] = useState("300"); const [distU, setDistU] = useState("km");
  const [speed, setSpeed] = useState("60"); const [speedU, setSpeedU] = useState("kmh");
  const [durH, setDurH] = useState("5"); const [durM2, setDurM2] = useState("0");
  const [stopTime, setStopTime] = useState("0");
  const [delay, setDelay] = useState("0");

  const dep24 = to24(parseInt(depH)||12, parseInt(depM)||0, depAp);
  const arr24 = to24(parseInt(arrH)||12, parseInt(arrM)||0, arrAp);
  const depMins = dep24.h*60 + dep24.m;
  const arrMins = arr24.h*60 + arr24.m;
  const distKm  = toKm(parseFloat(dist)||0, distU);
  const spdKmh  = toKmh(parseFloat(speed)||1, speedU);
  const extraMins = (parseInt(stopTime)||0) + (parseInt(delay)||0);
  const travelMins = distKm/spdKmh*60 + extraMins;
  const durMinsInput = (parseInt(durH)||0)*60 + (parseInt(durM2)||0) + extraMins;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} modes={[
        {key:"a",label:"→ Arrival"},
        {key:"b",label:"→ Duration"},
        {key:"c",label:"→ Speed"},
        {key:"d",label:"→ Departure"},
      ]} />
      <ToolCard title="Travel Time Calculator" icon={Clock} iconColor="bg-sky-500">
        <div className="space-y-4">
          {(mode==="a"||mode==="b"||mode==="d") && (
            <TimeInput label={mode==="d"?"Arrival Time":"Departure Time"}
              hour={mode==="d"?arrH:depH} min={mode==="d"?arrM:depM} ampm={mode==="d"?arrAp:depAp}
              onHour={mode==="d"?setArrH:setDepH} onMin={mode==="d"?setArrM:setDepM} onAmpm={mode==="d"?setArrAp:setDepAp} />
          )}
          {(mode==="b") && (
            <TimeInput label="Arrival Time" hour={arrH} min={arrM} ampm={arrAp} onHour={setArrH} onMin={setArrM} onAmpm={setArrAp} />
          )}
          {(mode==="a"||mode==="c") && (
            <UnitField label="Distance" value={dist} onChange={setDist} unit={distU} onUnitChange={setDistU} units={DIST_UNITS} />
          )}
          {(mode==="a"||mode==="c") && (
            <UnitField label={mode==="c"?"Travel Time (hours)":`Speed`} value={mode==="c"?durH:speed}
              onChange={mode==="c"?setDurH:setSpeed} unit={mode==="c"?"kmh":speedU}
              onUnitChange={mode==="c"?()=>{}:setSpeedU} units={mode==="c"?[{v:"kmh",l:"hrs",f:1}]:SPEED_UNITS}
              hint={mode==="c"?"Enter total hours":"Avg. speed"} />
          )}
          {mode==="d" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duration Hours" value={durH} onChange={setDurH} suffix="h" />
              <Field label="Duration Mins"  value={durM2} onChange={setDurM2} suffix="m" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stops / Breaks" value={stopTime} onChange={setStopTime} suffix="min" />
            <Field label="Traffic Delay"  value={delay}    onChange={setDelay}    suffix="min" />
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        {mode==="a" && (
          <div className="space-y-1">
            <Step label="Travel time (driving)" value={fmtDur(distKm/spdKmh*60)} />
            <Step label="Stops + delays" value={`+ ${fmtDur(extraMins)}`} />
            <Highlight label="Estimated Arrival" value={fmt12(Math.floor((depMins+travelMins)/60)%24, Math.round((depMins+travelMins)%60))} />
          </div>
        )}
        {mode==="b" && (() => {
          let diff = arrMins - depMins; if(diff<0) diff+=1440;
          return (
            <div className="space-y-1">
              <Highlight label="Travel Duration" value={fmtDur(diff)} />
            </div>
          );
        })()}
        {mode==="c" && (() => {
          const hrs = (parseInt(durH)||1); const avgKmh = distKm/hrs;
          return (
            <div className="space-y-1">
              <Step label="Distance" value={`${n1(distKm)} km`} />
              <Step label="Time" value={`${durH} hours`} />
              <Highlight label="Average Speed" value={`${n1(avgKmh)} km/h  ·  ${n1(frmKmh(avgKmh,"mph"))} mph`} />
            </div>
          );
        })()}
        {mode==="d" && (() => {
          const depCalcMins = arrMins - durMinsInput; 
          const d24h = Math.floor(((depCalcMins%1440)+1440)%1440/60);
          const d24m = Math.round(((depCalcMins%1440)+1440)%1440%60);
          return (
            <div className="space-y-1">
              <Step label="Duration + extras" value={fmtDur(durMinsInput)} />
              <Highlight label="Latest Departure" value={fmt12(d24h, d24m)} />
            </div>
          );
        })()}
      </ToolCard>
    </div>
  );
}

// ─── 2. Train Calculator ──────────────────────────────────────────────────────
function TrainCalc() {
  const [mode, setMode] = useState("a");
  const [dist, setDist] = useState("450"); const [distU, setDistU] = useState("km");
  const [depH, setDepH] = useState("06"); const [depM, setDepM] = useState("00"); const [depAp, setDepAp] = useState("AM");
  const [travelH, setTravelH] = useState("6");
  const [speed, setSpeed] = useState("75"); const [speedU, setSpeedU] = useState("kmh");
  const [stops, setStops] = useState("3");
  const [stopDur, setStopDur] = useState("5");
  const [delay, setDelay] = useState("0");

  const distKm  = toKm(parseFloat(dist)||0, distU);
  const spdKmh  = toKmh(parseFloat(speed)||1, speedU);
  const hrs     = parseFloat(travelH)||1;
  const stopMin = (parseInt(stops)||0)*(parseInt(stopDur)||5);
  const delayMin= parseInt(delay)||0;
  const dep24   = to24(parseInt(depH)||6, parseInt(depM)||0, depAp);
  const depMins = dep24.h*60+dep24.m;

  const calcSpeed   = distKm/hrs;
  const calcTimeMins= distKm/spdKmh*60 + stopMin;
  const arrMinsA    = depMins + calcTimeMins + delayMin;
  const scheduleArr = depMins + calcTimeMins;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} modes={[
        {key:"a",label:"→ Speed"},
        {key:"b",label:"→ Time"},
        {key:"c",label:"→ Arrival"},
        {key:"d",label:"Delay Adjust"},
      ]} />
      <ToolCard title="Train Schedule Calculator" icon={Train} iconColor="bg-blue-600">
        <div className="space-y-4">
          <UnitField label="Distance" value={dist} onChange={setDist} unit={distU} onUnitChange={setDistU} units={DIST_UNITS} />
          {(mode==="a") && <Field label="Total Journey Time" value={travelH} onChange={setTravelH} suffix="hours" hint="e.g. 6 for 6 hours" />}
          {(mode==="b"||mode==="c"||mode==="d") && (
            <UnitField label="Train Speed" value={speed} onChange={setSpeed} unit={speedU} onUnitChange={setSpeedU} units={SPEED_UNITS} hint="Average speed" />
          )}
          {(mode==="c"||mode==="d") && (
            <TimeInput label="Departure Time" hour={depH} min={depM} ampm={depAp} onHour={setDepH} onMin={setDepM} onAmpm={setDepAp} />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Station Stops" value={stops} onChange={setStops} suffix="stops" />
            <Field label="Time per Stop" value={stopDur} onChange={setStopDur} suffix="min" />
          </div>
          {mode==="d" && <Field label="Delay" value={delay} onChange={setDelay} suffix="min" />}
        </div>
      </ToolCard>
      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        {mode==="a" && (
          <div className="space-y-1">
            <Step label="Distance" value={`${n1(distKm)} km`} />
            <Step label="Journey time" value={`${travelH} h`} />
            <Highlight label="Average Train Speed" value={`${n1(calcSpeed)} km/h`} sub={`${n1(frmKmh(calcSpeed,"mph"))} mph`} />
          </div>
        )}
        {mode==="b" && (
          <div className="space-y-1">
            <Step label="Driving time" value={fmtDur(distKm/spdKmh*60)} />
            <Step label="Station stops" value={`+${fmtDur(stopMin)}`} />
            <Highlight label="Total Travel Time" value={fmtDur(calcTimeMins)} />
          </div>
        )}
        {mode==="c" && (() => {
          const arrH = Math.floor(((arrMinsA%1440)+1440)%1440/60);
          const arrM = Math.round(((arrMinsA%1440)+1440)%1440%60);
          return (
            <div className="space-y-1">
              <Step label="Travel + stops" value={fmtDur(calcTimeMins)} />
              <Highlight label="Scheduled Arrival" value={fmt12(Math.floor(scheduleArr/60)%24, Math.round(scheduleArr%60))} />
            </div>
          );
        })()}
        {mode==="d" && (() => {
          const newArr = arrMinsA;
          return (
            <div className="space-y-1">
              <Step label="Scheduled arrival" value={fmt12(Math.floor(scheduleArr/60)%24, Math.round(scheduleArr%60))} />
              <Step label="Delay" value={`+${delay} min`} />
              <Highlight label="New Arrival (with delay)" value={fmt12(Math.floor(((newArr%1440)+1440)%1440/60), Math.round(((newArr%1440)+1440)%1440%60))} color="text-red-400" />
            </div>
          );
        })()}
      </ToolCard>
    </div>
  );
}

// ─── 3. Trip Fuel Cost Calculator ────────────────────────────────────────────
function FuelCostCalc() {
  const [mode, setMode] = useState("a");
  const [dist, setDist] = useState("500"); const [distU, setDistU] = useState("km");
  const [mileage, setMileage] = useState("15"); const [mileU, setMileU] = useState("km");
  const [fuelPrice, setFuelPrice] = useState("105");
  const [currency, setCurrency] = useState("₹");
  const [fuelType, setFuelType] = useState("petrol");
  const [priceUnit, setPriceUnit] = useState("L");
  const [budget, setBudget] = useState("500");
  const [fuelAvail, setFuelAvail] = useState("30"); const [fuelAvailU, setFuelAvailU] = useState("L");
  const [roundTrip, setRoundTrip] = useState(false);

  const FUEL_VOL = [{v:"L",l:"L",f:1},{v:"gal",l:"gal",f:3.78541},{v:"kg",l:"kg",f:1}];
  const distKm    = toKm(parseFloat(dist)||0, distU) * (roundTrip?2:1);
  const mpLInKm   = parseFloat(mileage)||1;
  const price     = parseFloat(fuelPrice)||0;
  const fuelNeeded= distKm / mpLInKm;
  const tripCost  = fuelNeeded * price;
  const maxDist   = (parseFloat(budget)||0) / price * mpLInKm;
  const distFromFuel = toBase(parseFloat(fuelAvail)||0, fuelAvailU, FUEL_VOL) * mpLInKm;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} modes={[
        {key:"a",label:"Trip Cost"},
        {key:"b",label:"Budget → Dist"},
        {key:"c",label:"Fuel → Dist"},
      ]} color="bg-orange-500" />
      <ToolCard title="Trip Fuel Cost Calculator" icon={Fuel} iconColor="bg-orange-500">
        <div className="space-y-4">
          {mode==="a" && <UnitField label="Trip Distance" value={dist} onChange={setDist} unit={distU} onUnitChange={setDistU} units={DIST_UNITS} />}
          {mode==="b" && (
            <div className="flex gap-2">
              <div className="w-20"><Field label="Currency" value={currency} onChange={setCurrency} /></div>
              <div className="flex-1"><Field label="Budget" value={budget} onChange={setBudget} /></div>
            </div>
          )}
          {mode==="c" && (
            <UnitField label="Fuel Available" value={fuelAvail} onChange={setFuelAvail} unit={fuelAvailU} onUnitChange={setFuelAvailU} units={FUEL_VOL} />
          )}
          <SelectField label="Fuel Type" value={fuelType} onChange={setFuelType} options={[
            {value:"petrol",   label:"Petrol"},
            {value:"diesel",   label:"Diesel"},
            {value:"cng",      label:"CNG"},
            {value:"electric", label:"Electric (per kWh)"},
            {value:"lpg",      label:"LPG"},
          ]} />
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Mileage`} value={mileage} onChange={setMileage} suffix={`km/${fuelType==="cng"?"kg":fuelType==="electric"?"kWh":"L"}`} />
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">
                {fuelType==="electric"?"Elec Price":"Fuel Price"}
              </label>
              <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
                <input type="number" value={fuelPrice} onChange={e=>setFuelPrice(e.target.value)}
                  className="flex-1 min-w-0 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none" />
                <select value={currency} onChange={e=>setCurrency(e.target.value)}
                  className="bg-muted border-l border-border px-2 py-2.5 text-sm font-bold text-muted-foreground focus:outline-none cursor-pointer">
                  {["₹","$","€","£","¥","AED","SGD","BDT","NPR","PKR"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          {mode==="a" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={roundTrip} onChange={e=>setRoundTrip(e.target.checked)}
                className="w-4 h-4 rounded" data-testid="input-round-trip" />
              <span className="text-sm text-muted-foreground">Round Trip</span>
            </label>
          )}
        </div>
      </ToolCard>
      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        {mode==="a" && (
          <div className="space-y-1">
            <Step label={`Distance${roundTrip?" (×2)":""}`} value={`${n1(distKm)} km`} />
            <Step label="Fuel Needed" value={`${n1(fuelNeeded)} ${fuelType==="cng"?"kg":fuelType==="electric"?"kWh":"L"}`} />
            <Step label="Fuel Rate" value={`${currency}${fuelPrice}/${fuelType==="cng"?"kg":fuelType==="electric"?"kWh":"L"}`} />
            <Highlight label="Total Fuel Cost" value={`${currency}${Math.ceil(tripCost)}`} color="text-orange-400" />
          </div>
        )}
        {mode==="b" && (
          <div className="space-y-1">
            <Step label="Budget" value={`${currency}${budget}`} />
            <Step label="Mileage" value={`${mileage} km/unit`} />
            <Highlight label="Max Distance" value={`${n1(maxDist)} km  ·  ${n1(frmKm(maxDist,"mi"))} mi`} color="text-orange-400" />
          </div>
        )}
        {mode==="c" && (
          <div className="space-y-1">
            <Step label="Fuel Available" value={`${fuelAvail} ${fuelAvailU}`} />
            <Step label="Mileage" value={`${mileage} km/unit`} />
            <Highlight label="Distance Possible" value={`${n1(distFromFuel)} km`} color="text-orange-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

// ─── 4. Luggage Weight Calculator ────────────────────────────────────────────
function LuggageCalc() {
  const [bags, setBags] = useState([
    {name:"Bag 1", weight:"12", unit:"kg"},
    {name:"Bag 2", weight:"8",  unit:"kg"},
  ]);
  const [limit, setLimit] = useState("25"); const [limitU, setLimitU] = useState("kg");
  const [fee, setFee] = useState("600");
  const [currency, setCurrency] = useState("₹");
  const [airline, setAirline] = useState("indigo");

  const airlines: Record<string,{name:string;limit:number;fee:number;currency:string}> = {
    indigo:  {name:"IndiGo",          limit:15, fee:600,  currency:"₹"},
    airindia:{name:"Air India",       limit:25, fee:800,  currency:"₹"},
    spicejet:{name:"SpiceJet",        limit:15, fee:650,  currency:"₹"},
    emirates:{name:"Emirates",        limit:30, fee:12,   currency:"$"},
    airuae:  {name:"Air Arabia",      limit:20, fee:10,   currency:"$"},
    indigo23:{name:"IndiGo (Check-in)",limit:23,fee:600,  currency:"₹"},
    economy: {name:"International Economy",limit:23,fee:15,currency:"$"},
    custom:  {name:"Custom",          limit:parseFloat(limit)||0,fee:parseFloat(fee)||0,currency},
  };

  const handleAirlineChange = (a:string) => {
    setAirline(a);
    if(a!=="custom") {
      const al = airlines[a];
      setLimit(al.limit.toString());
      setFee(al.fee.toString());
      setCurrency(al.currency);
    }
  };

  const UNITS = [{v:"kg",l:"kg",f:1},{v:"lb",l:"lb",f:0.453592},{v:"g",l:"g",f:0.001}];
  const totalKg   = bags.reduce((sum,b) => sum + toKg(parseFloat(b.weight)||0, b.unit), 0);
  const limitKg   = toKg(parseFloat(limit)||0, limitU);
  const excessKg  = Math.max(0, totalKg - limitKg);
  const feeTotal  = excessKg * (parseFloat(fee)||0);
  const within    = totalKg <= limitKg;

  const addBag = () => setBags(prev=>[...prev,{name:`Bag ${prev.length+1}`,weight:"5",unit:"kg"}]);
  const removeBag = (i:number) => setBags(prev=>prev.filter((_,idx)=>idx!==i));
  const updateBag = (i:number, field:string, value:string) => setBags(prev=>prev.map((b,idx)=>idx===i?{...b,[field]:value}:b));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Luggage Weight Calculator" icon={Luggage} iconColor="bg-violet-500">
        <div className="space-y-4">
          <SelectField label="Airline Preset" value={airline} onChange={handleAirlineChange}
            options={Object.entries(airlines).map(([k,v])=>({value:k,label:v.name}))} />
          <div className="grid grid-cols-2 gap-3">
            <UnitField label="Baggage Limit" value={limit} onChange={setLimit} unit={limitU} onUnitChange={setLimitU} units={UNITS} />
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">Overweight Fee / kg</label>
              <div className="flex rounded-xl border border-border overflow-hidden">
                <input type="number" value={fee} onChange={e=>setFee(e.target.value)}
                  className="flex-1 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none" />
                <select value={currency} onChange={e=>setCurrency(e.target.value)}
                  className="bg-muted border-l border-border px-2 py-2.5 text-sm font-bold text-muted-foreground focus:outline-none">
                  {["₹","$","€","£","AED"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Bags</p>
              <button onClick={addBag} className="flex items-center gap-1 px-3 py-1 bg-sky-500 text-white rounded-lg text-xs font-bold" data-testid="button-add-bag">
                <Plus className="w-3 h-3" /> Add Bag
              </button>
            </div>
            <div className="space-y-2">
              {bags.map((bag,i)=>(
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Field label={`Bag ${i+1} Name`} value={bag.name} onChange={v=>updateBag(i,"name",v)} type="text" />
                  </div>
                  <div className="w-36">
                    <UnitField label="Weight" value={bag.weight} onChange={v=>updateBag(i,"weight",v)}
                      unit={bag.unit} onUnitChange={v=>updateBag(i,"unit",v)} units={UNITS} />
                  </div>
                  <button onClick={()=>removeBag(i)} className="mb-0.5 p-2.5 text-red-400 hover:bg-red-500/20 rounded-lg" data-testid={`button-remove-bag-${i}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Weight Summary" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-1">
          {bags.map((b,i)=>(
            <Step key={i} label={b.name||`Bag ${i+1}`} value={`${b.weight} ${b.unit}  (${n2(toKg(parseFloat(b.weight)||0,b.unit))} kg)`} />
          ))}
          <div className="border-t border-border pt-2 mt-2">
            <Step label="Total Weight" value={`${n2(totalKg)} kg  ·  ${n2(frmKg(totalKg,"lb"))} lb`} />
            <Step label="Allowed Limit" value={`${limit} ${limitU}  (${n2(limitKg)} kg)`} />
          </div>
          {within ? (
            <div className="bg-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-sm font-semibold mt-2">
              ✓ Within limit — {n2(limitKg-totalKg)} kg spare
            </div>
          ) : (
            <div className="space-y-1">
              <Highlight label={`Excess Weight`} value={`${n2(excessKg)} kg over`} color="text-red-400" sub={`Overweight fee: ${currency}${Math.ceil(feeTotal)}`} />
            </div>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

// ─── 5. Distance Converter ───────────────────────────────────────────────────
function DistanceConverter() {
  const [val, setVal] = useState("100");
  const [fromU, setFromU] = useState("km");

  const UNITS_EXT = [
    {v:"km",   l:"Kilometre",     f:1},
    {v:"mi",   l:"Mile",          f:1.60934},
    {v:"m",    l:"Metre",         f:0.001},
    {v:"ft",   l:"Foot",          f:0.000304800},
    {v:"in",   l:"Inch",          f:0.0000254},
    {v:"cm",   l:"Centimetre",    f:0.00001},
    {v:"yd",   l:"Yard",          f:0.0009144},
    {v:"nmi",  l:"Nautical Mile", f:1.852},
    {v:"league",l:"League",       f:4.828},
  ];
  const baseKm = toBase(parseFloat(val)||0, fromU, UNITS_EXT);
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Distance Converter" icon={Route} iconColor="bg-teal-500">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">Enter Value</label>
            <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
              <input type="number" value={val} onChange={e=>setVal(e.target.value)}
                className="flex-1 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none" />
              <select value={fromU} onChange={e=>setFromU(e.target.value)}
                className="bg-muted border-l border-border px-2 py-2.5 text-sm font-bold text-muted-foreground focus:outline-none cursor-pointer">
                {UNITS_EXT.map(u=><option key={u.v} value={u.v}>{u.l}</option>)}
              </select>
            </div>
          </div>
        </div>
      </ToolCard>
      <ToolCard title="All Conversions" icon={ArrowRightLeft} iconColor="bg-emerald-500">
        <div className="space-y-1">
          {UNITS_EXT.filter(u=>u.v!==fromU).map(u=>(
            <Step key={u.v} label={u.l} value={`${parseFloat((baseKm/u.f).toPrecision(6))} ${u.v}`} />
          ))}
        </div>
      </ToolCard>
    </div>
  );
}

// ─── 6. Time Zone Converter ───────────────────────────────────────────────────
function TimeZoneConverter() {
  const [hour, setHour] = useState("10"); const [min, setMin] = useState("00"); const [ampm, setAmpm] = useState("AM");
  const [fromZ, setFromZ] = useState("IST — India (New Delhi, Mumbai, Kolkata)");
  const [toZ, setToZ] = useState("GMT / WET — London (winter)");

  const fOffset = ZONES.find(z=>z.l===fromZ)?.o ?? 5.5;
  const tOffset = ZONES.find(z=>z.l===toZ)?.o ?? 0;
  const {h: h24, m: m24} = to24(parseInt(hour)||12, parseInt(min)||0, ampm);
  const totalMins = h24*60 + m24;
  const utcMins   = totalMins - fOffset*60;
  let destMins    = utcMins + tOffset*60;
  const nextDay   = destMins >= 1440 || destMins < 0;
  destMins        = ((destMins%1440)+1440)%1440;
  const dH = Math.floor(destMins/60);
  const dM = Math.round(destMins%60);
  const diffH = tOffset - fOffset;
  const diffLabel = diffH===0?"Same time": diffH>0?`+${diffH} hrs`:`${diffH} hrs`;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Time Zone Converter" icon={Globe} iconColor="bg-indigo-500">
        <div className="space-y-4">
          <SelectField label="From Time Zone" value={fromZ} onChange={setFromZ}
            options={ZONES.map(z=>({value:z.l,label:`UTC${z.o>=0?"+":""}${z.o}  ${z.l}`}))} />
          <TimeInput label="Time" hour={hour} min={min} ampm={ampm} onHour={setHour} onMin={setMin} onAmpm={setAmpm} />
          <SelectField label="To Time Zone" value={toZ} onChange={setToZ}
            options={ZONES.map(z=>({value:z.l,label:`UTC${z.o>=0?"+":""}${z.o}  ${z.l}`}))} />
        </div>
      </ToolCard>
      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-1">
          <Step label="Input time" value={`${fmt12(h24, m24)}  (UTC${fOffset>=0?"+":""}${fOffset})`} />
          <Step label="UTC time" value={fmt12(Math.floor(((utcMins%1440)+1440)%1440/60), Math.round(((utcMins%1440)+1440)%1440%60))} />
          <Step label="Offset difference" value={diffLabel} />
          {nextDay && <p className="text-xs text-amber-400 font-medium">⚠ Time crosses midnight (next/previous day)</p>}
          <Highlight label={toZ.split("—")[0].trim()} value={fmt12(dH, dM)} color="text-indigo-400" />
        </div>
      </ToolCard>
      <ToolCard title="Quick Reference: IST to World" icon={Map} iconColor="bg-sky-500">
        <div className="space-y-1">
          {[
            {l:"London (GMT)",o:0},{l:"Dubai",o:4},{l:"Singapore",o:8},
            {l:"Tokyo",o:9},{l:"New York (EST)",o:-5},{l:"New York (EDT)",o:-4},
            {l:"Los Angeles (PST)",o:-8},{l:"Sydney (AEST)",o:10},
          ].map(z=>{
            let dest = totalMins - fOffset*60 + z.o*60;
            dest = ((dest%1440)+1440)%1440;
            return <Step key={z.l} label={z.l} value={fmt12(Math.floor(dest/60), Math.round(dest%60))} />;
          })}
        </div>
      </ToolCard>
    </div>
  );
}

// ─── 7. Flight Duration Calculator ───────────────────────────────────────────
function FlightCalc() {
  const [mode, setMode] = useState("a");
  const [dist, setDist] = useState("7000"); const [distU, setDistU] = useState("km");
  const [speed, setSpeed] = useState("850"); const [speedU, setSpeedU] = useState("kmh");
  const [depH, setDepH] = useState("10"); const [depM, setDepM] = useState("00"); const [depAp, setDepAp] = useState("AM");
  const [durH, setDurH] = useState("8"); const [durM2, setDurM2] = useState("14");
  const [fromZ, setFromZ] = useState("IST — India (New Delhi, Mumbai, Kolkata)");
  const [toZ, setToZ] = useState("GMT / WET — London (winter)");

  const distKm   = toKm(parseFloat(dist)||0, distU);
  const spdKmh   = toKmh(parseFloat(speed)||850, speedU);
  const flightMins= distKm/spdKmh*60;
  const flightH  = Math.floor(flightMins/60), flightM = Math.round(flightMins%60);

  const dep24 = to24(parseInt(depH)||12, parseInt(depM)||0, depAp);
  const depMins = dep24.h*60+dep24.m;
  const fOffset = ZONES.find(z=>z.l===fromZ)?.o ?? 5.5;
  const tOffset = ZONES.find(z=>z.l===toZ)?.o ?? 0;

  const durMinsInput = (parseInt(durH)||0)*60+(parseInt(durM2)||0);
  const arrAtDep = depMins + (mode==="a"?flightMins:durMinsInput);
  const arrUTC   = arrAtDep - fOffset*60;
  const arrLocal = ((arrUTC + tOffset*60)%1440+1440)%1440;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} modes={[
        {key:"a",label:"Dist → Duration"},
        {key:"b",label:"Dep + Dur → Arrival"},
        {key:"c",label:"With Timezones"},
      ]} color="bg-sky-600" />
      <ToolCard title="Flight Duration Calculator" icon={Plane} iconColor="bg-sky-600">
        <div className="space-y-4">
          <UnitField label="Flight Distance" value={dist} onChange={setDist} unit={distU} onUnitChange={setDistU} units={DIST_UNITS} />
          <UnitField label="Aircraft Speed" value={speed} onChange={setSpeed} unit={speedU} onUnitChange={setSpeedU} units={SPEED_UNITS} hint="Commercial jet: ~850–950 km/h" />
          {(mode==="b"||mode==="c") && (
            <TimeInput label="Departure Time" hour={depH} min={depM} ampm={depAp} onHour={setDepH} onMin={setDepM} onAmpm={setDepAp} />
          )}
          {mode==="b" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Flight Hours"   value={durH}  onChange={setDurH}  suffix="h" />
              <Field label="Flight Minutes" value={durM2} onChange={setDurM2} suffix="m" />
            </div>
          )}
          {mode==="c" && (
            <>
              <SelectField label="Departure Timezone" value={fromZ} onChange={setFromZ}
                options={ZONES.map(z=>({value:z.l,label:`UTC${z.o>=0?"+":""}${z.o}  ${z.l}`}))} />
              <SelectField label="Arrival Timezone" value={toZ} onChange={setToZ}
                options={ZONES.map(z=>({value:z.l,label:`UTC${z.o>=0?"+":""}${z.o}  ${z.l}`}))} />
            </>
          )}
        </div>
      </ToolCard>
      <ToolCard title="Result" icon={Calculator} iconColor="bg-emerald-500">
        {mode==="a" && (
          <div className="space-y-1">
            <Step label="Distance" value={`${n0(distKm)} km  ·  ${n0(frmKm(distKm,"mi"))} mi`} />
            <Step label="Speed" value={`${speed} ${speedU}`} />
            <Highlight label="Flight Duration" value={`${flightH}h ${flightM}m`} />
          </div>
        )}
        {mode==="b" && (
          <div className="space-y-1">
            <Step label="Departure" value={fmt12(dep24.h, dep24.m)} />
            <Step label="Flight time" value={`${durH}h ${durM2}m`} />
            <Highlight label="Arrival (same timezone)" value={fmt12(Math.floor(((depMins+durMinsInput)%1440)/60), Math.round((depMins+durMinsInput)%1440%60))} />
          </div>
        )}
        {mode==="c" && (
          <div className="space-y-1">
            <Step label="Departure" value={`${fmt12(dep24.h, dep24.m)}  (${fromZ.split("—")[0].trim()})`} />
            <Step label="Flight time" value={`${flightH}h ${flightM}m`} />
            <Step label="Timezone change" value={`${tOffset-fOffset>=0?"+":""}${tOffset-fOffset} hrs`} />
            <Highlight label={`Arrival — ${toZ.split("—")[0].trim()}`} value={fmt12(Math.floor(arrLocal/60), Math.round(arrLocal%60))} color="text-sky-400" />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

// ─── 8. Packing List Weight Planner ──────────────────────────────────────────
function PackingList() {
  const [items, setItems] = useState([
    {name:"Laptop",  weight:"1.8", unit:"kg"},
    {name:"Clothes", weight:"3",   unit:"kg"},
    {name:"Shoes",   weight:"1",   unit:"kg"},
  ]);
  const [limit, setLimit] = useState("7"); const [limitU, setLimitU] = useState("kg");
  const [newName, setNewName] = useState("");
  const [newW, setNewW] = useState("0.5"); const [newWU, setNewWU] = useState("kg");

  const UNITS = [{v:"kg",l:"kg",f:1},{v:"lb",l:"lb",f:0.453592},{v:"g",l:"g",f:0.001}];
  const totalKg = items.reduce((s,it)=>s+toKg(parseFloat(it.weight)||0,it.unit),0);
  const limitKg = toKg(parseFloat(limit)||0, limitU);
  const pct     = limitKg>0 ? Math.min(100,(totalKg/limitKg)*100) : 0;

  const addItem = () => {
    if(!newName.trim()) return;
    setItems(prev=>[...prev,{name:newName.trim(),weight:newW,unit:newWU}]);
    setNewName(""); setNewW("0.5");
  };
  const removeItem = (i:number) => setItems(prev=>prev.filter((_,idx)=>idx!==i));
  const updateItem = (i:number, f:string, v:string) => setItems(prev=>prev.map((it,idx)=>idx===i?{...it,[f]:v}:it));

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Packing List Weight Planner" icon={Package} iconColor="bg-purple-500">
        <div className="space-y-4">
          <UnitField label="Weight Limit (cabin / check-in)" value={limit} onChange={setLimit} unit={limitU} onUnitChange={setLimitU} units={UNITS} />
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items ({items.length})</p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((it,i)=>(
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Field label="Item" value={it.name} onChange={v=>updateItem(i,"name",v)} type="text" />
                  </div>
                  <div className="w-36">
                    <UnitField label="Weight" value={it.weight} onChange={v=>updateItem(i,"weight",v)}
                      unit={it.unit} onUnitChange={v=>updateItem(i,"unit",v)} units={UNITS} />
                  </div>
                  <button onClick={()=>removeItem(i)} className="mb-0.5 p-2.5 text-red-400 hover:bg-red-500/20 rounded-lg" data-testid={`button-remove-item-${i}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl p-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Add New Item</p>
            <Field label="Item Name" value={newName} onChange={setNewName} type="text" hint="e.g. Laptop, Clothes" />
            <UnitField label="Weight" value={newW} onChange={setNewW} unit={newWU} onUnitChange={setNewWU} units={UNITS} />
            <button onClick={addItem}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-semibold"
              data-testid="button-add-item">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Weight Summary" icon={Scale} iconColor="bg-emerald-500">
        <div className="space-y-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold">{n2(totalKg)} kg / {n2(limitKg)} kg</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${pct>100?"bg-red-500":pct>85?"bg-amber-400":"bg-emerald-500"}`}
              style={{width:`${Math.min(100,pct)}%`}} />
          </div>
          <div className="space-y-1">
            {items.map((it,i)=>(
              <Step key={i} label={it.name||`Item ${i+1}`} value={`${it.weight} ${it.unit}  (${n2(toKg(parseFloat(it.weight)||0,it.unit))} kg)`} />
            ))}
            <div className="border-t border-border pt-2">
              <Step label="Total" value={`${n2(totalKg)} kg  ·  ${n2(frmKg(totalKg,"lb"))} lb`} />
            </div>
          </div>
          {totalKg <= limitKg ? (
            <div className="bg-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-sm font-semibold">
              ✓ OK — {n2(limitKg-totalKg)} kg remaining
            </div>
          ) : (
            <div className="bg-red-500/20 text-red-400 rounded-xl p-3 text-center text-sm font-semibold">
              ✗ Over limit by {n2(totalKg-limitKg)} kg — remove some items
            </div>
          )}
        </div>
      </ToolCard>
    </div>
  );
}

// ─── 9. Vehicle Range Calculator ─────────────────────────────────────────────
function VehicleRange() {
  const [mode, setMode] = useState("fuel");
  const [fuel, setFuel] = useState("10"); const [fuelU, setFuelU] = useState("L");
  const [eff, setEff] = useState("20"); const [effU, setEffU] = useState("kmh");
  const [battery, setBattery] = useState("60");
  const [evEff, setEvEff] = useState("6");
  const [vehicle, setVehicle] = useState("car");

  const FUEL_U = [{v:"L",l:"L",f:1},{v:"gal",l:"gal",f:3.78541}];
  const EFF_U  = [{v:"kmh",l:"km/L",f:1},{v:"mph",l:"mi/gal",f:1.60934/3.78541},{v:"kmkg",l:"km/kg",f:1}];

  const fuelL   = toBase(parseFloat(fuel)||0, fuelU, FUEL_U);
  const effKmL  = toBase(parseFloat(eff)||1, effU, EFF_U);
  const rangeKm = mode==="fuel" ? fuelL*effKmL : (parseFloat(battery)||0)*(parseFloat(evEff)||1);

  const presets: Record<string,{fuel:string;eff:string;label:string}> = {
    bike:   {fuel:"5",  eff:"45",label:"Bike (~45 km/L)"},
    scooter:{fuel:"5",  eff:"40",label:"Scooter (~40 km/L)"},
    car:    {fuel:"10", eff:"20",label:"Car (~20 km/L)"},
    suv:    {fuel:"12", eff:"15",label:"SUV (~15 km/L)"},
    bus:    {fuel:"50", eff:"6", label:"Bus (~6 km/L)"},
    truck:  {fuel:"80", eff:"5", label:"Truck (~5 km/L)"},
  };
  const handleVehicle = (v:string) => {
    setVehicle(v);
    const p = presets[v];
    setFuel(p.fuel); setEff(p.eff);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ModeToggle mode={mode} onChange={setMode} modes={[
        {key:"fuel",    label:"Petrol / Diesel"},
        {key:"electric",label:"Electric (EV)"},
      ]} color="bg-green-500" />
      <ToolCard title="Vehicle Range Calculator" icon={Gauge} iconColor="bg-green-500">
        <div className="space-y-4">
          {mode==="fuel" ? (
            <>
              <SelectField label="Vehicle Type (presets)" value={vehicle} onChange={handleVehicle}
                options={Object.entries(presets).map(([k,v])=>({value:k,label:v.label}))} />
              <UnitField label="Fuel Available" value={fuel} onChange={setFuel} unit={fuelU} onUnitChange={setFuelU} units={FUEL_U} />
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">Fuel Efficiency</label>
                <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
                  <input type="number" value={eff} onChange={e=>setEff(e.target.value)}
                    className="flex-1 bg-muted/50 px-3 py-2.5 text-foreground text-sm focus:outline-none" />
                  <select value={effU} onChange={e=>setEffU(e.target.value)}
                    className="bg-muted border-l border-border px-2 py-2.5 text-sm font-bold text-muted-foreground focus:outline-none cursor-pointer">
                    <option value="kmh">km/L</option>
                    <option value="mph">mi/gal</option>
                    <option value="kmkg">km/kg (CNG)</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <Field label="Battery Capacity (kWh)" value={battery} onChange={setBattery} suffix="kWh" hint="e.g. Tata Nexon EV = 30 kWh" />
              <Field label="Efficiency (km/kWh)" value={evEff} onChange={setEvEff} suffix="km/kWh" hint="Typical EV: 5–8 km/kWh" />
            </>
          )}
        </div>
      </ToolCard>
      <ToolCard title="Range Result" icon={Calculator} iconColor="bg-emerald-500">
        <div className="space-y-1">
          {mode==="fuel" ? (
            <>
              <Step label="Fuel available" value={`${fuel} ${fuelU}`} />
              <Step label="Efficiency" value={`${eff} ${effU==="kmh"?"km/L":effU==="mph"?"mi/gal":"km/kg"}`} />
            </>
          ) : (
            <>
              <Step label="Battery capacity" value={`${battery} kWh`} />
              <Step label="Efficiency" value={`${evEff} km/kWh`} />
            </>
          )}
          <Highlight label="Estimated Range" value={`${n0(rangeKm)} km  ·  ${n0(frmKm(rangeKm,"mi"))} mi`} color="text-green-400" />
        </div>
      </ToolCard>
    </div>
  );
}

// ─── 10. Fuel Cost & Mileage Comparison ──────────────────────────────────────
function FuelCompare() {
  const [currency, setCurrency] = useState("₹");
  const [tripDist, setTripDist] = useState("300");
  const [dailyDist, setDailyDist] = useState("40");
  const [cngKit, setCngKit] = useState("60000");

  const [fuels, setFuels] = useState([
    {type:"Petrol",   on:true,  price:"105", mileage:"15",  unit:"km/L"},
    {type:"Diesel",   on:true,  price:"95",  mileage:"20",  unit:"km/L"},
    {type:"CNG",      on:true,  price:"80",  mileage:"25",  unit:"km/kg"},
    {type:"Electric", on:false, price:"8",   mileage:"6",   unit:"km/kWh"},
    {type:"LPG",      on:false, price:"60",  mileage:"14",  unit:"km/L"},
  ]);
  const updateFuel = (i:number, f:string, v:string|boolean) =>
    setFuels(prev=>prev.map((fl,idx)=>idx===i?{...fl,[f]:v}:fl));

  const dist  = parseFloat(tripDist)||0;
  const daily = parseFloat(dailyDist)||0;

  const results = fuels.filter(f=>f.on).map(f=>{
    const p = parseFloat(f.price)||1;
    const m = parseFloat(f.mileage)||1;
    const costPerKm   = p/m;
    const tripCost    = dist*costPerKm;
    const monthlyCost = daily*30*costPerKm;
    return {...f, costPerKm, tripCost, monthlyCost};
  });

  const sorted   = [...results].sort((a,b)=>a.costPerKm-b.costPerKm);
  const cheapest = sorted[0];
  const dearest  = sorted[sorted.length-1];
  const savingsKm= cheapest && dearest ? dearest.costPerKm-cheapest.costPerKm : 0;
  const breakEven= cheapest && savingsKm>0 ? parseFloat(cngKit)/savingsKm : 0;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <ToolCard title="Fuel Cost & Mileage Comparison" icon={Scale} iconColor="bg-emerald-600">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="w-20">
              <label className="text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide">Currency</label>
              <select value={currency} onChange={e=>setCurrency(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none text-sm">
                {["₹","$","€","£","AED","SGD"].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <Field label="Trip Distance" value={tripDist} onChange={setTripDist} suffix="km" />
            </div>
            <div className="flex-1">
              <Field label="Daily Travel" value={dailyDist} onChange={setDailyDist} suffix="km" />
            </div>
          </div>
          {fuels.map((f,i)=>(
            <div key={f.type} className={`rounded-xl border p-3 space-y-2 transition-all ${f.on?"border-border":"border-border/30 opacity-50"}`}>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={f.on} onChange={e=>updateFuel(i,"on",e.target.checked)}
                    className="w-4 h-4" data-testid={`input-${f.type.toLowerCase()}-toggle`} />
                  <span className="text-sm font-bold text-foreground">{f.type}</span>
                </label>
                <span className="text-xs text-muted-foreground">{f.unit}</span>
              </div>
              {f.on && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Price ({currency}/{f.unit==="km/kg"?"kg":f.unit==="km/kWh"?"kWh":"L"})</label>
                    <input type="number" value={f.price} onChange={e=>updateFuel(i,"price",e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Mileage ({f.unit})</label>
                    <input type="number" value={f.mileage} onChange={e=>updateFuel(i,"mileage",e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ToolCard>
      {results.length > 0 && (
        <>
          <ToolCard title="Cost per km Comparison" icon={Calculator} iconColor="bg-sky-500">
            <div className="space-y-1">
              {sorted.map((f,i)=>(
                <div key={f.type} className={`flex justify-between items-center py-2 border-b border-border/40 last:border-0 ${i===0?"text-emerald-400":""}`}>
                  <span className="text-sm font-medium">{i===0?"🏆 ":""}{f.type}</span>
                  <div className="text-right">
                    <span className="font-bold text-sm">{currency}{f.costPerKm.toFixed(2)}/km</span>
                  </div>
                </div>
              ))}
            </div>
          </ToolCard>
          <ToolCard title="Trip & Monthly Cost" icon={Fuel} iconColor="bg-orange-500">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground font-semibold uppercase mb-1">
                <span>Fuel</span><span className="text-right">Trip ({tripDist}km)</span><span className="text-right">Monthly ({dailyDist}km/day)</span>
              </div>
              {sorted.map((f,i)=>(
                <div key={f.type} className={`grid grid-cols-3 gap-1 py-1.5 border-b border-border/40 last:border-0 ${i===0?"text-emerald-400":""}`}>
                  <span className="text-sm font-medium">{f.type}</span>
                  <span className="text-right font-bold text-sm">{currency}{Math.ceil(f.tripCost)}</span>
                  <span className="text-right font-bold text-sm">{currency}{Math.ceil(f.monthlyCost)}</span>
                </div>
              ))}
            </div>
          </ToolCard>
          {cheapest && dearest && cheapest.type!==dearest.type && (
            <ToolCard title="Smart Recommendation" icon={Zap} iconColor="bg-yellow-500">
              <div className="space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Most Economical Fuel</p>
                  <p className="text-lg font-black text-emerald-400">🏆 {cheapest.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">Saves {currency}{savingsKm.toFixed(2)}/km vs {dearest.type}</p>
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Monthly Savings (if switching from {dearest.type})</p>
                  <p className="text-xl font-black text-sky-400">{currency}{Math.ceil((dearest.monthlyCost-cheapest.monthlyCost))}</p>
                </div>
                {cheapest.type==="CNG" && (
                  <div className="space-y-2">
                    <Field label={`CNG Kit Cost (${currency})`} value={cngKit} onChange={setCngKit} suffix={currency} />
                    <div className="bg-muted/40 rounded-xl p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Break-Even Distance</p>
                      <p className="text-xl font-black text-amber-400">{isFinite(breakEven)?`${n0(breakEven)} km`:"—"}</p>
                      <p className="text-xs text-muted-foreground mt-1">After this distance, CNG is cheaper overall</p>
                    </div>
                  </div>
                )}
              </div>
            </ToolCard>
          )}
        </>
      )}
    </div>
  );
}
