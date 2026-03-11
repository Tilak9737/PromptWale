import Navbar from "@/components/layout/Navbar";
import { Copy, Eye, CornerDownRight, CheckCircle2, ThumbsUp, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPromptBySlug, trackPromptView, getRelatedPrompts } from "@/actions/prompt";
import { notFound } from "next/navigation";
import CopyButton from "@/components/ui/CopyButton";
import ShareButton from "@/components/ui/ShareButton";
import ComparisonSlider from "@/components/ui/ComparisonSlider";
import PromptCard from "@/components/ui/PromptCard";
import ReportModal from "@/components/ui/ReportModal";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const prompt = await getPromptBySlug(slug);

    if (!prompt) return { title: "Prompt Not Found" };

    const title = prompt.metaTitle || `${prompt.title} | AI Prompt for ${prompt.tool} | PromptWale`;
    const categoryName = prompt.categories?.[0]?.name || "AI Prompt";
    const description = prompt.metaDescription || prompt.description || `Get this high-quality ${prompt.tool} prompt for ${categoryName}. Achieve professional AI results with PromptWale.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [prompt.afterImage],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [prompt.afterImage],
        },
    };
}

export default async function PromptPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const prompt = await getPromptBySlug(slug);

    if (!prompt) {
        return notFound();
    }

    trackPromptView(prompt.id);

    const firstCategoryId = prompt.categories?.[0]?.id || "";
    const relatedPrompts = firstCategoryId ? await getRelatedPrompts(firstCategoryId, prompt.id) : [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: prompt.title,
        description: prompt.description || prompt.metaDescription || "",
        image: prompt.afterImage,
        genre: prompt.categories?.[0]?.name || "AI Prompt",
        publisher: {
            "@type": "Organization",
            name: "PromptWale",
            logo: {
                "@type": "ImageObject",
                url: "https://promptwale.com/logo.png",
            },
        },
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
    };

    return (
        <div className="page-fade-in flex min-h-screen flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="flex-1">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
                    <section className="section-shell clay-soft">
                        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
                            <CornerDownRight size={14} />
                            {prompt.categories?.map((cat, i: number) => (
                                <div key={cat.id} className="flex items-center gap-2">
                                    <Link href={`/categories/${cat.slug}`} className="transition-colors hover:text-primary">{cat.name}</Link>
                                    {i < prompt.categories.length - 1 && <span className="opacity-50">,</span>}
                                </div>
                            ))}
                            <CornerDownRight size={14} />
                            <span className="max-w-[240px] truncate font-medium text-foreground sm:max-w-none">{prompt.title}</span>
                        </nav>

                        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1.05fr]">
                            <div className="space-y-5">
                                <ComparisonSlider
                                    beforeImage={prompt.beforeImage}
                                    afterImage={prompt.afterImage}
                                    title={prompt.title}
                                    thumbnailPos={prompt.thumbnailPos}
                                />

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    <div className="clay-soft group relative aspect-square cursor-pointer overflow-hidden rounded-2xl">
                                        <Image
                                            src={prompt.beforeImage}
                                            alt="Base Image"
                                            fill
                                            sizes="120px"
                                            className="object-cover transition-transform group-hover:scale-110"
                                            style={{ objectPosition: prompt.thumbnailPos || "center" }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold uppercase text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                            Original
                                        </div>
                                    </div>
                                    <div className="clay-soft group relative aspect-square cursor-pointer overflow-hidden rounded-2xl">
                                        <Image
                                            src={prompt.afterImage}
                                            alt="Result Image"
                                            fill
                                            sizes="120px"
                                            className="object-cover transition-transform group-hover:scale-110"
                                            style={{ objectPosition: prompt.thumbnailPos || "center" }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold uppercase text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                            Result
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    {prompt.categories?.map((cat) => (
                                        <span key={cat.id} className="clay-soft rounded-full border border-primary/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                            {cat.name}
                                        </span>
                                    ))}
                                    {prompt.isTrending && (
                                        <span className="clay-soft rounded-full border border-warning/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-warning">
                                            Trending
                                        </span>
                                    )}
                                </div>

                                <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{prompt.title}</h1>

                                <p className="mb-7 text-base leading-relaxed text-muted-foreground sm:text-lg">
                                    {prompt.description || "A powerful AI prompt designed for stunning visual results."}
                                </p>

                                <div className="mb-8 flex flex-wrap items-center gap-5 border-b border-border/60 pb-8">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {prompt.tool.split(",").map((t: string, i: number) => (
                                                <div key={i} className="clay flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-primary">
                                                    {t.trim()[0]}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Optimized for</p>
                                            <div className="flex flex-wrap gap-1">
                                                {prompt.tool.split(",").map((t: string, i: number) => (
                                                    <span key={i} className="text-sm font-bold text-foreground">
                                                        {t.trim()}{i < prompt.tool.split(",").length - 1 ? "," : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="inline-flex items-center gap-1"><Eye size={16} /> <span>{prompt.views.toLocaleString()}</span></span>
                                        <span className="inline-flex items-center gap-1"><Copy size={16} /> <span>{prompt.copies.toLocaleString()}</span></span>
                                    </div>
                                </div>

                                <div className="clay-inset relative mb-8 overflow-hidden rounded-2xl p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            <Sparkles size={12} className="text-primary" />
                                            <span>The Prompt</span>
                                        </h3>
                                        <div className="flex space-x-1">
                                            <div className="h-2 w-2 rounded-full bg-border/80" />
                                            <div className="h-2 w-2 rounded-full bg-border/80" />
                                            <div className="h-2 w-2 rounded-full bg-border/80" />
                                        </div>
                                    </div>
                                    <div className="max-h-[500px] overflow-y-auto pr-2">
                                        <p className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground/90 selection:bg-primary/30">
                                            {prompt.promptText}
                                        </p>
                                    </div>
                                </div>

                                {prompt.instructions && (
                                    <div className="mb-8">
                                        <h3 className="mb-4 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            <CheckCircle2 size={14} className="text-primary" />
                                            <span>Instructions</span>
                                        </h3>
                                        <div className="prose prose-sm dark:prose-invert">
                                            <p className="whitespace-pre-line text-muted-foreground">
                                                {prompt.instructions}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto flex flex-col items-start space-y-4">
                                    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                                        <CopyButton promptId={prompt.id} promptText={prompt.promptText} />
                                        <ShareButton />
                                    </div>
                                    <ReportModal promptId={prompt.id} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {relatedPrompts.length > 0 && (
                        <section className="section-shell clay-soft">
                            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="flex items-center space-x-2 text-2xl font-bold">
                                        <ThumbsUp size={22} className="text-primary" />
                                        <span>Related Prompts</span>
                                    </h2>
                                    <p className="text-muted-foreground">More prompts from the {prompt.categories?.[0]?.name || "collection"}.</p>
                                </div>
                                {prompt.categories?.[0] && (
                                    <Link href={`/categories/${prompt.categories[0].slug}`} className="clay hover-lift rounded-full px-4 py-2 text-sm font-bold text-primary">
                                        View Category -&gt;
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedPrompts.map((related: { id: string; title: string; categories?: { name: string }[]; tool: string; beforeImage: string; afterImage: string; views: number; copies: number; slug: string; thumbnailPos?: string }) => (
                                    <PromptCard
                                        key={related.id}
                                        id={related.id}
                                        title={related.title}
                                        category={related.categories?.map((c: { name: string }) => c.name).join(", ") || ""}
                                        tool={related.tool}
                                        beforeImage={related.beforeImage}
                                        afterImage={related.afterImage}
                                        views={related.views}
                                        copies={related.copies}
                                        slug={related.slug}
                                        thumbnailPos={related.thumbnailPos}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
