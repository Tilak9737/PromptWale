import Link from "next/link";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { deleteCategory } from "@/actions/admin";

export default async function AdminCategoriesPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; q?: string }>
}) {
    const { page, q } = await searchParams;
    const currentPage = parseInt(page || "1");
    const pageSize = 10;
    const skip = (currentPage - 1) * pageSize;
    const searchQuery = q || "";

    const deleteAction = async (formData: FormData) => {
        "use server";
        await deleteCategory(formData.get("id") as string);
    };

    const where = searchQuery ? {
        OR: [
            { name: { contains: searchQuery, mode: 'insensitive' as const } },
            { slug: { contains: searchQuery, mode: 'insensitive' as const } }
        ]
    } : {};

    const [categories, totalCategories] = await Promise.all([
        prisma.category.findMany({
            where,
            orderBy: { name: "asc" },
            skip,
            take: pageSize,
            include: {
                _count: { select: { prompts: true } }
            }
        }),
        prisma.category.count({ where })
    ]);

    const totalPages = Math.ceil(totalCategories / pageSize);

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Category Management</h1>
                    <p className="text-muted-foreground">Organize your prompts by style and domain. ({totalCategories} total)</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <form action="/admin/categories" method="GET" className="relative w-full sm:w-64">
                        <input
                            type="text"
                            name="q"
                            defaultValue={searchQuery}
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <button type="submit" className="hidden" />
                    </form>
                    <Link
                        href="/admin/categories/new"
                        className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center space-x-2 shrink-0"
                    >
                        <Plus size={18} />
                        <span>New Category</span>
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border/50 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Name</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Slug</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground text-center">Prompt Count</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-card">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-medium">
                                        No categories exist yet. Creating a Prompt will auto-generate one!
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat: { id: string; name: string; slug: string; description: string | null; _count: { prompts: number } }) => (
                                    <tr key={cat.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground">{cat.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1 truncate max-w-[300px]">{cat.description || "No description provided."}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                                            /{cat.slug}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                                {cat._count.prompts}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/categories/${cat.id}/edit`} className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </Link>
                                                <form action={deleteAction}>
                                                    <input type="hidden" name="id" value={cat.id} />
                                                    <button type="submit" className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between bg-muted/10">
                        <div className="text-sm text-muted-foreground">
                            Showing <span className="font-bold text-foreground">{skip + 1}</span> to <span className="font-bold text-foreground">{Math.min(skip + pageSize, totalCategories)}</span> of <span className="font-bold text-foreground">{totalCategories}</span> categories
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link
                                href={`/admin/categories?page=${currentPage - 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                                className={`p-2 rounded-lg border border-border transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}
                            >
                                <ChevronLeft size={16} />
                            </Link>
                            <span className="text-sm font-medium px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Link
                                href={`/admin/categories?page=${currentPage + 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                                className={`p-2 rounded-lg border border-border transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}
                            >
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
