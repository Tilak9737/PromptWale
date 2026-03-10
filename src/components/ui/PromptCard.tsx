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
        <div className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 flex flex-col h-full">
            {/* Image Container with Before/After concept */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted group/image">
                <Image
                    src={beforeImage}
                    alt={`${title} Before`}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover absolute inset-0 z-0"
                    style={{ objectPosition: thumbnailPos || 'center' }}
                />
                <Image
                    src={afterImage}
                    alt={title}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover absolute inset-0 z-10 transition-opacity duration-700 group-hover/image:opacity-0"
                    style={{ objectPosition: thumbnailPos || 'center' }}
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Tool Label */}
                <div className="absolute top-3 left-3 z-30 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                    {tool.split(',')[0]}
                </div>

                {/* Action Buttons (Hover) */}
                <div className="absolute inset-x-0 bottom-0 z-30 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center space-x-2">
                        <Link
                            href={`/prompt/${slug}`}
                            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <span>View Prompt</span>
                            <ArrowUpRight size={14} />
                        </Link>
                        <button className="p-2.5 bg-card/80 backdrop-blur-md text-foreground rounded-xl border border-border shadow-lg hover:bg-primary hover:text-primary-foreground transition-all">
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
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
