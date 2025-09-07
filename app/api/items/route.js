import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Item from '@/app/models/Item';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    
    // Build filter object
    let filter = {};
    if (category && category !== 'All') filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get all items with filters (no pagination)
    const items = await Item.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({
      items,
      total: items.length
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}