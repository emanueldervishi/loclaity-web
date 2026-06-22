import type { Metadata } from "next";

const baseUrl = "https://localitycli.vercel.app";

export const seoConfig = {
  name: "Locality",
  shortName: "Locality",
  title: "Locality - Local-First Memory for Codex Users",
  description:
    "Locality helps Codex users search sessions, commands, diffs, decisions, and debugging context in one private local-first project memory workspace.",
  socialTitle: "Locality - Searchable Project Memory for Codex Users",
  socialDescription:
    "Stop losing why something changed. Locality gives Codex users a local-first memory layer for sessions, commands, diffs, decisions, and debugging context.",
  siteUrl: baseUrl,
  ogImage: `${baseUrl}/logo.png`,
  keywords: [
    "Locality",
    "Codex memory",
    "local-first memory",
    "project memory",
    "AI coding context",
    "searchable coding sessions",
    "command history for developers",
    "debugging context",
    "diff search",
    "developer memory workspace",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, seoConfig.siteUrl).toString();
}

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: MetadataInput = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${seoConfig.name}` : seoConfig.title;
  const resolvedDescription = description ?? seoConfig.description;
  const url = absoluteUrl(path);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: [...seoConfig.keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: seoConfig.name,
      title: title ? `${title} | ${seoConfig.name}` : seoConfig.socialTitle,
      description: description ?? seoConfig.socialDescription,
      images: [
        {
          url: seoConfig.ogImage,
          alt: "Locality logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${seoConfig.name}` : seoConfig.socialTitle,
      description: description ?? seoConfig.socialDescription,
      images: [seoConfig.ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
