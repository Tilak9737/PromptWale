"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PromptCard from "@/components/ui/PromptCard";
import { SearchIcon, SlidersHorizontal, Loader2 } from "lucide-react";
import { searchPrompts, getLatestPrompts } from "@/actions/prompt";

function SearchContent() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get("q") || searchParams.get("tool") || "";

    const [query, setQuery] = useState(queryParam);
    const [results, setResults] = useState<Array<{ id: string; title: string; categories?: { name: string }[]; tool: string; beforeImage: string; afterImage: string; views: number; copies: number; slug: string; thumbnailPos?: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            if (query.trim().length > 1) {
                const prompts = await searchPrompts(query);
                setResults(prompts);
            } else {
                // Fetch trending or latest if query is empty
                const prompts = await getLatestPrompts(12);
                setResults(prompts);
            }
            setIsLoading(false);
        }, query.trim().length > 0 ? 500 : 0); // No debounce for empty state

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex-1">

                {/* Search Header */}
                <div className="max-w-3xl mx-auto mb-16 relative z-10">
                    <h1 className="text-3xl font-extrabold text-center mb-8">Search the Library</h1>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-card border border-border/50 rounded-full p-2 h-16 shadow-2xl">
                            <SearchIcon className="ml-4 text-muted-foreground h-6 w-6" />
                            <input
                                type="text"
                                placeholder="Search by keywords, tools, or style..."
                                className="flex-1 bg-transparent px-4 py-2 text-lg focus:outline-none placeholder:text-muted-foreground/50"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <button className="h-full px-6 bg-primary text-primary-foreground font-bold rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center space-x-2">
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1 cursor-pointer hover:text-foreground transition-colors"><SlidersHorizontal size={14} /> <span>Advanced Filters</span></span>
                        <span>•</span>
                        <span>Try: &quot;Cyberpunk&quot;, &quot;Gemini&quot;, &quot;Portraits&quot;</span>
                    </div>
                </div>

                {/* Search Results Area */}
                <div className="border-t border-border/50 pt-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Search Results</h2>
                        <span className="text-sm text-muted-foreground">
                            {isLoading ? "Searching..." : `${results.length} results found`}
                        </span>
                    </div>

                    {/* States */}
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                            <Loader2 className="animate-spin text-primary relative top-2" size={32} />
                            <p className="font-bold">Searching library...</p>
                        </div>
                    ) : query.length < 2 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border/50 rounded-3xl mb-8">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <SearchIcon className="text-muted-foreground" size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-lg">Start typing to search.</p>
                                <p className="text-muted-foreground text-sm">Discover high-quality AI prompts.</p>
                            </div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border/50 rounded-3xl mb-8">
                            <p className="font-bold text-lg">No prompts found for &quot;{query}&quot;.</p>
                            <p className="text-muted-foreground text-sm">Try adjusting your keywords.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {results.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    id={prompt.id}
                                    title={prompt.title}
                                    category={prompt.categories?.map((c: { name: string }) => c.name).join(", ") || ""}
                                    tool={prompt.tool}
                                    beforeImage={prompt.beforeImage}
                                    afterImage={prompt.afterImage}
                                    views={prompt.views}
                                    copies={prompt.copies}
                                    slug={prompt.slug}
                                    thumbnailPos={prompt.thumbnailPos}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading search...</div>}>
            <SearchContent />
        </Suspense>
    );
}
