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
                const prompts = await getLatestPrompts(12);
                setResults(prompts);
            }
            setIsLoading(false);
        }, query.trim().length > 0 ? 500 : 0);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <main className="page-fade-in flex min-h-screen flex-col">
            <Navbar />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
                <section className="section-shell clay-soft">
                    <div className="relative z-10 mx-auto max-w-3xl">
                        <h1 className="mb-7 text-center text-3xl font-extrabold sm:text-4xl">Search the Library</h1>
                        <div className="relative">
                            <div className="clay-inset flex h-16 items-center rounded-full pr-2">
                                <SearchIcon className="ml-5 h-6 w-6 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by keywords, tools, or style..."
                                    className="flex-1 bg-transparent px-4 py-2 text-base focus:outline-none placeholder:text-muted-foreground/60 sm:text-lg"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                                <button className="clay flex h-12 items-center space-x-2 rounded-full px-5 text-sm font-bold text-primary sm:text-base">
                                    <span>Search</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                            <span className="inline-flex items-center space-x-1 rounded-full px-3 py-1">
                                <SlidersHorizontal size={14} />
                                <span>Advanced Filters</span>
                            </span>
                            <span>Try: &quot;Cyberpunk&quot;, &quot;Gemini&quot;, &quot;Portraits&quot;</span>
                        </div>
                    </div>
                </section>

                <section className="section-shell clay-soft">
                    <div className="mb-7 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-xl font-bold">Search Results</h2>
                        <span className="text-sm text-muted-foreground">
                            {isLoading ? "Searching..." : `${results.length} results found`}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
                            <Loader2 className="relative top-2 animate-spin text-primary" size={32} />
                            <p className="font-bold">Searching library...</p>
                        </div>
                    ) : query.length < 2 ? (
                        <div className="clay-inset mb-2 flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl text-center">
                            <div className="clay-soft flex h-16 w-16 items-center justify-center rounded-full">
                                <SearchIcon className="text-muted-foreground" size={24} />
                            </div>
                            <div>
                                <p className="text-lg font-bold">Start typing to search.</p>
                                <p className="text-sm text-muted-foreground">Discover high-quality AI prompts.</p>
                            </div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="clay-inset mb-2 flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl text-center">
                            <p className="text-lg font-bold">No prompts found for &quot;{query}&quot;.</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your keywords.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                </section>
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
