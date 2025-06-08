import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visitor from '@/models/Visitor';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'lastVisit';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const filter = searchParams.get('filter') || 'all';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (filter === 'blocked') {
      query.isBlocked = true;
    } else if (filter === 'active') {
      query.isBlocked = false;
    }
    
    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Get visitors with pagination
    const visitors = await Visitor.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-pages'); // Exclude pages array for performance
    
    // Get total count
    const total = await Visitor.countDocuments(query);
    
    // Get analytics data
    const analytics = await getVisitorAnalytics();
    
    return NextResponse.json({
      success: true,
      data: {
        visitors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        analytics
      }
    });
    
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getVisitorAnalytics() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const [
      totalVisitors,
      todayVisitors,
      yesterdayVisitors,
      weekVisitors,
      monthVisitors,
      blockedVisitors,
      topCountries,
      recentVisitors
    ] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ lastVisit: { $gte: today } }),
      Visitor.countDocuments({ 
        lastVisit: { $gte: yesterday, $lt: today } 
      }),
      Visitor.countDocuments({ lastVisit: { $gte: weekAgo } }),
      Visitor.countDocuments({ lastVisit: { $gte: monthAgo } }),
      Visitor.countDocuments({ isBlocked: true }),
      Visitor.aggregate([
        { $match: { country: { $ne: '' } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Visitor.find()
        .sort({ lastVisit: -1 })
        .limit(10)
        .select('ipAddress country city lastVisit visitCount')
    ]);
    
    return {
      total: totalVisitors,
      today: todayVisitors,
      yesterday: yesterdayVisitors,
      week: weekVisitors,
      month: monthVisitors,
      blocked: blockedVisitors,
      topCountries: topCountries.map(item => ({
        country: item._id,
        count: item.count
      })),
      recent: recentVisitors
    };
    
  } catch (error) {
    console.error('Error getting analytics:', error);
    return {
      total: 0,
      today: 0,
      yesterday: 0,
      week: 0,
      month: 0,
      blocked: 0,
      topCountries: [],
      recent: []
    };
  }
}
