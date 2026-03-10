import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getAllCategories } from "@/actions/prompt";

export default async function CategoriesPage() {
    const categories = await getAllCategories();

    return (
        <main className="min-h-screen flex flex-col pt-16">
            <Navbar />
            <div className="container mx-auto px-4 py-16 flex-1">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Explore Categories</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Browse our curated collection of AI image prompts organized by style, subject, and use-case.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground font-medium">
                        No categories found. Start creating them in the Admin Panel!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((cat: any) => (
                            <Link
                                href={`/categories/${cat.slug}`}
                                key={cat.id}
                                className="group p-8 rounded-3xl bg-card border border-border/50 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{cat.name}</h2>
                                <div className="text-sm font-medium px-3 py-1 bg-muted rounded-full">
                                    {cat._count.prompts} Prompts
                                </div>
                                <div className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Library →
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
