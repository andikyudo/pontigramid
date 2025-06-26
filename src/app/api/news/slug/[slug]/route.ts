import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';
import ArticleView from '@/models/ArticleView';

// GET - Ambil berita berdasarkan slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    
    const news = await News.findOne({ 
      slug: slug,
      published: true 
    });
    
    if (!news) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }

    // Track article view (server-side)
    try {
      const ipAddress = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       '127.0.0.1';
      const userAgent = request.headers.get('user-agent') || 'Unknown';

      // Check if this is a unique view (same IP + article within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existingView = await ArticleView.findOne({
        articleId: news._id,
        ipAddress,
        viewedAt: { $gte: twentyFourHoursAgo }
      });

      const isUniqueView = !existingView;

      // Create view record
      const viewRecord = new ArticleView({
        articleId: news._id,
        articleSlug: news.slug,
        articleTitle: news.title,
        articleCategory: news.category,
        articleAuthor: news.author,
        visitorId: `server-visitor-${Date.now()}`,
        ipAddress,
        userAgent,
        sessionId: `server-session-${Date.now()}`,
        viewDuration: 0, // Will be updated by client-side tracking
        isUniqueView,
        location: {
          country: 'Indonesia',
          region: 'Kalimantan Barat',
          city: 'Pontianak',
          district: 'Pontianak Kota'
        },
        device: {
          type: userAgent.toLowerCase().includes('mobile') ? 'mobile' : 'desktop',
          os: 'Server Detected',
          browser: 'Server Detected'
        },
        viewedAt: new Date()
      });

      await viewRecord.save();

      // Update article view count (only for unique views)
      if (isUniqueView) {
        await News.findByIdAndUpdate(
          news._id,
          { $inc: { views: 1 } }
        );
      }

      console.log(`Article view tracked: ${news.slug}, IP: ${ipAddress.substring(0, 8)}***, Unique: ${isUniqueView}`);
    } catch (trackingError) {
      console.error('Error tracking article view:', trackingError);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({
      success: true,
      data: news
    });
    
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data berita' },
      { status: 500 }
    );
  }
}
