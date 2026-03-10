import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // In a real production scenario, we would uncomment this to fetch dynamic routes:
    // const prompts = await prisma.prompt.findMany({ select: { slug: true, updatedAt: true } })
    // const promptUrls = prompts.map(p => ({ url: `https://promptwale.com/prompt/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly', priority: 0.8 }))

    const baseUrl = 'https://promptwale.com'

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
    ]
}
