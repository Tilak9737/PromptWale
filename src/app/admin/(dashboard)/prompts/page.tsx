import Link from "next/link";
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { deletePrompt } from "@/actions/admin";

export default async function AdminPromptsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || "1");
    const pageSize = 10;
    const skip = (currentPage - 1) * pageSize;

    const deleteAction = async (formData: FormData) => {
        "use server";
        await deletePrompt(formData.get("id") as string);
    };

    // Fetch prompts with pagination
    const [prompts, totalPrompts] = await Promise.all([
        prisma.prompt.findMany({
            skip,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            include: { categories: true }
        }),
        prisma.prompt.count()
    ]);

    const totalPages = Math.ceil(totalPrompts / pageSize);

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Prompts</h1>
                    <p className="text-muted-foreground">View and edit all {totalPrompts} prompts.</p>
                </div>
                <Link
                    href="/admin/prompts/new"
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Create Prompt</span>
                </Link>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border/50 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-bold text-muted-foreground w-16">Image</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Title</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Category</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Tool</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground text-center">Stats</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-card">
                            {prompts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">
                                        No prompts found. Create your first one!
                                    </td>
                                </tr>
                            ) : (
                                prompts.map((prompt: any) => (
                                    <tr key={prompt.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                                                <Image
                                                    src={prompt.afterImage}
                                                    alt="Thumbnail"
                                                    fill
                                                    className="object-cover"
                                                    style={{ objectPosition: (prompt as any).thumbnailPos || 'center' }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground truncate max-w-[250px]">{prompt.title}</div>
                                            <div className="text-xs text-muted-foreground mt-1 truncate max-w-[250px]">{prompt.promptText}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {prompt.categories?.length > 0 ? (
                                                    prompt.categories.map((cat: any) => (
                                                        <span key={cat.id} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                                            {cat.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Uncategorized</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm">
                                            <div className="flex flex-wrap gap-1">
                                                {prompt.tool.split(',').slice(0, 2).map((t: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-muted rounded text-[10px]">{t.trim()}</span>
                                                ))}
                                                {prompt.tool.split(',').length > 2 && <span className="text-[10px] text-muted-foreground">+{prompt.tool.split(',').length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm">
                                                <span className="font-bold">{prompt.views}</span> <span className="text-muted-foreground text-xs">V</span>
                                                <span className="mx-2">•</span>
                                                <span className="font-bold">{prompt.copies}</span> <span className="text-muted-foreground text-xs">C</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/prompt/${prompt.slug}`} target="_blank" className="p-2 text-muted-foreground hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="View">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link href={`/admin/prompts/${prompt.id}/edit`} className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </Link>
                                                <form action={deleteAction}>
                                                    <input type="hidden" name="id" value={prompt.id} />
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
                            Showing <span className="font-bold text-foreground">{skip + 1}</span> to <span className="font-bold text-foreground">{Math.min(skip + pageSize, totalPrompts)}</span> of <span className="font-bold text-foreground">{totalPrompts}</span> prompts
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link
                                href={`/admin/prompts?page=${currentPage - 1}`}
                                className={`p-2 rounded-lg border border-border transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}
                            >
                                <ChevronLeft size={16} />
                            </Link>
                            <div className="flex items-center space-x-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <Link
                                        key={i + 1}
                                        href={`/admin/prompts?page=${i + 1}`}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${i + 1 === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-muted border border-border/50'}`}
                                    >
                                        {i + 1}
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={`/admin/prompts?page=${currentPage + 1}`}
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
