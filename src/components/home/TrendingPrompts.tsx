import PromptCard from "../ui/PromptCard";
import { getTrendingPrompts } from "@/actions/prompt";

export default async function TrendingPrompts() {
    const prompts = await getTrendingPrompts(4);

    return (
        <section className="py-16 bg-accent/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Trending This Week <span className="text-orange-500">🔥</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Most popular prompts based on views and copies.</p>
                </div>

                {prompts.length === 0 ? (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground font-medium">
                        No trending prompts to show yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {prompts.map((prompt: { id: string; title: string; categories?: { name: string }[]; tool: string; beforeImage: string; afterImage: string; views: number; copies: number; slug: string; thumbnailPos?: string }) => (
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
        </section>
    );
}
