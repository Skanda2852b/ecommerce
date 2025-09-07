"use client";
import {
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

// Fallback images for when Unsplash URLs fail
const fallbackImages = {
  "Yoga Mat":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  Blender:
    "https://images.unsplash.com/photo-1611880147493-7542bdb0f024?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  default:
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
};

export default function Items() {
  const [items, setItems] =
    useState([]);
  const [
    filteredItems,
    setFilteredItems,
  ] = useState([]);
  const [
    categories,
    setCategories,
  ] = useState(["All"]);
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");
  const [
    minPrice,
    setMinPrice,
  ] = useState("");
  const [
    maxPrice,
    setMaxPrice,
  ] = useState("");
  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);
  const [error, setError] =
    useState("");
  const [sortBy, setSortBy] =
    useState("name");
  const [
    sortOrder,
    setSortOrder,
  ] = useState("asc");
  const router = useRouter();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [
    items,
    selectedCategory,
    minPrice,
    maxPrice,
    searchTerm,
    sortBy,
    sortOrder,
  ]);

  const fetchItems =
    async () => {
      try {
        setIsLoading(true);
        console.log(
          "Fetching items from API..."
        );
        const response =
          await fetch(
            "/api/items"
          );

        if (response.ok) {
          const data =
            await response.json();
          console.log(
            `Received ${
              data.items
                ?.length || 0
            } items from API`
          );
          setItems(
            data.items || []
          );
        } else {
          const errorText =
            await response.text();
          console.error(
            "Failed to fetch items:",
            response.status,
            errorText
          );
          setError(
            `Failed to fetch items: ${response.status} ${errorText}`
          );
        }
      } catch (error) {
        console.error(
          "Error fetching items:",
          error
        );
        setError(
          "An error occurred while fetching items"
        );
      } finally {
        setIsLoading(false);
      }
    };

  const fetchCategories =
    async () => {
      try {
        console.log(
          "Fetching categories from API..."
        );
        const response =
          await fetch(
            "/api/items/categories"
          );

        if (response.ok) {
          const data =
            await response.json();
          console.log(
            "Categories received:",
            data.categories
          );
          setCategories([
            "All",
            ...data.categories.map(
              (cat) =>
                cat.name
            ),
          ]);
        } else {
          console.warn(
            "Categories API failed, extracting from items"
          );
          // If categories API fails, extract categories from items
          const itemsResponse =
            await fetch(
              "/api/items"
            );
          if (
            itemsResponse.ok
          ) {
            const itemsData =
              await itemsResponse.json();
            const uniqueCategories =
              [
                ...new Set(
                  itemsData.items.map(
                    (item) =>
                      item.category
                  )
                ),
              ];
            console.log(
              "Categories extracted from items:",
              uniqueCategories
            );
            setCategories([
              "All",
              ...uniqueCategories,
            ]);
          } else {
            setCategories([
              "All",
              "Electronics",
              "Clothing",
              "Books",
              "Home",
              "Sports",
              "Other",
            ]);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error
        );
        setCategories([
          "All",
          "Electronics",
          "Clothing",
          "Books",
          "Home",
          "Sports",
          "Other",
        ]);
      }
    };

  const filterAndSortItems =
    () => {
      let filtered = items;
      console.log(
        `Filtering ${items.length} items with category: ${selectedCategory}`
      );

      // Filter by category
      if (
        selectedCategory !==
        "All"
      ) {
        filtered =
          filtered.filter(
            (item) =>
              item.category.toLowerCase() ===
              selectedCategory.toLowerCase()
          );
        console.log(
          `After category filter: ${filtered.length} items`
        );
      }

      // Filter by price
      if (minPrice) {
        filtered =
          filtered.filter(
            (item) =>
              item.price >=
              parseFloat(
                minPrice
              )
          );
        console.log(
          `After min price filter: ${filtered.length} items`
        );
      }

      if (maxPrice) {
        filtered =
          filtered.filter(
            (item) =>
              item.price <=
              parseFloat(
                maxPrice
              )
          );
        console.log(
          `After max price filter: ${filtered.length} items`
        );
      }

      // Filter by search term
      if (searchTerm) {
        filtered =
          filtered.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(
                  searchTerm.toLowerCase()
                ) ||
              item.description
                .toLowerCase()
                .includes(
                  searchTerm.toLowerCase()
                )
          );
        console.log(
          `After search filter: ${filtered.length} items`
        );
      }

      // Sort items
      filtered.sort(
        (a, b) => {
          if (
            sortBy === "name"
          ) {
            return sortOrder ===
              "asc"
              ? a.name.localeCompare(
                  b.name
                )
              : b.name.localeCompare(
                  a.name
                );
          } else if (
            sortBy === "price"
          ) {
            return sortOrder ===
              "asc"
              ? a.price -
                  b.price
              : b.price -
                  a.price;
          }
          return 0;
        }
      );

      console.log(
        `Final filtered items: ${filtered.length}`
      );
      setFilteredItems(
        filtered
      );
    };

  const addToCart = async (
    itemId
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
                itemId,
                quantity: 1,
              }
            ),
          }
        );

      if (response.ok) {
        // Show a subtle notification instead of alert
        const notification =
          document.createElement(
            "div"
          );
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn";
        notification.textContent =
          "Item added to cart!";
        document.body.appendChild(
          notification
        );

        setTimeout(() => {
          notification.classList.add(
            "animate-fadeOut"
          );
          setTimeout(
            () =>
              document.body.removeChild(
                notification
              ),
            300
          );
        }, 2000);
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
          // Show error notification
          const notification =
            document.createElement(
              "div"
            );
          notification.className =
            "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn";
          notification.textContent =
            data.error ||
            "Failed to add item to cart";
          document.body.appendChild(
            notification
          );

          setTimeout(() => {
            notification.classList.add(
              "animate-fadeOut"
            );
            setTimeout(
              () =>
                document.body.removeChild(
                  notification
                ),
              300
            );
          }, 2000);
        }
      }
    } catch (error) {
      const notification =
        document.createElement(
          "div"
        );
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn";
      notification.textContent =
        "An error occurred while adding item to cart";
      document.body.appendChild(
        notification
      );

      setTimeout(() => {
        notification.classList.add(
          "animate-fadeOut"
        );
        setTimeout(
          () =>
            document.body.removeChild(
              notification
            ),
          300
        );
      }, 2000);
    }
  };

  // Function to handle image loading errors
  const handleImageError = (
    e,
    itemName
  ) => {
    const fallbackImage =
      fallbackImages[
        itemName
      ] ||
      fallbackImages.default;
    e.target.src =
      fallbackImage;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                ...Array(4),
              ].map(
                (_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-300 rounded"
                  ></div>
                )
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                ...Array(8),
              ].map(
                (_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                      </div>
                      <div className="h-10 bg-gray-300 rounded mt-4"></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Oops! Something
            went wrong
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {error}
          </p>
          <button
            onClick={
              fetchItems
            }
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our
            curated collection
            of high-quality
            products designed
            to enhance your
            lifestyle.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            {
              filteredItems.length
            }{" "}
            of {items.length}{" "}
            products
          </div>
        </div>

        {/* Filters */}
        <div className="bg-purple-100 text-black p-6 rounded-2xl shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* 🔍 Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Search
                Products
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                  value={
                    searchTerm
                  }
                  onChange={(
                    e
                  ) =>
                    setSearchTerm(
                      e.target
                        .value
                    )
                  }
                />
              </div>
            </div>

            {/* 🏷️ Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                  value={
                    selectedCategory
                  }
                  onChange={(
                    e
                  ) =>
                    setSelectedCategory(
                      e.target
                        .value
                    )
                  }
                >
                  {categories.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {
                          category
                        }
                      </option>
                    )
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 💰 Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Price Range
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={
                    minPrice
                  }
                  onChange={(
                    e
                  ) =>
                    setMinPrice(
                      e.target
                        .value
                    )
                  }
                />
                <span className="self-center text-gray-500">
                  -
                </span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={
                    maxPrice
                  }
                  onChange={(
                    e
                  ) =>
                    setMaxPrice(
                      e.target
                        .value
                    )
                  }
                />
              </div>
            </div>

            {/* 🔽 Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Sort By
              </label>
              <div className="flex space-x-3">
                <select
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                  value={
                    sortBy
                  }
                  onChange={(
                    e
                  ) =>
                    setSortBy(
                      e.target
                        .value
                    )
                  }
                >
                  <option value="name">
                    Name
                  </option>
                  <option value="price">
                    Price
                  </option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(
                      sortOrder ===
                        "asc"
                        ? "desc"
                        : "asc"
                    )
                  }
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {sortOrder ===
                  "asc"
                    ? "Z~A"
                    : "A~Z"}
                </button>
              </div>
            </div>
          </div>

          {/* 🔄 Reset */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setSelectedCategory(
                  "All"
                );
                setMinPrice(
                  ""
                );
                setMaxPrice(
                  ""
                );
                setSearchTerm(
                  ""
                );
                setSortBy(
                  "name"
                );
                setSortOrder(
                  "asc"
                );
              }}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredItems.length ===
        0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products
              found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find
              any products
              matching your
              criteria. Try
              adjusting your
              filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(
                  "All"
                );
                setMinPrice(
                  ""
                );
                setMaxPrice(
                  ""
                );
                setSearchTerm(
                  ""
                );
              }}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Clear All
              Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(
              (item) => (
                <div
                  key={
                    item._id
                  }
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(
                        e
                      ) =>
                        handleImageError(
                          e,
                          item.name
                        )
                      }
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white text-purple-600 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                        {
                          item.category
                        }
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {
                        item.name
                      }
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                      {
                        item.description
                      }
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        ₹
                        {
                          item.price
                        }
                      </span>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-500 ml-1">
                          4.8
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        addToCart(
                          item._id
                        )
                      }
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
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
        )}
      </div>

      {/* Add custom animations to global CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(
              -10px
            );
          }
          to {
            opacity: 1;
            transform: translateY(
              0
            );
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(
              0
            );
          }
          to {
            opacity: 0;
            transform: translateY(
              -10px
            );
          }
        }
        .animate-fadeIn {
          animation: fadeIn
            0.3s ease-out
            forwards;
        }
        .animate-fadeOut {
          animation: fadeOut
            0.3s ease-in
            forwards;
        }
      `}</style>
    </div>
  );
}
