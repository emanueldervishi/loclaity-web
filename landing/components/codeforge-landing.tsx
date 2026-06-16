"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleDot,
  CircleCheck,
  Cloud,
  Code2,
  Command,
  Globe2,
  Menu,
  Moon,
  Network,
  List,
  Plus,
  Play,
  Search,
  Sparkles,
  Sun,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navItems = ["Products", "features", "pricing", "Docs", "Company"];
const demoTabs = ["Code Generation", "Smart Review", "Auto Testing", "Deploy Ready"];
const demoImages = [
  "/images/code-generation.jpg",
  "/images/smart-review.jpg",
  "/images/auto-testing.jpg",
  "/images/deploy-ready.jpg",
];
const faqItems = [
  ["What is an AI Agent?", "An AI agent is an intelligent coding assistant that understands your repository, writes features, reviews changes, and automates repetitive development work."],
  ["How does SkyAgent work?", "Connect a repository, describe what you want in plain English, and the agent plans and applies changes with full project context."],
  ["How secure is my data?", "Repository access is encrypted and isolated. Your code remains private and is never used to train public models."],
  ["Can I integrate my existing tools?", "Yes. MCP integrations connect your agent to design tools, databases, APIs, issue trackers, and deployment providers."],
  ["Is there a free trial available?", "Yes. Every account starts with a 14-day trial with access to the complete product."],
  ["How does SkyAgent save me time?", "It handles boilerplate, test generation, code review, refactors, and routine fixes so your team can focus on architecture."],
];

const testimonials = [
  ["The AI-driven analytics have revolutionized our product development cycle. Insights are now more accurate and faster than ever.", "Alex Rivera", "Product Engineer"],
  ["Our targeting strategy improved immediately. We are shipping experiments in hours instead of weeks.", "Samantha Lee", "Growth Lead"],
  ["As a startup, we need to move fast. CodeForge doubled our development speed without lowering quality.", "Raj Patel", "Founder"],
  ["The agent understands our codebase and creates changes that look like they came from our own team.", "Emily Chen", "Staff Engineer"],
  ["We reduced repetitive development work and gave every engineer more time for product thinking.", "Michael Brown", "VP Engineering"],
  ["Setup took minutes. The value was obvious in the first pull request.", "Linda Wu", "Engineering Manager"],
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Codeforge home">
      <span className="logo-mark"><Code2 size={15} /></span>
      <span>Codeforge</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className={open ? "nav open" : "nav"} aria-label="Main">
          {navItems.map((item) => <a href={item === "pricing" ? "#pricing" : "#features"} key={item}>{item}{item === "Products" && <ChevronDown size={13} />}</a>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Toggle theme" onClick={toggleTheme}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
          <a className="button button-small" href="#pricing">Get Started</a>
          <button className="menu-button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}

function Eyebrow({ icon = "sparkles" }: { icon?: "sparkles" | "globe" | "terminal" }) {
  return <div className="eyebrow">{icon === "globe" ? <Globe2 size={16} /> : icon === "terminal" ? <Terminal size={16} /> : <Sparkles size={16} />}<span>Scale</span></div>;
}

function SectionHeading({ title, text, icon }: { title: React.ReactNode; text: string; icon?: "sparkles" | "globe" | "terminal" }) {
  return <div className="section-heading"><Eyebrow icon={icon} /><h2>{title}</h2><p>{text}</p></div>;
}

function CodeWindow() {
  return (
    <div className="code-window">
      <div className="window-bar"><i /><i /><i /><span>src/components/hero.tsx</span></div>
      <pre><span className="purple">export function</span> <span className="blue">Hero</span>() {`{`}\n  <span className="purple">return</span> (\n    &lt;<span className="blue">section</span> className=<span className="green">&quot;relative&quot;</span>&gt;\n      &lt;<span className="blue">h1</span>&gt;Ship faster&lt;/<span className="blue">h1</span>&gt;\n    &lt;/<span className="blue">section</span>&gt;\n  )\n{`}`}</pre>
      <div className="code-status"><Check size={15} /> Generated in 1.2s</div>
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

function Hero() {
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
        <div className="announcement"><span className="announcement-icon"><LayersBadgeIcon /></span><span>Introducing intelligent code generation</span></div>
        <h1>Ship production code 10x faster with AI</h1>
        <p>Your AI coding partner writes, reviews, and refactors code instantly. Build features in minutes, not hours.</p>
        <a className="hero-button" href="#pricing">Start for free</a>
      </div>
    </section>
    <section className="product-demo">
      <div className="demo-tabs">{demoTabs.map((item, index) => <button className={tab === index ? "active" : ""} onClick={() => selectTab(index)} key={item}>{tab === index && <span className="tab-canvas-wrap" aria-hidden="true"><TabParticles /></span>}<span className="tab-label">{item}</span>{tab === index && <span className="tab-progress-track" aria-hidden="true"><span className="tab-progress" key={cycle} /></span>}</button>)}</div>
      <div className="demo-stage">
        <Image key={`${tab}-${cycle}`} className="demo-image" src={demoImages[tab]} alt={demoTabs[tab]} width={2070} height={1380} priority={tab === 0} />
      </div>
    </section>
  </>;
}

function TrustStrip() {
  const logos = [[Zap, "Vercel"], [Command, "Linear"], [Cloud, "Cloudflare"], [Code2, "GitHub"], [Globe2, "Arc"], [Network, "Raycast"]] as const;
  return <section className="trust"><p>Trusted by <span>fast-growing</span> startups</p><div className="logo-row">{logos.map(([Icon, name]) => <div key={name}><Icon /> {name}</div>)}</div></section>;
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="mini-feature"><div className="mini-icon">{icon}</div><h4>{title}</h4><p>{text}</p></div>;
}

function FeatureShowcase() {
  return <section id="features" className="bounded section-block">
    <SectionHeading title={<>Your AI partner for <span>every commit</span></>} text="CodeForge writes boilerplate, refactors legacy code, and reviews every line so you can focus on architecture and innovation" />
    <div className="scroll-feature-grid">
      <div className="feature-copy sticky-feature-copy"><h3>AI meets your workflow in seconds</h3><p>Start coding with AI by cloning any GitHub repository. Review smart suggestions and apply code changes with a single click.</p><a href="#workflow">Learn More <ArrowRight /></a></div>
      <div className="scroll-feature-content">
        <div className="feature-visual terminal-visual"><CodeWindow /></div>
        <FeatureCard icon={<Code2 />} title="Clone and activate your AI agent" text="Connect any GitHub repository instantly. Your AI agent analyzes your codebase and starts suggesting improvements right away." />
        <div className="feature-visual diff-visual"><CodeWindow /></div>
        <FeatureCard icon={<Check />} title="Review and apply AI suggestions" text="Get instant code suggestions with visual diffs. Apply changes with a single click to improve your codebase." />
      </div>
    </div>
  </section>;
}

function AgentsSection() {
  return <section className="bounded agents-section">
    <div className="scroll-feature-grid">
      <div className="feature-copy sticky-feature-copy"><h3>Connect tools. Run agents. Build anything.</h3><p>Choose from hundreds of MCP servers to extend capabilities. Run multiple AI agents in parallel to complete complex tasks faster.</p><a href="#workflow">Learn More <ArrowRight /></a></div>
      <div className="scroll-feature-content">
        <div className="feature-visual agent-visual"><div className="agent-search"><Search size={16} /> Plan, search <span><Play size={14} /></span></div><div className="agent-orbit"><div><Code2 /></div><div><Globe2 /></div><div><Cloud /></div><div className="center"><Sparkles /></div></div></div>
        <FeatureCard icon={<Network />} title="Install MCP servers with one click" text="Search and install MCP servers instantly. Extend your agent's capabilities with seamless integrations for any tool." />
        <div className="feature-visual parallel-visual"><div className="parallel-agents"><i>A</i><i>B</i><i>C</i><i>D</i></div></div>
        <FeatureCard icon={<Sparkles />} title="Run multiple agents in parallel" text="Launch parallel agents for different roles. Monitor token usage and progress as each agent completes its steps." />
      </div>
    </div>
  </section>;
}

function TeamSection() {
  return <section className="bounded section-block team-section">
    <SectionHeading icon="globe" title={<>Stop writing boilerplate. <span>Start building features.</span></>} text="Your AI agent handles repetitive coding tasks, reviews every commit, and catches bugs before deployment. Spend time on architecture, not syntax." />
    <DitherBanner />
    <div className="scroll-feature-grid"><div className="feature-copy sticky-feature-copy"><h3>Built for teams scaling at warp speed</h3><p>From solo developers to 100+ person engineering teams. Trusted by companies that need to ship fast and stay lean.</p><a href="#pricing">Learn More <ArrowRight /></a></div><div className="scroll-feature-content"><div className="feature-visual map-visual"><div className="world-grid" /><div className="pulse p1" /><div className="pulse p2" /><div className="pulse p3" /><div className="stat"><strong>10x</strong><span>faster delivery</span></div></div><FeatureCard icon={<Zap />} title="Used by teams at innovative companies" text="Trusted by engineering teams at rapidly growing startups. Write production code 10x faster while maintaining quality and standards." /><div className="feature-visual globe-visual"><div className="world-grid" /></div><FeatureCard icon={<Globe2 />} title="Active in 120+ countries worldwide" text="Developers choose our AI agents to accelerate development. Join the global movement toward intelligent coding." /></div></div>
  </section>;
}

function Workflow() {
  const steps = [["Connect your GitHub or repository", "Sign in with GitHub or clone any repository to activate your AI agent. Instant setup with zero configuration required."], ["Choose your integrations and tools", "Add design tools, frameworks, databases, and APIs to extend your agent's capabilities."], ["Start building with AI assistance", "Ask your agent to write features, review code, or fix bugs in plain English."]];
  return <section id="workflow" className="bounded section-block workflow"><SectionHeading icon="terminal" title={<>Setup. Connect. <span>Build.Ship.</span></>} text="Collaborate seamlessly with your team using AI-powered tools" /><div className="workflow-grid"><div className="workflow-panel"><div className="workflow-composer"><div className="connection-badge"><CircleCheck />Connected</div><p>Plan, search</p><div className="composer-actions"><button aria-label="Add"><Plus /></button><button aria-label="Web"><Globe2 /></button><button className="sources"><List />Sources</button><button className="submit" aria-label="Submit"><ChevronDown /></button></div></div></div><div className="steps">{steps.map(([title, text], index) => <article key={title} className={index === 0 ? "active-step" : ""}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>;
}

function Testimonials() {
  return <section className="bounded section-block testimonials"><SectionHeading title={<>Hear from our <span>developer community</span></>} text="Thousands of engineers trust our AI agents daily. Discover how teams accelerate development while maintaining code quality and standards." /><div className="marquee-mask"><div className="marquee">{[...testimonials, ...testimonials].map(([quote, name, role], i) => <article className="quote-card" key={`${name}-${i}`}><p>“{quote}”</p><div><div className="avatar">{name.split(" ").map(n => n[0]).join("")}</div><span><strong>{name}</strong><small>{role}</small></span></div></article>)}</div></div></section>;
}

function Pricing() {
  const [annual, setAnnual] = useState(false);
  return <section id="pricing" className="bounded pricing"><div className="pricing-intro"><h3>Build more. Pay less.<br />Scale smart.</h3><p>Try free for 14 days with full access to all features. Upgrade only when your AI agent proves value.</p><div className="toggle"><button className={!annual ? "active" : ""} onClick={() => setAnnual(false)}>Monthly</button><button className={annual ? "active" : ""} onClick={() => setAnnual(true)}>Annually</button></div></div><div className="price-grid"><PriceCard name="Startup" price={annual ? "$9" : "$12"} popular /><PriceCard name="Enterprise" price={annual ? "$19" : "$24"} dark /><PriceCard name="Free" price="$0" /></div></section>;
}

function PriceCard({ name, price, popular, dark }: { name: string; price: string; popular?: boolean; dark?: boolean }) {
  return <article className={`price-card ${dark ? "dark-card" : ""}`}><div><h4>{name} {popular && <span>Popular</span>}</h4><p><strong>{price}</strong>/month</p><small>{name === "Free" ? "Perfect for individual users" : "For teams shipping production software"}</small><a href="#top" className="button">{name === "Enterprise" ? "Contact Sales" : name === "Free" ? "Start Free" : "Upgrade to Pro"}</a></div><hr /><p>Everything you need:</p><ul>{["Unlimited code generation", "Smart repository context", "Automated testing", "Pull request reviews", "MCP integrations"].map(item => <li key={item}><Check />{item}</li>)}</ul></article>;
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return <section className="bounded faq"><div><h2>Frequently Asked Questions</h2><p>Answers to common questions about SkyAgent and its features. If you have any other questions, please don&apos;t hesitate to contact us.</p></div><div className="accordion">{faqItems.map(([question, answer], i) => <article className={open === i ? "open" : ""} key={question}><button onClick={() => setOpen(open === i ? null : i)}>{question}<ChevronDown /></button><p>{answer}</p></article>)}</div></section>;
}

function CTA() {
  return <section className="cta"><div className="aurora" /><h2>Ship your next feature 10x<br className="desktop" /> faster with CodeForge</h2><p>Stop writing boilerplate. Let AI handle the repetitive work.<br className="desktop" /> Start coding smarter today, completely free.</p><a className="button" href="#pricing">Start for free <ArrowRight /></a></section>;
}

function Footer() {
  const groups = {Product:["Features", "Pricing", "Integrations", "Playground", "Multi-Agent Workflows"], Resources:["Terms of user", "API Reference", "Documentation", "Community", "Support"], Company:["About us", "Our team", "Blog", "Changelog", "Privacy", "Careers", "Brand", "Contact", "Legal"]};
  return <footer className="footer bounded"><div className="footer-grid">{Object.entries(groups).map(([title, links]) => <div key={title}><h3>{title}</h3>{links.map(link => <a href="#top" key={link}>{link}</a>)}</div>)}<div className="footer-brand"><Logo /><div><Code2 /><Globe2 /><CircleDot /></div></div></div><p>© 2026 Codeforge. All rights reserved.</p></footer>;
}

export function CodeforgeLanding() {
  return <><Header /><main><Hero /><TrustStrip /><FeatureShowcase /><AgentsSection /><TeamSection /><Workflow /><Testimonials /><Pricing /><FAQ /><CTA /></main><Footer /></>;
}
