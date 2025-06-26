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

    // FORCE INCREMENT VIEW COUNT FOR TESTING
    try {
      console.log('FORCE INCREMENT: Starting view tracking for article:', news.slug);

      // Always increment view count for testing
      const updatedNews = await News.findByIdAndUpdate(
        news._id,
        { $inc: { views: 1 } },
        { new: true }
      );

      console.log('FORCE INCREMENT: View count updated to:', updatedNews?.views);

      // Update the news object to return the new view count
      news.views = updatedNews?.views || (news.views || 0) + 1;

    } catch (trackingError) {
      console.error('FORCE INCREMENT: Error updating view count:', trackingError);
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
