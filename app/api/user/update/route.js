// app/api/user/update/route.js
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';

export async function PUT(request) {
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

    // Get update data from request
    const { username, email, firstName, lastName, phone, address, avatar } = await request.json();

    // Find user and update
    const user = await User.findByIdAndUpdate(
      userData.id,
      { username, email, firstName, lastName, phone, address, avatar },
      { new: true, runValidators: true }
    ).select('-password');

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