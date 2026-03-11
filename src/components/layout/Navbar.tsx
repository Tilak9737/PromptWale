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
        <nav className="relative z-50 px-3 pt-3 sm:px-5">
            <div className="clay-soft mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-[1.3rem] px-3 sm:px-5 lg:px-6">
                <Link href="/" className="group flex shrink-0 items-center space-x-2.5">
                    <div className="pulse-ring flex h-9 w-9 items-center justify-center rounded-[0.95rem] bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                        <Zap size={20} />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight">
                        Prompt<span className="text-primary">Wale</span>
                    </span>
                </Link>

                <div className="mx-4 hidden max-w-lg flex-1 items-center md:flex">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search prompts, tools, styles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="clay-inset h-11 w-full rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </form>
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <nav className="hidden items-center space-x-1 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="hover-lift flex items-center space-x-2 rounded-full px-3 py-2 text-sm font-semibold text-foreground/90 transition-colors hover:text-primary"
                            >
                                <span className="text-muted-foreground">{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {mounted && (
                        <button
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            className="clay flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
                            aria-label="Toggle Theme"
                        >
                            {resolvedTheme === "dark" ? <Moon size={19} /> : <Sun size={19} />}
                        </button>
                    )}

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="clay flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5 active:scale-95 md:hidden"
                        aria-label="Open menu"
                    >
                        <Menu size={19} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-background/75 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 210 }}
                            className="clay fixed right-2 top-2 bottom-2 z-50 flex w-[90%] max-w-sm flex-col rounded-[1.7rem] md:hidden"
                        >
                            <div className="border-b border-border/60 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-bold">Explore</span>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="clay-soft flex h-9 w-9 items-center justify-center rounded-full"
                                        aria-label="Close menu"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-8 overflow-y-auto p-5">
                                <form onSubmit={handleSearch} className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search library..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="clay-inset h-12 w-full rounded-2xl pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </form>

                                <div className="space-y-3">
                                    <p className="pl-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Menu</p>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="clay-soft flex items-center space-x-3 rounded-2xl p-4 text-sm font-bold transition-colors hover:text-primary"
                                            >
                                                <span className="text-muted-foreground">{link.icon}</span>
                                                <span>{link.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border/60 p-5">
                                <p className="text-center text-xs text-muted-foreground">
                                    (c) {new Date().getFullYear()} PromptWale
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
