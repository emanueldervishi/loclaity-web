import { Feature } from "@/components/codeforge/animations/feature-slide";
import { siteConfig } from "@/lib/codeforge/config";

export function DemoSection() {
    const { items } = siteConfig.demoSection;

    return (
        <section
            id="demo"
            className="w-full relative"
        >
            <Feature
                collapseDelay={5000}
                linePosition="bottom"
                featureItems={items}
                lineColor="bg-sky-500"
            />
        </section>
    );
}
