import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/product-slice";
import ShoppingProductTile from "./product-tile";
import { X } from "lucide-react";

const ShoppingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails, loading, error, productList } = useSelector(
    (state) => state.shopProducts
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800">
        Loading product...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );
  if (!productDetails)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Product not found
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* Dialog Box */}
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-90 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="p-6 md:p-10">
          {/* Product Info */}
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={productDetails.image || ""}
              alt={productDetails.title || "Product"}
              className="w-full md:w-1/3 h-64 md:h-96 object-contain rounded-lg border border-gray-200 shadow-sm"
            />
            <div className="flex-1 flex flex-col gap-4">
              <h1 className="text-4xl font-extrabold text-gray-900">
                {productDetails.title}
              </h1>
              <p className="text-gray-800">{productDetails.description}</p>

              {/* Category, Brand, Rating */}
              <div className="flex flex-wrap gap-3 mt-2">
                {productDetails.category && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                    Category: {productDetails.category}
                  </span>
                )}
                {productDetails.brand && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                    Brand: {productDetails.brand}
                  </span>
                )}
                {productDetails.rating !== undefined && (
                  <span className="bg-yellow-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                    Rating: {productDetails.rating.toFixed(1)} / 5
                  </span>
                )}
              </div>

              <p className="text-3xl font-bold mt-4 text-gray-900">
                ${productDetails.salePrice || productDetails.price || 0}
              </p>

              <Link
                to="/shop/listing"
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
              >
                Back to Products
              </Link>
            </div>
          </div>

          {/* Recommended Products */}
          {productList?.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-900">
                You may also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {productList
                  .filter((p) => p._id !== productDetails._id)
                  .slice(0, 8)
                  .map((product) => (
                    <ShoppingProductTile key={product._id} product={product} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingDetail;
