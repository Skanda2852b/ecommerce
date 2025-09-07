"use client";
import {
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Cart() {
  const [cart, setCart] =
    useState({ items: [] });
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);
  const [error, setError] =
    useState("");
  const [
    updatingItems,
    setUpdatingItems,
  ] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart =
    async () => {
      try {
        const response =
          await fetch(
            "/api/cart"
          );
        if (response.ok) {
          const data =
            await response.json();
          setCart(data);
        } else if (
          response.status ===
          401
        ) {
          router.push(
            "/login"
          );
        } else {
          setError(
            "Failed to fetch cart"
          );
        }
      } catch (error) {
        setError(
          "An error occurred while fetching cart"
        );
      } finally {
        setIsLoading(false);
      }
    };

  const removeFromCart =
    async (itemId) => {
      try {
        setUpdatingItems(
          (prev) => ({
            ...prev,
            [itemId]: true,
          })
        );
        const response =
          await fetch(
            `/api/cart?itemId=${itemId}`,
            {
              method:
                "DELETE",
            }
          );

        if (response.ok) {
          const data =
            await response.json();
          if (
            data.message ===
            "Cart is now empty"
          ) {
            setCart({
              items: [],
            });
          } else {
            setCart(data);
          }
        } else {
          const errorData =
            await response.json();
          setError(
            errorData.error ||
              "Failed to remove item from cart"
          );
        }
      } catch (error) {
        setError(
          "An error occurred while removing item from cart"
        );
      } finally {
        setUpdatingItems(
          (prev) => ({
            ...prev,
            [itemId]: false,
          })
        );
      }
    };

  const updateQuantity =
    async (
      itemId,
      newQuantity
    ) => {
      if (newQuantity < 1) {
        removeFromCart(
          itemId
        );
        return;
      }

      try {
        setUpdatingItems(
          (prev) => ({
            ...prev,
            [itemId]: true,
          })
        );
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
                  itemId,
                  quantity:
                    newQuantity,
                }
              ),
            }
          );

        if (response.ok) {
          const updatedCart =
            await response.json();
          setCart(
            updatedCart
          );
        } else {
          setError(
            "Failed to update quantity"
          );
        }
      } catch (error) {
        setError(
          "An error occurred while updating quantity"
        );
      } finally {
        setUpdatingItems(
          (prev) => ({
            ...prev,
            [itemId]: false,
          })
        );
      }
    };

  const calculateTotal =
    () => {
      return cart.items.reduce(
        (total, item) =>
          total +
          item.item.price *
            item.quantity,
        0
      );
    };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() =>
                  setError("")
                }
                className="text-red-700 hover:text-red-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Your Shopping Cart
        </h1>
        <Link
          href="/items"
          className="text-purple-600 hover:text-purple-500 font-medium flex items-center transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          Continue Shopping
        </Link>
      </div>

      {cart.items.length ===
      0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-purple-500"
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Looks like you
            haven't added any
            items to your cart
            yet.
          </p>
          <Link
            href="/items"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">
                  Product
                </div>
                <div className="col-span-2 text-center">
                  Price
                </div>
                <div className="col-span-3 text-center">
                  Quantity
                </div>
                <div className="col-span-2 text-right">
                  Total
                </div>
              </div>

              {cart.items.map(
                (
                  cartItem
                ) => (
                  <div
                    key={
                      cartItem._id
                    }
                    className="border-b border-gray-100 last:border-b-0 p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center"
                  >
                    <div className="md:col-span-5 flex items-center">
                      <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        {cartItem
                          .item
                          .image ? (
                          <img
                            src={
                              cartItem
                                .item
                                .image
                            }
                            alt={
                              cartItem
                                .item
                                .name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              No
                              image
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {
                            cartItem
                              .item
                              .name
                          }
                        </h3>
                        <button
                          onClick={() =>
                            removeFromCart(
                              cartItem
                                .item
                                ._id
                            )
                          }
                          disabled={
                            updatingItems[
                              cartItem
                                .item
                                ._id
                            ]
                          }
                          className="mt-1 text-sm text-red-500 hover:text-red-700 flex items-center transition-colors duration-200 disabled:opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          {updatingItems[
                            cartItem
                              .item
                              ._id
                          ]
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-between md:block w-full md:w-auto">
                      <span className="md:hidden text-sm font-medium text-gray-500">
                        Price
                      </span>
                      <p className="text-gray-900 font-medium md:text-center">
                        ₹
                        {
                          cartItem
                            .item
                            .price
                        }
                      </p>
                    </div>

                    <div className="md:col-span-3 ml-4 flex justify-between md:block w-full">
                      <span className="md:hidden text-sm font-medium text-gray-500 mb-1">
                        Quantity
                      </span>
                      <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden w-fit bg-white shadow-sm">
                        {/* ➖ Decrease */}
                        <button
                          onClick={() =>
                            updateQuantity(
                              cartItem
                                .item
                                ._id,
                              cartItem.quantity -
                                1
                            )
                          }
                          className={`h-10 w-10 flex items-center justify-center 
        transition-colors ${
          cartItem.quantity <=
          1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
        }`}
                          disabled={
                            cartItem.quantity <=
                            1
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                              d="M20 12H4"
                            />
                          </svg>
                        </button>

                        {/* 🔢 Quantity */}
                        <span className="h-10 w-14 flex items-center justify-center bg-white text-gray-900 font-semibold text-sm">
                          {
                            cartItem.quantity
                          }
                        </span>

                        {/* ➕ Increase */}
                        <button
                          onClick={() =>
                            updateQuantity(
                              cartItem
                                .item
                                ._id,
                              cartItem.quantity +
                                1
                            )
                          }
                          className="h-10 w-10 flex items-center justify-center 
                 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-between md:block w-full md:w-auto">
                      <span className="md:hidden text-sm font-medium text-gray-500">
                        Total
                      </span>
                      <p className="text-lg font-semibold text-gray-900 md:text-right">
                        ₹
                        {(
                          cartItem
                            .item
                            .price *
                          cartItem.quantity
                        ).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.items.map(
                  (
                    cartItem
                  ) => (
                    <div
                      key={
                        cartItem._id
                      }
                      className="flex justify-between"
                    >
                      <div className="flex items-center max-w-[70%]">
                        <span className="text-gray-600 truncate">
                          {
                            cartItem
                              .item
                              .name
                          }
                        </span>
                        <span className="text-gray-400 ml-1 whitespace-nowrap">
                          ×{" "}
                          {
                            cartItem.quantity
                          }
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium whitespace-nowrap">
                        ₹
                        {(
                          cartItem
                            .item
                            .price *
                          cartItem.quantity
                        ).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>
                    Total
                  </span>
                  <span>
                    ₹
                    {calculateTotal().toFixed(
                      2
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Shipping and
                  taxes
                  calculated
                  at checkout
                </p>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center transform hover:-translate-y-0.5">
                Proceed to
                Checkout
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/items"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue
                  Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
