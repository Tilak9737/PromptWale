import { Zap, Copy, ImageIcon, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden px-4 pt-16 pb-14 sm:px-6 sm:pt-20 sm:pb-18">
            <div className="section-shell clay-soft relative mx-auto max-w-7xl">
                <div className="hero-kinetic" aria-hidden="true">
                    <span className="hero-blob hero-blob--one" />
                    <span className="hero-blob hero-blob--two" />
                    <span className="hero-blob hero-blob--three" />
                    <span className="hero-ring hero-ring--one" />
                    <span className="hero-ring hero-ring--two" />
                    <span className="hero-scan" />
                </div>

                <div className="relative z-10 text-center">
                    <div className="clay-soft mx-auto mb-7 inline-flex items-center space-x-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
                        <Sparkles size={14} />
                        <span>Curated Prompt Intelligence</span>
                    </div>

                    <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                        Premium AI Prompt Library for
                        <span className="gradient-shimmer ml-2 inline-block bg-gradient-to-r from-primary via-info to-primary bg-clip-text text-transparent">
                            Visual Creators
                        </span>
                    </h1>

                    <p className="mx-auto mb-9 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Discover, compare, and deploy production-quality prompt setups for Gemini, Nano Banana, and advanced image workflows.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <Link href="/search" className="clay hover-lift inline-flex w-full items-center justify-center space-x-2 rounded-full px-7 py-3.5 text-sm font-bold text-primary sm:w-auto sm:text-base">
                            <span>Explore Library</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link href="/trending" className="clay-soft hover-lift inline-flex w-full items-center justify-center space-x-2 rounded-full px-7 py-3.5 text-sm font-bold sm:w-auto sm:text-base">
                            <Copy size={17} />
                            <span>Top Prompts This Week</span>
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-3 text-xs sm:mt-14 sm:grid-cols-4 sm:gap-4 sm:text-sm">
                        <div className="clay-soft flex items-center justify-center space-x-2 rounded-2xl px-3 py-3 font-semibold">
                            <Zap size={18} />
                            <span>Gemini</span>
                        </div>
                        <div className="clay-soft flex items-center justify-center space-x-2 rounded-2xl px-3 py-3 font-semibold">
                            <ImageIcon size={18} />
                            <span>Nano Banana</span>
                        </div>
                        <div className="clay-soft flex items-center justify-center space-x-2 rounded-2xl px-3 py-3 font-semibold">
                            <Zap size={18} />
                            <span>Pro AI</span>
                        </div>
                        <div className="clay-soft flex items-center justify-center space-x-2 rounded-2xl px-3 py-3 font-semibold">
                            <ImageIcon size={18} />
                            <span>Studio Pipelines</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
