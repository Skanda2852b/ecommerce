const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Sample data
const sampleItems = [
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 50
  },
  {
    name: "Smartphone",
    description: "Latest smartphone with high-end camera and performance",
    price: 699.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 30
  },
  {
    name: "Laptop",
    description: "Thin and light laptop with long battery life",
    price: 999.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 20
  },
  {
    name: "T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    price: 19.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 100
  },
  {
    name: "Jeans",
    description: "Classic denim jeans with a modern fit",
    price: 49.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 75
  },
  {
    name: "Sweater",
    description: "Warm and cozy sweater for the cold weather",
    price: 39.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 60
  },
  {
    name: "Novel",
    description: "Bestselling novel by a famous author",
    price: 14.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 200
  },
  {
    name: "Cookbook",
    description: "Collection of delicious recipes from around the world",
    price: 24.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 80
  },
  {
    name: "Coffee Table Book",
    description: "Beautiful photography and design book for your coffee table",
    price: 39.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 40
  },
  {
    name: "Throw Pillow",
    description: "Soft and decorative throw pillow for your living room",
    price: 24.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 150
  },
  {
    name: "Desk Lamp",
    description: "Modern desk lamp with adjustable brightness",
    price: 34.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 90
  },
  {
    name: "Blender",
    description: "Powerful blender for making smoothies and soups",
    price: 49.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1566761226391-9f1aedefa0b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 60
  },
  {
    name: "Basketball",
    description: "Official size and weight basketball for indoor and outdoor play",
    price: 29.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 120
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat for comfortable workouts",
    price: 22.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1549062577-5d4c33a7c739?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 100
  },
  {
    name: "Dumbbell Set",
    description: "Adjustable dumbbell set for home gym",
    price: 89.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 40
  },
  {
    name: "Board Game",
    description: "Fun board game for family game night",
    price: 34.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1610917040803-1fccf9623064?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 80
  },
  {
    name: "Water Bottle",
    description: "Reusable water bottle to stay hydrated throughout the day",
    price: 15.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 200
  },
  {
    name: "Backpack",
    description: "Durable backpack with laptop compartment and multiple pockets",
    price: 45.99,
    category: "Other",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    stock: 70
  }
];

async function populateDB() {
  try {
    // Connect to MongoDB
    const mongoose = require('mongoose');
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
    
    await mongoose.connect(MONGODB_URI);
    
    // Import the Item model
    const Item = require('../app/models/Item');
    
    // Clear existing items
    await Item.deleteMany({});
    
    // Insert sample items
    await Item.insertMany(sampleItems);
    
    console.log('Database populated successfully with sample data!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateDB();