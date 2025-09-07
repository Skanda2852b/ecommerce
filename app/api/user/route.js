// app/api/user/route.js
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Get current user from token
    const userData = await getCurrentUser();
    if (!userData) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Find user in database
    const user = await User.findById(userData.id).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}