import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { action, ids } = body;
    
    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: 'Missing action or ids' },
        { status: 400 }
      );
    }
    
    const objectIds = ids.map(id => new ObjectId(id));
    
    let result;
    
    switch (action) {
      case 'publish':
        result = await db.collection('news').updateMany(
          { _id: { $in: objectIds } },
          { 
            $set: { 
              published: true,
              updatedAt: new Date().toISOString()
            }
          }
        );
        break;
        
      case 'unpublish':
        result = await db.collection('news').updateMany(
          { _id: { $in: objectIds } },
          { 
            $set: { 
              published: false,
              updatedAt: new Date().toISOString()
            }
          }
        );
        break;
        
      case 'archive':
        result = await db.collection('news').updateMany(
          { _id: { $in: objectIds } },
          { 
            $set: { 
              published: false,
              archived: true,
              updatedAt: new Date().toISOString()
            }
          }
        );
        break;
        
      case 'delete':
        result = await db.collection('news').deleteMany(
          { _id: { $in: objectIds } }
        );
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${result.modifiedCount || result.deletedCount} items`,
      affected: result.modifiedCount || result.deletedCount
    });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}
