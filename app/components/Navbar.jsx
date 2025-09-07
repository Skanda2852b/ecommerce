// app/components/Navbar.js
"use client";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [
    isLoggedIn,
    setIsLoggedIn,
  ] = useState(false);
  const [
    cartCount,
    setCartCount,
  ] = useState(0);
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
    fetchCartCount();
  }, []);

  const checkAuthStatus =
    async () => {
      try {
        const response =
          await fetch(
            "/api/auth/status"
          );
        if (response.ok) {
          const data =
            await response.json();
          setIsLoggedIn(
            data.isAuthenticated
          );
        } else {
          const cartResponse =
            await fetch(
              "/api/cart"
            );
          setIsLoggedIn(
            cartResponse.status !==
              401
          );
        }
      } catch (error) {
        console.error(
          "Error checking auth status:",
          error
        );
        setIsLoggedIn(false);
      }
    };

  const fetchCartCount =
    async () => {
      try {
        const guestToken =
          document.cookie
            .split("; ")
            .find((row) =>
              row.startsWith(
                "guestToken="
              )
            )
            ?.split("=")[1];

        const url = guestToken
          ? `/api/cart?guestToken=${guestToken}`
          : "/api/cart";

        const response =
          await fetch(url);
        if (response.ok) {
          const cart =
            await response.json();
          setCartCount(
            cart.items?.reduce(
              (total, item) =>
                total +
                item.quantity,
              0
            ) || 0
          );
        }
      } catch (error) {
        console.error(
          "Error fetching cart:",
          error
        );
      }
    };

  const handleLogout =
    async () => {
      try {
        await fetch(
          "/api/auth/logout",
          { method: "POST" }
        );
        setIsLoggedIn(false);
        setCartCount(0);
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      }
    };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">
                S
              </span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
              StyleHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/items"
              className="text-gray-600 hover:text-purple-500 transition-all duration-300 font-medium flex items-center space-x-1.5 group"
            >
              <div className="p-1.5 rounded-md group-hover:bg-purple-50 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <span className="group-hover:text-purple-600 transition-colors">
                Products
              </span>
            </Link>

            <Link
              href="/cart"
              className="text-gray-600 hover:text-purple-500 transition-all duration-300 font-medium flex items-center space-x-1.5 group relative"
            >
              <div className="p-1.5 rounded-md group-hover:bg-purple-50 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="group-hover:text-purple-600 transition-colors">
                Cart
              </span>
              {cartCount >
                0 && (
                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-purple-500 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-purple-50"
                >
                  Profile
                </Link>
                <button
                  onClick={
                    handleLogout
                  }
                  className="bg-gray-100 hover:bg-purple-400 text-gray-800 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-purple-500 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-purple-50"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() =>
                setIsMenuOpen(
                  !isMenuOpen
                )
              }
              className="p-2 rounded-lg text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 bg-white rounded-b-lg shadow-lg">
            <div className="flex flex-col space-y-2">
              <Link
                href="/items"
                className="text-gray-600 hover:text-purple-500 transition-colors font-medium flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-purple-50"
                onClick={() =>
                  setIsMenuOpen(
                    false
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>
                  Products
                </span>
              </Link>

              <Link
                href="/cart"
                className="text-gray-600 hover:text-purple-500 transition-colors font-medium flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-purple-50 relative"
                onClick={() =>
                  setIsMenuOpen(
                    false
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>
                  Cart
                </span>
                {cartCount >
                  0 && (
                  <span className="absolute right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                    {
                      cartCount
                    }
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-purple-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                    onClick={() =>
                      setIsMenuOpen(
                        false
                      )
                    }
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(
                        false
                      );
                    }}
                    className="text-left text-gray-600 hover:text-purple-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-purple-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
                    onClick={() =>
                      setIsMenuOpen(
                        false
                      )
                    }
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-center mt-2"
                    onClick={() =>
                      setIsMenuOpen(
                        false
                      )
                    }
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
