import { filterOptions } from "@/config";
import * as Label from "@radix-ui/react-label";
import React from "react";

function ProductFilter({ selectedFilters = {}, onFilterChange }) {

  const handleCheckboxChange = (categoryKey, optionId) => {
    const current = selectedFilters[categoryKey] || [];
    const updated = current.includes(optionId)
      ? current.filter(v => v !== optionId)
      : [...current, optionId];

    onFilterChange(categoryKey, updated);
  };

  return (
    <div className="bg-black text-gray-100 rounded-lg shadow-md border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold tracking-wide">Filters</h2>
      </div>

      <div className="p-4 space-y-6">
        {Object.keys(filterOptions).map(categoryKey => (
          <div key={categoryKey}>
            <h3 className="text-base font-semibold text-gray-200 capitalize border-b border-gray-800 pb-1 mb-2">
              {categoryKey}
            </h3>

            <div className="grid gap-2">
              {filterOptions[categoryKey].map(option => (
                <Label.Root
                  key={option.id}
                  className="flex items-center gap-2 text-gray-300 hover:text-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters[categoryKey]?.includes(option.id) || false}
                    onChange={() => handleCheckboxChange(categoryKey, option.id)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer bg-gray-900 border border-gray-700 rounded"
                  />
                  {option.label}
                </Label.Root>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
