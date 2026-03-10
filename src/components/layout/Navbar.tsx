"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, Zap, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border/50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Zap size={20} className="text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Prompt<span className="text-primary">Wale</span>
                    </span>
                </Link>

                {/* Desktop Search */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search prompts (e.g. cinematic fashion)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </form>
                </div>

                <div className="flex items-center space-x-4">
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
                        <Link href="/trending" className="hover:text-primary transition-colors">Trending</Link>
                        <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
                    </nav>

                    {mounted && (
                        <button
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            className="p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center"
                            aria-label="Toggle Theme"
                        >
                            {resolvedTheme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    )}

                    <button className="md:hidden p-2 hover:bg-muted rounded-full transition-colors">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
