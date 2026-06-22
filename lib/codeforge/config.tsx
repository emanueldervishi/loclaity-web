import { Icons } from "@/components/codeforge/icons";
import { cn } from "@/lib/utils";
import {
    SiAnthropic,
    SiGithub,
    SiObsidian,
    SiOllama,
    SiOpenai,
    SiVercel,
} from "react-icons/si";

export const Highlight = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <span
            className={cn(
                "bg-radial from-gradient-primary to-gradient-secondary/40 bg-clip-text text-transparent",
                className,
            )}
        >
            {children}
        </span>
    );
};

export const BLUR_FADE_DELAY = 0.15;

const trustLogoBaseClass =
    "flex items-center gap-2 text-[1.95rem] font-semibold tracking-[-0.04em] text-foreground";

function TrustLogo({
    name,
    icon: Icon,
    className,
}: {
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
}) {
    return (
        <div className={cn(trustLogoBaseClass, className)}>
            {Icon ? <Icon className="size-7 shrink-0" /> : null}
            <span>{name}</span>
        </div>
    );
}

export const siteConfig = {
    name: "Locality",
    description: "Local-first project memory for Codex users and AI coding workflows.",
    cta: "Get Started",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://localitycli.vercel.app",
    keywords: [
        "Locality",
        "Codex memory",
        "Local-first project memory",
        "Coding session search",
        "Obsidian project memory",
    ],
    links: {
        email: "support@locality.ai",
        twitter: "https://twitter.com/localityai",
        discord: "https://discord.gg/localityai",
        github: "https://github.com/localityai",
        instagram: "https://instagram.com/localityai",
    },
    nav: {
        links: [
            {
                id: 1,
                name: "Products",
                href: "#",
                submenu: [
                    { id: 1, icon: <Icons.code className="size-4 text-muted-foreground" />, name: "Local memory", href: "#features", description: "Keep project context readable and local.", image: "/instant-integration.png" },
                    { id: 2, icon: <Icons.code className="size-4 text-muted-foreground" />, name: "AI chat", href: "/dashboard/chat", description: "Ask imported history from one dashboard.", image: "/instant-integration.png   " },
                    { id: 3, icon: <Icons.code className="size-4 text-muted-foreground" />, name: "CLI bridge", href: "/setup", description: "Install, import, and sync from your machine.", image: "/instant-integration.png" },
                ]
            },
            { id: 2, name: "Features", href: "#features" },
            { id: 3, name: "Pricing", href: "#pricing" },
            { id: 4, name: "Setup", href: "/setup" },
            { id: 5, name: "FAQ", href: "#faq" },
        ],
    },
    hero: {
        badgeIcon: <Icons.stackedIcons className="size-4" />,
        badge: "Local-first memory for Codex users",
        title: "Search sessions, commands, diffs, and debugging context locally",
        description:
            "Locality gives Codex users a private project memory workspace for searchable sessions, commands, diffs, decisions, and debugging context.",
        cta: {
            primary: {
                text: "Start for free",
                href: "/login",
            },
        },
    },
    demoSection: {
        title: "Install. Import. Search.",
        description:
            "See how Locality turns Codex and AI coding history into searchable local project memory.",
        items: [
            {
                id: 1,
                title: "Install the CLI",
                content:
                    "Install Locality where your AI coding work already happens, then initialize a private memory layer without changing your editor.",
                image: "/landing-tabs/import-sessions.png",
                alt: "Locality CLI install terminal showing setup and import commands.",
            },
            {
                id: 2,
                title: "Import sessions",
                content:
                    "Import Codex sessions, CLI history, notes, and related context so prior fixes and decisions stay available later.",
                image: "/landing-tabs/structured-memory.png",
                alt: "Locality import sessions view with supported coding tools and import progress.",
            },
            {
                id: 3,
                title: "Search memory",
                content:
                    "Search prior architecture choices, exact commands, session diffs, and earlier debugging paths before repeating the same investigation.",
                image: "/landing-tabs/local-search.png",
                alt: "Locality search memory interface showing session, command, diff, and notes results.",
            },
            {
                id: 4,
                title: "Ask locally",
                content:
                    "Ask local or connected models what changed, why it changed, and which debugging path worked last time.",
                image: "/landing-tabs/ask-local-ai.png",
                alt: "Locality search workspace with top matches for implementation and error-handling history.",
            },
        ],
    },
    companyShowcase: {
        companyLogos: [
            { id: 1, name: "OpenAI", logo: <TrustLogo name="OpenAI" icon={SiOpenai} /> },
            { id: 2, name: "Anthropic", logo: <TrustLogo name="Anthropic" icon={SiAnthropic} /> },
            { id: 3, name: "GitHub", logo: <TrustLogo name="GitHub" icon={SiGithub} /> },
            { id: 4, name: "Obsidian", logo: <TrustLogo name="Obsidian" icon={SiObsidian} /> },
            { id: 5, name: "Ollama", logo: <TrustLogo name="Ollama" icon={SiOllama} /> },
            { id: 6, name: "Vercel", logo: <TrustLogo name="Vercel" icon={SiVercel} /> },
            { id: 7, name: "Codex", logo: <TrustLogo name="Codex" /> },
            { id: 8, name: "Cursor", logo: <TrustLogo name="Cursor" /> },
        ],
    },
    workflowSection: {
        badge: {
            icon: <Icons.terminal className="size-4 text-muted-foreground" />,
            text: "Memory",
        },
        title: (<>Keep every agent handoff <Highlight>searchable</Highlight></>),
        description: "Locality keeps the reason behind changes, the commands that worked, and the debugging history your next Codex session should not have to rediscover.",
        sections: {
            title: "Bring coding history into Locality in minutes",
            description: "Install the CLI, sign in once, and import the sessions that matter. Locality turns AI coding work into readable project memory without changing your editor.",
            ctaButton: {
                text: "See setup",
                href: "/setup",
            },
            blocks: [
                {
                    id: 1,
                    icon: <Icons.terminal className="size-4 text-muted-foreground" />,
                    title: "Install and import your history",
                    description: "Connect this device, bring in recent sessions, and keep private project memory on infrastructure you control.",
                },
                {
                    id: 2,
                    icon: <Icons.shock className="size-4 text-muted-foreground" />,
                    title: "Search the decision, command, or diff",
                    description: "Recover why a file moved, which prompt worked, and what changed before you reopen the same debugging path.",
                },
            ],
        }
    },
    workflowConnectSection: {
        title: "Connect more tools without losing context.",
        description: "Use one local memory across Codex, Claude Code, Cursor, Copilot, Obsidian, and local or cloud models.",
        ctaButton: {
            text: "Open chat",
            href: "/dashboard/chat",
        },
        blocks: [
            {
                id: 1,
                icon: <Icons.magicClick className="size-4 text-muted-foreground" />,
                title: "Add tools around one memory layer",
                description: "Keep imports, dashboards, vault notes, and AI chat connected to the same project memory instead of scattering context.",
            },
            {
                id: 2,
                icon: <Icons.magicStar className="size-4 text-muted-foreground" />,
                title: "Carry context across every agent",
                description: "Switch editors, models, and machines without starting from zero every time a new tool joins the workflow.",
            },
        ],
    },
    featureSection: {
        badge: {
            icon: <Icons.globe className="size-4 text-muted-foreground" />,
            text: "Local-first",
        },
        title: (<>Keep memory local. <Highlight>Ask better questions.</Highlight></>),
        description: "Locality turns prior sessions into durable project memory, keeps it readable in your vault, and lets you search commands, diffs, and context from one dashboard.",
        sections: {
            title: "Built for developers who use agents every day",
            description: "From solo builders to small teams, Locality keeps architecture decisions, fixes, prompts, and debugging context available after the chat window is gone.",
            ctaButton: {
                text: "Compare plans",
                href: "/pricing",
            },
            blocks: [
                {
                    id: 1,
                    icon: <Icons.puzzle className="size-4 text-muted-foreground" />,
                    title: "Readable notes, not locked context",
                    description: "Locality writes ordinary Markdown into memory you own, so the result stays portable across tools and understandable outside one UI.",
                },
                {
                    id: 2,
                    icon: <Icons.globe className="size-4 text-muted-foreground" />,
                    title: "One workflow across editors and models",
                    description: "Keep the same project memory available whether the work happened in Codex, Claude Code, Cursor, Copilot, or a local model.",
                },
            ],
        }
    },
    connectSection: {
        badge: {
            icon: <Icons.terminal className="size-4 text-muted-foreground" />,
            text: "Workflow",
        },
        title: (<>Setup. Import. <Highlight>Remember.</Highlight></>),
        description: "Keep the context from every coding session without changing how you build.",
        step1: {
            title: "Install and connect Locality",
            description: "Sign in once, activate the CLI, and choose the vault or local setup that will hold your project memory.",
        },
        step2: {
            title: "Choose the history to import",
            description: "Review detected coding-agent sessions and import only the projects you want to preserve for later search and chat.",
        },
        step3: {
            title: "Search or ask your local memory",
            description: "Browse readable notes in your vault or ask the Locality dashboard what changed, which commands worked, and why.",
        },
    },
    testimonialSection: {
        badge: {
            icon: (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-muted-foreground"
                >
                    <path
                        d="M4 4C3.44772 4 3 4.44772 3 5V7C3 7.55228 3.44772 8 4 8H5V10C5 10.5523 5.44772 11 6 11H7C7.55228 11 8 10.5523 8 10V5C8 4.44772 7.55228 4 7 4H4Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M11 4C10.4477 4 10 4.44772 10 5V7C10 7.55228 10.4477 8 11 8H12V10C12 10.5523 12.4477 11 13 11H14C14.5523 11 15 10.5523 15 10V5C15 4.44772 14.5523 4 14 4H11Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            text: "Use cases",
        },
        title: (<>What Locality is built to <Highlight>preserve</Highlight></>),
        description: "These are the kinds of context Locality keeps available after the chat window closes. They describe workflows, not customer endorsements.",
        testimonials: [
            {
                id: "1",
                name: "Decision history",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Keep the reasoning behind a schema change, refactor, or rollback so the next agent session can start with context instead of guesses.
                    </p>
                ),
            },
            {
                id: "2",
                name: "Command recall",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Recover the exact terminal commands and follow-up fixes that solved a problem last time instead of rebuilding the path from memory.
                    </p>
                ),
            },
            {
                id: "3",
                name: "Private notes",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Keep imported sessions and vault-backed notes in a local workflow that stays readable outside a hosted chat product.
                    </p>
                ),
            },
            {
                id: "4",
                name: "Model switching",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Move between local models and connected providers while keeping the same project memory attached to the work.
                    </p>
                ),
            },
            {
                id: "5",
                name: "Session imports",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Pull recent coding-agent sessions into one searchable place so new work can start from prior attempts and known outcomes.
                    </p>
                ),
            },
            {
                id: "6",
                name: "Obsidian sync",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Write durable project memory into an Obsidian vault so the archive remains yours, portable, and easy to inspect in plain Markdown.
                    </p>
                ),
            },
            {
                id: "7",
                name: "Multi-device setup",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Authorize more than one machine and keep imported memory available wherever your day-to-day coding actually happens.
                    </p>
                ),
            },
            {
                id: "8",
                name: "Ask memory",
                role: "Locality workflow",
                img: "/icon.svg",
                description: (
                    <p>
                        Ask what changed, why a file moved, which command worked, or which earlier decision shaped the current implementation.
                    </p>
                ),
            },
        ],
    },
    pricing: {
        title: "Pricing that keeps memory useful",
        description:
            "Start with Free, move to Go or Plus when Locality becomes part of your daily AI coding workflow.",
        pricingItems: [
            {
                name: "Go",
                href: "/pricing",
                price: "$2",
                period: "month",
                yearlyPrice: "$2",
                features: [
                    "Unlimited history",
                    "Codex, Claude Code, Cursor and Copilot",
                    "Automatic imports",
                    "Web and Obsidian Local AI chat",
                    "Ollama, OpenAI and Claude",
                ],
                description: "For developers using agents every day.",
                buttonText: "Choose Go",
                buttonColor: "bg-secondary text-white",
                isPopular: true,
            },
            {
                name: "Free",
                href: "/pricing",
                price: "$0",
                period: "month",
                yearlyPrice: "$0",
                features: [
                    "Latest 10 imported chats",
                    "Up to 50 turns per chat",
                    "Codex importer",
                    "Manual imports",
                    "Local Obsidian notes",
                ],
                description: "A permanent local memory for your newest Codex work.",
                buttonText: "Start Free",
                buttonColor: "bg-accent text-primary",
                isPopular: false,
            },
            {
                name: "Plus",
                href: "/pricing",
                price: "$10",
                period: "month",
                yearlyPrice: "$10",
                features: [
                    "Everything in Go",
                    "Multiple devices and vaults",
                    "Advanced semantic indexing",
                    "Team-ready export",
                    "Priority releases",
                ],
                description: "A connected memory layer across your whole setup.",
                buttonText: "Choose Plus",
                buttonColor: "bg-primary text-primary-foreground",
                isPopular: false,
            },
        ],
    },
    faqSection: {
        title: "Frequently Asked Questions",
        description:
            "Answers to common questions about Locality, local-first project memory, imports, and private AI chat.",
        faQitems: [
            {
                id: 1,
                question: "Where does my project memory live?",
                answer:
                    "Locality writes readable Markdown into your Obsidian vault and local memory workflow, so the result stays portable and under your control.",
            },
            {
                id: 2,
                question: "What can I import into Locality?",
                answer:
                    "You can import supported Codex and coding-agent session history, manual notes, and local project context so prior work remains searchable later.",
            },
            {
                id: 3,
                question: "Can I use Locality with local models?",
                answer:
                    "Yes. Locality can work with Ollama for local AI chat, while connected plans can also use supported hosted providers.",
            },
            {
                id: 4,
                question: "Do I need to change how I already work?",
                answer:
                    "No. The point is to keep your current coding-agent workflow and add a memory layer that helps you recover context after the session ends.",
            },
            {
                id: 5,
                question: "Is there a free plan?",
                answer:
                    "Yes. Free includes the Codex importer, manual imports, and local Obsidian notes for your newest work.",
            },
            {
                id: 6,
                question: "What do Go and Plus add?",
                answer:
                    "Go removes history limits and adds broader import and chat support. Plus extends Locality across more devices, vaults, and advanced indexing workflows.",
            },
        ],
    },
    ctaSection: {
        id: "cta",
        title: "Keep your next agent session grounded with Locality",
        backgroundImage: "/agent-cta-background.png",
        button: {
            text: "Start for free",
            href: "/login",
        },
        subtext: "Your project already has a history. Turn it into private, durable memory before the next bug, refactor, or handoff starts cold.",
    },
    footerLinks: [
        {
            title: "Product",
            links: [
                { id: 1, title: "Features", url: "#features" },
                { id: 2, title: "Pricing", url: "#pricing" },
                { id: 3, title: "Dashboard", url: "/dashboard" },
                { id: 4, title: "AI Chat", url: "/dashboard/chat" },
                { id: 5, title: "Setup", url: "/setup" },
            ],
        },
        {
            title: "Resources",
            links: [
                { id: 6, title: "Terms", url: "/terms" },
                { id: 7, title: "Privacy", url: "/privacy" },
                { id: 8, title: "Pricing page", url: "/pricing" },
                { id: 9, title: "Activate CLI", url: "/activate" },
                { id: 10, title: "Sign in", url: "/login" },
            ],
        },
        {
            title: "Company",
            links: [
                { id: 11, title: "About Locality", url: "/" },
                { id: 12, title: "Setup guide", url: "/setup" },
                { id: 13, title: "Codex memory", url: "#workflow" },
                { id: 14, title: "AI chat", url: "/dashboard/chat" },
                { id: 15, title: "Privacy", url: "/privacy" },
                { id: 16, title: "Pricing", url: "/pricing" },
                { id: 17, title: "Terms", url: "/terms" },
                { id: 18, title: "Login", url: "/login" },
                { id: 19, title: "Dashboard", url: "/dashboard" },
            ],
        },

    ],


};

export type SiteConfig = typeof siteConfig;
