"use client";
import Link from "next/link";
import Image from "next/image";
import {
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [
    featuredProducts,
    setFeaturedProducts,
  ] = useState([]);
  const [
    categories,
    setCategories,
  ] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch featured products from your API
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts =
    async () => {
      try {
        const response =
          await fetch(
            "/api/items/featured?limit=6"
          );
        if (response.ok) {
          const data =
            await response.json();
          setFeaturedProducts(
            data.items || data
          );
        } else {
          // Fallback products if API fails
          setFeaturedProducts(
            [
              {
                id: 1,
                name: "Premium Wireless Headphones",
                price: 249.99,
                category:
                  "Electronics",
                rating: 4.8,
                image:
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                id: 2,
                name: "Designer Casual T-Shirt",
                price: 49.99,
                category:
                  "Clothing",
                rating: 4.5,
                image:
                  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                id: 3,
                name: "Bestselling Novel",
                price: 19.99,
                category:
                  "Books",
                rating: 4.7,
                image:
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                id: 4,
                name: "Smart Fitness Watch",
                price: 199.99,
                category:
                  "Electronics",
                rating: 4.6,
                image:
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                id: 5,
                name: "Modern Desk Lamp",
                price: 89.99,
                category:
                  "Home",
                rating: 4.4,
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
              {
                id: 6,
                name: "Professional Running Shoes",
                price: 129.99,
                category:
                  "Sports",
                rating: 4.9,
                image:
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              },
            ]
          );
        }
      } catch (error) {
        console.error(
          "Error fetching featured products:",
          error
        );
      }
    };

  const fetchCategories =
    async () => {
      try {
        const response =
          await fetch(
            "/api/items/categories"
          );
        if (response.ok) {
          const data =
            await response.json();
          setCategories(
            data.categories ||
              data
          );
        } else {
          // Fallback categories if API fails
          setCategories([
            {
              name: "Electronics",
              count: 24,
            },
            {
              name: "Clothing",
              count: 32,
            },
            {
              name: "Books",
              count: 18,
            },
            {
              name: "Home",
              count: 27,
            },
            {
              name: "Sports",
              count: 15,
            },
          ]);
        }
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error
        );
      }
    };

  const addToCart = async (
    productId
  ) => {
    try {
      const response =
        await fetch(
          "/api/cart",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              {
                itemId:
                  productId,
                quantity: 1,
              }
            ),
          }
        );

      if (response.ok) {
        alert(
          "Item added to cart successfully!"
        );
      } else {
        const data =
          await response.json();
        if (
          response.status ===
          401
        ) {
          router.push(
            "/login"
          );
        } else {
          alert(
            data.error ||
              "Failed to add item to cart"
          );
        }
      }
    } catch (error) {
      alert(
        "An error occurred while adding item to cart"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-black text-white py-20 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your
              Style
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Curated
              collection of
              premium products
              for the modern
              lifestyle
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/items"
                className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop
                Collection
              </Link>
              <Link
                href="/categories"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Browse
                Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-20 container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked
            selection of
            quality products
            designed to
            elevate your
            everyday life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(
            (product) => (
              <div
                key={
                  product.id ||
                  product._id
                }
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-60 relative overflow-hidden">
                  <Image
                    src={
                      product.image
                    }
                    alt={
                      product.name
                    }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
                    <span className="text-sm font-semibold text-purple-700">
                      ₹
                      {
                        product.price
                      }
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold text-white bg-purple-600 px-2 py-1 rounded-full">
                      {
                        product.category
                      }
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[
                        ...Array(
                          5
                        ),
                      ].map(
                        (
                          _,
                          i
                        ) => (
                          <svg
                            key={
                              i
                            }
                            className={`w-4 h-4 ${
                              i <
                              Math.floor(
                                product.rating ||
                                  4.5
                              )
                                ? "fill-current"
                                : "stroke-current"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )
                      )}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.rating ||
                        4.5}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-purple-700 transition-colors">
                    {
                      product.name
                    }
                  </h3>
                  <button
                    onClick={() =>
                      addToCart(
                        product.id ||
                          product._id
                      )
                    }
                    className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={
                          2
                        }
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add to
                    Cart
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/items"
            className="inline-flex items-center justify-center bg-white text-purple-700 border-2 border-purple-700 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            View All Products
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={
                  2
                }
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our
              diverse range of
              categories to
              find exactly
              what you're
              looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map(
              (
                category,
                index
              ) => (
                <Link
                  key={index}
                  href={`/items?category=${category.name}`}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={
                          2
                        }
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                    {
                      category.name
                    }
                  </h3>
                  <p className="text-sm text-gray-500">
                    {
                      category.count
                    }{" "}
                    items
                  </p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Sign up now to get
            exclusive offers,
            early access to
            new products, and
            more!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white hover:bg-black hover:text-purple-300 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
