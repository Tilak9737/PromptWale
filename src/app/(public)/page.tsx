import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import LatestPrompts from "@/components/home/LatestPrompts";
import TrendingPrompts from "@/components/home/TrendingPrompts";
import PopularCategories from "@/components/home/PopularCategories";
import HomeScrollEffects from "@/components/home/HomeScrollEffects";

export default function Home() {
  return (
    <main id="home-scroll-container" className="home-snap-scroll page-fade-in flex-1">
      <HomeScrollEffects />

      <div className="home-live-bg" data-home-live-bg aria-hidden="true">
        <span className="home-live-orb home-live-orb--one" />
        <span className="home-live-orb home-live-orb--two" />
        <span className="home-live-orb home-live-orb--three" />
        <span className="home-live-grid" />
      </div>

      <section data-home-panel className="home-snap-panel is-visible">
        <div className="home-panel-content w-full">
          <Navbar />
          <Hero />
        </div>
      </section>

      <section data-home-panel className="home-snap-panel">
        <div className="home-panel-content w-full">
          <LatestPrompts />
        </div>
      </section>

      <section data-home-panel className="home-snap-panel">
        <div className="home-panel-content w-full">
          <TrendingPrompts />
        </div>
      </section>

      <section data-home-panel className="home-snap-panel">
        <div className="home-panel-content w-full">
          <PopularCategories />
        </div>
      </section>

      <section data-home-panel className="home-snap-panel home-snap-panel--footer">
        <div className="home-panel-content w-full">
          <footer className="mx-4 mt-8 rounded-3xl border border-border/55 py-10 text-center sm:mx-6">
            <div className="mx-auto max-w-7xl px-4">
              <p className="text-sm text-muted-foreground">
                (c) {new Date().getFullYear()} PromptWale. Crafted for AI creators.
              </p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
