import Navbar from "@/components/layout/Navbar";
import PromptCard from "@/components/ui/PromptCard";
import { getCategoryBySlug } from "@/actions/prompt";
import { notFound } from "next/navigation";
import CategorySort from "@/components/category/CategorySort";
import CategoryToolFilter from "@/components/category/CategoryToolFilter";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const categoryData = await getCategoryBySlug(slug);

    if (!categoryData) return { title: 'Category Not Found' };

    const title = `${categoryData.name} AI Prompts | ${categoryData.prompts.length} Prompts | PromptWale`;
    const description = categoryData.description || `Browse a curated collection of high-quality AI prompts in the ${categoryData.name} category. Enhance your creativity with PromptWale.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
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
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ tool?: string, sort?: string }>
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
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex-1">

                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border/50 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                            {name}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {description || "Explore top-rated prompts for this style."}
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0 flex items-center space-x-4">
                        <CategoryToolFilter tools={availableTools} currentTool={tool} />
                        <CategorySort currentSort={sort || "Newest First"} />
                    </div>
                </div>

                {/* Prompt Grid */}
                {prompts.length === 0 ? (
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground text-lg font-medium">
                        No prompts available in this category yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>
        </main>
    );
}
