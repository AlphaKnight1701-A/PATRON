"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { Building2, Camera, Check, ClipboardList, FileSpreadsheet, History, Laptop, Paperclip, RefreshCw, Settings, UserCircle } from "lucide-react";

type Agent = "Laptop components" | "Workplace supplies" | "Digital Growth AI";
type ModalContent = { title: string; body: string; action?: string } | null;
type BusinessProfile = { type: string; size: string; scope: string; description: string };

const defaultBusinessProfile: BusinessProfile = { type: "IT services and repair", size: "Small team (2-25)", scope: "Regional / multi-city", description: "We repair and support laptops for local businesses." };
const businessTypes = ["IT services and repair", "Hardware store", "Construction and trades", "Restaurant and hospitality", "Professional services", "Other Hispanic-owned SMB"];
const businessSizes = ["Solo operator", "Small team (2-25)", "Growing team (26-100)", "Enterprise supplier (100+)"];
const businessScopes = ["Neighborhood / local", "Regional / multi-city", "Statewide", "National contracts"];

const agentCards: { name: Agent; eyebrow: string; description: string; color: string; icon: ReactNode }[] = [
  { name: "Laptop components", eyebrow: "TECH COMPONENT FINDER", description: "Find compatible laptop parts through secondary-market sourcing.", color: "coral", icon: <Laptop size={22} strokeWidth={1.7} /> },
  { name: "Workplace supplies", eyebrow: "HOME DEPOT PRO PROCUREMENT", description: "Source localized supplies that make teams and spaces work better.", color: "blue", icon: <Building2 size={22} strokeWidth={1.7} /> },
  { name: "Digital Growth AI", eyebrow: "AUTHENTIC PRODUCT CONTENT", description: "Authenticate product imagesand Improve digital selling strategies", color: "yellow", icon: <Camera size={22} strokeWidth={1.7} /> },
];

const resultSets: Record<Agent, { title: string; subtitle: string; price: string; meta: string; score: string }[]> = {
  "Laptop components": [
    { title: "14-inch laptop battery", subtitle: "63Wh • compatible replacement • refurbished", price: "$48.00", meta: "Marketplace / 2 day delivery", score: "96" },
    { title: "FHD laptop display panel", subtitle: "14 inch • tested pull • slim bezel", price: "$119.00", meta: "Marketplace / 4 day delivery", score: "91" },
    { title: "65W USB-C power adapter", subtitle: "Universal PD • grade A", price: "$22.50", meta: "Certified reseller / 3 day delivery", score: "88" },
  ],
  "Workplace supplies": [
    { title: "Ergonomic task chairs", subtitle: "Adjustable lumbar • 24 units", price: "$4,320", meta: "Local partner / delivery Friday", score: "94" },
    { title: "Modular workspace lighting", subtitle: "LED • low energy • 18 fixtures", price: "$1,286", meta: "Local partner / delivery tomorrow", score: "89" },
    { title: "Team room acoustic panels", subtitle: "Recycled felt • 12 pack", price: "$774", meta: "Local partner / pickup today", score: "86" },
  ],
  "Digital Growth AI": [
    { title: "Authentic product photo plan", subtitle: "Three real-world angles for a refurbished laptop listing", price: "3 concepts", meta: "eBay content / Gen Z-ready", score: "98" },
    { title: "Short-form content ideas", subtitle: "Behind-the-scenes and proof-of-condition story prompts", price: "6 ideas", meta: "Social content / review ready", score: "93" },
    { title: "Digital selling strategy", subtitle: "Trust-first listing improvements for younger buyers", price: "Ready", meta: "Marketplace strategy / review ready", score: "90" },
  ],
};

function makeResponse(agent: Agent, query: string, profile: BusinessProfile) {
  const cleanQuery = query.trim() || "your latest procurement request";
  const context = `${profile.type}, ${profile.size}, ${profile.scope}`;
  const guidance = agent === "Laptop components" ? "I prioritized compatible, repair-friendly inventory and delivery reliability." : agent === "Workplace supplies" ? "I prioritized practical quantities, regional availability, and workplace impact." : "I prioritized authentic product photography, content ideas, and trust-building digital selling.";
  return `For your ${context} operation, I routed “${cleanQuery}” to ${agent}. ${guidance} The demo orchestrator found ${resultSets[agent].length} high-confidence options or verification findings.`;
}

export default function Home() {
  const [activeAgent, setActiveAgent] = useState<Agent>("Laptop components");
  const [query, setQuery] = useState("I need 15 compatible laptop batteries and 10 replacement display panels.");
  const [response, setResponse] = useState("I’m ready to source laptop components through eBay, find workplace supplies through Home Depot Pro, or help your business reach Gen Z and Millennial customers with authentic digital content.");
  const [uploadedFile, setUploadedFile] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [modal, setModal] = useState<ModalContent>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(defaultBusinessProfile);
  const [businessDraft, setBusinessDraft] = useState<BusinessProfile>(defaultBusinessProfile);
  const [typedGreeting, setTypedGreeting] = useState("");
  const [pricingOpen, setPricingOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [exportType, setExportType] = useState("Excel workbook (.xlsx)");
  const [exportScope, setExportScope] = useState("Current workspace results");

  const currentDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()).toUpperCase();

  useEffect(() => {
    const greeting = `Good morning, Diogo Ortiz.`;
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedGreeting(greeting.slice(0, index));
      if (index === greeting.length) window.clearInterval(timer);
    }, 42);
    return () => window.clearInterval(timer);
  }, []);

  function showModal(title: string, body: string, action?: string) {
    setModal({ title, body, action });
  }

  function submitQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRunning(true);
    window.setTimeout(() => {
      setResponse(makeResponse(activeAgent, query, businessProfile));
      setIsRunning(false);
    }, 450);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setUploadedFile(event.target.files?.[0]?.name ?? "");
    setActiveAgent("Digital Growth AI");
    setResponse("Photo received in demo mode. Digital Growth AI is ready to recommend authentic product photography and content ideas.");
  }

  const activeResults = resultSets[activeAgent];
  const activeAgentCard = agentCards.find((agent) => agent.name === activeAgent);

  function saveBusinessProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusinessProfile(businessDraft);
    setBusinessOpen(false);
    setResponse(`Business context saved for ${businessDraft.type}. Future demo recommendations will account for ${businessDraft.size} operations serving a ${businessDraft.scope.toLowerCase()} market.`);
  }

  function resizeChat(event: ChangeEvent<HTMLTextAreaElement>) {
    setQuery(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 180)}px`;
  }

  function downloadDemoExport() {
    const rows = activeResults.map((result) => `${result.title},${result.price},${result.score}%`).join("\n");
    const blob = new Blob([`Patron demo export\nScope,${exportScope}\nFormat,${exportType}\n\nTitle,Value,Match\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "patron-demo-export.csv";
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }

  return (
    <main className="app-shell">
      <header className="topbar"><button className="brand-lockup brand-home" aria-label="Return to command center" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="brand-mark">P</span><span>patron</span><span className="brand-divider" /> <span className="workspace-label">SUPPLY CHAIN DESK</span></button><div className="topbar-actions"><span className="demo-pill"><span className="status-dot" /> DEMO MODE</span><div className="account-wrap"><button className="avatar" aria-label="Open account menu" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)}>JD</button>{accountOpen && <div className="account-menu"><div className="account-name"><UserCircle size={18} /> <span><strong>Diogo Ortiz</strong><small>Acme IT Services</small></span></div><button onClick={() => { setAccountOpen(false); showModal("Account settings", "Identity, organization membership, and permissions will be connected in the account milestone.", "Identity connector pending"); }}><UserCircle size={15} /> Account settings</button><button onClick={() => { setAccountOpen(false); setBusinessDraft(businessProfile); setBusinessOpen(true); }}><Settings size={15} /> Business preferences</button></div>}</div></div></header>
      <div className="workspace">
        <aside className="sidebar"><div className="side-heading">WORKSPACE</div><nav className="nav-list" aria-label="Primary navigation"><button className="nav-item active" onClick={() => showModal("Command center", "You are already here. Choose one of the three solution workspaces to route a request.")}><span className="nav-icon">⌂</span> Command center</button><button className="nav-item" onClick={() => showModal("Procurement queue", "Three demo requests are staged for human review. Live persistence and approvals are part of the next backend milestone.", "3 requests staged")}><span className="nav-icon">◫</span> Procurement queue <span className="nav-count">3</span></button><button className="nav-item" onClick={() => showModal("Visual ledger", "The ledger connects product imagery, sourcing records, timestamps, and review events. The current evidence is a local preview.", "Evidence connector pending")}><span className="nav-icon">◎</span> Visual ledger</button><button className="nav-item" onClick={() => showModal("Compliance reports", "Reports will combine sourcing, supplier diversity, and reviewed sustainability evidence. No external claims are generated in demo mode.", "Human approval required")}><span className="nav-icon">▤</span> Compliance reports</button></nav><div className="side-heading agent-heading">SOLUTIONS</div><div className="mini-agents">{agentCards.map((agent) => <button key={agent.name} className={`mini-agent ${activeAgent === agent.name ? "selected" : ""}`} onClick={() => setActiveAgent(agent.name)}><span className={`mini-icon ${agent.color}`}>{agent.icon}</span><span>{agent.name}</span><span className="agent-status" /></button>)}</div><div className="sidebar-bottom"><div className="side-heading">WORKFORCE ACCELERATOR</div><p>4 active learners are reviewing today&apos;s sourcing plans.</p><button className="text-button" onClick={() => showModal("Workforce accelerator", "Learners can review sourcing plans, practice marketplace analysis, and receive mentor feedback here once the talent workspace is connected.", "4 learners active")}>Open talent view <span>↗</span></button></div></aside>
        <section className="main-content"><div className="page-intro"><div><div className="overline">{currentDate}</div><h1>{typedGreeting}<span className="typing-caret" aria-hidden="true" /></h1><p>Coordinate your next move across the supply chain.</p></div><button className="outline-button" onClick={() => showModal("Export activity", "Demo activity is ready to export once live records are connected.", "Export connector pending")}>Export activity <span>↓</span></button></div>
          <section className="agent-grid" aria-label="Patron solutions">{agentCards.map((agent) => <button key={agent.name} className={`agent-card ${activeAgent === agent.name ? "agent-selected" : ""}`} onClick={() => setActiveAgent(agent.name)}><div className="agent-card-top"><span className={`agent-icon ${agent.color}`}>{agent.icon}</span><span className="card-arrow">↗</span></div><div className="overline">{agent.eyebrow}</div><h2>{agent.name}</h2><p>{agent.description}</p></button>)}</section>
          <div className="section-heading"><div><div className="overline">CENTRAL AI ORCHESTRATOR</div><h2>What are we solving today?</h2></div><span className="connection-label"><span className="status-dot" /> Demo intelligence online</span></div>
          <form className="command-panel" onSubmit={submitQuery}><div className="command-top"><span className={`command-icon ${activeAgentCard?.color}`}>{activeAgentCard?.icon}</span><div><span className="command-label">ROUTING TO <strong>{activeAgent.toUpperCase()}</strong></span><textarea value={query} onChange={resizeChat} aria-label="Describe your supply chain request" rows={1} /></div></div><div className="command-actions"><label className="attach-button"><Paperclip size={14} /><span className="attach-copy">Add product photo</span><input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFile} /></label><small className="upload-limit">JPEG or PDF up to 25 MB · Pro and Premium unlock expanded limits</small>{uploadedFile && <span className="file-name">{uploadedFile}</span>}<button className="run-button" type="submit" disabled={isRunning}>{isRunning ? "..." : "Run"} <span>→</span></button></div></form>
          <div className="response-line"><span className="response-orb">✦</span><p>{response}</p></div>
          <section className="results-section"><div className="section-heading compact"><div><div className="overline">RANKED OPPORTUNITIES</div><h2>{activeAgent === "Digital Growth AI" ? "Growth recommendations" : "Recommended sourcing plan"}</h2></div><button className="text-button" onClick={() => setResultsOpen(true)}>View all <span>↗</span></button></div><div className="result-list">{activeResults.map((result, index) => <article className="result-row" key={result.title}><span className="rank">0{index + 1}</span><div className="result-main"><h3>{result.title}</h3><p>{result.subtitle}</p></div><div className="result-meta"><strong>{result.price}</strong><span>{result.meta}</span></div><div className="score"><strong>{result.score}</strong><span>match</span></div><button className="row-action" aria-label={`Open ${result.title}`} onClick={() => showModal(result.title, `${result.subtitle}. This demo recommendation changes with the active solution and business profile.`, `${result.score}% demo match`)}>↗</button></article>)}</div></section>
          <section className="bottom-grid"><div className="ledger-panel"><div className="section-heading compact"><div><div className="overline">VISUAL SUPPLY CHAIN LEDGER</div><h2>Supply verification</h2></div><button className="text-button" onClick={() => showModal("Visual ledger", "The demo ledger is ready for the next shipment verification. Live photo evidence, timestamps, and purchase-order links will be stored after the vision connector is enabled.", "Ledger preview")}>Open ledger <span>↗</span></button></div><button className="ledger-item" onClick={() => showModal("Incoming laptop batch verified", "The shipment passed the demo condition check and is linked to PO-1048.", "Verified")}><span className="ledger-icon coral"><Check size={16} /></span><span><strong>Incoming laptop batch verified</strong><small>Photo evidence linked to PO-1048</small></span><time>12 min ago</time></button><button className="ledger-item" onClick={() => showModal("Supplier diversity record updated", "The supplier record has new ownership evidence ready for human review.", "Updated")}><span className="ledger-icon blue"><RefreshCw size={16} /></span><span><strong>Supplier diversity record updated</strong><small>Ownership proof • review ready</small></span><time>Yesterday</time></button></div><div className="impact-panel"><div className="overline">CIRCULAR ECONOMY SNAPSHOT</div><h2>Make every purchase count.</h2><div className="impact-number">284<span> kg</span></div><p>estimated e-waste avoided this quarter</p><div className="impact-bar"><span /></div><div className="impact-foot"><span>+18% vs last quarter</span><span>Q3 2026</span></div></div></section>
          <section className="sponsors-section"><div><div className="overline">BUILT WITH THE ECOSYSTEM</div><h2>Stronger supply chains, together.</h2></div><div className="sponsor-grid"><div className="sponsor-item"><Image src="/sponsors/approved-png/dell.png" alt="Dell Technologies" width={180} height={52} /><span>Laptop component context</span></div><div className="sponsor-item"><Image src="/sponsors/approved-png/home_depot.png" alt="The Home Depot Pro" width={180} height={52} /><span>Workplace supply context</span></div><div className="sponsor-item"><Image src="/sponsors/approved-png/ebay.png" alt="eBay" width={180} height={52} /><span>Secondary-market sourcing</span></div></div></section>
          <section className="quick-actions"><div><div className="overline">BUSINESS INTELLIGENCE</div><h2>Make the workspace yours.</h2></div><div className="quick-action-list"><button onClick={() => setPricingOpen(true)}><ClipboardList size={14} /> Patron plans <span>→</span></button><button onClick={() => setExportOpen(true)}><FileSpreadsheet size={14} /> Export dataset <span>→</span></button><button onClick={() => setHistoryOpen(true)}><History size={14} /> Past searches <span>→</span></button></div></section>
        </section>
      </div>
      {pricingOpen && <div className="modal-backdrop" role="presentation" onClick={() => setPricingOpen(false)}><section className="modal-card pricing-card" role="dialog" aria-modal="true" aria-labelledby="pricing-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close pricing" onClick={() => setPricingOpen(false)}>×</button><div className="modal-spark"><ClipboardList size={18} /></div><div className="overline">PATRON PLANS</div><h2 id="pricing-title">Choose your growth level</h2><p>Demo-only plan cards show how limits and connected intelligence could scale.</p><div className="plan-grid"><article><span>Patron Pro</span><strong>$49<small>/month</small></strong><p>Expanded uploads, saved business context, and richer sourcing workflows.</p><button className="plan-button" onClick={() => showModal("Patron Pro", "Pro plan selection is a demo preview. Billing and account entitlements are not connected.", "Plan preview")}>Select Pro</button></article><article className="featured-plan"><span>Patron Premium</span><strong>$129<small>/month</small></strong><p>Advanced growth insights, higher limits, and priority AI workflow support.</p><button className="plan-button" onClick={() => showModal("Patron Premium", "Premium plan selection is a demo preview. Billing and account entitlements are not connected.", "Plan preview")}>Select Premium</button></article></div></section></div>}
      {exportOpen && <div className="modal-backdrop" role="presentation" onClick={() => setExportOpen(false)}><section className="modal-card business-card" role="dialog" aria-modal="true" aria-labelledby="export-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close export" onClick={() => setExportOpen(false)}>×</button><div className="modal-spark"><FileSpreadsheet size={18} /></div><div className="overline">DATA WORKSPACE</div><h2 id="export-title">Export your dataset</h2><p>Configure a demo extract for Excel or a Power BI-ready semantic model.</p><form className="business-form" onSubmit={(event) => { event.preventDefault(); downloadDemoExport(); }}><label>What to export<select value={exportScope} onChange={(event) => setExportScope(event.target.value)}><option>Current workspace results</option><option>All solution activity</option><option>Supply verification and impact data</option></select></label><label>File type<select value={exportType} onChange={(event) => setExportType(event.target.value)}><option>Excel workbook (.xlsx)</option><option>Power BI dataset (.csv)</option><option>Semantic model starter (.json)</option></select></label><button className="run-button modal-button" type="submit">Download demo export <span>↓</span></button></form></section></div>}
      {historyOpen && <div className="modal-backdrop" role="presentation" onClick={() => setHistoryOpen(false)}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="history-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close search history" onClick={() => setHistoryOpen(false)}>×</button><div className="modal-spark"><History size={18} /></div><div className="overline">SEARCH HISTORY</div><h2 id="history-title">Past searches</h2><p className="history-note">Generated demo searches show the kinds of requests a business can revisit.</p><div className="history-list"><button onClick={() => { setQuery("Find 20 laptop batteries for our regional repair contracts"); setHistoryOpen(false); }}>Find 20 laptop batteries for regional repair contracts <span>↗</span></button><button onClick={() => { setQuery("Create a photo content plan for refurbished laptops"); setActiveAgent("Digital Growth AI"); setHistoryOpen(false); }}>Create a photo content plan for refurbished laptops <span>↗</span></button><button onClick={() => { setQuery("Source ergonomic seating for a 25-person office"); setActiveAgent("Workplace supplies"); setHistoryOpen(false); }}>Source ergonomic seating for a 25-person office <span>↗</span></button></div></section></div>}
      {resultsOpen && <div className="modal-backdrop" role="presentation" onClick={() => setResultsOpen(false)}><section className="modal-card results-card" role="dialog" aria-modal="true" aria-labelledby="results-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close opportunities" onClick={() => setResultsOpen(false)}>×</button><div className="modal-spark"><History size={18} /></div><div className="overline">ALL OPPORTUNITIES</div><h2 id="results-title">{activeAgent}</h2><div className="expanded-results">{activeResults.map((result) => <button key={result.title} onClick={() => showModal(result.title, `${result.subtitle}. Demo result only; connect the provider before making a purchasing or marketing decision.`, `${result.score}% demo match`)}><span><strong>{result.title}</strong><small>{result.subtitle}</small></span><b>{result.score}%</b></button>)}</div></section></div>}
      {businessOpen && <div className="modal-backdrop" role="presentation" onClick={() => setBusinessOpen(false)}><section className="modal-card business-card" role="dialog" aria-modal="true" aria-labelledby="business-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close business preferences" onClick={() => setBusinessOpen(false)}>×</button><div className="modal-spark"><Settings size={18} /></div><div className="overline">BUSINESS INTELLIGENCE</div><h2 id="business-title">Describe your business</h2><p>These preferences help the demo orchestrator size quantities, prioritize sources, and tailor growth output.</p><form className="business-form" onSubmit={saveBusinessProfile}><label>Business type<select value={businessDraft.type} onChange={(event) => setBusinessDraft({ ...businessDraft, type: event.target.value })}>{businessTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label>Operation size<select value={businessDraft.size} onChange={(event) => setBusinessDraft({ ...businessDraft, size: event.target.value })}>{businessSizes.map((size) => <option key={size}>{size}</option>)}</select></label><label>Market scope<select value={businessDraft.scope} onChange={(event) => setBusinessDraft({ ...businessDraft, scope: event.target.value })}>{businessScopes.map((scope) => <option key={scope}>{scope}</option>)}</select></label><label>Business description<textarea value={businessDraft.description} onChange={(event) => setBusinessDraft({ ...businessDraft, description: event.target.value })} rows={3} /></label><button className="run-button modal-button" type="submit">Save business context <span>→</span></button></form></section></div>}
      {modal && <div className="modal-backdrop" role="presentation" onClick={() => setModal(null)}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close dialog" onClick={() => setModal(null)}>×</button><div className="modal-spark">✦</div><div className="overline">PATRON UPDATE</div><h2 id="modal-title">{modal.title}</h2><p>{modal.body}</p>{modal.action && <div className="modal-status"><span className="status-dot" /> {modal.action}</div>}<button className="run-button modal-button" onClick={() => setModal(null)}>Got it <span>→</span></button></section></div>}
    </main>
  );
}
