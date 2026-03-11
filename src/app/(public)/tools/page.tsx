import Navbar from "@/components/layout/Navbar";
import { Zap, ImageIcon, Settings, Cpu } from "lucide-react";
import Link from "next/link";

const TOOLS = [
    { name: "Gemini", icon: <Zap size={32} />, desc: "Google's powerful multimodal AI." },
    { name: "Nano Banana", icon: <ImageIcon size={32} />, desc: "High-fidelity generation engine." },
    { name: "Nano Banana Pro", icon: <Settings size={32} />, desc: "Advanced tools for pro creators." },
    { name: "Nano Banana 2", icon: <Cpu size={32} />, desc: "Next-gen experimental synthesis." },
    { name: "Midjourney", icon: <ImageIcon size={32} />, desc: "Industry leading artistic synthesis." },
];

export default function ToolsPage() {
    return (
        <main className="page-fade-in flex min-h-screen flex-col">
            <Navbar />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
                <section className="section-shell clay-soft">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">AI Generation Tools</h1>
                        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                            Filter prompts optimized for your preferred image synthesis engine.
                        </p>
                    </div>
                </section>

                <section className="section-shell clay-soft">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {TOOLS.map((tool) => (
                            <Link
                                href={`/search?tool=${encodeURIComponent(tool.name)}`}
                                key={tool.name}
                                className="clay hover-lift group flex cursor-pointer flex-col items-center rounded-2xl p-6 text-center"
                            >
                                <div className="clay-soft mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                                    {tool.icon}
                                </div>
                                <h2 className="mb-2 text-xl font-bold">{tool.name}</h2>
                                <p className="text-sm text-muted-foreground">{tool.desc}</p>
                                <span className="mt-5 text-sm font-bold uppercase tracking-wide text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                    View Prompts -&gt;
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
