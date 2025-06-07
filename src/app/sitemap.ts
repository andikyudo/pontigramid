import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Connect to database
    await connectDB();

    // Get all published news
    const news = await News.find({ published: true })
      .select('slug updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    // Generate news pages
    const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
      url: `${baseUrl}/berita/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...newsPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
