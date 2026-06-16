"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChartLine, Folders, House, MagnifyingGlass } from "@phosphor-icons/react";

const COLLAPSED_WIDTH = 64;
const ICON_TILE_SIZE = 44;

type PhosphorIcon = ComponentType<{
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
  style?: CSSProperties;
}>;

type DashboardGlassSidebarProps = {
  user: {
    name: string | null;
    email: string | null;
    plan: string;
    setupComplete: boolean;
  };
};

type NavItem = {
  icon: PhosphorIcon;
  label: string;
  href: string;
  color: string;
  detail: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    icon: House,
    label: "Overview",
    href: "/dashboard",
    color: "#3A86FF",
    detail: "Workspace",
  },
  {
    icon: MagnifyingGlass,
    label: "AI chat",
    href: "/dashboard/chat",
    color: "#B388FF",
    detail: "Ask memory",
  },
  {
    icon: Folders,
    label: "Devices",
    href: "/dashboard/devices",
    color: "#FFBE0B",
    detail: "Authorized",
  },
  {
    icon: ChartLine,
    label: "Billing",
    href: "/dashboard/billing",
    color: "#06D6A0",
    detail: "Plan",
  },
];

const GLASS_STYLE = {
  background: "color-mix(in oklch, var(--background) 92%, transparent)",
  border: "1px solid color-mix(in oklch, var(--border) 92%, transparent)",
  boxShadow:
    "0 16px 44px color-mix(in oklch, var(--foreground) 8%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
} as const;

function isItemActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

function NavItemRow({
  item,
  isActive,
  href,
}: {
  item: NavItem;
  isActive: boolean;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div className="relative flex w-full items-center">
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute left-[calc(100%+10px)] z-50 whitespace-nowrap rounded-lg px-3 py-1.5 font-sans text-xs font-semibold text-foreground dark:text-white"
            style={GLASS_STYLE}
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          scale: hovered ? 1.12 : 1,
          x: hovered ? 3 : 0,
        }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="w-full"
      >
        <Link
          aria-current={isActive ? "page" : undefined}
          aria-label={item.label}
          className="group flex w-full items-center justify-start gap-3 rounded-xl pr-0 outline-none transition-[filter] duration-200 focus-visible:ring-2 focus-visible:ring-ring/45"
          href={href}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.div
            className="flex shrink-0 items-center justify-center rounded-xl"
            style={{
              width: ICON_TILE_SIZE,
              height: ICON_TILE_SIZE,
              background: isActive ? `${item.color}24` : "transparent",
              border: `1px solid ${isActive ? `${item.color}40` : "rgba(148,163,184,0.18)"}`,
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            <Icon size={20} weight="regular" style={{ color: item.color }} />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

export function DashboardGlassSidebar({ user }: DashboardGlassSidebarProps) {
  const pathname = usePathname();

  function gatedHref(href: string) {
    if (user.setupComplete) return href;
    return "/setup";
  }

  return (
    <aside className="relative z-20 hidden w-[64px] shrink-0 overflow-visible md:block" aria-label="Dashboard navigation">
      <div className="sticky top-1/2 flex h-0 -translate-y-1/2 items-center justify-start overflow-visible">
        <motion.nav
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.05 }}
          className="relative isolate flex h-auto max-h-[calc(100dvh-2rem)] flex-col items-center overflow-visible rounded-[1.5rem] px-2.5 py-3"
          style={{ width: COLLAPSED_WIDTH, ...GLASS_STYLE }}
        >
          <div className="pointer-events-none absolute inset-x-3 top-3 h-24 rounded-[1.25rem] bg-foreground/[0.03] blur-2xl dark:bg-white/[0.05]" />

          <Link
            href="/"
            className="mb-2 flex w-full items-center justify-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
            aria-label="Locality home"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-[1rem] bg-foreground text-sm font-black text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              L
            </div>
          </Link>

          <div className="flex w-full flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <NavItemRow
                key={item.href}
                href={gatedHref(item.href)}
                isActive={isItemActive(pathname, item.href)}
                item={item}
              />
            ))}
          </div>
        </motion.nav>
      </div>
    </aside>
  );
}
