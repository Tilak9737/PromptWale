"use client";

import { useState, useEffect, use } from "react";
import { UploadCloud, Save, Image as ImageIcon, Loader2, Globe, Sparkles, Layout } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updatePrompt, getAllCategories } from "@/actions/admin";
import { getPromptById } from "@/actions/prompt";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type PromptForEdit = {
    title: string;
    tool: string;
    categories?: { name: string }[];
    promptText: string;
    description?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    beforeImage: string;
    afterImage: string;
    thumbnailPos?: string | null;
    status?: string | null;
};

export default function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [status, setStatus] = useState("published");

    // Form Data State
    const [title, setTitle] = useState("");
    const [tools, setTools] = useState<string[]>(["Gemini"]);
    const [categoryName, setCategoryName] = useState("");
    const [promptText, setPromptText] = useState("");
    const [description, setDescription] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [thumbnailPos, setThumbnailPos] = useState("center");
    const [existingCategories, setExistingCategories] = useState<{ name: string }[]>([]);

    // File State
    const [beforeFile, setBeforeFile] = useState<File | null>(null);
    const [afterFile, setAfterFile] = useState<File | null>(null);
    const [beforePreview, setBeforePreview] = useState("");
    const [afterPreview, setAfterPreview] = useState("");

    useEffect(() => {
        getAllCategories().then(setExistingCategories);
    }, []);

    useEffect(() => {
        // Fetch existing prompt data
        getPromptById(id)
            .then(data => {
                if (!data) return router.push("/admin/prompts");
                setTitle(data.title);
                setTools(data.tool ? data.tool.split(", ").filter(Boolean) : ["Gemini"]);
                // Map multiple categories to comma separated string
                const promptData = data as PromptForEdit;
                const cats = promptData.categories?.map((c) => c.name).join(", ") || "";
                setCategoryName(cats);
                setPromptText(promptData.promptText);
                setDescription(promptData.description || "");
                setMetaTitle(promptData.metaTitle || "");
                setMetaDescription(promptData.metaDescription || "");
                setBeforePreview(promptData.beforeImage);
                setAfterPreview(promptData.afterImage);
                setThumbnailPos(promptData.thumbnailPos || "center");
                setStatus(promptData.status || "published");
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [id, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
        const file = e.target.files?.[0];
        if (file) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                alert("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
                e.target.value = "";
                return;
            }

            if (file.size > MAX_UPLOAD_SIZE_BYTES) {
                alert("File too large. Maximum size is 5MB.");
                e.target.value = "";
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            if (type === "before") {
                setBeforeFile(file);
                setBeforePreview(previewUrl);
            } else {
                setAfterFile(file);
                setAfterPreview(previewUrl);
            }
        }
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        if (!res.ok) {
            let message = "Failed to upload image.";
            try {
                const errorData = await res.json() as { error?: string };
                if (errorData?.error) message = errorData.error;
            } catch {
                // Ignore malformed error JSON and keep default message.
            }
            throw new Error(message);
        }

        const data = await res.json() as { url?: string; error?: string };
        if (!data.url) {
            throw new Error(data.error || "Upload response did not include a URL.");
        }
        return data.url;
    };

    const handleSubmit = async (e: React.FormEvent, targetStatus: string = status) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const beforeImageUrl = beforeFile ? await uploadImage(beforeFile) : undefined;
            const afterImageUrl = afterFile ? await uploadImage(afterFile) : undefined;

            const result = await updatePrompt(id, {
                title,
                tool: tools.join(", "),
                categoryName,
                promptText,
                description,
                metaTitle,
                metaDescription,
                thumbnailPos,
                beforeImage: beforeImageUrl,
                afterImage: afterImageUrl,
                status: targetStatus
            });

            if (result.success) {
                router.push("/admin/prompts");
            } else {
                alert("Error updating prompt: " + result.error);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert(error instanceof Error ? error.message : "Update failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    const toggleTool = (t: string) => {
        setTools(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    };

    const addCategory = (name: string) => {
        const currentArr = categoryName.split(",").map(c => c.trim()).filter(Boolean);
        if (!currentArr.includes(name)) {
            setCategoryName(currentArr.concat(name).join(", "));
        }
    };

    const posOptions = [
        { id: "top", label: "Top" },
        { id: "center", label: "Center" },
        { id: "bottom", label: "Bottom" }
    ];

    if (isLoading) {
        return <div className="p-12 text-center text-muted-foreground font-medium">Loading prompt data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Prompt</h1>
                    <p className="text-muted-foreground">Manage and optimize your AI assets.</p>
                </div>
                <Link
                    href="/admin/prompts"
                    className="px-4 py-2 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Images & Layout Section */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-8">
                    <h2 className="text-lg font-bold flex items-center space-x-2">
                        <ImageIcon size={20} className="text-primary" />
                        <span>Visual Assets & Display</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-sm font-bold block">Update Images</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors overflow-hidden group">
                                    {beforePreview ? (
                                        <Image src={beforePreview} alt="Before" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-60 group-hover:scale-105 transition-transform" />
                                    ) : null}
                                    <div className="relative z-10 flex flex-col items-center p-2 bg-black/20 rounded-lg backdrop-blur-sm">
                                        <UploadCloud size={20} className="text-white mb-1" />
                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-white">Change Base</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={(e) => handleFileChange(e, "before")}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />
                                </div>
                                <div className="relative aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors overflow-hidden group border-primary/20">
                                    {afterPreview ? (
                                        <Image src={afterPreview} alt="After" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-60 group-hover:scale-105 transition-transform" />
                                    ) : null}
                                    <div className="relative z-10 flex flex-col items-center p-2 bg-primary/20 rounded-lg backdrop-blur-sm">
                                        <UploadCloud size={20} className="text-white mb-1" />
                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-white">Change Result</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={(e) => handleFileChange(e, "after")}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center space-x-2">
                                <Layout size={16} className="text-primary" />
                                <span>Thumbnail Focal Point</span>
                            </label>
                            <div className="p-4 bg-muted/30 rounded-2xl space-y-4">
                                <p className="text-xs text-muted-foreground">Ensure the most important part of the image is shown in the library.</p>
                                <div className="flex space-x-2">
                                    {posOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setThumbnailPos(opt.id)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${thumbnailPos === opt.id
                                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                : "bg-background border-border hover:bg-muted"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="aspect-[4/5] w-24 mx-auto bg-muted border border-border rounded-lg overflow-hidden relative shadow-inner">
                                    {afterPreview ? (
                                        <Image
                                            src={afterPreview}
                                            alt="Crop preview"
                                            fill
                                            sizes="96px"
                                            className="object-cover transition-all duration-300"
                                            style={{ objectPosition: thumbnailPos }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase">No Image</div>
                                    )}
                                    <div className="absolute inset-0 border-2 border-primary/20 pointer-events-none ring-2 ring-inset ring-black/10"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prompt Details Section */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold flex items-center space-x-2">
                        <Sparkles size={20} className="text-primary" />
                        <span>Prompt Configuration</span>
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold block mb-3">AI Discovery (Tools)</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Gemini", "Nano Banana", "Nano Banana Pro", "Nano Banana 2", "Midjourney", "Flux", "DALL-E 3"].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => toggleTool(t)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${tools.includes(t)
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2 relative">
                                <label className="text-sm font-bold">Categories (Comma separated)</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Portrait, Fashion, Cyberpunk..."
                                />
                                {existingCategories.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1 self-center">Suggestions:</span>
                                        {existingCategories.slice(0, 10).map(cat => (
                                            <button
                                                key={cat.name}
                                                type="button"
                                                onClick={() => addCategory(cat.name)}
                                                className="px-2 py-0.5 bg-muted hover:bg-muted/80 text-[10px] font-bold rounded-md transition-colors"
                                            >
                                                + {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">The Core Prompt</label>
                                <textarea
                                    rows={5}
                                    required
                                    value={promptText}
                                    onChange={(e) => setPromptText(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-muted/30 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold">Description & Instructions</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO Optimization Section */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold flex items-center space-x-2">
                        <Globe size={20} className="text-primary" />
                        <span>SEO & Discoverability</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Meta Title (Custom)</label>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Leave blank to use prompt title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Meta Description (Custom)</label>
                                <textarea
                                    rows={3}
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Leave blank for auto-generation"
                                />
                            </div>
                        </div>

                        {/* Real-time Google Preview */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground flex items-center space-x-2">
                                <span>Live Google Preview</span>
                                <div className="h-px flex-1 bg-border/50"></div>
                            </label>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5 shadow-xl">
                                <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                                    <div className="w-5 h-5 bg-primary/20 text-primary border border-primary/20 rounded-full flex items-center justify-center font-bold">P</div>
                                    <span className="truncate">https://promptwale.com &rsaquo; prompt &rsaquo; {title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'slug'}</span>
                                </div>
                                <h3 className="text-[#8ab4f8] text-lg font-medium hover:underline cursor-pointer truncate leading-tight">
                                    {metaTitle || (title ? `${title} | Professional AI Tool Prompt` : 'Cinematic Portrait AI Prompt | PromptWale')}
                                </h3>
                                <p className="text-[13px] text-[#bdc1c6] line-clamp-2 leading-snug">
                                    {metaDescription || description || promptText.substring(0, 160) || 'Get this high-quality AI prompt optimized for various models. Professional results instantly with PromptWale.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 md:px-8">
                    <div className="max-w-4xl mx-auto flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit(e, status === "draft" ? "published" : "draft")}
                            className="px-6 py-3 font-bold text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        >
                            {status === "draft" ? "Ready to Publish" : "Move to Draft"}
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit(e, status)}
                            className="px-10 py-3 bg-primary text-primary-foreground font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-3 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={20} className="animate-spin" /> <span>Saving...</span></>
                            ) : (
                                <><Save size={20} /> <span>{status === "draft" ? "Save Draft" : "Update Prompt"}</span></>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
