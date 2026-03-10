import Link from "next/link";
import { getAllCategories } from "@/actions/prompt";

export default async function PopularCategories() {
    const categories = await getAllCategories();

    return (
        <section className="py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-10">Popular Categories</h2>

                {categories.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-border/50 rounded-2xl text-muted-foreground">
                        No categories available.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.slice(0, 8).map((cat: { id: string; slug: string; name: string; _count: { prompts: number } }) => (
                            <Link
                                href={`/categories/${cat.slug}`}
                                key={cat.id}
                                className="p-8 rounded-2xl bg-muted/30 border border-border/50 hover:bg-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all flex flex-col items-center justify-center group"
                            >
                                <span className="font-bold mb-1 group-hover:text-primary transition-colors">{cat.name}</span>
                                <span className="text-xs text-muted-foreground">{cat._count.prompts} prompts</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
