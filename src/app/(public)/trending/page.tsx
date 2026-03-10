import Navbar from "@/components/layout/Navbar";
import PromptCard from "@/components/ui/PromptCard";
import { getTrendingPrompts } from "@/actions/prompt";
import { TrendingUp } from "lucide-react";

export default async function TrendingPage() {
    const prompts = await getTrendingPrompts();

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex-1 max-w-7xl">

                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
                    <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-2">
                        <TrendingUp size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Trending Prompts</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        The hottest and most copied AI image generation prompts on the platform this week.
                    </p>
                </div>

                {prompts.length === 0 ? (
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground text-lg font-medium">
                        No trending prompts available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {prompts.map((prompt: { id: string; title: string; categories?: { name: string }[]; tool: string; beforeImage: string; afterImage: string; views: number; copies: number; slug: string; thumbnailPos?: string }) => (
                            <PromptCard
                                key={prompt.id}
                                id={prompt.id}
                                title={prompt.title}
                                category={prompt.categories?.map((c: { name: string }) => c.name).join(", ") || "Uncategorized"}
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
        </main>
    );
}
