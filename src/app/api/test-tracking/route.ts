import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ArticleView from '@/models/ArticleView';
import News from '@/models/News';

export async function POST(request: NextRequest) {
  try {
    console.log('Test tracking endpoint called');
    
    await connectDB();
    console.log('Database connected');

    const body = await request.json();
    const { articleSlug } = body;
    
    console.log('Request body:', body);

    if (!articleSlug) {
      return NextResponse.json(
        { success: false, error: 'Article slug is required' },
        { status: 400 }
      );
    }

    // Find the article
    const article = await News.findOne({ slug: articleSlug }).lean();
    console.log('Article found:', article ? 'Yes' : 'No');
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    console.log('Client info:', { ipAddress: ipAddress.substring(0, 8) + '***', userAgent: userAgent.substring(0, 20) + '...' });

    // Create view record
    const viewRecord = new ArticleView({
      articleId: (article as any)._id,
      articleSlug: (article as any).slug,
      articleTitle: (article as any).title,
      articleCategory: (article as any).category,
      articleAuthor: (article as any).author,
      visitorId: `test-visitor-${Date.now()}`,
      ipAddress,
      userAgent,
      sessionId: `test-session-${Date.now()}`,
      viewDuration: 30,
      isUniqueView: true,
      location: {
        country: 'Indonesia',
        region: 'Kalimantan Barat',
        city: 'Pontianak',
        district: 'Pontianak Kota'
      },
      device: {
        type: userAgent.toLowerCase().includes('mobile') ? 'mobile' : 'desktop',
        os: 'Test OS',
        browser: 'Test Browser'
      },
      viewedAt: new Date()
    });

    await viewRecord.save();
    console.log('View record saved:', viewRecord._id);

    // Update article view count
    const updateResult = await News.findByIdAndUpdate(
      (article as any)._id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    console.log('Article view count updated:', updateResult?.views);

    // Get current view counts
    const totalViews = await ArticleView.countDocuments();
    const articleViews = await ArticleView.countDocuments({ articleId: (article as any)._id });

    return NextResponse.json({
      success: true,
      data: {
        viewId: viewRecord._id,
        articleId: (article as any)._id,
        articleSlug: (article as any).slug,
        articleTitle: (article as any).title,
        newViewCount: updateResult?.views || 0,
        totalViewsInDB: totalViews,
        articleViewsInDB: articleViews,
        ipAddress: ipAddress.substring(0, 8) + '***',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in test tracking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const totalViews = await ArticleView.countDocuments();
    const totalArticles = await News.countDocuments();
    
    // Get recent views
    const recentViews = await ArticleView.find()
      .sort({ viewedAt: -1 })
      .limit(5)
      .lean();

    // Get articles with view counts
    const articlesWithViews = await News.find()
      .select('title slug views')
      .sort({ views: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        totalArticles,
        recentViews: recentViews.map(view => ({
          id: view._id,
          articleSlug: view.articleSlug,
          articleTitle: view.articleTitle,
          ipAddress: view.ipAddress?.substring(0, 8) + '***',
          viewedAt: view.viewedAt
        })),
        articlesWithViews: articlesWithViews.map(article => ({
          id: article._id,
          title: article.title,
          slug: article.slug,
          views: article.views || 0
        }))
      }
    });

  } catch (error) {
    console.error('Error getting tracking data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
