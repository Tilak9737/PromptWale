"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Save, Image as ImageIcon, Loader2, Globe, Sparkles, Layout } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPrompt, getAllCategories } from "@/actions/admin";

export default function NewPromptPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data State
    const [title, setTitle] = useState("");
    const [tools, setTools] = useState<string[]>(["Gemini"]);
    const [categoryName, setCategoryName] = useState("Portrait");
    const [promptText, setPromptText] = useState("");
    const [description, setDescription] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [thumbnailPos, setThumbnailPos] = useState("center");
    const [existingCategories, setExistingCategories] = useState<{ name: string }[]>([]);

    const [status, setStatus] = useState("published");

    // File State
    const [beforeFile, setBeforeFile] = useState<File | null>(null);
    const [afterFile, setAfterFile] = useState<File | null>(null);
    const [beforePreview, setBeforePreview] = useState("");
    const [afterPreview, setAfterPreview] = useState("");

    // Real-time SEO Generation
    useEffect(() => {
        getAllCategories().then(setExistingCategories);
    }, []);

    useEffect(() => {
        if (!metaTitle && title) {
            // Logic handled by server action as fallback, but we show it here too
        }
    }, [title, metaTitle]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
        const file = e.target.files?.[0];
        if (file) {
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
        });

        if (!res.ok) throw new Error("Failed to upload image.");
        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async (e: React.FormEvent, targetStatus: string = "published") => {
        e.preventDefault();

        if (!beforeFile || !afterFile) {
            alert("Please upload both before and after images.");
            return;
        }

        setIsSubmitting(true);

        try {
            const beforeImageUrl = await uploadImage(beforeFile);
            const afterImageUrl = await uploadImage(afterFile);

            const result = await createPrompt({
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
                alert("Error saving prompt: " + result.error);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert("Upload failed. Please try again.");
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

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Prompt</h1>
                    <p className="text-muted-foreground">Upload images and define the perfect prompt.</p>
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
                            <label className="text-sm font-bold block">Image Uploads</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors overflow-hidden group">
                                    {beforePreview ? (
                                        <img src={beforePreview} alt="Before" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform" />
                                    ) : null}
                                    <div className="relative z-10 flex flex-col items-center p-2">
                                        <UploadCloud size={24} className="text-muted-foreground mb-1" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">Base Image</span>
                                    </div>
                                    <input type="file" onChange={(e) => handleFileChange(e, "before")} className="absolute inset-0 opacity-0 cursor-pointer z-20" required />
                                </div>
                                <div className="relative aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors overflow-hidden group border-primary/20">
                                    {afterPreview ? (
                                        <img src={afterPreview} alt="After" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform" />
                                    ) : null}
                                    <div className="relative z-10 flex flex-col items-center p-2">
                                        <UploadCloud size={24} className="text-primary mb-1" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Result Image</span>
                                    </div>
                                    <input type="file" onChange={(e) => handleFileChange(e, "after")} className="absolute inset-0 opacity-0 cursor-pointer z-20" required />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center space-x-2">
                                <Layout size={16} className="text-primary" />
                                <span>Thumbnail Focal Point</span>
                            </label>
                            <div className="p-4 bg-muted/30 rounded-2xl space-y-4">
                                <p className="text-xs text-muted-foreground">Adjust how images are cropped in the library grid.</p>
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
                                <div className="aspect-[4/5] w-24 mx-auto bg-muted border border-border rounded-lg overflow-hidden relative">
                                    {afterPreview ? (
                                        <img
                                            src={afterPreview}
                                            alt="Crop preview"
                                            className="absolute inset-0 w-full h-full object-cover transition-all duration-300 shadow-2xl"
                                            style={{ objectPosition: thumbnailPos }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase">Preview</div>
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
                                className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
                                placeholder="e.g. Cinematic Cyberpunk Portrait"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold block mb-3">AI Discovery (Multi-Tool)</label>
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
                                    rows={4}
                                    required
                                    value={promptText}
                                    onChange={(e) => setPromptText(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-muted/30 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                                    placeholder="Enter the exact prompt text here..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold">Description & Instructions</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="How should users utilize this prompt?"
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
                                    <span className="truncate">https://promptwale.com &rsaquo; prompt &rsaquo; {title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'example-slug'}</span>
                                </div>
                                <h3 className="text-[#8ab4f8] text-lg font-medium hover:underline cursor-pointer truncate leading-tight">
                                    {metaTitle || (title ? `${title} | Professional AI Tool Prompt` : 'Cinematic Portrait AI Prompt | PromptWale')}
                                </h3>
                                <p className="text-[13px] text-[#bdc1c6] line-clamp-2 leading-snug">
                                    {metaDescription || description || promptText.substring(0, 160) || 'Get this high-quality AI prompt optimized for Gemini and more. Achieve professional results instantly with PromptWale.'}
                                </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic font-medium px-2">Preview is generated in real-time based on your inputs.</p>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 md:px-8">
                    <div className="max-w-4xl mx-auto flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit(e, "draft")}
                            className="px-6 py-3 font-bold text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Processing..." : "Save as Draft"}
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit(e, "published")}
                            className="px-10 py-3 bg-primary text-primary-foreground font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-3 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={20} className="animate-spin" /> <span>Publishing...</span></>
                            ) : (
                                <><Save size={20} /> <span>Publish Now</span></>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
