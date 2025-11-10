import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { fetchAllProducts } from "@/store/shop/product-slice";
import ProductFilter from "./filter";
import ShoppingProductTile from "./product-tile";
import { ArrowUpDown, ChevronDown, SlidersHorizontal, X } from "lucide-react";

// ------------------------------
// Config: Sort Options
// ------------------------------
export const sortOptions = [
  { id: "price-lowtoHigh", label: "Price Low to High" },
  { id: "price-hightoLow", label: "Price High to Low" },
  { id: "newest", label: "Newest" },
  { id: "bestRated", label: "Best Rated" },
];

const STORAGE_KEY = "shoppingFilters";

const ShoppingListing = () => {
  const dispatch = useDispatch();
  const { productList, loading, error } = useSelector((state) => state.shopProducts);

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ category: [], brands: [] });
  const [selectedSort, setSelectedSort] = useState({ id: "", label: "Sort by" });
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // ------------------------------
  // Load filters and sort from sessionStorage or URL
  // ------------------------------
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const urlCategory = searchParams.get("category");
    const urlBrand = searchParams.get("brands");
    const urlSort = searchParams.get("sort");

    if (saved && !urlCategory && !urlBrand && !urlSort) {
      const parsed = JSON.parse(saved);
      setSelectedFilters(parsed.filters || { category: [], brands: [] });
      setSelectedSort(parsed.sort || { id: "", label: "Sort by" });
    } else {
      const category = urlCategory ? urlCategory.split(",") : [];
      const brands = urlBrand ? urlBrand.split(",") : [];
      const sort = urlSort
        ? sortOptions.find((s) => s.id === urlSort) || { id: "", label: "Sort by" }
        : { id: "", label: "Sort by" };
      setSelectedFilters({ category, brands });
      setSelectedSort(sort);
    }

    setFiltersLoaded(true);
  }, []);

  // ------------------------------
  // Sync URL changes
  // ------------------------------
  useEffect(() => {
    if (!filtersLoaded) return;
    const category = searchParams.get("category")?.split(",") || [];
    const brands = searchParams.get("brands")?.split(",") || [];
    const sort = searchParams.get("sort")
      ? sortOptions.find((s) => s.id === searchParams.get("sort")) || { id: "", label: "Sort by" }
      : { id: "", label: "Sort by" };

    setSelectedFilters({ category, brands });
    setSelectedSort(sort);
  }, [searchParams, filtersLoaded]);

  // ------------------------------
  // Fetch products on filter/sort change
  // ------------------------------
  useEffect(() => {
    if (!filtersLoaded) return;

    dispatch(
      fetchAllProducts({
        category: selectedFilters.category,
        brand: selectedFilters.brands,
        sortBy: selectedSort.id,
      })
    );
  }, [dispatch, selectedFilters, selectedSort, filtersLoaded]);

  // ------------------------------
  // Persist filters and sort to sessionStorage + URL
  // ------------------------------
  useEffect(() => {
    if (!filtersLoaded) return;

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ filters: selectedFilters, sort: selectedSort })
    );

    const params = new URLSearchParams();
    if (selectedFilters.category.length) params.set("category", selectedFilters.category.join(","));
    if (selectedFilters.brands.length) params.set("brands", selectedFilters.brands.join(","));
    if (selectedSort.id) params.set("sort", selectedSort.id);
    setSearchParams(params);
  }, [selectedFilters, selectedSort, filtersLoaded]);

  // ------------------------------
  // Helpers
  // ------------------------------
  const getPrice = (product) => product?.salePrice || product?.price || 0;
  const getRating = (product) => product?.rating || 0;

  // ------------------------------
  // Client-side filter + sort
  // ------------------------------
  const sortedAndFilteredProducts = useMemo(() => {
    if (!filtersLoaded || !productList?.length) return [];

    let filtered = productList.filter((product) => {
      const categoryMatch =
        !selectedFilters.category.length ||
        selectedFilters.category.includes(product.category?.toLowerCase());
      const brandMatch =
        !selectedFilters.brands.length ||
        selectedFilters.brands.includes(product.brand?.toLowerCase());
      return categoryMatch && brandMatch;
    });

    switch (selectedSort.label) {
      case "Price Low to High":
        filtered.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "Price High to Low":
        filtered.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "Newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Best Rated":
        filtered.sort((a, b) => getRating(b) - getRating(a));
        break;
      default:
        break;
    }

    return filtered;
  }, [productList, selectedFilters, selectedSort, filtersLoaded]);

  // ------------------------------
  // Event Handlers
  // ------------------------------
  const handleFilterChange = (filterType, optionIds) =>
    setSelectedFilters((prev) => ({ ...prev, [filterType]: optionIds }));

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortOpen(false);
  };

  // ------------------------------
  // Loading / Error
  // ------------------------------
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="relative flex flex-col md:grid md:grid-cols-[280px_1fr] gap-4 md:gap-6 p-4 md:p-6 bg-black text-gray-100 min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block">
        <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <>
          <div
            onClick={() => setFilterOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
          />
          <div className="fixed top-0 left-0 w-3/4 sm:w-2/3 max-w-xs h-full bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-3.5rem)] p-4">
              <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
            </div>
          </div>
        </>
      )}

      {/* Main Section */}
      <div className="bg-black border border-gray-800 rounded-lg shadow-sm w-full relative z-10">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-800 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex md:hidden items-center gap-1 bg-gray-900 border border-gray-700 text-gray-200 hover:bg-gray-800 px-3 py-1.5 rounded-md text-xs sm:text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              {selectedFilters.category.length
                ? selectedFilters.category.join(", ").toUpperCase()
                : "All Products"}
            </h2>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 relative">
            <span className="text-xs sm:text-sm text-gray-400">
              {sortedAndFilteredProducts.length} products
            </span>
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1 border border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>{selectedSort.label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-2 w-40 sm:w-44 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSortSelect(option)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedAndFilteredProducts.map((product) => (
            <Link key={product._id} to={`/shop/product/${product._id}`}>
              <ShoppingProductTile product={product} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListing;
