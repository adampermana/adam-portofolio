import HeroSection from "@/components/HeroSection";
import ScrollExperience from "@/components/ScrollExperience";

export default function Home() {
  return (
    <main className="flex w-full flex-col bg-space-black">
      <HeroSection />
      <ScrollExperience />

      <footer className="relative z-10 w-full border-t border-white/10 bg-space-black px-6 py-8 text-center">
        <p className="text-sm text-gray-500">
          Copyright {new Date().getFullYear()} Adam Permana. Mobile app developer portfolio.
        </p>
      </footer>
    </main>
  );
}
