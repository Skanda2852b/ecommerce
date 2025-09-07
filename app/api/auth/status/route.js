import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    return NextResponse.json({
      isAuthenticated: !!user,
      user: user ? { id: user.id, username: user.username } : null
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}