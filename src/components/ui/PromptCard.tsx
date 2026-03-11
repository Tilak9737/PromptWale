import Link from "next/link";
import Image from "next/image";
import { Copy, Eye, ArrowUpRight } from "lucide-react";

interface PromptCardProps {
    id: string;
    title: string;
    category: string;
    tool: string;
    beforeImage: string;
    afterImage: string;
    views: number;
    copies: number;
    slug: string;
    thumbnailPos?: string;
    priority?: boolean;
}

export default function PromptCard({

    title,
    category,
    tool,
    beforeImage,
    afterImage,
    views,
    copies,
    slug,
    thumbnailPos,
    priority = false,
}: PromptCardProps) {
    return (
        <div className="clay group flex h-full flex-col overflow-hidden rounded-[1.4rem] transition-all duration-500 hover:-translate-y-1 hover:border-primary/35">
            {/* Image Container with Before/After concept */}
            <div className="group/image relative aspect-[4/5] overflow-hidden rounded-b-[1.15rem] bg-muted/35">
                <Image
                    src={beforeImage}
                    alt={`${title} Before`}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="absolute inset-0 z-0 object-cover"
                    style={{ objectPosition: thumbnailPos || "center" }}
                />
                <Image
                    src={afterImage}
                    alt={title}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="absolute inset-0 z-10 object-cover transition-opacity duration-700 group-hover/image:opacity-0"
                    style={{ objectPosition: thumbnailPos || "center" }}
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Tool Label */}
                <div className="absolute left-3 top-3 z-30 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {tool.split(",")[0]}
                </div>

                {/* Action Buttons (Hover) */}
                <div className="absolute inset-x-0 bottom-0 z-30 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center space-x-2">
                        <Link
                            href={`/prompt/${slug}`}
                            className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>View Prompt</span>
                            <ArrowUpRight size={14} />
                        </Link>
                        <button className="clay-soft rounded-xl border border-border/70 p-2.5 text-foreground transition-all hover:bg-primary hover:text-primary-foreground">
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest truncate max-w-[120px]">
                        {category}
                    </span>
                    <div className="flex items-center space-x-3 text-muted-foreground text-[10px]">
                        <span className="flex items-center space-x-1">
                            <Eye size={12} />
                            <span>{views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Copy size={10} />
                            <span>{copies}</span>
                        </span>
                    </div>
                </div>

                <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
            </div>
        </div>
    );
}
