import PromptCard from "../ui/PromptCard";
import { getLatestPrompts } from "@/actions/prompt";
import Link from "next/link";

export default async function LatestPrompts() {
    const prompts = await getLatestPrompts(8);

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Latest Prompts</h2>
                        <p className="text-muted-foreground">Freshly updated prompts from our community.</p>
                    </div>
                    <Link href="/search" className="text-sm font-bold text-primary hover:underline transition-all">
                        View All
                    </Link>
                </div>

                {prompts.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl text-muted-foreground font-medium">
                        <p>No prompts found yet.</p>
                        <p className="text-sm mt-2">Check back soon or create one from the admin panel!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {prompts.map((prompt: { id: string; title: string; categories?: { name: string }[]; tool: string; beforeImage: string; afterImage: string; views: number; copies: number; slug: string; thumbnailPos?: string }, i: number) => (
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
                                priority={i < 4}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
