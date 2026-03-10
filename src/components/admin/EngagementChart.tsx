"use client";

import { useState, useEffect, useRef } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function EngagementChart({ data }: { data: { name: string, views: number, copies: number }[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const node = containerRef.current;
        const updateSize = () => {
            setSize({
                width: node.clientWidth,
                height: node.clientHeight,
            });
        };

        updateSize();

        const observer = new ResizeObserver(() => {
            updateSize();
        });
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-[300px] min-w-0">
            {!data || data.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                    <span className="text-sm font-medium">No engagement data available for this period.</span>
                </div>
            ) : size.width > 0 && size.height > 0 ? (
                <LineChart
                    width={size.width}
                    height={size.height}
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.35} vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: 'var(--background)' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="copies"
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ r: 5, strokeWidth: 2, fill: 'var(--background)' }}
                        activeDot={{ r: 7, strokeWidth: 0 }}
                    />
                </LineChart>
            ) : (
                <div className="w-full h-full bg-muted/5 flex items-center justify-center rounded-xl">Loading chart...</div>
            )}
        </div>
    );
}
