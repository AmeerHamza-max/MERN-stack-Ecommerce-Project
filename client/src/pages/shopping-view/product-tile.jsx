import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { useNavigate } from "react-router-dom";

function ShoppingProductTile({ product, onRate }) {
  const isOnSale = !!product?.salePrice;
  const brandLabel = brandOptionsMap[product?.brand] || product?.brand || "Unknown";
  const categoryLabel = categoryOptionsMap[product?.category] || product?.category || "General";

  const [rating, setRating] = useState(product?.rating || 0);
  const [hovered, setHovered] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setRating(product?.rating || 0);
  }, [product?.rating]);

  const handleRate = (newRating) => {
    setRating(newRating);
    if (onRate) onRate(product?._id || product?.id, newRating);
  };

  const renderStars = () =>
    [...Array(5)].map((_, i) => {
      const index = i + 1;
      const filled = index <= (hovered || rating);
      return (
        <button
          key={index}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => handleRate(index)}
          className="focus:outline-none"
        >
          <Star
            size={14}
            className={filled ? "fill-amber-400 text-amber-400" : "text-gray-600"}
          />
        </button>
      );
    });

  return (
    <div
      onClick={() => navigate(`/shop/product/${product._id}`)}
      className="cursor-pointer w-full bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-gray-700"
    >
      {/* Product Image */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-800 flex items-center justify-center">
        <img
          src={product?.image}
          alt={product?.title || "Product"}
          className="w-auto h-full object-contain p-1 sm:p-2 transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {isOnSale && (
          <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-1 py-0.5 rounded-full shadow-md">
            SALE
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 flex flex-col flex-1 justify-between">
        {/* Category & Brand */}
        <div className="flex flex-wrap gap-1 mb-1 text-[10px] sm:text-xs">
          <span className="bg-gray-800 text-gray-300 font-medium px-2 py-0.5 rounded-md">{categoryLabel}</span>
          <span className="bg-gray-800 text-gray-300 font-medium px-2 py-0.5 rounded-md">{brandLabel}</span>
        </div>

        {/* Title + Rating */}
        <div className="flex items-center justify-between gap-2 mb-1 text-sm font-semibold">
          <h3 className="flex-1 line-clamp-1 text-gray-100">{product?.title}</h3>
          <div className="flex items-center gap-1">{renderStars()}</div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {isOnSale ? (
            <>
              <span className="text-amber-400 font-bold text-sm sm:text-base">${product.salePrice}</span>
              <span className="text-gray-500 line-through text-xs sm:text-sm">${product.price}</span>
            </>
          ) : (
            <span className="text-gray-100 font-bold text-sm sm:text-base">${product?.price}</span>
          )}
        </div>

        {/* Buy Button */}
        <div className="flex justify-center mt-4">
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 sm:px-6 py-2 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;
