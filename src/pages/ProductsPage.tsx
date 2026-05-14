import React, { useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X, Grid2X2, List } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/product/ProductCard";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discount" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: Infinity },
];

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const saleOnly = searchParams.get("sale") === "true";
  const sortParam = searchParams.get("sort") || "relevance";

  const [sortBy, setSortBy] = useState(sortParam);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOpen, setSortOpen] = useState(false);

  // Gather unique brands
  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), []);
  // Sizes are rendered inline in the filter panel

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sale filter
    if (saleOnly) {
      result = result.filter((p) => p.discount >= 40);
    }

    // Price range
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Sizes
    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;
    }

    return result;
  }, [category, searchQuery, saleOnly, selectedPriceRange, selectedBrands, selectedSizes, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedPriceRange(null);
    setSelectedBrands([]);
    setSelectedSizes([]);
  };

  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : saleOnly
    ? "Sale - Up to 70% Off"
    : category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";

  const activeFilterCount = (selectedPriceRange !== null ? 1 : 0) + selectedBrands.length + selectedSizes.length;

  const FilterPanel = () => (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-20 bg-white border rounded-md overflow-hidden">
        {/* Filter header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-sm">FILTERS</span>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-[#e31837] font-medium hover:underline">
              Clear All ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Price */}
        <div className="p-4 border-b">
          <h4 className="text-sm font-semibold mb-3">PRICE RANGE</h4>
          <div className="space-y-2">
            {PRICE_RANGES.map((range, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === idx}
                  onChange={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                  className="accent-[#e31837]"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="p-4 border-b">
          <h4 className="text-sm font-semibold mb-3">BRANDS</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="accent-[#e31837]"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-3">SIZES</h4>
          <div className="flex flex-wrap gap-2">
            {["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34"].map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "w-10 h-10 text-xs border rounded-md transition-all",
                  selectedSizes.includes(size)
                    ? "bg-[#e31837] text-white border-[#e31837]"
                    : "border-gray-200 hover:border-[#e31837] text-gray-600"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <p className="text-xs text-gray-500">
            Home / {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Products"}
            {searchQuery && ` / Search: "${searchQuery}"`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{filteredProducts.length} products</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              className="md:hidden flex items-center gap-1.5 text-sm border rounded-md px-3 py-2 font-medium"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {/* Sort */}
            <div className="relative">
              <button
                className="flex items-center gap-1.5 text-sm border rounded-md px-3 py-2 font-medium bg-white"
                onClick={() => setSortOpen(!sortOpen)}
              >
                Sort by: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <ChevronDown size={16} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-30 min-w-[200px]">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={cn(
                        "block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50",
                        sortBy === option.value ? "text-[#e31837] font-medium" : "text-gray-700"
                      )}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View mode */}
            <div className="hidden md:flex border rounded-md overflow-hidden">
              <button
                className={cn("p-2", viewMode === "grid" ? "bg-[#e31837] text-white" : "bg-white text-gray-500")}
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 size={16} />
              </button>
              <button
                className={cn("p-2", viewMode === "list" ? "bg-[#e31837] text-white" : "bg-white text-gray-500")}
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedBrands.map((b) => (
              <span key={b} className="flex items-center gap-1 bg-[#e31837]/10 text-[#e31837] text-xs px-2.5 py-1 rounded-full">
                {b}
                <button onClick={() => toggleBrand(b)}><X size={12} /></button>
              </span>
            ))}
            {selectedSizes.map((s) => (
              <span key={s} className="flex items-center gap-1 bg-[#e31837]/10 text-[#e31837] text-xs px-2.5 py-1 rounded-full">
                Size: {s}
                <button onClick={() => toggleSize(s)}><X size={12} /></button>
              </span>
            ))}
            {selectedPriceRange !== null && (
              <span className="flex items-center gap-1 bg-[#e31837]/10 text-[#e31837] text-xs px-2.5 py-1 rounded-full">
                {PRICE_RANGES[selectedPriceRange].label}
                <button onClick={() => setSelectedPriceRange(null)}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <div className="hidden md:block">
            <FilterPanel />
          </div>

          {/* Mobile Filters overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                  <span className="font-bold">Filters</span>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={20} />
                  </button>
                </div>
                <FilterPanel />
                <div className="p-4 sticky bottom-0 bg-white border-t">
                  <Button className="w-full" onClick={() => setShowFilters(false)}>
                    Apply Filters ({filteredProducts.length} results)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">😔</p>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "flex flex-col gap-4"
                )}
              >
                {filteredProducts.map((product) => (
                  viewMode === "grid" ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <div key={product.id} className="flex gap-4 bg-white border rounded-md p-4 hover:shadow-md transition-shadow">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-28 h-36 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase font-medium">{product.brand}</p>
                        <p className="font-medium text-gray-900 mt-0.5">{product.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold">₹{product.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                          <span className="text-sm text-[#e31837] font-medium">{product.discount}% off</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
