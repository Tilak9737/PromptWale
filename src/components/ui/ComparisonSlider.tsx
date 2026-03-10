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
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-border/50 cursor-col-resize select-none group"
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
                className="absolute inset-y-0 z-20 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-col-resize pointer-events-none transition-all duration-75"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-primary/20">
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
                className="absolute top-4 left-4 z-30 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors active:scale-95"
            >
                Before
            </button>
            <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setSliderPos(0); }}
                className="absolute top-4 right-4 z-30 bg-primary/80 hover:bg-primary backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors active:scale-95"
            >
                Result
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/40 backdrop-blur-xl text-white/90 px-4 py-2 rounded-2xl text-[10px] font-medium border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Drag to compare
            </div>
        </div>
    );
}
