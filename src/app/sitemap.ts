import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://promptwale.com'

    // Fetch Prompts
    const prompts = await prisma.prompt.findMany({ select: { slug: true, updatedAt: true } })
    const promptUrls = prompts.map(p => ({
        url: `${baseUrl}/prompt/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8
    }))

    // Fetch Categories
    const categories = await prisma.category.findMany({ select: { slug: true, updatedAt: true } })
    const categoryUrls = categories.map(c => ({
        url: `${baseUrl}/categories/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9,
        },
        ...categoryUrls,
        ...promptUrls
    ]
}
