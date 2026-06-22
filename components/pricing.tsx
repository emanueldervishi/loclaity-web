import Link from "next/link";
import { Check } from "lucide-react";
import { plans } from "@/lib/plans";

type PricingProps = {
  signedIn?: boolean;
  currentPlan?: string;
};

export function Pricing({ signedIn = false, currentPlan = "FREE" }: PricingProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {Object.entries(plans).map(([key, plan]) => {
        const isCurrent = key === currentPlan;
        const isPaid = key !== "FREE";

        return (
          <article
            className={`flex h-full flex-col rounded-[1.75rem] border bg-card/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl ${
              key === "GO" ? "border-primary/30 ring-1 ring-primary/10" : ""
            }`}
            key={key}
          >
            {key === "GO" ? (
              <span className="mb-5 inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Most useful
              </span>
            ) : null}

            <h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
            <div className="mt-4 text-4xl font-semibold tracking-tight">
              ${plan.price}
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                {plan.price > 0 ? "/ month" : "forever"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.description}</p>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li className="flex items-start gap-3 text-sm leading-6 text-foreground/90" key={feature}>
                  <Check className="mt-1 size-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {isCurrent ? (
              <span className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl border bg-muted text-sm font-semibold text-foreground">
                Current plan
              </span>
            ) : isPaid && signedIn ? (
              <form action="/api/stripe/checkout" method="POST" className="mt-8">
                <input name="plan" type="hidden" value={key} />
                <button
                  className={`inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                    key === "GO"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                  type="submit"
                >
                  Choose {plan.name}
                </button>
              </form>
            ) : (
              <Link
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                  key === "GO"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
                href="/login"
              >
                {isPaid ? `Start with ${plan.name}` : "Create free account"}
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
