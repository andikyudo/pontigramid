import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import News from '@/models/News';

export async function POST(request: NextRequest) {
  try {
    console.log('Manual increment endpoint called');
    
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
    const article = await News.findOne({ slug: articleSlug });
    console.log('Article found:', article ? 'Yes' : 'No');
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    console.log('Current views:', article.views || 0);

    // Manual increment
    const updatedArticle = await News.findByIdAndUpdate(
      article._id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    console.log('Updated views:', updatedArticle?.views);

    return NextResponse.json({
      success: true,
      data: {
        articleId: article._id,
        articleSlug: article.slug,
        articleTitle: article.title,
        oldViews: article.views || 0,
        newViews: updatedArticle?.views || 0,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in manual increment:', error);
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

    // Get all articles with view counts
    const articles = await News.find()
      .select('title slug views')
      .sort({ views: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        articles: articles.map(article => ({
          id: article._id,
          title: article.title,
          slug: article.slug,
          views: article.views || 0
        }))
      }
    });

  } catch (error) {
    console.error('Error getting articles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
