import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getAllCategories } from "@/actions/prompt";

export default async function CategoriesPage() {
    const categories = await getAllCategories();

    return (
        <main className="page-fade-in flex min-h-screen flex-col">
            <Navbar />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
                <section className="section-shell clay-soft text-center">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">Explore Categories</h1>
                    <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                        Browse our curated collection of AI image prompts organized by style, subject, and use-case.
                    </p>
                </section>

                <section className="section-shell clay-soft">
                    {categories.length === 0 ? (
                        <div className="clay-inset flex h-48 items-center justify-center rounded-3xl text-center font-medium text-muted-foreground">
                            No categories found. Start creating them in the Admin Panel!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {categories.map((cat: { id: string; name: string; slug: string; _count: { prompts: number } }) => (
                                <Link
                                    href={`/categories/${cat.slug}`}
                                    key={cat.id}
                                    className="clay hover-lift group flex flex-col items-center justify-center space-y-3 rounded-3xl p-6 text-center"
                                >
                                    <h2 className="text-xl font-bold transition-colors group-hover:text-primary">{cat.name}</h2>
                                    <div className="clay-soft rounded-full px-3 py-1 text-sm font-medium">
                                        {cat._count.prompts} Prompts
                                    </div>
                                    <div className="text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                        View Library -&gt;
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
