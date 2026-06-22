import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/codeforge/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { buildMetadata, seoConfig } from "@/lib/seo";
import "@/app/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(seoConfig.siteUrl),
  applicationName: seoConfig.name,
  authors: [{ name: seoConfig.name }],
  creator: seoConfig.name,
  publisher: seoConfig.name,
  category: "developer tools",
  title: {
    default: seoConfig.title,
    template: "%s"
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="locality-theme"
        >
          <TooltipProvider>
            {children}
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
