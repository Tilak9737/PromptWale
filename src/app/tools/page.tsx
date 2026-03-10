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
        <main className="min-h-screen flex flex-col pt-16">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex-1 max-w-7xl">

                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI Generation Tools</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Filter prompts optimized for your preferred image synthesis engine.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOOLS.map(tool => (
                        <Link href={`/search?tool=${encodeURIComponent(tool.name)}`} key={tool.name} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col items-center text-center cursor-pointer">
                            <div className="w-16 h-16 bg-muted text-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                {tool.icon}
                            </div>
                            <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
                            <p className="text-sm text-muted-foreground">{tool.desc}</p>
                            <span className="mt-6 text-primary font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                View Prompts &rarr;
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
