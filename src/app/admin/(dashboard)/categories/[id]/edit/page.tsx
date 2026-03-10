import { Save } from "lucide-react";
import Link from "next/link";
import { updateCategory } from "@/actions/admin";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch initial data
    const category = await prisma.category.findUnique({
        where: { id }
    });

    if (!category) return notFound();

    // Reusing Server Action within a form instead of client component to speed things up
    const handleUpdate = async (formData: FormData) => {
        "use server";
        await updateCategory(id, {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
        });
        redirect("/admin/categories");
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Category</h1>
                    <p className="text-muted-foreground">Modify the details of &apos;{category.name}&apos;.</p>
                </div>
                <Link
                    href="/admin/categories"
                    className="px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <form action={handleUpdate} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold">Name</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={category.name}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. Portrait, Cyberpunk, Logo Design..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold">Description (Optional)</label>
                    <textarea
                        name="description"
                        defaultValue={category.description || ""}
                        rows={3}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Briefly describe what this category entails."
                    />
                </div>

                <div className="flex items-center justify-end pt-4">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center space-x-2"
                    >
                        <Save size={18} /> <span>Save Changes</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
