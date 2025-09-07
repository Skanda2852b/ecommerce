import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Cart from '@/app/models/Cart';
import { getCurrentUser } from '@/app/lib/auth';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

// Helper function to generate a random token
function generateGuestToken() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Helper function to get or create guest token
async function getGuestToken() {
  const cookieStore = await cookies();
  let guestToken = cookieStore.get('guestToken')?.value;
  
  if (!guestToken) {
    guestToken = generateGuestToken();
    cookieStore.set('guestToken', guestToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      path: '/',
    });
  }
  
  return guestToken;
}

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

export async function GET() {
  try {
    await dbConnect();
    
    const user = await getCurrentUser();
    let cart;
    
    if (user) {
      // Authenticated user - get their cart
      cart = await Cart.findOne({ user: user.id }).populate('items.item');
      
      // Check if there's a guest cart to merge
      const cookieStore = await cookies();
      const guestToken = cookieStore.get('guestToken')?.value;
      
      if (guestToken) {
        const mergedCart = await mergeCarts(user.id, guestToken);
        if (mergedCart) {
          cart = mergedCart;
          // Clear guest token after successful merge
          cookieStore.set('guestToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: -1,
            sameSite: 'lax',
            path: '/',
          });
        }
      }
    } else {
      // Guest user - use guest token
      const guestToken = await getGuestToken();
      cart = await Cart.findOne({ guestToken }).populate('items.item');
    }
    
    if (!cart) {
      return NextResponse.json({ items: [] });
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const { itemId, quantity } = await request.json();
    const user = await getCurrentUser();
    let cart;
    
    if (user) {
      // Authenticated user
      cart = await Cart.findOne({ user: user.id });
      
      if (!cart) {
        cart = new Cart({ user: user.id, items: [] });
      }
    } else {
      // Guest user
      const guestToken = await getGuestToken();
      cart = await Cart.findOne({ guestToken });
      
      if (!cart) {
        cart = new Cart({ guestToken, items: [] });
      }
    }
    
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      item => item.item.toString() === itemId
    );
    
    // In your POST handler
if (itemIndex > -1) {
  // Set quantity to the new value (not add to it)
  cart.items[itemIndex].quantity = quantity;  // Changed from += to =
  
  // Remove item if quantity is zero or less
  if (cart.items[itemIndex].quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  }
} else if (quantity > 0) {
  // Add new item to cart only if quantity is positive
  cart.items.push({ item: itemId, quantity });
}
    
    await cart.save();
    await cart.populate('items.item');
    
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const user = await getCurrentUser();
    let cart;
    
    if (user) {
      // Authenticated user
      cart = await Cart.findOne({ user: user.id });
    } else {
      // Guest user
      const guestToken = await getGuestToken();
      cart = await Cart.findOne({ guestToken });
    }
    
    if (!cart) {
      return NextResponse.json({ message: 'Cart is empty' });
    }
    
    // Remove item from cart
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.item.toString() !== itemId
    );
    
    // If no items were removed, return error
    if (cart.items.length === initialLength) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // If cart is empty after removal, delete the cart document
    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return NextResponse.json({ message: 'Cart is now empty', items: [] });
    }
    
    await cart.save();
    await cart.populate('items.item');
    
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}