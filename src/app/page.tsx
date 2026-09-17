"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Agent = "Dell parts" | "Materials" | "Creator studio";

const agentCards: { name: Agent; eyebrow: string; description: string; color: string; icon: string }[] = [
  { name: "Dell parts", eyebrow: "RECOVERY NETWORK", description: "Find compatible components and refurbished inventory.", color: "coral", icon: "DP" },
  { name: "Materials", eyebrow: "LOCAL INTELLIGENCE", description: "Plan nearby sourcing for active projects.", color: "blue", icon: "MI" },
  { name: "Creator studio", eyebrow: "AUTHENTIC COMMERCE", description: "Turn product photos into marketplace-ready content.", color: "yellow", icon: "CS" },
];

const resultSets: Record<Agent, { title: string; subtitle: string; price: string; meta: string; score: string }[]> = {
  "Dell parts": [
    { title: "Dell Latitude 7420 battery", subtitle: "WDX0R • 63Wh • refurbished", price: "$48.00", meta: "eBay marketplace / 2 day delivery", score: "96" },
    { title: "Latitude 7420 LCD panel", subtitle: "FHD 14 inch • tested pull", price: "$119.00", meta: "eBay marketplace / 4 day delivery", score: "91" },
    { title: "Dell 65W USB-C adapter", subtitle: "DA65NM111 • grade A", price: "$22.50", meta: "Certified reseller / 3 day delivery", score: "88" },
  ],
  Materials: [
    { title: "1/2 in. moisture resistant drywall", subtitle: "4 x 8 ft panels • 48 units", price: "$1,104", meta: "Local partner / pickup today", score: "94" },
    { title: "EMT conduit and fittings", subtitle: "3/4 in. galvanized • 120 ft", price: "$286", meta: "Local partner / delivery tomorrow", score: "89" },
    { title: "Heavy-duty mounting brackets", subtitle: "Zinc plated • 24 pack", price: "$74", meta: "Local partner / pickup today", score: "86" },
  ],
  "Creator studio": [
    { title: "Listing draft ready", subtitle: "Condition, category, and keywords detected", price: "12 assets", meta: "Marketplace title + description", score: "98" },
    { title: "Social caption set", subtitle: "Three authentic short-form variations", price: "3 posts", meta: "Instagram + TikTok concepts", score: "93" },
    { title: "Visual quality check", subtitle: "Clean background and product detail", price: "Ready", meta: "No authenticity flags detected", score: "90" },
  ],
};

function makeResponse(agent: Agent, query: string) {
  const cleanQuery = query.trim() || "your latest procurement request";
  return `I routed “${cleanQuery}” to ${agent}. The demo ranking engine found ${resultSets[agent].length} high-confidence options. Review the shortlist below before placing an order.`;
}

export default function Home() {
  const [activeAgent, setActiveAgent] = useState<Agent>("Dell parts");
  const [query, setQuery] = useState("I need 15 Dell Latitude 7420 batteries and 10 replacement monitor panels.");
  const [response, setResponse] = useState("I’m ready to coordinate procurement, sourcing, or marketplace content. Tell me what your team needs next.");
  const [uploadedFile, setUploadedFile] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  function submitQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRunning(true);
    window.setTimeout(() => {
      setResponse(makeResponse(activeAgent, query));
      setIsRunning(false);
    }, 450);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setUploadedFile(event.target.files?.[0]?.name ?? "");
    setActiveAgent("Creator studio");
    setResponse("Photo received in demo mode. Creator studio is ready to analyze condition, category, and listing quality.");
  }

  const activeResults = resultSets[activeAgent];

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand-lockup"><span className="brand-mark">P</span><span>patron</span><span className="brand-divider" /> <span className="workspace-label">OPERATIONS DESK</span></div><div className="topbar-actions"><span className="demo-pill"><span className="status-dot" /> DEMO MODE</span><button className="avatar" aria-label="Open profile">JD</button></div></header>
      <div className="workspace">
        <aside className="sidebar"><div className="side-heading">WORKSPACE</div><nav className="nav-list" aria-label="Primary navigation"><button className="nav-item active"><span className="nav-icon">⌂</span> Command center</button><button className="nav-item"><span className="nav-icon">◫</span> Procurement queue <span className="nav-count">3</span></button><button className="nav-item"><span className="nav-icon">◎</span> Visual ledger</button><button className="nav-item"><span className="nav-icon">▤</span> Compliance reports</button></nav><div className="side-heading agent-heading">AGENTS</div><div className="mini-agents">{agentCards.map((agent) => <button key={agent.name} className={`mini-agent ${activeAgent === agent.name ? "selected" : ""}`} onClick={() => setActiveAgent(agent.name)}><span className={`mini-icon ${agent.color}`}>{agent.icon}</span><span>{agent.name}</span><span className="agent-status" /></button>)}</div><div className="sidebar-bottom"><div className="side-heading">WORKFORCE ACCELERATOR</div><p>4 active learners are reviewing today&apos;s sourcing plans.</p><button className="text-button">Open talent view <span>↗</span></button></div></aside>
        <section className="main-content"><div className="page-intro"><div><div className="overline">WEDNESDAY, SEPTEMBER 16, 2026</div><h1>Good morning, Jordan.</h1><p>Coordinate your next move across the supply chain.</p></div><button className="outline-button" onClick={() => alert("Report generation is available in the live connector build.")}>Export activity <span>↓</span></button></div>
          <section className="agent-grid" aria-label="Patron agents">{agentCards.map((agent) => <button key={agent.name} className={`agent-card ${activeAgent === agent.name ? "agent-selected" : ""}`} onClick={() => setActiveAgent(agent.name)}><div className="agent-card-top"><span className={`agent-icon ${agent.color}`}>{agent.icon}</span><span className="card-arrow">↗</span></div><div className="overline">{agent.eyebrow}</div><h2>{agent.name}</h2><p>{agent.description}</p><span className="live-label"><span className="status-dot" /> LIVE AGENT</span></button>)}</section>
          <div className="section-heading"><div><div className="overline">ORCHESTRATOR</div><h2>What are we solving today?</h2></div><span className="connection-label"><span className="status-dot" /> Local intelligence online</span></div>
          <form className="command-panel" onSubmit={submitQuery}><div className="command-top"><span className={`command-icon ${activeAgent === "Dell parts" ? "coral" : activeAgent === "Materials" ? "blue" : "yellow"}`}>{activeAgent === "Dell parts" ? "DP" : activeAgent === "Materials" ? "MI" : "CS"}</span><div><span className="command-label">ROUTING TO <strong>{activeAgent.toUpperCase()}</strong></span><textarea value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Describe your supply chain request" /></div></div><div className="command-actions"><label className="attach-button"><span>+</span> Add product photo<input type="file" accept="image/*" onChange={handleFile} /></label>{uploadedFile && <span className="file-name">{uploadedFile}</span>}<button className="run-button" type="submit" disabled={isRunning}>{isRunning ? "Routing..." : "Run orchestration"} <span>→</span></button></div></form>
          <div className="response-line"><span className="response-orb">✦</span><p>{response}</p></div>
          <section className="results-section"><div className="section-heading compact"><div><div className="overline">RANKED OPPORTUNITIES</div><h2>{activeAgent === "Creator studio" ? "Content workspace" : "Recommended sourcing plan"}</h2></div><button className="text-button">View all <span>↗</span></button></div><div className="result-list">{activeResults.map((result, index) => <article className="result-row" key={result.title}><span className="rank">0{index + 1}</span><div className="result-main"><h3>{result.title}</h3><p>{result.subtitle}</p></div><div className="result-meta"><strong>{result.price}</strong><span>{result.meta}</span></div><div className="score"><strong>{result.score}</strong><span>match</span></div><button className="row-action" aria-label={`Open ${result.title}`}>↗</button></article>)}</div></section>
          <section className="bottom-grid"><div className="ledger-panel"><div className="section-heading compact"><div><div className="overline">VISUAL SUPPLY CHAIN LEDGER</div><h2>Recent activity</h2></div><button className="text-button">Open ledger <span>↗</span></button></div><div className="ledger-item"><span className="ledger-icon coral">▧</span><div><strong>Latitude 7420 batch verified</strong><span>Photo evidence linked to PO-1048</span></div><time>12 min ago</time></div><div className="ledger-item"><span className="ledger-icon blue">✓</span><div><strong>Supplier diversity record updated</strong><span>Acme IT Services • verified</span></div><time>Yesterday</time></div></div><div className="impact-panel"><div className="overline">IMPACT SNAPSHOT</div><h2>Make every purchase count.</h2><div className="impact-number">284<span> kg</span></div><p>estimated e-waste avoided this quarter</p><div className="impact-bar"><span /></div><div className="impact-foot"><span>+18% vs last quarter</span><span>Q3 2026</span></div></div></section>
        </section>
      </div>
    </main>
  );
}
