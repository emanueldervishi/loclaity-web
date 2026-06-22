import Link from "next/link";
import { BrandMark } from "@/components/brand-logo";
import { siteConfig } from "@/lib/codeforge/config";

export function Footer() {
    const { footerLinks, name } = siteConfig;

    return (
        <footer className="w-full">
            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
                {footerLinks.map((section) => (
                    <div
                        key={section.title}
                        className="flex flex-col gap-4 p-8 lg:pt-18"
                    >
                        <h3 className="text-sm font-semibold text-foreground">
                            {section.title}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {section.links.map((link) => (
                                <li key={link.id}>
                                    <Link
                                        href={link.url}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="flex flex-col items-start justify-start gap-4 p-8 lg:pt-18 md:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-foreground text-background">
                            <BrandMark className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{name}</p>
                            <p className="text-sm text-muted-foreground">Local memory for coding agents.</p>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Private by default</li>
                        <li>Readable project memory</li>
                        <li>Built for daily agent work</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-border py-4">
                <p className="text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {name}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
