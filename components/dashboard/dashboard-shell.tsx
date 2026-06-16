"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bot, CreditCard, House, LogOut, Settings, TabletSmartphone } from "lucide-react";
import { DashboardGlassSidebar } from "@/components/dashboard/glass-dashboard-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DashboardShellProps = {
  children: ReactNode;
  user: {
    name: string | null;
    email: string | null;
    plan: string;
    setupComplete: boolean;
  };
};

const mobileNav = [
  { label: "Overview", href: "/dashboard", icon: House },
  { label: "Chat", href: "/dashboard/chat", icon: Bot },
  { label: "Devices", href: "/dashboard/devices", icon: TabletSmartphone },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();

  function gatedHref(href: string) {
    if (user.setupComplete) return href;
    return "/setup";
  }

  return (
    <div className="dashboard-app h-dvh overflow-hidden bg-[linear-gradient(180deg,color-mix(in_oklch,var(--background),var(--muted)_48%),var(--background))] p-2 text-foreground">
      <div className="flex h-full w-full gap-3">
        <DashboardGlassSidebar user={user} />

        <div className="flex h-full min-w-0 flex-1">
          <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border bg-background/95 shadow-[0_18px_56px_rgba(15,23,42,0.08)] dark:bg-background/92 dark:shadow-[0_18px_56px_rgba(0,0,0,0.26)]">
            <header className="hidden min-h-16 shrink-0 flex-col gap-3 border-b bg-background/88 px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between md:px-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className="h-6 rounded-full px-2.5"
                      variant={user.setupComplete ? "secondary" : "outline"}
                    >
                      {user.setupComplete ? "Workspace ready" : "Setup required"}
                    </Badge>
                    <span className="hidden text-sm text-muted-foreground sm:inline">{user.plan} plan</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">Locality dashboard</p>
                </div>
              </div>

              <div className="hidden items-center justify-end gap-1 md:flex">
                <ThemeToggle showLabel />
                <Link
                  className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  href="/api/auth/signout"
                  aria-label="Sign out"
                >
                  <LogOut className="size-4" />
                </Link>
                <Link
                  className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  href="/dashboard/billing"
                  aria-label="Settings"
                >
                  <Settings className="size-4" />
                </Link>
              </div>
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--background),var(--muted)_85%),transparent_36%)] p-4 pb-28 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:hidden">
        <TooltipProvider delay={80}>
          <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] " direction="middle" iconDistance={110} iconMagnification={54} iconSize={38}>
            {mobileNav.map((item) => {
              const Icon = item.icon;
              const href = gatedHref(item.href);
              const isActive = pathname === item.href;

              return (
                <Tooltip key={item.href}>
                  <DockIcon className="">
                    <TooltipTrigger
                      render={
                        <Link
                          aria-label={item.label}
                          className={` ${isActive ? "text-black" : "text-muted-foreground"} `}
                          href={href}
                        >
                          <Icon className={` size-4 ${isActive ? "text-black" : "text-muted-foreground"} `}/>
                        </Link>
                      }
                    />
                  </DockIcon>
                  <TooltipContent>{item.label}</TooltipContent>
                </Tooltip>
              );
            })}

            <Tooltip>
              <DockIcon >
                <TooltipTrigger
                  render={<ThemeToggle className="text-black" />}
                />
              </DockIcon>
              <TooltipContent>Theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <DockIcon >
                <TooltipTrigger
                  render={
                    <Link
                      aria-label="Sign out"
                      
                      href="/api/auth/signout"
                    >
                      <LogOut className="size-4 text-red-400" />
                    </Link>
                  }
                />
              </DockIcon>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </Dock>
        </TooltipProvider>
      </div>
    </div>
  );
}
