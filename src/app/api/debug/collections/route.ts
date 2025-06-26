import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Import models
    const ReaderAnalytics = (await import('@/models/ReaderAnalytics')).default;
    const ArticleView = (await import('@/models/ArticleView')).default;
    const News = (await import('@/models/News')).default;

    // Check ReaderAnalytics collection
    const readerAnalyticsCount = await ReaderAnalytics.countDocuments();
    const readerAnalyticsRecent = await ReaderAnalytics.find()
      .sort({ viewedAt: -1 })
      .limit(5)
      .lean();

    // Check ArticleView collection
    const articleViewCount = await ArticleView.countDocuments();
    const articleViewRecent = await ArticleView.find()
      .sort({ viewedAt: -1 })
      .limit(5)
      .lean();

    // Check News collection view counts
    const newsWithViews = await News.find({ views: { $gt: 0 } })
      .select('title slug views')
      .sort({ views: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        collections: {
          readerAnalytics: {
            count: readerAnalyticsCount,
            recentRecords: readerAnalyticsRecent.map(record => ({
              articleSlug: record.articleSlug,
              articleTitle: record.articleTitle,
              ipAddress: record.ipAddress?.substring(0, 10) + '***',
              viewedAt: record.viewedAt,
              sessionId: record.sessionId,
              referrer: record.referrer
            }))
          },
          articleView: {
            count: articleViewCount,
            recentRecords: articleViewRecent.map(record => ({
              articleSlug: record.articleSlug,
              articleTitle: record.articleTitle,
              ipAddress: record.ipAddress?.substring(0, 10) + '***',
              viewedAt: record.viewedAt,
              sessionId: record.sessionId,
              referrer: record.referrer
            }))
          },
          newsViewCounts: {
            articlesWithViews: newsWithViews.map(article => ({
              title: article.title,
              slug: article.slug,
              views: article.views
            }))
          }
        },
        summary: {
          totalReaderAnalyticsRecords: readerAnalyticsCount,
          totalArticleViewRecords: articleViewCount,
          totalArticlesWithViews: newsWithViews.length
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error checking collections:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
