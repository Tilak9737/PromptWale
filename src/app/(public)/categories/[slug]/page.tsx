import Navbar from "@/components/layout/Navbar";
import PromptCard from "@/components/ui/PromptCard";
import { getCategoryBySlug } from "@/actions/prompt";
import { notFound } from "next/navigation";
import CategorySort from "@/components/category/CategorySort";
import CategoryToolFilter from "@/components/category/CategoryToolFilter";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const categoryData = await getCategoryBySlug(slug);

    if (!categoryData) return { title: "Category Not Found" };

    const title = `${categoryData.name} AI Prompts | ${categoryData.prompts.length} Prompts | PromptWale`;
    const description = categoryData.description || `Browse a curated collection of high-quality AI prompts in the ${categoryData.name} category. Enhance your creativity with PromptWale.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

interface PromptWithCategory {
    id: string;
    title: string;
    tool: string;
    beforeImage: string;
    afterImage: string;
    views: number;
    copies: number;
    slug: string;
    thumbnailPos?: string;
    category?: { name: string };
}

export default async function CategoryDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ tool?: string; sort?: string }>;
}) {
    const { slug } = await params;
    const { tool, sort } = await searchParams;
    const categoryData = await getCategoryBySlug(slug, tool, sort);

    if (!categoryData) {
        return notFound();
    }

    const { prompts, availableTools, name, description } = categoryData;
    const typedPrompts = prompts as PromptWithCategory[];

    return (
        <main className="page-fade-in flex min-h-screen flex-col">
            <Navbar />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
                <section className="section-shell clay-soft">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="mb-2 text-4xl font-extrabold tracking-tight md:text-5xl">{name}</h1>
                            <p className="text-base text-muted-foreground sm:text-lg">
                                {description || "Explore top-rated prompts for this style."}
                            </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 md:mt-0">
                            <CategoryToolFilter tools={availableTools} currentTool={tool} />
                            <CategorySort currentSort={sort || "Newest First"} />
                        </div>
                    </div>
                </section>

                <section className="section-shell clay-soft">
                    {prompts.length === 0 ? (
                        <div className="clay-inset flex h-64 items-center justify-center rounded-3xl text-center text-lg font-medium text-muted-foreground">
                            No prompts available in this category yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {typedPrompts.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    id={prompt.id}
                                    title={prompt.title}
                                    category={name}
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
