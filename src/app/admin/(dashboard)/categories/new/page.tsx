"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { createCategory } from "@/actions/admin";

export default function NewCategoryPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const result = await createCategory({
            name: formData.get("name") as string,
            description: formData.get("description") as string,
        });

        if (result.success) {
            router.push("/admin/categories");
        } else {
            alert(result.error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Category</h1>
                    <p className="text-muted-foreground">Add a new style or domain for your prompts.</p>
                </div>
                <Link
                    href="/admin/categories"
                    className="px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. Portrait, Cyberpunk, Logo Design..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold">Description (Optional)</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Briefly describe what this category entails."
                    />
                </div>

                <div className="flex items-center justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center space-x-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <><Loader2 size={18} className="animate-spin" /> <span>Saving...</span></>
                        ) : (
                            <><Save size={18} /> <span>Create Category</span></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
