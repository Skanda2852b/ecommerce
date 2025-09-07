import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Item from '@/app/models/Item';

// Sample data with 50+ products
const sampleItems = [
  // Electronics (15 items)
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 50
  },
  {
    name: "Smartphone",
    description: "Latest smartphone with high-end camera and performance",
    price: 699.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    stock: 30
  },
  {
    name: "Laptop",
    description: "Thin and light laptop with long battery life",
    price: 999.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    stock: 20
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health monitoring",
    price: 249.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    stock: 40
  },
  {
    name: "Wireless Earbuds",
    description: "Compact wireless earbuds with charging case",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
    stock: 75
  },
  {
    name: "Tablet",
    description: "10-inch tablet with high-resolution display",
    price: 399.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
    stock: 25
  },
  {
    name: "Gaming Console",
    description: "Next-generation gaming console with 4K support",
    price: 499.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3",
    stock: 15
  },
  {
    name: "Digital Camera",
    description: "DSLR camera with 24MP sensor and 4K video",
    price: 799.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    stock: 18
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with 20-hour battery life",
    price: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    stock: 60
  },
  {
    name: "Wireless Keyboard",
    description: "Ergonomic wireless keyboard with numeric pad",
    price: 69.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a",
    stock: 45
  },
  {
    name: "Computer Monitor",
    description: "27-inch 4K monitor with IPS panel",
    price: 349.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618477388955-04156c5d70cc",
    stock: 22
  },
  {
    name: "External Hard Drive",
    description: "2TB portable hard drive with USB-C connectivity",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
    stock: 80
  },
  {
    name: "VR Headset",
    description: "Immersive virtual reality headset with controllers",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e",
    stock: 20
  },
  {
    name: "Drone",
    description: "4K camera drone with GPS and auto-follow",
    price: 449.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9",
    stock: 15
  },
  {
    name: "Smart Home Hub",
    description: "Central control for all your smart home devices",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    stock: 35
  },

  // Clothing (15 items)
  {
    name: "T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    price: 19.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    stock: 100
  },
  {
    name: "Jeans",
    description: "Classic denim jeans with a modern fit",
    price: 49.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    stock: 75
  },
  {
    name: "Sweater",
    description: "Warm and cozy sweater for the cold weather",
    price: 39.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    stock: 60
  },
  {
    name: "Winter Jacket",
    description: "Waterproof winter jacket with insulation",
    price: 129.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    stock: 40
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioning",
    price: 89.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 65
  },
  {
    name: "Formal Shirt",
    description: "Crisp formal shirt for business occasions",
    price: 59.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    stock: 50
  },
  {
    name: "Summer Dress",
    description: "Light and breezy dress for summer days",
    price: 45.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
    stock: 55
  },
  {
    name: "Leather Belt",
    description: "Genuine leather belt with classic buckle",
    price: 29.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    stock: 90
  },
  {
    name: "Sports Shorts",
    description: "Breathable shorts for athletic activities",
    price: 24.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1506629905877-52a5ca6d63b1",
    stock: 70
  },
  {
    name: "Winter Beanie",
    description: "Warm knitted beanie for cold days",
    price: 19.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9",
    stock: 85
  },
  {
    name: "Swim Trunks",
    description: "Quick-dry swim trunks with secure pockets",
    price: 34.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0",
    stock: 60
  },
  {
    name: "Yoga Pants",
    description: "Stretchy yoga pants with high waist",
    price: 39.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
    stock: 75
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket for casual wear",
    price: 69.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    stock: 45
  },
  {
    name: "Baseball Cap",
    description: "Adjustable cap with embroidered logo",
    price: 24.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1575428652377-a2e80a0c0c77",
    stock: 95
  },
  {
    name: "Winter Gloves",
    description: "Insulated gloves for cold weather protection",
    price: 29.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
    stock: 80
  },

  // Books (10 items)
  {
    name: "Novel",
    description: "Bestselling novel by a famous author",
    price: 14.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    stock: 200
  },
  {
    name: "Cookbook",
    description: "Collection of delicious recipes from around the world",
    price: 24.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
    stock: 80
  },
  {
    name: "Coffee Table Book",
    description: "Beautiful photography and design book for your coffee table",
    price: 39.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637",
    stock: 40
  },
  {
    name: "Science Fiction Novel",
    description: "Award-winning science fiction adventure",
    price: 16.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1531901599634-8b059634e824",
    stock: 65
  },
  {
    name: "Children's Book",
    description: "Colorful illustrated book for young readers",
    price: 12.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73",
    stock: 120
  },
  {
    name: "Self-Help Book",
    description: "Inspirational guide for personal development",
    price: 19.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
    stock: 90
  },
  {
    name: "History Book",
    description: "Comprehensive guide to world history",
    price: 29.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    stock: 55
  },
  {
    name: "Poetry Collection",
    description: "Award-winning collection of contemporary poetry",
    price: 15.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    stock: 70
  },
  {
    name: "Business Strategy Book",
    description: "Expert guide to business growth strategies",
    price: 22.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6",
    stock: 45
  },
  {
    name: "Art Book",
    description: "Collection of works from renowned artists",
    price: 49.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637",
    stock: 30
  },

  // Home (10 items)
  {
    name: "Throw Pillow",
    description: "Soft and decorative throw pillow for your living room",
    price: 24.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    stock: 150
  },
  {
    name: "Desk Lamp",
    description: "Modern desk lamp with adjustable brightness",
    price: 34.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    stock: 90
  },
  {
    name: "Blender",
    description: "Powerful blender for making smoothies and soups",
    price: 49.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1566761226391-9f1aedefa0b4",
    stock: 60
  },
  {
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 79.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    stock: 40
  },
  {
    name: "Bedding Set",
    description: "Luxury cotton bedding set with pillowcases",
    price: 89.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    stock: 35
  },
  {
    name: "Wall Art",
    description: "Modern abstract wall art for home decoration",
    price: 59.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
    stock: 25
  },
  {
    name: "Kitchen Knife Set",
    description: "Professional-grade knife set with block",
    price: 129.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65",
    stock: 30
  },
  {
    name: "Vacuum Cleaner",
    description: "Powerful bagless vacuum with HEPA filter",
    price: 199.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
    stock: 20
  },
  {
    name: "Air Purifier",
    description: "HEPA air purifier for large rooms",
    price: 149.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1581578021430-4d2aea2d5e0a",
    stock: 25
  },
  {
    name: "Throw Blanket",
    description: "Soft and cozy throw blanket for your couch",
    price: 39.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1574828241320-2f27f66b7c6e",
    stock: 70
  },

  // Sports (10 items)
  {
    name: "Basketball",
    description: "Official size and weight basketball for indoor and outdoor play",
    price: 29.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    stock: 120
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat for comfortable workouts",
    price: 22.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    stock: 100
  },
  {
    name: "Dumbbell Set",
    description: "Adjustable dumbbell set for home gym",
    price: 89.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    stock: 40
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with cushion technology",
    price: 99.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 55
  },
  {
    name: "Tennis Racket",
    description: "Professional tennis racket with carbon fiber construction",
    price: 129.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1611944190310-8a8c6bc20f36",
    stock: 30
  },
  {
    name: "Camping Tent",
    description: "4-person camping tent with weather protection",
    price: 149.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4",
    stock: 25
  },
  {
    name: "Fitness Tracker",
    description: "Waterproof fitness tracker with heart rate monitor",
    price: 79.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6",
    stock: 65
  },
  {
    name: "Bicycle",
    description: "Lightweight urban bicycle with 21-speed gear system",
    price: 349.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
    stock: 15
  },
  {
    name: "Golf Clubs Set",
    description: "Complete set of golf clubs for beginners",
    price: 249.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c990e30",
    stock: 20
  },
  {
    name: "Swimming Goggles",
    description: "Anti-fog swimming goggles with UV protection",
    price: 19.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65",
    stock: 90
  },

  // Other (10 items)
  {
    name: "Board Game",
    description: "Fun board game for family game night",
    price: 34.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1610917040803-1fccf9623064",
    stock: 80
  },
  {
    name: "Water Bottle",
    description: "Reusable water bottle to stay hydrated throughout the day",
    price: 15.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504",
    stock: 200
  },
  {
    name: "Backpack",
    description: "Durable backpack with laptop compartment and multiple pockets",
    price: 45.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    stock: 70
  },
  {
    name: "Sunglasses",
    description: "Polarized sunglasses with UV protection",
    price: 59.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    stock: 85
  },
  {
    name: "Perfume",
    description: "Luxury fragrance with long-lasting scent",
    price: 79.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539",
    stock: 45
  },
  {
    name: "Watch",
    description: "Elegant wristwatch with leather strap",
    price: 129.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    stock: 35
  },
  {
    name: "Jewelry Set",
    description: "Elegant necklace and earrings set",
    price: 89.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ad5e5",
    stock: 40
  },
  {
    name: "Plant",
    description: "Low-maintenance indoor plant for home decoration",
    price: 24.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
    stock: 95
  },
  {
    name: "Candles Set",
    description: "Scented candles for creating a cozy atmosphere",
    price: 29.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
    stock: 110
  },
  {
    name: "Puzzle",
    description: "1000-piece jigsaw puzzle with beautiful artwork",
    price: 19.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1618346136474-52fbb6e3e6f4",
    stock: 65
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing items
    await Item.deleteMany({});
    
    // Insert sample items
    await Item.insertMany(sampleItems);
    
    return NextResponse.json({ 
      message: 'Database populated successfully with sample data!',
      count: sampleItems.length
    });
  } catch (error) {
    console.error('Error populating database:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}