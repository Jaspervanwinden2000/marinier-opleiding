import React, { useState, useEffect, useMemo } from "react";

// ============================================================
//  COURSE MARINER — 8-MAANDEN VOORBEREIDING
//  Van 23 juni 2026 tot 5 februari 2027
// ============================================================

const START = new Date("2026-06-23");
const MARINER = new Date("2027-02-05");
const DAY = 86400000;

// ---- Fases over de 32 weken ----
const PHASES = [
  { name: "Basis & Volume", from: "2026-06-23", to: "2026-07-01", color: "#c0512f",
    focus: "Opbouw, techniek terughalen, lean bulk starten" },
  { name: "Vakantie — Vrienden", from: "2026-07-02", to: "2026-07-09", color: "#6b7b8c",
    focus: "Rust & deload. Genieten. Veel drinken = geen training. Hydrateer." },
  { name: "Vakantie — Spanje (familie)", from: "2026-07-10", to: "2026-07-22", color: "#3f7d8c",
    focus: "Lichte training: hardlopen, bodyweight, mobiliteit. Onderhoud." },
  { name: "Hypertrofie & Kracht", from: "2026-07-23", to: "2026-10-12", color: "#c0512f",
    focus: "Hardste bulk-blok. Zwaar tillen, volume omhoog, fysiek opbouwen." },
  { name: "Functionele Kracht & Conditie", from: "2026-10-13", to: "2026-12-14", color: "#b8862f",
    focus: "Loaded carries, rucking, work capacity richting Mariner-eisen." },
  { name: "Peak & Mariner-specifiek", from: "2026-12-15", to: "2027-01-25", color: "#2f7d4f",
    focus: "Conditie, rucking, zwemmen, hindernis-fitness. Vet eraf, lean piek." },
  { name: "Taper", from: "2027-01-26", to: "2027-02-04", color: "#6b7b8c",
    focus: "Volume omlaag, fris worden. Klaar voor 5 februari." },
];

// ---- Wekelijks vaste rooster ----
// 0=zo 1=ma 2=di 3=wo 4=do 5=vr 6=za
const FIXED = {
  1: [ // maandag
    { t: "07:30", label: "Hardlopen — Duurloop", type: "cardio", dur: 45 },
    { t: "18:30", label: "Kickboksen", type: "fight", dur: 90 },
    { t: "20:30", label: "Grappling", type: "fight", dur: 75 },
  ],
  2: [ // dinsdag
    { t: "08:00", label: "Zwemmen — Techniek", type: "swim", dur: 60 },
    { t: "18:30", label: "Kracht A — Push / Pull bovenlijf", type: "lift", dur: 70 },
  ],
  3: [ // woensdag
    { t: "07:30", label: "Hardlopen — Intervallen", type: "cardio", dur: 45 },
    { t: "18:30", label: "Kickboksen", type: "fight", dur: 90 },
  ],
  4: [ // donderdag
    { t: "18:30", label: "Kracht B — Onderlijf & Posterior chain", type: "lift", dur: 70,
      note: " · ochtend bewust cardio-vrij = herstel" },
  ],
  5: [ // vrijdag
    { t: "08:00", label: "Zwemmen — Conditie", type: "swim", dur: 60 },
    { t: "18:30", label: "Grappling", type: "fight", dur: 75 },
  ],
  6: [ // zaterdag
    { t: "10:00", label: "Kickboksen", type: "fight", dur: 90 },
    { t: "11:30", label: "Kracht C — Functioneel / Full body + core", type: "lift", dur: 75 },
  ],
  0: [ // zondag
    { t: "09:00", label: "Lange duurloop / Rucking", type: "cardio", dur: 75,
      note: " · hierna VOLLEDIG rust — je enige echte rustdag" },
  ],
};

// ---- Workout split detail ----
const SPLIT = {
  "Kracht A — Push / Pull bovenlijf": {
    goal: "Borst, rug, schouders, armen. Dik bovenlijf + trekkracht voor grappling.",
    ex: [
      ["Bench press", "4×6–8", "Hoofdkracht borst. Progressie elke week."],
      ["Weighted pull-up / lat pulldown", "4×6–8", "Trekkracht — cruciaal voor klimmen & touw."],
      ["Overhead press (staand)", "3×8", "Schouders & stabiele core onder load."],
      ["Barbell row", "3×8–10", "Dikke rug, houding."],
      ["Dips", "3×8–12", "Triceps & borst."],
      ["Face pulls + biceps", "3×12–15", "Schoudergezondheid + armen."],
      ["Hangende leg raises", "3×12", "Core."],
    ],
  },
  "Kracht B — Onderlijf & Posterior chain": {
    goal: "Benen, billen, hamstrings, lage rug. Explosief & sterk voor rucking en sprints.",
    ex: [
      ["Back squat", "4×5–8", "De koning. Bouwt totale kracht & benen."],
      ["Romanian deadlift", "3×8", "Hamstrings & posterior chain — blessurepreventie."],
      ["Walking lunges (dumbbell)", "3×10/been", "Unilateraal, functioneel voor lopen onder last."],
      ["Bulgarian split squat", "3×8/been", "Stabiliteit & beenkracht."],
      ["Calf raises", "4×15", "Enkels sterk voor hardlopen & rucking."],
      ["Plank + side plank", "3×45s", "Core onder spanning."],
      ["Back extensions", "3×12", "Lage rug."],
    ],
  },
  "Kracht C — Functioneel / Full body + core": {
    goal: "Mariner-specifiek: full body, grip, carries, explosiviteit. Atletisch & taai.",
    ex: [
      ["Deadlift", "4×4–6", "Brute totale kracht. Til zwaar maar techniek eerst."],
      ["Push press", "3×6", "Explosieve overhead kracht."],
      ["Pull-ups (max effort)", "4×AMRAP", "Werk naar 12+ strikt — Mariner-eis."],
      ["Farmer's carry", "4×40m zwaar", "Grip, core, mentale taaiheid."],
      ["Kettlebell swings", "3×15", "Heupscharnier, explosief, conditie."],
      ["Sled push / prowler (of heuvelsprints)", "5×20m", "Work capacity & benen."],
      ["Hanging knee raises + ab wheel", "3×12", "IJzersterke core."],
      ["Burpees finisher", "3×15", "Conditie & mentaal."],
    ],
  },
};

// ---- Voeding / bulk targets ----
function nutritionTargets(weight, rate) {
  // rate in kg/week bepaalt surplus. ~7700 kcal per kg, ~60% via voeding effectief
  const maintenance = Math.round(weight * 33); // actief persoon, 8 sessies/wk
  const surplus = Math.round((rate || 0.4) * 7700 / 7); // dagelijks surplus
  const calories = maintenance + surplus;
  const protein = Math.round(weight * 2.0); // g
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { maintenance, calories, protein, fat, carbs, surplus };
}

const FOCUS = [
  "Consistentie verslaat intensiteit. Kom gewoon opdagen.",
  "De dag dat je geen zin hebt is de dag die telt.",
  "Techniek eerst, gewicht volgt.",
  "Herstel is training. Slaap je sterker.",
  "Niemand checkt of je traint. Behalve jij, in februari.",
  "Pijn is informatie, geen vijand. Luister ernaar.",
  "Je bouwt geen lichaam, je bouwt een gewoonte.",
  "Eén procent beter vandaag. Dat is genoeg.",
  "De opleiding test wie consistent was, niet wie hard startte.",
  "Eet, train, slaap, herhaal. Saai werkt.",
  "Vermoeid? Schroef terug, stop niet.",
  "Het zware deel is komen opdagen. De rest is uitvoering.",
  "Sterk worden is traag. Blijf op het pad.",
  "Je toekomstige zelf kijkt mee. Maak hem trots.",
];
function focusFor(d) { return FOCUS[(Math.floor(d.getTime() / DAY)) % FOCUS.length]; }


const iso = (d) => d.toISOString().slice(0, 10);
const fmt = (d) => d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
const DAYNAMES = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

function phaseFor(d) {
  for (const p of PHASES) {
    if (d >= new Date(p.from) && d <= new Date(p.to)) return p;
  }
  return d < START ? PHASES[0] : PHASES[PHASES.length - 1];
}

function isHoliday(d) {
  const t = d.getTime();
  return t >= new Date("2026-07-02").getTime() && t <= new Date("2026-07-22").getTime();
}
function isSpain(d) {
  const t = d.getTime();
  return t >= new Date("2026-07-10").getTime() && t <= new Date("2026-07-22").getTime();
}
function isFriends(d) {
  const t = d.getTime();
  return t >= new Date("2026-07-02").getTime() && t <= new Date("2026-07-09").getTime();
}

function scheduleFor(d) {
  const dow = d.getDay();
  if (isFriends(d)) {
    return [{ t: "—", label: "Rust — vakantie met vrienden", type: "rest",
      note: "Geniet. Hydrateer goed (water tussen drankjes). Geen schuldgevoel — dit is je deload." }];
  }
  if (isSpain(d)) {
    // Vanaf 12 juli echte start in Spanje: veel hardlopen, bodyweight, gym indien mogelijk
    const spainPlan = {
      1: [
        { t: "ocht", label: "Hardlopen 5 km easy", type: "cardio", note: "Rustig tempo. Aerobe basis opbouwen." },
        { t: "later", label: "Bodyweight push (push-ups, dips)", type: "lift", note: "3–4 rondes. Gym? Dan bench/press." },
      ],
      2: [
        { t: "ocht", label: "Hardlopen intervallen 6×200m", type: "cardio", note: "Snelheid. Goed inlopen." },
        { t: "later", label: "Bodyweight pull + core", type: "lift", note: "Pull-ups/rows, plank, leg raises. Gym? Dan rug + core." },
      ],
      3: [{ t: "ocht", label: "Hardlopen 6 km of wandelen", type: "cardio", note: "Rustig. Actief herstel telt ook." }],
      4: [
        { t: "ocht", label: "Hardlopen 5 km tempo", type: "cardio", note: "Iets sneller dan easy, niet vol." },
        { t: "later", label: "Bodyweight benen (squats, lunges)", type: "lift", note: "Hoog volume. Gym? Dan squat/RDL." },
      ],
      5: [
        { t: "ocht", label: "Bodyweight full body circuit", type: "lift", note: "Push-ups, squats, lunges, burpees, plank — 4 rondes." },
      ],
      6: [{ t: "ocht", label: "Hardlopen 8–10 km lang", type: "cardio", note: "Langste duurloop van de week. Rustig tempo." }],
      0: [{ t: "—", label: "Rust", type: "rest", note: "Volledig herstel. Slaap en eet goed." }],
    };
    return spainPlan[dow] || [{ t: "—", label: "Rust", type: "rest" }];
  }
  return FIXED[dow] || [];
}

export default function MarinerTracker() {
  const [tab, setTab] = useState("dashboard");
  const [today, setToday] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [logs, setLogs] = useState({});
  const [weights, setWeights] = useState({});
  const [nutrition, setNutrition] = useState({});
  const [recovery, setRecovery] = useState({}); // Garmin handmatige import per dag
  const [bulkRate, setBulkRate] = useState(0.4);
  const [prs, setPrs] = useState({}); // {oefening: [{date, value}]}
  const [anchor, setAnchor] = useState(""); // "waarom doe ik dit"
  const [progStart, setProgStart] = useState("2026-07-12"); // echte programmastart in Spanje, instelbaar
  const [loaded, setLoaded] = useState(false);

  // load persisted data
  useEffect(() => {
    let done = false;
    const finish = () => { if (!done) { done = true; setLoaded(true); } };
    // harde fallback: nooit langer dan 1,5s op "Laden…" blijven hangen
    const timer = setTimeout(finish, 1500);
    (async () => {
      try {
        const store = (typeof window !== "undefined" && window.storage) ? window.storage : null;
        if (store) {
          const keys = ["logs", "weights", "nutrition", "recovery", "bulkRate", "prs", "anchor", "progStart"];
          for (const k of keys) {
            try {
              const r = await store.get("mariner:" + k);
              if (r && r.value) {
                const v = JSON.parse(r.value);
                if (k === "logs") setLogs(v);
                if (k === "weights") setWeights(v);
                if (k === "nutrition") setNutrition(v);
                if (k === "recovery") setRecovery(v);
                if (k === "bulkRate") setBulkRate(v);
                if (k === "prs") setPrs(v);
                if (k === "anchor") setAnchor(v);
                if (k === "progStart") setProgStart(v);
              }
            } catch (e) { /* key bestaat niet — prima */ }
          }
        }
      } catch (e) { /* storage niet beschikbaar — app werkt gewoon zonder opslaan */ }
      clearTimeout(timer);
      finish();
    })();
    return () => clearTimeout(timer);
  }, []);

  const save = async (key, val) => {
    try {
      if (typeof window !== "undefined" && window.storage) {
        await window.storage.set("mariner:" + key, JSON.stringify(val));
      }
    } catch (e) {}
  };

  const latestWeight = useMemo(() => {
    const ks = Object.keys(weights).sort();
    return ks.length ? weights[ks[ks.length - 1]] : 71;
  }, [weights]);

  const targets = nutritionTargets(latestWeight, bulkRate);

  // doelgewicht-lijn op basis van gekozen tempo, gecapt op 82 kg
  const weightTarget = (d) => {
    const wk = Math.max(0, (d - START) / (7 * DAY));
    return +Math.min(82, 71 + wk * bulkRate).toFixed(1);
  };

  const daysToMariner = Math.ceil((MARINER - today) / DAY);
  const weeksToMariner = Math.round(daysToMariner / 7);
  const totalDays = (MARINER - START) / DAY;
  const elapsed = Math.max(0, (today - START) / DAY);
  const progress = Math.min(100, Math.round((elapsed / totalDays) * 100));

  const sel = selected;
  const selKey = iso(sel);
  const selSchedule = scheduleFor(sel);
  const selPhase = phaseFor(sel);

  const toggleDone = (idx) => {
    const day = { ...(logs[selKey] || {}) };
    day[idx] = !day[idx];
    const nl = { ...logs, [selKey]: day };
    setLogs(nl); save("logs", nl);
  };

  const setWeight = (v) => {
    const nw = { ...weights, [selKey]: parseFloat(v) };
    setWeights(nw); save("weights", nw);
  };

  const setNut = (field, v) => {
    const d = { ...(nutrition[selKey] || {}) };
    d[field] = v;
    const nn = { ...nutrition, [selKey]: d };
    setNutrition(nn); save("nutrition", nn);
  };

  const setRec = (field, v) => {
    const d = { ...(recovery[selKey] || {}) };
    d[field] = v;
    const nr = { ...recovery, [selKey]: d };
    setRecovery(nr); save("recovery", nr);
  };

  const changeBulk = (r) => { setBulkRate(r); save("bulkRate", r); };
  const saveAnchor = (v) => { setAnchor(v); save("anchor", v); };
  const changeProgStart = (v) => { setProgStart(v); save("progStart", v); };
  const addPR = (ex, val) => {
    const v = parseFloat(val);
    if (!v) return;
    const list = [...(prs[ex] || []), { date: iso(today), value: v }];
    const np = { ...prs, [ex]: list };
    setPrs(np); save("prs", np);
  };

  // programma-status: vóór start = aftellen, daarna = dag X
  const PS = new Date(progStart);
  const started = today >= PS;
  const daysUntilStart = Math.ceil((PS - today) / DAY);
  const programDay = Math.floor((today - PS) / DAY) + 1;

  // wekelijkse compliance: % geplande sessies gedaan, afgelopen 7 dagen
  const compliance = useMemo(() => {
    let planned = 0, done = 0;
    let d = new Date(today);
    for (let i = 0; i < 7; i++) {
      const k = iso(d);
      const sched = scheduleFor(d).filter((x) => x.type !== "rest");
      planned += sched.length;
      const log = logs[k] || {};
      sched.forEach((_, idx) => { if (log[idx]) done++; });
      d = new Date(d - DAY);
    }
    return planned ? Math.round((done / planned) * 100) : 0;
  }, [logs, today]);

  // totaal afgevinkte sessies (voor badges)
  const totalDone = useMemo(() =>
    Object.values(logs).reduce((a, day) => a + Object.values(day).filter(Boolean).length, 0),
  [logs]);

  // langste pull-up PR & 5km voor badges
  const bestPR = (ex) => {
    const l = prs[ex] || [];
    if (!l.length) return null;
    return ex === "5 km (min)" || ex === "Zwemmen 100m (sec)"
      ? Math.min(...l.map((x) => x.value))
      : Math.max(...l.map((x) => x.value));
  };

  // streak: opeenvolgende dagen met minimaal 1 done
  const streak = useMemo(() => {
    let s = 0;
    let d = new Date(today);
    for (let i = 0; i < 365; i++) {
      const k = iso(d);
      if (new Date(k) < PS) break; // streak telt pas vanaf programmastart
      const sched = scheduleFor(d);
      const hasTraining = sched.some((x) => x.type !== "rest");
      if (!hasTraining) { d = new Date(d - DAY); continue; }
      const log = logs[k];
      const done = log && Object.values(log).some(Boolean);
      if (done) { s++; d = new Date(d - DAY); }
      else if (k === iso(today)) { d = new Date(d - DAY); }
      else break;
    }
    return s;
  }, [logs, today, progStart]);

  // badges
  const badges = useMemo(() => {
    const pu = bestPR("Pull-ups (reps)");
    const run = bestPR("5 km (min)");
    return [
      { id: "start", icon: "🚀", name: "Van start", desc: "Programma begonnen", got: started },
      { id: "week1", icon: "🔥", name: "Eerste week", desc: "7-dagen streak", got: streak >= 7 },
      { id: "week4", icon: "💪", name: "Een maand sterk", desc: "28-dagen streak", got: streak >= 28 },
      { id: "sessions25", icon: "⚡", name: "25 sessies", desc: "25 trainingen afgevinkt", got: totalDone >= 25 },
      { id: "sessions100", icon: "🏅", name: "100 sessies", desc: "100 trainingen afgevinkt", got: totalDone >= 100 },
      { id: "pullups12", icon: "🧗", name: "12 pull-ups", desc: "Mariner-niveau trekkracht", got: pu != null && pu >= 12 },
      { id: "run5k25", icon: "🏃", name: "Snelle 5 km", desc: "5 km onder 25 min", got: run != null && run <= 25 },
      { id: "consistent", icon: "🎯", name: "Ijzersterk", desc: "Week 100% compliance", got: compliance === 100 },
      { id: "goal", icon: "👑", name: "82 kg", desc: "Streefgewicht gehaald", got: latestWeight >= 82 },
    ];
  }, [started, streak, totalDone, compliance, latestWeight, prs]);

  // calendar grid for selected month
  const [calMonth, setCalMonth] = useState(new Date(2026, 5, 1));
  const calDays = useMemo(() => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    const first = new Date(y, m, 1);
    const startDow = (first.getDay() + 6) % 7; // ma=0
    const arr = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    const dim = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) arr.push(new Date(y, m, d));
    return arr;
  }, [calMonth]);

  const C = {
    bg: "#0f1216", panel: "#171b21", panel2: "#1d232b", line: "#2a323c",
    text: "#e8eaed", dim: "#9aa4af", accent: "#c0512f", accent2: "#2f7d4f",
    gold: "#b8862f", blue: "#3f7d8c",
  };

  const tabs = [
    ["dashboard", "Vandaag"],
    ["week", "Week"],
    ["motivation", "Motivatie"],
    ["calendar", "Kalender"],
    ["plan", "Plan"],
    ["body", "Lichaam"],
    ["food", "Voeding"],
    ["recovery", "Herstel"],
  ];

  if (!loaded) {
    return <div style={{ background: C.bg, color: C.text, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui" }}>Laden…</div>;
  }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", paddingBottom: 80 }}>
      <style>{`
        * { box-sizing: border-box; }
        .oswald { font-family: 'Oswald', 'Arial Narrow', system-ui, sans-serif; letter-spacing: 0.5px; }
        .card { background: ${C.panel}; border: 1px solid ${C.line}; border-radius: 14px; }
        button { font-family: inherit; cursor: pointer; }
        .chk { width: 26px; height: 26px; border-radius: 7px; border: 2px solid ${C.line};
          background: transparent; display:flex; align-items:center; justify-content:center;
          flex-shrink: 0; transition: all .15s; }
        .chk.on { background: ${C.accent2}; border-color: ${C.accent2}; }
        .inp { background: ${C.panel2}; border: 1px solid ${C.line}; color: ${C.text};
          border-radius: 8px; padding: 10px 12px; font-size: 15px; width: 100%; font-family: inherit; }
        .inp:focus { outline: none; border-color: ${C.accent}; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {/* Header */}
      <div style={{ padding: "22px 18px 14px", borderBottom: `1px solid ${C.line}`,
        background: `linear-gradient(135deg, ${C.panel} 0%, ${C.bg} 100%)` }}>
        <div style={{ fontSize: 12, color: C.accent, letterSpacing: 2, fontWeight: 700 }} className="oswald">
          COURSE MARINER · VOORBEREIDING
        </div>
        <div className="oswald" style={{ fontSize: 30, fontWeight: 700, marginTop: 2, lineHeight: 1.05 }}>
          {daysToMariner} DAGEN
        </div>
        <div style={{ color: C.dim, fontSize: 13, marginTop: 2 }}>
          tot 5 februari 2027 · week {weeksToMariner} aftellen · {progress}% van de reis
        </div>
        <div style={{ height: 6, background: C.panel2, borderRadius: 4, marginTop: 12, overflow: "hidden" }}>
          <div style={{ width: progress + "%", height: "100%",
            background: `linear-gradient(90deg, ${C.accent}, ${C.gold})` }} />
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "16px 14px" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <DateNav sel={sel} setSelected={setSelected} C={C} />

            {!started && (
              <div className="card" style={{ padding: 16, marginBottom: 12, textAlign: "center",
                borderLeft: `4px solid ${C.gold}` }}>
                <div className="oswald" style={{ fontSize: 22, fontWeight: 700, color: C.gold }}>
                  Nog {daysUntilStart} {daysUntilStart === 1 ? "dag" : "dagen"}
                </div>
                <div style={{ fontSize: 13, color: C.dim, marginTop: 2 }}>
                  tot je programma start ({new Date(progStart).toLocaleDateString("nl-NL",{day:"numeric",month:"long"})}). Geniet van je vakantie — die rust telt mee.
                </div>
              </div>
            )}
            {started && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 12, padding: "0 4px" }}>
                <span className="oswald" style={{ fontSize: 13, color: C.dim, letterSpacing: 1 }}>
                  DAG {programDay} VAN JE VOORBEREIDING
                </span>
              </div>
            )}

            <div className="card" style={{ padding: 14, marginBottom: 12,
              borderLeft: `4px solid ${C.accent}`, fontStyle: "italic", fontSize: 14 }}>
              "{focusFor(sel)}"
            </div>

            <div className="card" style={{ padding: 14, marginBottom: 12,
              borderLeft: `4px solid ${selPhase.color}` }}>
              <div className="oswald" style={{ fontSize: 13, color: selPhase.color, fontWeight: 600 }}>
                FASE · {selPhase.name.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>{selPhase.focus}</div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <Stat label="Streak" val={streak + "🔥"} C={C} />
              <Stat label="Week" val={compliance + "%"} sub="gedaan" C={C} />
              <Stat label="Gewicht" val={latestWeight + " kg"} C={C} />
            </div>

            <SectionTitle C={C}>Trainingen vandaag</SectionTitle>
            {selSchedule.length === 0 && <Empty C={C}>Geen training ingepland — rustdag.</Empty>}
            {selSchedule.map((s, i) => {
              const done = logs[selKey] && logs[selKey][i];
              const detail = SPLIT[s.label];
              return (
                <div key={i} className="card" style={{ padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <button className={"chk" + (done ? " on" : "")} onClick={() => toggleDone(i)}>
                      {done && <span style={{ color: "#fff", fontSize: 16 }}>✓</span>}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 15,
                          textDecoration: done ? "line-through" : "none",
                          color: done ? C.dim : C.text }}>{s.label}</span>
                        <Tag type={s.type} C={C} />
                      </div>
                      <div style={{ fontSize: 12, color: C.dim, marginTop: 3 }}>
                        {s.t !== "—" ? s.t + " · " : ""}{s.dur ? s.dur + " min" : ""}
                        {s.note ? s.note : ""}
                      </div>
                      {detail && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
                          <div style={{ fontSize: 12, color: C.gold, marginBottom: 8 }}>{detail.goal}</div>
                          {detail.ex.map(([name, sets, tip], j) => (
                            <div key={j} style={{ display: "flex", justifyContent: "space-between",
                              padding: "4px 0", fontSize: 13, borderBottom: j < detail.ex.length-1 ? `1px solid ${C.panel2}` : "none" }}>
                              <span>{name}</span>
                              <span style={{ color: C.accent, fontWeight: 600, whiteSpace: "nowrap" }}>{sets}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <SectionTitle C={C}>Snel loggen</SectionTitle>
            <div className="card" style={{ padding: 14 }}>
              <label style={{ fontSize: 13, color: C.dim }}>Gewicht vandaag (kg)</label>
              <input className="inp" type="number" step="0.1" style={{ marginTop: 6 }}
                value={weights[selKey] ?? ""} placeholder={String(latestWeight)}
                onChange={(e) => setWeight(e.target.value)} />
            </div>
          </>
        )}

        {/* WEEK */}
        {tab === "week" && <WeekView C={C} logs={logs} today={today} setSelected={setSelected} setTab={setTab} />}

        {/* MOTIVATION */}
        {tab === "motivation" && (
          <>
            <SectionTitle C={C}>Waarom ik dit doe</SectionTitle>
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>
                Schrijf je grootste reden op. Op zware dagen lees je dit terug.
              </div>
              <textarea className="inp" rows={3} style={{ resize: "vertical", lineHeight: 1.5 }}
                value={anchor} placeholder="Bijv: Ik word marinier omdat..."
                onChange={(e) => saveAnchor(e.target.value)} />
            </div>

            <SectionTitle C={C}>Badges</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
              {badges.map((b) => (
                <div key={b.id} className="card" style={{ padding: "12px 6px", textAlign: "center",
                  opacity: b.got ? 1 : 0.35, borderColor: b.got ? C.accent2 : C.line }}>
                  <div style={{ fontSize: 26, filter: b.got ? "none" : "grayscale(1)" }}>{b.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>{b.name}</div>
                  <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>{b.desc}</div>
                </div>
              ))}
            </div>

            <SectionTitle C={C}>Persoonlijke records</SectionTitle>
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>
                Log je beste prestaties. Je ziet je vooruitgang zwart-op-wit groeien.
              </div>
              {["Bench (kg)","Squat (kg)","Deadlift (kg)","Pull-ups (reps)","5 km (min)","Zwemmen 100m (sec)"].map((ex) => {
                const best = bestPR(ex);
                const lower = ex === "5 km (min)" || ex === "Zwemmen 100m (sec)";
                return (
                  <PRRow key={ex} ex={ex} best={best} lower={lower} count={(prs[ex]||[]).length}
                    onAdd={(v) => addPR(ex, v)} C={C} />
                );
              })}
            </div>

            <SectionTitle C={C}>Deze week</SectionTitle>
            <div className="card" style={{ padding: 16, marginBottom: 14, textAlign: "center" }}>
              <div className="oswald" style={{ fontSize: 40, fontWeight: 700,
                color: compliance >= 80 ? C.accent2 : compliance >= 50 ? C.gold : C.accent }}>
                {compliance}%
              </div>
              <div style={{ fontSize: 13, color: C.dim }}>
                {compliance >= 100 ? "Alles gedaan. Ijzersterk." :
                 compliance >= 80 ? "Sterke week. Blijf hangen." :
                 compliance >= 50 ? "Halverwege — maak het af." :
                 started ? "Nieuwe week, nieuwe kans. Kom opdagen." :
                 "Je programma is nog niet begonnen."}
              </div>
            </div>

            <SectionTitle C={C}>Startdatum programma</SectionTitle>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>
                Wanneer begint je volledige programma? Streak en voortgang tellen vanaf deze dag.
              </div>
              <input className="inp" type="date" value={progStart}
                onChange={(e) => changeProgStart(e.target.value)} />
            </div>
          </>
        )}

        {/* CALENDAR */}
        {tab === "calendar" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button className="card" style={{ padding: "8px 14px", color: C.text }}
                onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))}>‹</button>
              <div className="oswald" style={{ fontSize: 18, fontWeight: 600 }}>
                {calMonth.toLocaleDateString("nl-NL", { month: "long", year: "numeric" })}
              </div>
              <button className="card" style={{ padding: "8px 14px", color: C.text }}
                onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {["M","D","W","D","V","Z","Z"].map((d,i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 11, color: C.dim, padding: 4 }}>{d}</div>
              ))}
              {calDays.map((d, i) => {
                if (!d) return <div key={i} />;
                const k = iso(d);
                const ph = phaseFor(d);
                const log = logs[k];
                const done = log && Object.values(log).some(Boolean);
                const hol = isHoliday(d);
                const isToday = iso(d) === iso(today);
                const isSel = iso(d) === selKey;
                return (
                  <button key={i} onClick={() => { setSelected(d); setTab("dashboard"); }}
                    style={{ aspectRatio: "1", border: isSel ? `2px solid ${C.accent}` : `1px solid ${C.line}`,
                      borderRadius: 9, background: hol ? C.panel2 : C.panel, color: C.text,
                      position: "relative", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", padding: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 400,
                      color: isToday ? C.accent : C.text }}>{d.getDate()}</span>
                    <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                      {done && <span style={{ width: 5, height: 5, borderRadius: 3, background: C.accent2 }} />}
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: ph.color, opacity: .7 }} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 16 }}>
              <SectionTitle C={C}>Fases</SectionTitle>
              {PHASES.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 13 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: p.color }} />
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span style={{ color: C.dim, fontSize: 11 }}>
                    {new Date(p.from).toLocaleDateString("nl-NL",{day:"numeric",month:"short"})} – {new Date(p.to).toLocaleDateString("nl-NL",{day:"numeric",month:"short"})}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PLAN */}
        {tab === "plan" && (
          <>
            <SectionTitle C={C}>Wekelijks ritme</SectionTitle>
            <div className="card" style={{ padding: 6, marginBottom: 16 }}>
              {[1,2,3,4,5,6,0].map((dow) => (
                <div key={dow} style={{ padding: "10px 10px", borderBottom: dow !== 0 ? `1px solid ${C.panel2}` : "none" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.gold, marginBottom: 4 }}>{DAYNAMES[dow]}</div>
                  {FIXED[dow].map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "2px 0" }}>
                      <span>{s.label}</span>
                      <span style={{ color: C.dim }}>{s.t}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <SectionTitle C={C}>De 3 krachtsessies</SectionTitle>
            {Object.entries(SPLIT).map(([name, d]) => (
              <div key={name} className="card" style={{ padding: 14, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                <div style={{ fontSize: 12, color: C.gold, margin: "4px 0 8px" }}>{d.goal}</div>
                {d.ex.map(([n, s, tip], j) => (
                  <div key={j} style={{ padding: "5px 0", borderTop: `1px solid ${C.panel2}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ fontWeight: 500 }}>{n}</span>
                      <span style={{ color: C.accent, fontWeight: 600 }}>{s}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.dim }}>{tip}</div>
                  </div>
                ))}
              </div>
            ))}

            <SectionTitle C={C}>Progressie-principes</SectionTitle>
            <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 8px" }}><b style={{color:C.accent}}>Overload:</b> voeg elke week 1 rep of 1–2,5 kg toe op je hoofdoefeningen zodra je het bovenste repbereik haalt.</p>
              <p style={{ margin: "0 0 8px" }}><b style={{color:C.accent}}>Deload:</b> elke 6e week gewicht ~40% omlaag, herstel & techniek.</p>
              <p style={{ margin: "0 0 8px" }}><b style={{color:C.accent}}>Herstel:</b> 7–9 uur slaap is je #1 wapen voor zowel spiergroei als vechtsportherstel.</p>
              <p style={{ margin: 0 }}><b style={{color:C.accent}}>Vechtsport telt:</b> 5 sessies/week is veel belasting. Luister naar je lichaam; vermoeid = volume krachttraining iets terug, niet skippen.</p>
            </div>
          </>
        )}

        {/* BODY */}
        {tab === "body" && (
          <BodyView C={C} weights={weights} weightTarget={weightTarget} latestWeight={latestWeight}
            selKey={selKey} setWeight={setWeight} />
        )}

        {/* FOOD */}
        {tab === "food" && (
          <>
            <SectionTitle C={C}>Bulk-tempo</SectionTitle>
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>
                Kies hoe snel je aankomt. 0,4 kg/week is het advies: stevig maar lean. Sneller = meer vet.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[0.3, 0.4, 0.5].map((r) => (
                  <button key={r} onClick={() => changeBulk(r)}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 9,
                      border: `1px solid ${bulkRate === r ? C.accent : C.line}`,
                      background: bulkRate === r ? C.accent : "transparent",
                      color: bulkRate === r ? "#fff" : C.text, fontWeight: 600, fontSize: 14 }}>
                    {r} kg/wk
                  </button>
                ))}
              </div>
            </div>

            <SectionTitle C={C}>Lean bulk targets</SectionTitle>
            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: C.dim }}>Op basis van {latestWeight} kg · {bulkRate} kg/week aankomen</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                <Macro label="Calorieën" val={targets.calories} unit="kcal" big C={C} />
                <Macro label="Eiwit" val={targets.protein} unit="g" C={C} accent />
                <Macro label="Koolhydraten" val={targets.carbs} unit="g" C={C} />
                <Macro label="Vet" val={targets.fat} unit="g" C={C} />
              </div>
              <div style={{ fontSize: 12, color: C.dim, marginTop: 12, lineHeight: 1.5 }}>
                Onderhoud ≈ {targets.maintenance} kcal. Surplus ≈ +{targets.surplus} kcal/dag. Update je gewicht en deze waarden schalen mee.
              </div>
            </div>

            <SectionTitle C={C}>Vandaag loggen</SectionTitle>
            <div className="card" style={{ padding: 14 }}>
              {[["calories","Calorieën (kcal)"],["protein","Eiwit (g)"],["sleep","Slaap (uren)"],["water","Water (L)"]].map(([f,l]) => (
                <div key={f} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, color: C.dim }}>{l}</label>
                  <input className="inp" type="number" step="0.1" style={{ marginTop: 5 }}
                    value={(nutrition[selKey] && nutrition[selKey][f]) ?? ""}
                    onChange={(e) => setNut(f, e.target.value)} />
                </div>
              ))}
            </div>

            <SectionTitle C={C}>Eet-richtlijnen</SectionTitle>
            <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.6 }}>
              <p style={{margin:"0 0 6px"}}>• Eiwit bij elke maaltijd: kip, rund, eieren, vis, kwark, whey.</p>
              <p style={{margin:"0 0 6px"}}>• Koolhydraten rond training: rijst, aardappel, havermout, pasta.</p>
              <p style={{margin:"0 0 6px"}}>• Gezonde vetten: noten, olijfolie, avocado, vette vis.</p>
              <p style={{margin:"0 0 6px"}}>• Groente bij 2 maaltijden voor herstel & vertering.</p>
              <p style={{margin:0}}>• Te zwaar om te eten? Voeg een shake toe (whey + havermout + banaan + pindakaas).</p>
            </div>
          </>
        )}

        {/* RECOVERY */}
        {tab === "recovery" && (
          <>
            <SectionTitle C={C}>Garmin-data invoeren</SectionTitle>
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5, marginBottom: 12 }}>
                Automatisch koppelen kan niet in een losse app. Open Garmin Connect, lees je cijfers van vannacht af en zet ze hier neer. Zo blijft je herstel naast je training zichtbaar.
              </div>
              {[["sleep","Slaap (uren)"],["sleepScore","Slaapscore (0–100)"],["hrv","HRV (ms)"],["rhr","Rustpols (bpm)"],["bodyBattery","Body Battery (0–100)"]].map(([f,l]) => (
                <div key={f} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, color: C.dim }}>{l}</label>
                  <input className="inp" type="number" step="0.1" style={{ marginTop: 5 }}
                    value={(recovery[selKey] && recovery[selKey][f]) ?? ""}
                    onChange={(e) => setRec(f, e.target.value)} />
                </div>
              ))}
              <div style={{ fontSize: 12, color: C.gold, marginTop: 6, lineHeight: 1.5 }}>
                Vuistregel: HRV laag + rustpols hoog + Body Battery laag = vandaag krachtvolume terugschroeven, niet skippen. Luister naar deze signalen — overtraining is de #1 reden dat mensen geblesseerd aan de opleiding beginnen.
              </div>
            </div>

            <SectionTitle C={C}>Herstel-prioriteiten</SectionTitle>
            <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
              <p style={{margin:"0 0 8px"}}><b style={{color:C.accent}}>Slaap 8–9 uur:</b> je #1 herstelwapen. Spiergroei én conditiewinst gebeuren in je slaap, niet in de sportschool.</p>
              <p style={{margin:"0 0 8px"}}><b style={{color:C.accent}}>Eén echte rustdag:</b> zondagmiddag volledig vrij. Neem die ook echt.</p>
              <p style={{margin:"0 0 8px"}}><b style={{color:C.accent}}>Deload elke 6e week:</b> volume ~40% omlaag. Voelt als achteruitgang, is vooruitgang.</p>
              <p style={{margin:0}}><b style={{color:C.accent}}>Pijn ≠ progressie:</b> scherpe pijn in scheenbeen/knie/schouder = stoppen en herstellen. Stressfracturen zijn opleidingskillers.</p>
            </div>

            <SectionTitle C={C}>Supplementen</SectionTitle>
            <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>
                Voeding en slaap doen 95% van het werk. Dit is de marge — geen wondermiddelen. Alleen deze hebben sterk bewijs:
              </div>
              <SupRow C={C} name="Creatine monohydraat" dose="3–5 g/dag, elk moment"
                why="Best onderzochte supplement. Meer kracht, spiermassa en herstel. Veilig voor langdurig gebruik." />
              <SupRow C={C} name="Vitamine D3" dose="1000–2000 IE/dag (winter)"
                why="In NL kom je 's winters bijna zeker tekort. Belangrijk voor botten, immuun en herstel." />
              <SupRow C={C} name="Whey-eiwit" dose="1–2 scoops indien nodig"
                why="Geen must, maar makkelijk om je eiwit te halen op zware dagen. Voeding eerst." />
              <SupRow C={C} name="Magnesium" dose="200–400 mg 's avonds"
                why="Kan slaapkwaliteit en spierontspanning helpen, zeker bij hoge trainingslast." last />
            </div>
            <div className="card" style={{ padding: 14, fontSize: 12, color: C.dim, lineHeight: 1.5,
              borderLeft: `3px solid ${C.gold}` }}>
              Dit is algemene info, geen medisch advies. Overleg met een (sport)arts of diëtist — zeker richting een militaire keuring, waar sommige stoffen op een controlelijst kunnen staan. Koop alleen bij betrouwbare merken met keurmerk.
            </div>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.panel,
        borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-around",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom))", zIndex: 10 }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ background: "none", border: "none", color: tab === id ? C.accent : C.dim,
              fontSize: 11, fontWeight: tab === id ? 700 : 500, padding: "4px 8px",
              borderTop: tab === id ? `2px solid ${C.accent}` : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Subcomponents ----
function DateNav({ sel, setSelected, C }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <button className="card" style={{ padding: "8px 14px", color: C.text }}
        onClick={() => setSelected(new Date(sel - DAY))}>‹</button>
      <div className="oswald" style={{ fontSize: 16, fontWeight: 600 }}>{fmt(sel)}</div>
      <button className="card" style={{ padding: "8px 14px", color: C.text }}
        onClick={() => setSelected(new Date(+sel + DAY))}>›</button>
    </div>
  );
}
function PRRow({ ex, best, lower, count, onAdd, C }) {
  const [v, setV] = useState("");
  return (
    <div style={{ padding: "8px 0", borderBottom: `1px solid ${C.panel2}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{ex}</div>
          <div style={{ fontSize: 11, color: best != null ? C.accent2 : C.dim }}>
            {best != null ? `Record: ${best}${lower ? " (lager = beter)" : ""}` : "Nog geen record"}
            {count > 1 ? ` · ${count} metingen` : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <input className="inp" type="number" step="0.1" style={{ width: 70, padding: "6px 8px" }}
            value={v} onChange={(e) => setV(e.target.value)} placeholder="—" />
          <button onClick={() => { onAdd(v); setV(""); }}
            style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8,
              padding: "0 14px", fontWeight: 600 }}>+</button>
        </div>
      </div>
    </div>
  );
}
function SupRow({ name, dose, why, C, last }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: last ? "none" : `1px solid ${C.panel2}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontWeight: 600 }}>{name}</span>
        <span style={{ color: C.accent, fontSize: 12, whiteSpace: "nowrap" }}>{dose}</span>
      </div>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{why}</div>
    </div>
  );
}
function Stat({ label, val, sub, C }) {
  return (
    <div className="card" style={{ flex: 1, padding: "12px 10px", textAlign: "center" }}>
      <div className="oswald" style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      {sub && <div style={{ fontSize: 9, color: C.dim }}>{sub}</div>}
    </div>
  );
}
function SectionTitle({ children, C }) {
  return <div className="oswald" style={{ fontSize: 13, color: C.dim, letterSpacing: 1.5,
    textTransform: "uppercase", margin: "16px 0 8px", fontWeight: 600 }}>{children}</div>;
}
function Empty({ children, C }) {
  return <div className="card" style={{ padding: 18, textAlign: "center", color: C.dim, fontSize: 13 }}>{children}</div>;
}
function Tag({ type, C }) {
  const map = { fight: ["Vechtsport", C.accent], lift: ["Kracht", C.gold],
    cardio: ["Conditie", C.blue], swim: ["Zwemmen", "#4a9ec0"], rest: ["Rust", C.dim] };
  const [t, col] = map[type] || ["", C.dim];
  if (!t) return null;
  return <span style={{ fontSize: 10, color: col, border: `1px solid ${col}`,
    borderRadius: 5, padding: "2px 7px", height: "fit-content", whiteSpace: "nowrap" }}>{t}</span>;
}
function Macro({ label, val, unit, big, accent, C }) {
  return (
    <div style={{ background: C.panel2, borderRadius: 10, padding: 12,
      border: accent ? `1px solid ${C.accent}` : "none" }}>
      <div className="oswald" style={{ fontSize: big ? 26 : 22, fontWeight: 700,
        color: accent ? C.accent : C.text }}>{val}<span style={{ fontSize: 12, color: C.dim }}> {unit}</span></div>
      <div style={{ fontSize: 11, color: C.dim }}>{label}</div>
    </div>
  );
}
function WeekView({ C, logs, today, setSelected, setTab }) {
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, i) => new Date(+monday + i * DAY));
  return (
    <>
      <SectionTitle C={C}>Deze week</SectionTitle>
      {days.map((d, i) => {
        const sched = scheduleFor(d);
        const k = iso(d);
        const ph = phaseFor(d);
        return (
          <div key={i} className="card" style={{ padding: 12, marginBottom: 8,
            borderLeft: `4px solid ${ph.color}` }}
            onClick={() => { setSelected(d); setTab("dashboard"); }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{DAYNAMES[d.getDay()]}</span>
              <span style={{ fontSize: 12, color: C.dim }}>{d.getDate()}/{d.getMonth()+1}</span>
            </div>
            {sched.map((s, j) => (
              <div key={j} style={{ fontSize: 12, color: C.dim, marginTop: 3 }}>
                {s.t !== "—" ? s.t + " · " : ""}{s.label}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
function BodyView({ C, weights, weightTarget, latestWeight, selKey, setWeight }) {
  const data = useMemo(() => {
    const ks = Object.keys(weights).sort();
    return ks.map((k) => ({ date: k, w: weights[k], t: weightTarget(new Date(k)) }));
  }, [weights]);
  const W = 500, H = 220, pad = 30;
  const minW = 68, maxW = 84;
  const x = (i, n) => pad + (i / Math.max(1, n - 1)) * (W - pad * 2);
  const y = (w) => H - pad - ((w - minW) / (maxW - minW)) * (H - pad * 2);
  return (
    <>
      <SectionTitle C={C}>Gewichtsverloop</SectionTitle>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <Stat label="Nu" val={latestWeight + "kg"} C={C} />
          <Stat label="Doel feb" val="82 kg" C={C} />
          <Stat label="Te gaan" val={(82 - latestWeight).toFixed(1) + "kg"} C={C} />
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          {[70,74,78,82].map((g) => (
            <g key={g}>
              <line x1={pad} x2={W-pad} y1={y(g)} y2={y(g)} stroke={C.line} strokeWidth="1" />
              <text x={4} y={y(g)+4} fill={C.dim} fontSize="10">{g}</text>
            </g>
          ))}
          {/* target line */}
          <line x1={x(0,2)} y1={y(71)} x2={x(1,2)} y2={y(82)} stroke={C.gold} strokeWidth="2" strokeDasharray="5,4" />
          {/* actual */}
          {data.length > 1 && (
            <polyline fill="none" stroke={C.accent} strokeWidth="2.5"
              points={data.map((d, i) => `${x(i, data.length)},${y(d.w)}`).join(" ")} />
          )}
          {data.map((d, i) => (
            <circle key={i} cx={x(i, data.length)} cy={y(d.w)} r="3" fill={C.accent} />
          ))}
        </svg>
        <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.dim, marginTop: 6 }}>
          <span>● <span style={{color:C.accent}}>Werkelijk</span></span>
          <span>- - <span style={{color:C.gold}}>Doel (71→82)</span></span>
        </div>
      </div>
      <div className="card" style={{ padding: 14, marginTop: 12 }}>
        <label style={{ fontSize: 13, color: C.dim }}>Gewicht loggen voor geselecteerde dag (kg)</label>
        <input className="inp" type="number" step="0.1" style={{ marginTop: 6 }}
          value={weights[selKey] ?? ""} placeholder={String(latestWeight)}
          onChange={(e) => setWeight(e.target.value)} />
      </div>
      {data.length === 0 && (
        <Empty C={C}>Nog geen gewicht gelogd. Voeg je eerste meting toe om de grafiek te starten.</Empty>
      )}
    </>
  );
}
