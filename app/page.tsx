import LandingPage from "@/components/LandingPage";
// import { FeaturedProperties } from "@/components/home/FeaturedProperties";
// import { Testimonials } from "@/components/home/Testimonials";
import { NeighborhoodMap } from "@/components/home/NeighborhoodMap";
import { CTABanner } from "@/components/home/CTABanner";
// import { Footersection } from "@/components/footer-section";
// import { Navbar } from "@/components/layout/Navbar";
// import Menu
export default function Home() {
  return (
    <>
    {/* <Navbar/> */}
  
      <LandingPage/>
      {/* <FeaturedProperties /> */}
     
      <NeighborhoodMap />
      {/* <Testimonials /> */}
      <CTABanner />
      {/* <Footersection /> */}
    </>
  );
}
