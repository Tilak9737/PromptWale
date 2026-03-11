import Link from "next/link";
import { getAllCategories } from "@/actions/prompt";

export default async function PopularCategories() {
    const categories = await getAllCategories();

    return (
        <section className="px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-14">
            <div className="section-shell clay-soft mx-auto max-w-7xl text-center">
                <h2 className="mb-10 text-3xl font-bold">Popular Categories</h2>

                {categories.length === 0 ? (
                    <div className="clay-inset flex h-32 items-center justify-center rounded-2xl text-muted-foreground">
                        No categories available.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.slice(0, 8).map((cat: { id: string; slug: string; name: string; _count: { prompts: number } }) => (
                            <Link
                                href={`/categories/${cat.slug}`}
                                key={cat.id}
                                className="clay hover-lift flex flex-col items-center justify-center rounded-2xl p-5 sm:p-8 group"
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
