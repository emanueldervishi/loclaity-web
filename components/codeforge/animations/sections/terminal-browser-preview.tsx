"use client";

import { useRef, useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/codeforge/ui/button";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/codeforge/use-mobile";

type CloningStatus = "idle" | "cloning" | "cloned" | "starting" | "started" | "preview";

const STATUS_SEQUENCE: Array<{ status: CloningStatus; delay: number }> = [
    { status: "cloning", delay: 400 },
    { status: "cloned", delay: 1400 },
    { status: "starting", delay: 800 },
    { status: "started", delay: 800 },
    { status: "preview", delay: 600 },
] as const;

const terminalVariants = {
    idle: { x: "0%", y: "0%" },
    active: (isMobile: boolean) => ({
        x: isMobile ? "8%" : "20%",
        y: isMobile ? "-15%" : "-30%",
    }),
};

const browserVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

const springTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
};

export function TerminalBrowserPreviewBlock() {
    const terminalRef = useRef<HTMLDivElement>(null);
    const terminalInView = useInView(terminalRef, { amount: 0.8, margin: "40px 0px -40px 0px" });
    const [status, setStatus] = useState<CloningStatus>("idle");
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const sequenceIndexRef = useRef(0);
    const isMobile = useMobile();

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!terminalInView) {
            timerRef.current = setTimeout(() => setStatus("idle"), 0);
            sequenceIndexRef.current = 0;
            return;
        }

        sequenceIndexRef.current = 0;

        const runSequence = () => {
            if (sequenceIndexRef.current >= STATUS_SEQUENCE.length) {
                return;
            }

            const { status: nextStatus, delay } = STATUS_SEQUENCE[sequenceIndexRef.current];
            sequenceIndexRef.current += 1;

            timerRef.current = setTimeout(() => {
                setStatus(nextStatus);
                if (sequenceIndexRef.current < STATUS_SEQUENCE.length) {
                    runSequence();
                }
            }, delay);
        };

        runSequence();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            sequenceIndexRef.current = 0;
        };
    }, [terminalInView]);

    const isPreviewState = useMemo(
        () => status === "starting" || status === "started" || status === "preview",
        [status]
    );

    const terminalAnimation = useMemo(
        () => (isPreviewState ? terminalVariants.active(isMobile) : terminalVariants.idle),
        [isPreviewState, isMobile]
    );

    return (
        <div
            ref={terminalRef}
            className="relative flex min-h-[400px] items-center justify-center overflow-visible p-6 md:min-h-[500px] md:p-12"
        >
            <motion.div
                animate={terminalAnimation}
                transition={springTransition}
                className="relative"
            >
                <CloningStatusIndicator status={status} />
                <TerminalWindow
                    command="locality import --all"
                    output={[
                        "Scanning recent agent sessions...",
                        "Writing project memory: 100% (128/128), done.",
                        "Syncing Markdown notes...",
                        "Launching Locality dashboard...",
                        "Vault linked successfully.",
                    ]}
                />
            </motion.div>

            <AnimatePresence>
                {status === "preview" && (
                    <BrowserPreview
                        title="Obsidian is ready with fresh notes"
                        description="Review imported project memory, browse readable notes, and open Locality chat from the same workflow."
                        button={{ text: "Open dashboard", href: "/dashboard" }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const TerminalWindow = memo(function TerminalWindow({
    command,
    output,
}: {
    command: string;
    output: string[];
}) {
    return (
        <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
                <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
            </div>

            <div className="bg-background p-4 font-mono text-xs md:p-6 md:text-sm">
                <div className="space-y-1 text-foreground">
                    <div className="flex">
                        <span className="text-primary">$</span>
                        <span className="ml-2">{command}</span>
                    </div>
                    {output.map((line, index) => {
                        const parts = line.split("100%");
                        return (
                            <div key={index} className="text-muted-foreground">
                                {parts.length > 1 ? (
                                    <>
                                        {parts[0]}
                                        <span className="font-semibold text-foreground">100%</span>
                                        {parts[1]}
                                    </>
                                ) : (
                                    line
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

const BrowserPreview = memo(function BrowserPreview({
    title,
    description,
    button,
}: {
    title: string;
    description: string;
    button: { text: string; href: string };
}) {
    return (
        <motion.div
            variants={browserVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ ...springTransition, delay: 0.2 }}
            className="absolute bottom-8 left-1/2 z-20 w-full max-w-xs -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card md:max-w-md"
        >
            <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2 md:px-4 md:py-2.5">
                <div className="flex gap-1.5 md:gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 md:h-2.5 md:w-2.5" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500 md:h-2.5 md:w-2.5" />
                    <div className="h-2 w-2 rounded-full bg-green-500 md:h-2.5 md:w-2.5" />
                </div>
            </div>

            <div className="flex h-40 flex-col items-center justify-center bg-radial from-primary/10 to-background p-4 md:h-56 md:p-8">
                <div className="space-y-2 text-center md:space-y-3">
                    <h3 className="text-center text-xl font-semibold leading-tight tracking-tighter text-balance text-foreground">
                        {title}
                    </h3>
                    <p className="text-balance text-sm font-normal leading-relaxed text-muted-foreground">{description}</p>
                    <div className="flex items-center justify-center gap-2 pt-1 md:gap-3 md:pt-2">
                        <Button
                            className={cn(
                                "rounded-full px-4 py-2 text-xs font-medium",
                                "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            {button.text}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

function CloningStatusIndicator({ status }: { status: CloningStatus }) {
    const isVisible = useMemo(() => status !== "idle", [status]);
    const isLoading = useMemo(() => status === "cloning" || status === "starting", [status]);

    const statusText = useMemo(() => {
        switch (status) {
            case "cloning":
                return "Importing";
            case "cloned":
                return "Imported";
            case "starting":
                return "Opening notes";
            case "started":
            case "preview":
                return "Notes ready";
            default:
                return "";
        }
    }, [status]);

    const animationKey = useMemo(() => (status === "preview" ? "started" : status), [status]);

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key={animationKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute left-1/2 top-[-0.875rem] z-10 flex -translate-x-1/2 items-center justify-center"
                >
                    <Button
                        size="sm"
                        className={cn(
                            "flex h-10 w-fit items-center gap-2 rounded-full border border-border bg-card pl-2 pr-4! text-sm font-medium text-card-foreground shadow-lg hover:bg-accent"
                        )}
                    >
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                            ) : (
                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground">
                                    <Check className="h-3 w-3 stroke-2 text-background" />
                                </div>
                            )}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">
                            {statusText}
                        </span>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
