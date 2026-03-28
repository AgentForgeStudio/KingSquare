import LandingPage from "@/components/LandingPage";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { StatsCounter } from "@/components/home/StatsCounter";
import { Testimonials } from "@/components/home/Testimonials";
import { NeighborhoodMap } from "@/components/home/NeighborhoodMap";
import { CTABanner } from "@/components/home/CTABanner";
import { ProcessSection } from "@/components/home/ProcessSection";

export default function Home() {
  return (
    <>
      <LandingPage />
      {/* <FeaturedProperties /> */}
      <StatsCounter />
      <ProcessSection />
      <NeighborhoodMap />
      <Testimonials />
      <CTABanner />
    </>
  );
}
