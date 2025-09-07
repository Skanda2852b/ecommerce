import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Item from '@/app/models/Item';

export async function GET() {
  try {
    await dbConnect();
    
    // Get distinct categories from items
    const categories = await Item.distinct('category');
    
    // If no categories exist in the database, return default categories
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Electronics', count: 0 },
        { name: 'Clothing', count: 0 },
        { name: 'Books', count: 0 },
        { name: 'Home', count: 0 },
        { name: 'Sports', count: 0 },
        { name: 'Other', count: 0 }
      ];
      
      return NextResponse.json({ categories: defaultCategories });
    }
    
    // Count items in each category
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Item.countDocuments({ category });
        return {
          name: category,
          count: count
        };
      })
    );
    
    return NextResponse.json({ categories: categoryCounts });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}