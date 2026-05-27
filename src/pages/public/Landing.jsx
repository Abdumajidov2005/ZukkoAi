import Background from "../../components/ui/Background";
import PublicNavbar from "../../components/landing/PublicNavbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import DashboardPreview from "../../components/landing/DashboardPreview";
import { Testimonials, Pricing } from "../../components/landing/Testimonials";
import { FAQ, Contact, Footer } from "../../components/landing/FAQ";

export default function Landing() {
  return (
    <div className="relative min-h-screen">
      <Background dense />
      <PublicNavbar />
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
