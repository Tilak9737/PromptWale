import PromptCard from "../ui/PromptCard";
import { getTrendingPrompts } from "@/actions/prompt";

export default async function TrendingPrompts() {
    const prompts = await getTrendingPrompts(4);

    return (
        <section className="px-4 py-8 sm:px-6 sm:py-10">
            <div className="section-shell clay-soft mx-auto max-w-7xl">
                <div className="mb-10 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Trending This Week</h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Most popular prompts based on views and copies.
                    </p>
                </div>

                {prompts.length === 0 ? (
                    <div className="clay-inset flex h-48 items-center justify-center rounded-3xl text-muted-foreground font-medium">
                        No trending prompts to show yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
