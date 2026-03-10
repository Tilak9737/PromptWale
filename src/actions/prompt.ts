"use server";

import prisma from "@/lib/prisma";


// --- PROMPT FETCHING ACTIONS ---

export async function getLatestPrompts(take = 8) {
    try {
        return await prisma.prompt.findMany({
            where: { status: "published" },
            take,
            orderBy: { createdAt: "desc" },
            include: { categories: true },
        });
    } catch (error) {
        console.error("Failed to fetch latest prompts:", error);
        return [];
    }
}

export async function getTrendingPrompts(take = 4) {
    try {
        return await prisma.prompt.findMany({
            where: { status: "published" },
            take,
            orderBy: [{ copies: "desc" }, { views: "desc" }],
            include: { categories: true },
        });
    } catch (error) {
        console.error("Failed to fetch trending prompts:", error);
        return [];
    }
}

export async function getPromptBySlug(slug: string) {
    try {
        return await prisma.prompt.findFirst({
            where: { slug, status: "published" },
            include: { categories: true },
        });
    } catch (error) {
        console.error(`Failed to fetch prompt ${slug}:`, error);
        return null;
    }
}

// --- CATEGORY FETCHING ACTIONS ---

export async function getAllCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { prompts: true } } },
        });
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

import { Prisma } from "@prisma/client";

export async function getCategoryBySlug(slug: string, tool?: string, sort?: string) {
    try {
        let orderBy: Prisma.PromptOrderByWithRelationInput | Prisma.PromptOrderByWithRelationInput[] = { createdAt: "desc" };
        if (sort === "Most Copied") orderBy = { copies: "desc" };
        if (sort === "Trending") orderBy = [
            { copies: "desc" },
            { views: "desc" }
        ];

        // Fetch category with all prompts to get unique tools
        const categoryData = await prisma.category.findUnique({
            where: { slug },
            include: {
                prompts: {
                    select: { tool: true }
                }
            }
        });

        if (!categoryData) return null;

        const allTools = Array.from(new Set(
            categoryData.prompts
                .flatMap(p => p.tool.split(',').map(s => s.trim()))
                .filter(Boolean)
        ));

        // Now fetch the filtered category data
        const filteredCategory = await prisma.category.findUnique({
            where: { id: categoryData.id },
            include: {
                prompts: {
                    where: {
                        status: "published",
                        ...(tool ? { tool: { contains: tool, mode: "insensitive" } } : {})
                    },
                    orderBy: orderBy,
                    include: { categories: true }
                },
            },
        });

        if (!filteredCategory) return null;

        return {
            ...filteredCategory,
            availableTools: allTools
        };
    } catch (error) {
        console.error(`Failed to fetch category ${slug}:`, error);
        return null;
    }
}

// --- SEARCH ACTION ---

export async function searchPrompts(query: string, categorySlug?: string) {
    try {
        const whereClause: Prisma.PromptWhereInput = {
            status: "published",
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { promptText: { contains: query, mode: "insensitive" } },
                { tool: { contains: query, mode: "insensitive" } },
                { categories: { some: { name: { contains: query, mode: "insensitive" } } } },
            ],
        };

        if (categorySlug) {
            whereClause.categories = { some: { slug: categorySlug } };
        }

        return await prisma.prompt.findMany({
            where: whereClause,
            include: { categories: true },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Failed to search prompts:", error);
        return [];
    }
}

// --- ANALYTICS TRACKING ACTIONS ---

export async function trackPromptView(promptId: string) {
    try {
        await prisma.prompt.update({
            where: { id: promptId },
            data: { views: { increment: 1 } },
        });

        await prisma.analytics.create({
            data: { event: "view", promptId },
        });

        // Non-blocking background revalidation
        // revalidatePath(`/prompt/[slug]`, 'page');
    } catch (error) {
        console.error("Failed to track view:", error);
    }
}

export async function trackPromptCopy(promptId: string) {
    try {
        await prisma.prompt.update({
            where: { id: promptId },
            data: { copies: { increment: 1 } },
        });

        await prisma.analytics.create({
            data: { event: "copy", promptId },
        });
    } catch (error) {
        console.error("Failed to track copy:", error);
    }
}

export async function getPromptById(id: string) {
    try {
        return await prisma.prompt.findUnique({
            where: { id },
            include: { categories: true }
        });
    } catch (error) {
        console.error("Failed to fetch prompt by ID:", error);
        return null;
    }
}
export async function getRelatedPrompts(categoryId: string, currentPromptId: string, limit = 4) {
    try {
        return await prisma.prompt.findMany({
            where: {
                categories: { some: { id: categoryId } },
                id: { not: currentPromptId },
                status: "published"
            },
            take: limit,
            orderBy: [{ copies: "desc" }, { views: "desc" }],
            include: { categories: true }
        });
    } catch (error) {
        console.error("Failed to fetch related prompts:", error);
        return [];
    }
}
