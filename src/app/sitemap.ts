import { MetadataRoute } from 'next'

const BASE_URL = 'https://medconsarl.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    const projects = await db.collection('projects').find({}).toArray()
    
    const staticPages: MetadataRoute.Sitemap = [
      { 
        url: BASE_URL, 
        lastModified: new Date(), 
        changeFrequency: 'daily', 
        priority: 1.0,
      },
      { 
        url: `${BASE_URL}/about`, 
        lastModified: new Date(), 
        changeFrequency: 'monthly', 
        priority: 0.7,
      },
      { 
        url: `${BASE_URL}/services`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.9,
      },
      { 
        url: `${BASE_URL}/services/construction`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.85,
      },
      { 
        url: `${BASE_URL}/services/renovation`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.85,
      },
      { 
        url: `${BASE_URL}/services/interior`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.85,
      },
      { 
        url: `${BASE_URL}/services/realEstate`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.85,
      },
      { 
        url: `${BASE_URL}/portfolio`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.9,
      },
      { 
        url: `${BASE_URL}/contact`, 
        lastModified: new Date(), 
        changeFrequency: 'monthly', 
        priority: 0.8,
      },
    ]

    const projectPages: MetadataRoute.Sitemap = projects.map(p => ({
      url: `${BASE_URL}/portfolio/${p._id}`,
      lastModified: p.updatedAt || p.createdAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      images: p.mainImage ? [
        {
          url: p.mainImage,
          title: typeof p.title === 'object' ? p.title.en : p.title,
          caption: `Project: ${typeof p.title === 'object' ? p.title.en : p.title} in ${p.location || 'Cameroon'}`,
          geoLocation: p.location ? {
            '@type': 'Place',
            name: p.location,
          } : undefined,
        }
      ] : [],
    }))

    return [...staticPages, ...projectPages]
  } catch (error) {
    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ]
  }
}