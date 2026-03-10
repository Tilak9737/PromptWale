import { Zap, Copy, ImageIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-20 pb-16 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                    <Zap size={14} fill="currentColor" />
                    <span>The Ultimate AI Prompt Library</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                    Transform Your Images with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
                        God-Tier AI Prompts
                    </span>
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Discover, copy, and remix professionally crafted image editing prompts for Gemini, Nano Banana, and more. Elevate your creative workflow in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/search" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center space-x-2">
                        <span>Explore Library</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link href="/trending" className="w-full sm:w-auto px-8 py-4 bg-muted hover:bg-muted/80 text-foreground rounded-full font-bold transition-all flex items-center justify-center space-x-2">
                        <Copy size={18} />
                        <span>Copy Recent Prompts</span>
                    </Link>
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center justify-center space-x-2">
                        <Zap size={24} />
                        <span className="font-bold">Gemini</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <ImageIcon size={24} />
                        <span className="font-bold">Nano Banana</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <Zap size={24} />
                        <span className="font-bold">Pro AI</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <ImageIcon size={24} />
                        <span className="font-bold">Nano Banana 2</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
