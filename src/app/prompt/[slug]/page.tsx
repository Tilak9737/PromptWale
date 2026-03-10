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
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const prompt = await getPromptBySlug(slug);

    if (!prompt) return { title: 'Prompt Not Found' };

    const title = prompt.metaTitle || `${prompt.title} | AI Prompt for ${prompt.tool} | PromptWale`;
    const categoryName = (prompt as any).categories?.[0]?.name || "AI Prompt";
    const description = prompt.metaDescription || prompt.description || `Get this high-quality ${prompt.tool} prompt for ${categoryName}. Achieve professional AI results with PromptWale.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [prompt.afterImage],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
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

    // Track view asynchronously
    trackPromptView(prompt.id);

    const firstCategoryId = (prompt as any).categories?.[0]?.id || "";

    // Fetch related prompts
    const relatedPrompts = firstCategoryId ? await getRelatedPrompts(firstCategoryId, prompt.id) : [];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: prompt.title,
        description: prompt.description || prompt.metaDescription,
        image: prompt.afterImage,
        genre: (prompt as any).categories?.[0]?.name || "AI Prompt",
        publisher: {
            '@type': 'Organization',
            name: 'PromptWale',
            logo: {
                '@type': 'ImageObject',
                url: 'https://promptwale.com/logo.png'
            }
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="flex-1 pt-16">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <CornerDownRight size={14} />
                        {(prompt as any).categories?.map((cat: any, i: number) => (
                            <div key={cat.id} className="flex items-center space-x-2">
                                <Link href={`/categories/${cat.slug}`} className="hover:text-primary transition-colors">{cat.name}</Link>
                                {i < (prompt as any).categories.length - 1 && <span className="opacity-50">,</span>}
                            </div>
                        ))}
                        <CornerDownRight size={14} />
                        <span className="text-foreground font-medium truncate">{prompt.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Interactive Comparison Slider */}
                        <div className="space-y-6">
                            <ComparisonSlider
                                beforeImage={prompt.beforeImage}
                                afterImage={prompt.afterImage}
                                title={prompt.title}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 relative aspect-square rounded-2xl overflow-hidden border border-border/50 group cursor-pointer shadow-sm">
                                    <Image
                                        src={prompt.beforeImage}
                                        alt="Base Image"
                                        fill
                                        sizes="100px"
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                        Original
                                    </div>
                                </div>
                                <div className="col-span-1 relative aspect-square rounded-2xl overflow-hidden border border-border/50 group cursor-pointer shadow-sm">
                                    <Image
                                        src={prompt.afterImage}
                                        alt="Result Image"
                                        fill
                                        sizes="100px"
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                        Result
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {(prompt as any).categories?.map((cat: any) => (
                                    <span key={cat.id} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        {cat.name}
                                    </span>
                                ))}
                                {prompt.isTrending && (
                                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        🔥 Trending
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{prompt.title}</h1>

                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                {prompt.description || "A powerful AI prompt designed for stunning visual results."}
                            </p>

                            <div className="flex items-center space-x-6 mb-10 pb-10 border-b border-border">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <div className="flex -space-x-2 mr-2">
                                        {prompt.tool.split(',').map((t: string, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                                                {t.trim()[0]}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Optimized for</p>
                                        <div className="flex flex-wrap gap-1">
                                            {prompt.tool.split(',').map((t: string, i: number) => (
                                                <span key={i} className="text-sm font-bold text-foreground">
                                                    {t.trim()}{i < prompt.tool.split(',').length - 1 ? ',' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1"></div>
                                <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                                    <span className="flex items-center space-x-1"><Eye size={16} /> <span>{prompt.views.toLocaleString()}</span></span>
                                    <span className="flex items-center space-x-1"><Copy size={16} /> <span>{prompt.copies.toLocaleString()}</span></span>
                                </div>
                            </div>

                            {/* Prompt Box */}
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative group mb-8 shadow-inner overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                                        <Sparkles size={12} className="text-primary" />
                                        <span>The Prompt</span>
                                    </h3>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                                    </div>
                                </div>
                                <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words selection:bg-primary/30">
                                        {prompt.promptText}
                                    </p>
                                </div>
                            </div>

                            {/* Instructions */}
                            {prompt.instructions && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center space-x-2">
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
                                <div className="flex items-center space-x-4">
                                    <CopyButton promptId={prompt.id} promptText={prompt.promptText} />
                                    <ShareButton />
                                </div>
                                <ReportModal />
                            </div>

                        </div>
                    </div>

                    {/* Related Prompts Section */}
                    {relatedPrompts.length > 0 && (
                        <div className="border-t border-border/50 pt-16">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                                        <ThumbsUp size={24} className="text-primary" />
                                        <span>Related Prompts</span>
                                    </h2>
                                    <p className="text-muted-foreground">More prompts from the {(prompt as any).categories?.[0]?.name || "collection"}.</p>
                                </div>
                                {(prompt as any).categories?.[0] && (
                                    <Link href={`/categories/${(prompt as any).categories[0].slug}`} className="text-sm font-bold text-primary hover:underline">
                                        View Category →
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedPrompts.map((related: any) => (
                                    <PromptCard
                                        key={related.id}
                                        id={related.id}
                                        title={related.title}
                                        category={related.categories?.map((c: any) => c.name).join(", ") || ""}
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
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
