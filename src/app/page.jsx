import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { EditorialFeature } from "@/components/home/EditorialFeature";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { TrustBanner } from "@/components/home/TrustBanner";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <CategoryShowcase />
      <TrendingGrid />
      <EditorialFeature />
      <ReviewsSection />
      <TrustBanner />
    </main>
  );
}
