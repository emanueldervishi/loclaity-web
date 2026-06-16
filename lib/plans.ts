export const plans = {
  FREE: {
    name: "Free",
    price: 0,
    description: "A permanent local memory for your newest Codex work.",
    features: [
      "Latest 10 agent chats",
      "Up to 50 turns per chat",
      "Codex importer",
      "Manual imports",
      "Local Obsidian notes"
    ]
  },
  GO: {
    name: "Go",
    price: 9,
    description: "For developers using agents every day.",
    features: [
      "Unlimited history",
      "Codex, Claude Code, Cursor and Copilot",
      "Automatic imports",
      "Web and Obsidian Local AI chat",
      "Ollama, OpenAI and Claude"
    ]
  },
  PLUS: {
    name: "Plus",
    price: 19,
    description: "A connected memory layer across your whole setup.",
    features: [
      "Everything in Go",
      "Multiple devices and vaults",
      "Advanced semantic indexing",
      "Team-ready export",
      "Priority releases"
    ]
  }
} as const;

export type PaidPlan = "GO" | "PLUS";

export function priceIdForPlan(plan: PaidPlan) {
  return plan === "GO"
    ? process.env.STRIPE_GO_PRICE_ID
    : process.env.STRIPE_PLUS_PRICE_ID;
}

export function planFromPriceId(priceId?: string | null): "FREE" | PaidPlan {
  if (priceId && priceId === process.env.STRIPE_PLUS_PRICE_ID) return "PLUS";
  if (priceId && priceId === process.env.STRIPE_GO_PRICE_ID) return "GO";
  return "FREE";
}
