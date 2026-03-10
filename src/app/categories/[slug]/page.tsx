import Navbar from "@/components/layout/Navbar";
import PromptCard from "@/components/ui/PromptCard";
import { Filter } from "lucide-react";
import { getCategoryBySlug } from "@/actions/prompt";
import { notFound } from "next/navigation";
import CategorySort from "@/components/category/CategorySort";
import CategoryToolFilter from "../../../components/category/CategoryToolFilter";

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

interface CategoryWithPrompts {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    prompts: PromptWithCategory[];
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
    const categoryResult = await getCategoryBySlug(slug, tool, sort);

    if (!categoryResult) {
        return notFound();
    }

    const category = categoryResult as any as CategoryWithPrompts;

    // Get all unique tools for the filter - we fetch all prompts for the category (unfiltered for tools) to get the list
    const allCategoryResult = await getCategoryBySlug(slug);
    const allCategory = allCategoryResult as any as CategoryWithPrompts;

    const uniqueTools = Array.from(new Set(
        allCategory?.prompts
            .map((p: PromptWithCategory) => p.tool)
            .flatMap((t: string) => t.split(',').map((s: string) => s.trim()))
            .filter(Boolean) || []
    ));

    return (
        <main className="min-h-screen flex flex-col pt-16">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex-1">

                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border/50 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                            {category.name}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {category.description || "Explore top-rated prompts for this style."}
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0 flex items-center space-x-4">
                        <CategoryToolFilter tools={uniqueTools} currentTool={tool} />
                        <CategorySort currentSort={sort || "Newest First"} />
                    </div>
                </div>

                {/* Prompt Grid */}
                {category.prompts.length === 0 ? (
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground text-lg font-medium">
                        No prompts available in this category yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {category.prompts.map((prompt: any) => (
                            <PromptCard
                                key={prompt.id}
                                id={prompt.id}
                                title={prompt.title}
                                category={prompt.categories?.map((c: any) => c.name).join(", ") || category.name}
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
