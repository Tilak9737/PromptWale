"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, Zap, Sun, Moon, X, TrendingUp, Grid, Cpu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMenuOpen(false);
        }
    };

    const navLinks = [
        { name: "Categories", href: "/categories", icon: <Grid size={18} /> },
        { name: "Trending", href: "/trending", icon: <TrendingUp size={18} /> },
        { name: "Tools", href: "/tools", icon: <Cpu size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border/50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group shrink-0">
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

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="hover:text-primary transition-colors">{link.name}</Link>
                        ))}
                    </nav>

                    {mounted && (
                        <button
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            className="p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center active:scale-95"
                            aria-label="Toggle Theme"
                        >
                            {resolvedTheme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    )}

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-2 hover:bg-muted rounded-full transition-colors active:scale-95"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-[80%] max-w-sm bg-card border-l border-border shadow-2xl md:hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <span className="font-bold">Navigation</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <form onSubmit={handleSearch} className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search library..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </form>

                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">Menu</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center space-x-3 p-4 bg-muted/30 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group"
                                            >
                                                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                                    {link.icon}
                                                </div>
                                                <span className="font-bold">{link.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-muted/20">
                                <p className="text-center text-xs text-muted-foreground">
                                    © {new Date().getFullYear()} PromptWale V2
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
