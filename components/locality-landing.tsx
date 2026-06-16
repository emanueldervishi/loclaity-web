"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Code2,
  Command,
  Globe2,
  Menu,
  Network,
  List,
  Plus,
  Search,
  Sparkles,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { plans } from "@/lib/plans";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = ["Products", "Features", "Pricing", "Docs", "Company"];
const demoTabs = ["Import Sessions", "Structured Memory", "Local Search", "Ask Local AI"];
const faqItems = [
  ["Does Locality upload my code or agent history?", "No. Raw sessions, imports, and indexing stay on your computer. The web account handles identity, billing, and plan access."],
  ["Which coding agents are supported?", "Codex is available first. Claude Code, Cursor, Copilot, and Gemini CLI are included in the multi-agent roadmap."],
  ["Where does my project memory live?", "Locality writes readable Markdown into your Obsidian vault, so the result stays portable and under your control."],
  ["Can I search old coding sessions?", "Yes. Locality indexes imported sessions and keeps commands, patches, decisions, and fixes searchable by project."],
  ["Can Locality use a local model?", "Yes. Local AI connects through a loopback-only bridge and can use Ollama to answer from your imported project history."],
  ["Is there a free plan?", "Yes. The Free plan includes the Codex importer, manual imports, and local Obsidian notes."],
];

const testimonials = [
  ["The fix was already in an old Codex session. Locality made it searchable before we repeated the investigation.", "Maya R.", "Staff Engineer"],
  ["Our architecture decisions now survive beyond the chat window and remain readable in Obsidian.", "Daniel K.", "Independent Developer"],
  ["I can switch agents without losing the project context that took weeks to build.", "Priya S.", "Product Engineer"],
  ["Local AI answers from work that actually happened in the repository, with sources I can inspect.", "Jon B.", "Engineering Lead"],
  ["The Markdown output means our memory is useful even without Locality running.", "Elena C.", "Founder"],
  ["Setup was quick, and keeping raw history local removed the biggest adoption concern.", "Marcus T.", "Security Engineer"],
];

type LocalityLandingProps = {
  signedIn: boolean;
  primaryHref: string;
  currentPlan: string;
};

function Logo() {
  return (
    <Link className="logo" href="#top" aria-label="Locality home">
      <span className="logo-image-tile">
        <Image
          src="/logo.png"
          alt=""
          width={30}
          height={30}
          className="logo-image"
          priority
        />
      </span>
      <span>Locality</span>
    </Link>
  );
}

function Header({ signedIn, primaryHref }: Pick<LocalityLandingProps, "signedIn" | "primaryHref">) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className={open ? "nav open" : "nav"} aria-label="Main">
          {navItems.map((item) => (
            <a
              href={item === "Pricing" ? "#pricing" : item === "Docs" ? "#workflow" : item === "Company" ? "#faq" : "#features"}
              key={item}
            >
              {item}
              {item === "Products" && <ChevronDown size={13} />}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link className="button button-small" href={primaryHref}>
            {signedIn ? "Dashboard" : "Get Started"}
          </Link>
          <button className="menu-button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}

function Eyebrow({ icon = "sparkles" }: { icon?: "sparkles" | "globe" | "terminal" }) {
  return <div className="eyebrow">{icon === "globe" ? <Globe2 size={16} /> : icon === "terminal" ? <Terminal size={16} /> : <Sparkles size={16} />}<span>Locality</span></div>;
}

function SectionHeading({ title, text, icon }: { title: React.ReactNode; text: string; icon?: "sparkles" | "globe" | "terminal" }) {
  return <div className="section-heading"><Eyebrow icon={icon} /><h2>{title}</h2><p>{text}</p></div>;
}

function ImportVisual() {
  const sessions = [
    ["Codex", "locality-web", "Imported"],
    ["Claude Code", "checkout-service", "Indexing"],
    ["Cursor", "docs-site", "Queued"],
  ];

  return (
    <div className="import-visual-card">
      <div className="visual-card-head">
        <span><Terminal size={15} /> Session importer</span>
        <small>Local only</small>
      </div>
      <div className="import-command"><span>$</span> locality import --all <i /></div>
      <div className="import-list">
        {sessions.map(([agent, project, status], index) => (
          <div className="import-row" key={project}>
            <span className="import-agent">{agent.slice(0, 1)}</span>
            <div><strong>{project}</strong><small>{agent} session</small></div>
            <span className={`import-status status-${index}`}>{status}</span>
            <span className="import-row-bar" aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="import-footer">
        <span><Check size={13} /> 18 decisions</span>
        <span>42 commands</span>
        <span>7 patches</span>
      </div>
    </div>
  );
}

function MemoryGraphVisual() {
  return (
    <div className="memory-graph-card">
      <div className="memory-map-stage">
        <svg className="memory-map-lines" viewBox="0 0 640 360" aria-hidden="true">
          <path className="memory-line line-a" d="M176 105 C214 88 230 118 238 168" />
          <path className="memory-line line-b" d="M402 168 C412 118 436 88 464 105" />
          <path className="memory-line line-c" d="M402 192 C422 246 438 260 464 255" />
          <path className="memory-line line-d" d="M176 255 C218 278 230 244 238 192" />
        </svg>
        <div className="graph-node node-center"><Network /><span>Project memory</span><small>Obsidian vault</small></div>
        <div className="graph-node node-a"><Command /><span>Sessions</span><small>24 imported</small></div>
        <div className="graph-node node-b"><Code2 /><span>Decisions</span><small>Architecture notes</small></div>
        <div className="graph-node node-c"><Search /><span>Search</span><small>Ranked locally</small></div>
        <div className="graph-node node-d"><Terminal /><span>Commands</span><small>Replay context</small></div>
        <div className="memory-note note-one">auth.ts</div>
        <div className="memory-note note-two">billing.ts</div>
      </div>
    </div>
  );
}

function SearchVisual() {
  return (
    <div className="search-visual-card">
      <div className="search-query"><Search size={17} /><span>Why did authentication change?</span><kbd>Ctrl K</kbd></div>
      <div className="search-answer">
        <span className="answer-icon"><Sparkles size={16} /></span>
        <div>
          <small>Answer from local memory</small>
          <p>Database sessions unified browser login, CLI device approval, plan checks, and token revocation.</p>
        </div>
      </div>
      <div className="source-stack">
        {["auth.ts", "device/approve", "billing.ts"].map((source, index) => (
          <div className={`source-item source-item-${index + 1}`} key={source}>
            <span>0{index + 1}</span><strong>{source}</strong><small>{index === 0 ? "96% match" : "Related context"}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentFlowVisual() {
  const integrations = [
    [Command, "Codex"],
    [Sparkles, "Claude"],
    [Code2, "Cursor"],
    [Terminal, "Ollama"],
  ] as const;

  return (
    <div className="agent-flow-card">
      <svg className="flow-map-lines" viewBox="0 0 640 380" aria-hidden="true">
        <path className="flow-path path-a" d="M170 100 C240 102 260 176 320 190" />
        <path className="flow-path path-b" d="M470 100 C400 102 380 176 320 190" />
        <path className="flow-path path-c" d="M170 280 C240 278 260 204 320 190" />
        <path className="flow-path path-d" d="M470 280 C400 278 380 204 320 190" />
      </svg>
      <div className="flow-grid">
        {integrations.map(([Icon, name]) => (
          <div className="flow-tool" key={name}>
            <span><Icon size={17} /></span>
            <strong>{name}</strong>
            <small>{name === "Ollama" ? "Local AI" : "Agent history"}</small>
          </div>
        ))}
      </div>
      <div className="flow-core"><Network size={25} /><span>Locality</span><small>Shared memory</small></div>
      <div className="flow-status-strip"><span>Import</span><span>Normalize</span><span>Recall</span></div>
    </div>
  );
}

function DecisionTimelineVisual() {
  const events = [
    ["09:18", "Rejected JWT refresh flow", "Race condition during CLI approval"],
    ["10:42", "Chose database sessions", "One revocation model across web and CLI"],
    ["11:07", "Updated auth boundary", "Decision saved with four source files"],
  ];

  return (
    <div className="decision-timeline">
      <div className="timeline-toolbar">
        <span><Command size={14} /> Session 42</span>
        <small>checkout-service</small>
      </div>
      <div className="timeline-track" aria-hidden="true">
        <span className="timeline-base" />
        <span className="timeline-segment segment-one" />
        <span className="timeline-segment segment-two" />
      </div>
      <div className="timeline-events">
        {events.map(([time, title, detail], index) => (
          <article className={`timeline-event timeline-event-${index + 1}`} key={time}>
            <time>{time}</time>
            <span className="timeline-dot" />
            <div>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
          </article>
        ))}
      </div>
      <div className="decision-stamp"><Check size={15} /><span>Decision preserved</span></div>
    </div>
  );
}

function ContextHandoffVisual() {
  return (
    <div className="handoff-visual">
      <div className="handoff-agent handoff-source">
        <span className="handoff-icon"><Command size={18} /></span>
        <div><small>Previous agent</small><strong>Codex</strong></div>
        <i>Finished</i>
      </div>
      <div className="handoff-lane" aria-hidden="true">
        <span className="handoff-rail" />
        <div className="context-packet">
          <Network size={15} />
          <span>Project context</span>
          <small>12.8 KB</small>
        </div>
        <span className="handoff-tick tick-one" />
        <span className="handoff-tick tick-two" />
        <span className="handoff-tick tick-three" />
      </div>
      <div className="handoff-agent handoff-target">
        <span className="handoff-icon"><Sparkles size={18} /></span>
        <div><small>Next agent</small><strong>Claude Code</strong></div>
        <i>Ready</i>
      </div>
      <div className="handoff-context">
        <span><Check size={13} /> Architecture decisions</span>
        <span><Check size={13} /> Failed approaches</span>
        <span><Check size={13} /> Files and commands</span>
      </div>
    </div>
  );
}

function DemoPanel({ tab }: { tab: number }) {
  const panels = [
    { src: "/landing-tabs/import-sessions.png", alt: "Locality importing coding sessions into searchable project memory" },
    { src: "/landing-tabs/structured-memory.png", alt: "Structured project memory connected across files, notes, and decisions" },
    { src: "/landing-tabs/local-search.png", alt: "Locality searching local project memory across saved context" },
    { src: "/landing-tabs/ask-local-ai.png", alt: "Local AI answering from connected Locality project memory" },
  ];
  const panel = panels[tab] ?? panels[0];

  return (
    <div className="demo-image-panel" key={panel.src}>
      <Image src={panel.src} alt={panel.alt} fill sizes="(max-width: 800px) 100vw, 1280px" priority={tab === 0} />
    </div>
  );
}

function LayersBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M7.62758 1.09876C7.74088 1.03404 7.8691 1 7.99958 1C8.13006 1 8.25828 1.03404 8.37158 1.09876L13.6216 4.09876C13.7363 4.16438 13.8316 4.25915 13.8979 4.37347C13.9642 4.48779 13.9992 4.6176 13.9992 4.74976C13.9992 4.88191 13.9642 5.01172 13.8979 5.12604C13.8316 5.24036 13.7363 5.33513 13.6216 5.40076L8.37158 8.40076C8.25828 8.46548 8.13006 8.49952 7.99958 8.49952C7.8691 8.49952 7.74088 8.46548 7.62758 8.40076L2.37758 5.40076C2.26287 5.33513 2.16753 5.24036 2.10123 5.12604C2.03492 5.01172 2 4.88191 2 4.74976C2 4.6176 2.03492 4.48779 2.10123 4.37347C2.16753 4.25915 2.26287 4.16438 2.37758 4.09876L7.62758 1.09876Z" fill="currentColor" />
      <path d="M2.56958 7.23928L2.37758 7.34928C2.26287 7.41491 2.16753 7.50968 2.10123 7.624C2.03492 7.73831 2 7.86813 2 8.00028C2 8.13244 2.03492 8.26225 2.10123 8.37657C2.16753 8.49089 2.26287 8.58566 2.37758 8.65128L7.62758 11.6513C7.74088 11.716 7.8691 11.75 7.99958 11.75C8.13006 11.75 8.25828 11.716 8.37158 11.6513L13.6216 8.65128C13.7365 8.58573 13.8321 8.49093 13.8986 8.3765C13.965 8.26208 14 8.13211 14 7.99978C14 7.86745 13.965 7.73748 13.8986 7.62306C13.8321 7.50864 13.7365 7.41384 13.6216 7.34828L13.4296 7.23828L9.11558 9.70328C8.77568 9.89744 8.39102 9.99956 7.99958 9.99956C7.60814 9.99956 7.22347 9.89744 6.88358 9.70328L2.56958 7.23928Z" fill="currentColor" />
      <path d="M2.37845 10.5993L2.57045 10.4893L6.88445 12.9533C7.22435 13.1474 7.60901 13.2496 8.00045 13.2496C8.39189 13.2496 8.77656 13.1474 9.11645 12.9533L13.4305 10.4883L13.6225 10.5983C13.7374 10.6638 13.833 10.7586 13.8994 10.8731C13.9659 10.9875 14.0009 11.1175 14.0009 11.2498C14.0009 11.3821 13.9659 11.5121 13.8994 11.6265C13.833 11.7409 13.7374 11.8357 13.6225 11.9013L8.37245 14.9013C8.25915 14.966 8.13093 15 8.00045 15C7.86997 15 7.74175 14.966 7.62845 14.9013L2.37845 11.9013C2.2635 11.8357 2.16795 11.7409 2.10148 11.6265C2.03501 11.5121 2 11.3821 2 11.2498C2 11.1175 2.03501 10.9875 2.10148 10.8731C2.16795 10.7586 2.2635 10.6638 2.37845 10.5983V10.5993Z" fill="currentColor" />
    </svg>
  );
}

type TabParticle = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  alpha: number;
  phase: number;
};

function TabParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 40;
    let particles: TabParticle[] = [];

    const reset = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth ?? 320;
      height = 40;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.max(34, Math.round(width / 7)) }, (_, index) => ({
        x: Math.random() * width,
        y: 3 + Math.random() * 34,
        radius: .45 + Math.random() * 1.25,
        speed: 5 + Math.random() * 13,
        drift: (Math.random() - .5) * 6,
        alpha: .18 + Math.random() * .6,
        phase: index * .47,
      }));
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      const seconds = time / 1000;
      const wash = context.createRadialGradient(width * .5, 2, 0, width * .5, 8, width * .58);
      wash.addColorStop(0, "rgba(14,165,233,.16)");
      wash.addColorStop(.55, "rgba(56,189,248,.055)");
      wash.addColorStop(1, "rgba(56,189,248,0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      for (const particle of particles) {
        const x = (particle.x + seconds * particle.speed) % (width + 8) - 4;
        const y = particle.y + Math.sin(seconds * 1.7 + particle.phase) * particle.drift;
        const pulse = .55 + Math.sin(seconds * 2.2 + particle.phase) * .25;
        context.fillStyle = `rgba(14,165,233,${particle.alpha * pulse})`;
        const size = Math.max(1, Math.round(particle.radius * 1.45));
        context.fillRect(Math.round(x), Math.round(y), size, size);
      }
      frame = window.requestAnimationFrame(render);
    };

    reset();
    const observer = new ResizeObserver(reset);
    observer.observe(canvas.parentElement ?? canvas);
    frame = window.requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="tab-particle-canvas" aria-hidden="true" />;
}

function DitherBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let width = 0;
    const height = 56;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth ?? 1280;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#050505";
      context.fillRect(0, 0, width, height);
      const cell = 4;
      const offset = time * .018;
      for (let y = 0; y < height; y += cell) {
        for (let x = 0; x < width; x += cell) {
          const wave = Math.sin((x + offset) * .026) + Math.cos((y - offset * .28) * .19) + Math.sin((x + y) * .055);
          const noise = Math.sin(x * 12.9898 + y * 78.233 + Math.floor(time / 90)) * 43758.5453;
          const value = wave + (noise - Math.floor(noise)) * 2.4;
          if (value > .65) {
            const alpha = Math.min(.95, .35 + (value - .65) * .24);
            context.fillStyle = `rgba(255,255,255,${alpha})`;
            context.fillRect(x, y, value > 2.2 ? 3 : 2, value > 1.45 ? 3 : 2);
          }
        }
      }
      frame = window.requestAnimationFrame(render);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement ?? canvas);
    frame = window.requestAnimationFrame(render);
    return () => { observer.disconnect(); window.cancelAnimationFrame(frame); };
  }, []);

  return <div className="dither-banner" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}

function Hero({ primaryHref }: Pick<LocalityLandingProps, "primaryHref">) {
  const [tab, setTab] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTab((current) => (current + 1) % demoTabs.length);
      setCycle((current) => current + 1);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [tab, cycle]);

  function selectTab(index: number) {
    setTab(index);
    setCycle((current) => current + 1);
  }

  return <>
    <section className="hero" id="top">
      <div className="hero-aurora hero-aurora-base" />
      <div className="hero-aurora hero-aurora-blur" />
      <div className="hero-content">
        <div className="announcement"><span className="announcement-icon"><LayersBadgeIcon /></span><span>Local memory for coding agents</span></div>
        <h1>Your agents forget. Locality remembers.</h1>
        <p>Turn every coding session into structured, searchable project knowledge while your raw history stays on your computer.</p>
        <Link className="hero-button" href={primaryHref}>Get Started</Link>
      </div>
    </section>
    <section className="product-demo">
      <div className="demo-tabs">{demoTabs.map((item, index) => <button className={tab === index ? "active" : ""} onClick={() => selectTab(index)} key={item}>{tab === index && <span className="tab-canvas-wrap" aria-hidden="true"><TabParticles /></span>}<span className="tab-label">{item}</span>{tab === index && <span className="tab-progress-track" aria-hidden="true"><span className="tab-progress" key={cycle} /></span>}</button>)}</div>
      <div className="demo-stage">
        <DemoPanel tab={tab} />
      </div>
    </section>
  </>;
}

function TrustStrip() {
  const logos = [[Command, "Codex"], [Sparkles, "Claude Code"], [Code2, "Cursor"], [Globe2, "Copilot"], [Terminal, "Gemini CLI"], [Network, "Ollama"]] as const;
  return <section className="trust"><p>One memory across the tools you <span>already use</span></p><div className="logo-row">{logos.map(([Icon, name]) => <div key={name}><Icon /> {name}</div>)}</div></section>;
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="mini-feature"><div className="mini-icon">{icon}</div><h4>{title}</h4><p>{text}</p></div>;
}

function FeatureShowcase() {
  return <section id="features" className="bounded section-block">
    <SectionHeading title={<>Your private memory for <span>every agent</span></>} text="Locality preserves the commands, patches, decisions, and fixes that normally disappear when a coding session ends." />
    <DitherBanner />
    <div className="scroll-feature-grid">
      <div className="feature-copy sticky-feature-copy"><h3>Capture complete sessions, not shallow summaries.</h3><p>Import the work your agents already completed and organize it by project without sending raw history to a cloud knowledge base.</p><a href="#workflow">How it works <ArrowRight /></a></div>
      <div className="scroll-feature-content">
        <div className="feature-visual terminal-visual"><ImportVisual /></div>
        <FeatureCard icon={<Code2 />} title="Import the context that matters" text="Keep prompts, tool calls, commands, patches, outcomes, and the reasoning behind important changes." />
        <div className="feature-visual diff-visual"><MemoryGraphVisual /></div>
        <FeatureCard icon={<Check />} title="Write durable project memory" text="Convert session history into structured Markdown that remains useful in Obsidian and any text editor." />
      </div>
    </div>
  </section>;
}

function AgentsSection() {
  return <section className="bounded agents-section">
    <DitherBanner />
    <div className="scroll-feature-grid">
      <div className="feature-copy sticky-feature-copy"><h3>Connect tools. Keep context. Build faster.</h3><p>Use one local memory across Codex, Claude Code, Cursor, Copilot, Gemini CLI, Obsidian, and local models.</p><a href="#workflow">See the workflow <ArrowRight /></a></div>
      <div className="scroll-feature-content">
        <div className="feature-visual agent-visual"><SearchVisual /></div>
        <FeatureCard icon={<Network />} title="Keep memory in your Obsidian vault" text="Locality writes ordinary Markdown into the knowledge system you already own and control." />
        <div className="feature-visual parallel-visual"><AgentFlowVisual /></div>
        <FeatureCard icon={<Sparkles />} title="Ask questions with local AI" text="Use Ollama through a loopback-only bridge and inspect the source notes behind every answer." />
      </div>
    </div>
  </section>;
}

function TeamSection() {
  return <section className="bounded section-block team-section">
    <SectionHeading icon="globe" title={<>Stop losing decisions. <span>Start building on them.</span></>} text="Preserve the discoveries from every coding session so the next agent starts with project history instead of starting over." />
    <DitherBanner />
    <div className="scroll-feature-grid team-scroll-grid"><div className="feature-copy sticky-feature-copy"><h3>Built for developers who use agents every day.</h3><p>Locality turns repeated investigations into reusable context and keeps that context portable across projects and tools.</p><a href="#pricing">Compare plans <ArrowRight /></a></div><div className="scroll-feature-content"><div className="feature-visual decision-visual"><DecisionTimelineVisual /></div><FeatureCard icon={<Zap />} title="Recall the fix before repeating the bug" text="Search old sessions for prior attempts, exact commands, changed files, and the decision that finally worked." /><div className="feature-visual handoff-feature-visual"><ContextHandoffVisual /></div><FeatureCard icon={<Globe2 />} title="Carry context across every agent" text="Keep one durable memory layer as your editor, model, and coding-agent workflow changes." /></div></div>
  </section>;
}

function Workflow() {
  const steps = [["Install and connect Locality", "Sign in once, activate the CLI, and choose the Obsidian vault that will hold your project memory."], ["Choose the history to import", "Review detected coding-agent sessions and import only the projects you want to preserve."], ["Search or ask your local memory", "Browse readable notes in Obsidian or ask an Ollama model questions from the Locality dashboard."]];
  return <section id="workflow" className="bounded section-block workflow"><SectionHeading icon="terminal" title={<>Setup. Import. <span>Remember.</span></>} text="Keep the context from every coding session without changing how you build." /><div className="workflow-grid"><div className="workflow-panel"><div className="workflow-composer"><div className="connection-badge"><CircleCheck />Connected</div><p>Why did we choose database sessions?</p><div className="composer-actions"><button aria-label="Add"><Plus /></button><button aria-label="Local memory"><Globe2 /></button><button className="sources"><List />3 sources</button><button className="submit" aria-label="Submit"><ChevronDown /></button></div></div></div><div className="steps">{steps.map(([title, text], index) => <article key={title} className={index === 0 ? "active-step" : ""}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>;
}

function Testimonials() {
  return <section className="bounded section-block testimonials"><SectionHeading title={<>Project memory that stays <span>useful and inspectable</span></>} text="Important coding context should remain private, portable, and easy to verify." /><div className="marquee-mask"><div className="marquee">{[...testimonials, ...testimonials].map(([quote, name, role], i) => <article className="quote-card" key={`${name}-${i}`}><p>&ldquo;{quote}&rdquo;</p><div><div className="avatar">{name.split(" ").map(n => n[0]).join("")}</div><span><strong>{name}</strong><small>{role}</small></span></div></article>)}</div></div></section>;
}

function Pricing({ signedIn, currentPlan }: Pick<LocalityLandingProps, "signedIn" | "currentPlan">) {
  return <section id="pricing" className="bounded pricing"><div className="pricing-intro"><h3>Start free.<br />Remember more.</h3><p>The Codex importer is free. Upgrade when automatic, multi-agent memory becomes part of your daily workflow.</p></div><div className="price-grid"><PriceCard planKey="GO" signedIn={signedIn} currentPlan={currentPlan} popular /><PriceCard planKey="PLUS" signedIn={signedIn} currentPlan={currentPlan} dark /><PriceCard planKey="FREE" signedIn={signedIn} currentPlan={currentPlan} /></div></section>;
}

function PriceCard({ planKey, signedIn, currentPlan, popular, dark }: { planKey: keyof typeof plans; signedIn: boolean; currentPlan: string; popular?: boolean; dark?: boolean }) {
  const plan = plans[planKey];
  const current = currentPlan === planKey;
  const action = current ? <span className="button current-plan">Current plan</span> : planKey === "FREE" ? <Link href="/login" className="button">Create free account</Link> : signedIn ? <form action="/api/stripe/checkout" method="POST"><input name="plan" type="hidden" value={planKey} /><button className="button" type="submit">Choose {plan.name}</button></form> : <Link href="/login" className="button">Start with {plan.name}</Link>;
  return <article className={`price-card ${dark ? "dark-card" : ""}`}><div><h4>{plan.name} {popular && <span>Popular</span>}</h4><p><strong>${plan.price}</strong>{plan.price ? "/month" : " forever"}</p><small>{plan.description}</small>{action}</div><hr /><p>Everything included:</p><ul>{plan.features.map(item => <li key={item}><Check />{item}</li>)}</ul></article>;
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return <section id="faq" className="bounded faq"><div><h2>Frequently Asked Questions</h2><p>How Locality keeps coding-agent memory private, portable, and useful across your development workflow.</p></div><div className="accordion">{faqItems.map(([question, answer], i) => <article className={open === i ? "open" : ""} key={question}><button onClick={() => setOpen(open === i ? null : i)}>{question}<ChevronDown /></button><p>{answer}</p></article>)}</div></section>;
}

function CTA({ primaryHref }: Pick<LocalityLandingProps, "primaryHref">) {
  return <section className="cta"><div className="aurora" /><h2>Give your next agent the context<br className="desktop" /> it needs to keep building.</h2><p>Your project already has a history. Turn it into private, durable memory.</p><Link className="button" href={primaryHref}>Get Started <ArrowRight /></Link></section>;
}

function Footer() {
  const groups = {Product:["Features", "Pricing", "Local AI"], Account:["Sign in", "Dashboard", "Activate CLI"], Legal:["Privacy", "Terms"]};
  return <footer className="footer bounded"><div className="footer-grid">{Object.entries(groups).map(([title, links]) => <div key={title}><h3>{title}</h3>{links.map(link => <a href={link === "Pricing" ? "#pricing" : link === "Features" ? "#features" : link === "Local AI" ? "/ai" : link === "Dashboard" ? "/dashboard" : link === "Activate CLI" ? "/activate" : link === "Privacy" ? "/privacy" : link === "Terms" ? "/terms" : "/login"} key={link}>{link}</a>)}</div>)}<div className="footer-brand"><Logo /><p>Local memory for coding agents.</p></div></div><p>&copy; 2026 Locality. All rights reserved.</p></footer>;
}

export function LocalityLanding({ signedIn, primaryHref, currentPlan }: LocalityLandingProps) {
  return <div className="locality-landing"><Header signedIn={signedIn} primaryHref={primaryHref} /><main><Hero primaryHref={primaryHref} /><TrustStrip /><FeatureShowcase /><AgentsSection /><TeamSection /><Workflow /><Testimonials /><Pricing signedIn={signedIn} currentPlan={currentPlan} /><FAQ /><CTA primaryHref={primaryHref} /></main><Footer /></div>;
}
