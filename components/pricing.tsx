import Link from "next/link";
import { Check } from "lucide-react";
import { plans } from "@/lib/plans";

type PricingProps = {
  signedIn?: boolean;
  currentPlan?: string;
};

export function Pricing({ signedIn = false, currentPlan = "FREE" }: PricingProps) {
  return (
    <div className="pricing-grid">
      {Object.entries(plans).map(([key, plan]) => {
        const isCurrent = key === currentPlan;
        const isPaid = key !== "FREE";

        return (
          <article className={`price-card ${key === "GO" ? "featured" : ""}`} key={key}>
            {key === "GO" && <span className="price-badge">Most useful</span>}
            <h3>{plan.name}</h3>
            <div className="price">
              ${plan.price}
              <span>{plan.price > 0 ? " / month" : " forever"}</span>
            </div>
            <p>{plan.description}</p>
            <ul className="feature-list">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {isCurrent ? (
              <span className="button secondary full current-plan">Current plan</span>
            ) : isPaid && signedIn ? (
              <form action="/api/stripe/checkout" method="POST">
                <input name="plan" type="hidden" value={key} />
                <button className={`button full ${key === "GO" ? "accent" : ""}`} type="submit">
                  Choose {plan.name}
                </button>
              </form>
            ) : (
              <Link className={`button full ${key === "GO" ? "accent" : ""}`} href="/login">
                {isPaid ? `Start with ${plan.name}` : "Create free account"}
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
