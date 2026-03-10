import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import LatestPrompts from "@/components/home/LatestPrompts";
import TrendingPrompts from "@/components/home/TrendingPrompts";
import PopularCategories from "@/components/home/PopularCategories";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />
      <Hero />
      <LatestPrompts />

      <TrendingPrompts />
      <PopularCategories />

      <footer className="py-12 border-t border-border mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PromptWale. Created with ❤️ for AI Creators.
          </p>
        </div>
      </footer>
    </main>
  );
}
