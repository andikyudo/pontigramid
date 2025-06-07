import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Footer from '@/models/Footer';

// GET footer data
export async function GET() {
  try {
    await connectDB();
    
    const footer = await Footer.getOrCreateDefault();
    
    return NextResponse.json({
      success: true,
      footer
    });
  } catch (error) {
    console.error('Error fetching footer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update footer data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validation
    if (!body.footerLinks || !body.socialLinks || !body.contactInfo || !body.companyInfo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing footer or create default
    let footer = await Footer.findOne();
    
    if (!footer) {
      footer = await Footer.getOrCreateDefault();
    }

    // Update footer data
    footer.footerLinks = body.footerLinks;
    footer.socialLinks = body.socialLinks;
    footer.contactInfo = body.contactInfo;
    footer.companyInfo = body.companyInfo;
    footer.newsletter = body.newsletter || footer.newsletter;

    await footer.save();

    return NextResponse.json({
      success: true,
      message: 'Footer updated successfully',
      footer
    });
  } catch (error) {
    console.error('Error updating footer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create/reset footer to default
export async function POST() {
  try {
    await connectDB();
    
    // Delete existing footer
    await Footer.deleteMany({});
    
    // Create new default footer
    const footer = await Footer.getOrCreateDefault();
    
    return NextResponse.json({
      success: true,
      message: 'Footer reset to default successfully',
      footer
    });
  } catch (error) {
    console.error('Error resetting footer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
