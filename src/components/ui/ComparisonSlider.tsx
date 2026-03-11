"use client";

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import Image from "next/image";

interface ComparisonSliderProps {
    beforeImage: string;
    afterImage: string;
    title: string;
    thumbnailPos?: string;
}

export default function ComparisonSlider({ beforeImage, afterImage, title, thumbnailPos }: ComparisonSliderProps) {
    const [sliderPos, setSliderPos] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPos(percent);
    };

    const handleMouseDown = () => setIsResizing(true);


    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (isResizing) handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const mouseUpHandler = () => setIsResizing(false);
        window.addEventListener("mouseup", mouseUpHandler);
        window.addEventListener("touchend", mouseUpHandler);
        return () => {
            window.removeEventListener("mouseup", mouseUpHandler);
            window.removeEventListener("touchend", mouseUpHandler);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="clay relative aspect-[4/5] cursor-col-resize select-none overflow-hidden rounded-3xl group"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
                <Image
                    src={afterImage}
                    alt={`${title} - After`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover"
                    style={{ objectPosition: thumbnailPos || "center" }}
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                />
            </div>

            {/* Before Image (Overlay) */}
            <div className="absolute inset-0 z-10 pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <Image
                    src={beforeImage}
                    alt={`${title} - Before`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: thumbnailPos || "center" }}
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                />
            </div>

            {/* Slider Line */}
            <div
                className="pointer-events-none absolute inset-y-0 z-20 w-1 cursor-col-resize bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-75"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-primary/20 bg-white shadow-xl">
                    <div className="flex space-x-0.5">
                        <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
                        <div className="w-0.5 h-4 bg-primary rounded-full" />
                        <div className="w-0.5 h-3 bg-primary/40 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Labels (Buttons) */}
            <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setSliderPos(100); }}
                className="absolute left-4 top-4 z-30 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/80 active:scale-95"
            >
                Before
            </button>
            <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setSliderPos(0); }}
                className="absolute right-4 top-4 z-30 rounded-full bg-primary/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-primary active:scale-95"
            >
                Result
            </button>

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-medium text-white/90 opacity-0 backdrop-blur-xl transition-opacity group-hover:opacity-100">
                Drag to compare
            </div>
        </div>
    );
}
