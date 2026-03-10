import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { deleteCategory } from "@/actions/admin";

export default async function AdminCategoriesPage() {
    const deleteAction = async (formData: FormData) => {
        "use server";
        await deleteCategory(formData.get("id") as string);
    };

    // Fetch all categories and the count of their related prompts
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { prompts: true } }
        }
    });

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Category Management</h1>
                    <p className="text-muted-foreground">Organize your prompts by style and domain.</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>New Category</span>
                </Link>
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
                                categories.map((cat: any) => (
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
            </div>
        </div>
    );
}
