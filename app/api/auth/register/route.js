import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';
import { generateToken, setTokenCookie } from '@/app/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email or username' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Generate token
    const token = generateToken({ id: user._id, username: user.username });

    // Set cookie
    const response = NextResponse.json(
      { message: 'User created successfully', user: { id: user._id, username: user.username, email: user.email } },
      { status: 201 }
    );
    
    setTokenCookie(token);
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}