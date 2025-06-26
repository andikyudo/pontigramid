import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

// GET - Fetch active team members for public display
export async function GET() {
  try {
    await connectDB();

    // Only return active team members, ordered by their order field
    const teamMembers = await TeamMember.find({ isActive: true }).sort({ order: 1 });

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
