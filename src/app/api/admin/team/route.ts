import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import { verifyAuth } from '@/lib/auth';

// GET - Fetch all team members
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = {};
    if (activeOnly) {
      query = { isActive: true };
    }

    const teamMembers = await TeamMember.find(query).sort({ order: 1 });

    return NextResponse.json({
      success: true,
      teamMembers,
      total: teamMembers.length
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { name, position, bio, photo, email, phone, socialMedia, order, isActive } = body;

    // Validation
    if (!name || !position || !bio) {
      return NextResponse.json(
        { success: false, error: 'Name, position, and bio are required' },
        { status: 400 }
      );
    }

    // Create new team member
    const teamMember = new TeamMember({
      name: name.trim(),
      position: position.trim(),
      bio: bio.trim(),
      photo,
      email: email?.trim(),
      phone: phone?.trim(),
      socialMedia,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await teamMember.save();

    return NextResponse.json({
      success: true,
      teamMember,
      message: 'Team member created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating team member:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

// PUT - Reorder team members
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { memberIds } = body;

    if (!Array.isArray(memberIds)) {
      return NextResponse.json(
        { success: false, error: 'memberIds must be an array' },
        { status: 400 }
      );
    }

    // Reorder team members
    const bulkOps = memberIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index + 1 }
      }
    }));

    await TeamMember.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: 'Team members reordered successfully'
    });

  } catch (error) {
    console.error('Error reordering team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder team members' },
      { status: 500 }
    );
  }
}
