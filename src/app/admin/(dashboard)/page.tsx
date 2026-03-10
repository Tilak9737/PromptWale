import { Image as ImageIcon, Tags, Eye, Copy, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";
import EngagementChart from "@/components/admin/EngagementChart";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDashboard() {
    // Aggregate Analytics from PostgreSQL
    const totalPrompts = await prisma.prompt.count();
    const totalCategories = await prisma.category.count();
    const totalViews = await prisma.prompt.aggregate({
        _sum: { views: true }
    });
    const totalCopies = await prisma.prompt.aggregate({
        _sum: { copies: true }
    });

    const recentPrompts = await prisma.prompt.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { categories: true }
    });

    // 7-day Analytics Data
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const analyticsData = await prisma.analytics.findMany({
        where: { timestamp: { gte: last7Days } },
        select: { event: true, timestamp: true }
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartMap = new Map();

    // Initialize last 7 days to 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        chartMap.set(d.toDateString(), { name: days[d.getDay()], views: 0, copies: 0 });
    }

    analyticsData.forEach((record: { event: string, timestamp: Date }) => {
        const dateStr = record.timestamp.toDateString();
        if (chartMap.has(dateStr)) {
            const current = chartMap.get(dateStr);
            if (record.event === "view") current.views++;
            if (record.event === "copy") current.copies++;
        }
    });

    const chartData: { name: string, views: number, copies: number }[] = Array.from(chartMap.values());

    const formatNumber = (num: number | null) => {
        if (!num) return "0";
        return num.toLocaleString();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">System Overview</h1>
                <p className="text-muted-foreground">Live analytics and platform metrics.</p>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Prompts</p>
                        <h3 className="text-2xl font-black">{formatNumber(totalPrompts)}</h3>
                    </div>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                        <Eye size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Views</p>
                        <h3 className="text-2xl font-black">{formatNumber(totalViews._sum.views)}</h3>
                    </div>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                        <Copy size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Copies</p>
                        <h3 className="text-2xl font-black">{formatNumber(totalCopies._sum.copies)}</h3>
                    </div>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                        <Tags size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Categories</p>
                        <h3 className="text-2xl font-black">{formatNumber(totalCategories)}</h3>
                    </div>
                </div>
            </div>

            {/* Analytics Chart & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Placeholder for real charts later */}
                <div className="col-span-2 bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold flex items-center space-x-2">
                            <TrendingUp className="text-primary" size={20} />
                            <span>Engagement Overview</span>
                        </h2>
                        <select className="bg-muted px-3 py-1.5 rounded-lg text-sm font-medium border-none focus:ring-0">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-border/50 rounded-xl bg-card p-4 flex flex-col min-w-0">
                        <EngagementChart data={chartData} />
                    </div>
                </div>

                {/* Recent Prompts List */}
                <div className="col-span-1 bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Recently Added</h2>
                    </div>
                    <div className="space-y-4 flex-1">
                        {recentPrompts.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-8">No prompts created.</div>
                        ) : (
                            recentPrompts.map((prompt: { id: string; title: string; categories?: { name: string }[]; afterImage: string }) => (
                                <div key={prompt.id} className="flex items-center space-x-4 group cursor-pointer hover:bg-muted/30 p-2 -mx-2 rounded-lg transition-colors">
                                    <div className="w-12 h-12 rounded-lg bg-muted border border-border/50 overflow-hidden relative">
                                        <Image src={prompt.afterImage} alt="Thumbnail" fill sizes="(max-width: 768px) 48px, 48px" className="object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-hidden">
                                        <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{prompt.title}</span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {prompt.categories?.map((c: { name: string }) => c.name).join(", ") || "Uncategorized"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/admin/prompts" className="block w-full mt-4 py-2 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted text-center transition-colors">
                        View All Prompts
                    </Link>
                </div>

            </div>
        </div>
    );
}
