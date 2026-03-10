"use client";

import { useState, useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function EngagementChart({ data }: { data: { name: string, views: number, copies: number }[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-full h-72 bg-muted/5 flex items-center justify-center rounded-xl">Loading chart...</div>;
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-72 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                <span className="text-sm font-medium">No engagement data available for this period.</span>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="copies"
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                        activeDot={{ r: 7, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
