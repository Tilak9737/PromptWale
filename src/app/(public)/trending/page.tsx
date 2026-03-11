import Navbar from "@/components/layout/Navbar";
import PromptCard from "@/components/ui/PromptCard";
import { getTrendingPrompts } from "@/actions/prompt";
import { TrendingUp } from "lucide-react";

export default async function TrendingPage() {
    const prompts = await getTrendingPrompts();

    return (
        <main className="page-fade-in flex min-h-screen flex-col">
            <Navbar />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
                <section className="section-shell clay-soft">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="clay flex h-16 w-16 items-center justify-center rounded-2xl text-primary">
                            <TrendingUp size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Trending Prompts</h1>
                        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                            The hottest and most copied AI image generation prompts on the platform this week.
                        </p>
                    </div>
                </section>

                <section className="section-shell clay-soft">
                    {prompts.length === 0 ? (
                        <div className="clay-inset flex h-64 items-center justify-center rounded-3xl text-center text-lg font-medium text-muted-foreground">
                            No trending prompts available yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                </section>
            </div>
        </main>
    );
}
