// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';
import Cart from '@/app/models/Cart';
import { generateToken } from '@/app/lib/auth';
import { cookies } from 'next/headers';

// Helper function to merge guest cart with user cart
async function mergeCarts(userId, guestToken) {
  try {
    // Find guest cart
    const guestCart = await Cart.findOne({ guestToken }).populate('items.item');
    if (!guestCart) return null;

    // Find or create user cart
    let userCart = await Cart.findOne({ user: userId }).populate('items.item');
    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    // Merge items from guest cart to user cart
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        item => item.item._id.toString() === guestItem.item._id.toString()
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // Add new item to cart
        userCart.items.push({
          item: guestItem.item._id,
          quantity: guestItem.quantity
        });
      }
    }

    await userCart.save();
    await userCart.populate('items.item');
    
    // Delete guest cart after merging
    await Cart.deleteOne({ _id: guestCart._id });
    
    return userCart;
  } catch (error) {
    console.error('Error merging carts:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get guest token from cookies
    const cookieStore = await cookies();
    const guestToken = cookieStore.get('guestToken')?.value;

    // Merge guest cart with user cart if exists
    if (guestToken) {
      await mergeCarts(user._id, guestToken);
      
      // Clear guest token cookie after merging
      cookieStore.set('guestToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1,
        sameSite: 'lax',
        path: '/',
      });
    }

    // Generate token
    const token = generateToken({ id: user._id, username: user.username });

    // Set authentication cookie
    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } },
      { status: 200 }
    );
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}