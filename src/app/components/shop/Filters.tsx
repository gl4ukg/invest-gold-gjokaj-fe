"use client";

import React from 'react';
import { useTranslations } from "next-intl";
import { Category } from "@/app/types/category.types";
import { FaFilter } from "react-icons/fa";

interface FiltersProps {
  categories: Category[];
  selectedCategory: string[];
  handleCategoryChange: (categoryId: string) => void;
  filters: { sortOrder: "ASC" | "DESC" };
  handleFilterChange: (newFilters: { sortOrder: "ASC" | "DESC" }) => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (open: boolean) => void;
}

export default function Filters({
  categories,
  selectedCategory,
  handleCategoryChange,
  filters,
  handleFilterChange,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
}: FiltersProps) {
  const t = useTranslations();

  return (
    <aside className="w-full md:w-64 md:mr-8">
      {/* Mobile filter dialog */}
      <button
        type="button"
        className="inline-flex items-center md:hidden mb-4 px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
      >
        <FaFilter className="mr-2 h-5 w-5" />
        {t("shop.filters")}
      </button>

      <div
        className={`${
          isMobileFiltersOpen ? "block" : "hidden"
        } md:block space-y-6`}
      >
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-darkGray">
            {t("shop.categories")}
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  selectedCategory.includes(category.id!)
                    ? "bg-primary/10 shadow-md"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <input
                      type="checkbox"
                      name="category"
                      checked={selectedCategory.includes(category.id!)}
                      onChange={() => handleCategoryChange(category.id!)}
                      className="appearance-none w-4 h-4 rounded border-2 border-darkGray 
                               checked:border-primary checked:bg-primary checked:border-0
                               transition-all duration-200 cursor-pointer 
                               focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div
                      className={`absolute inset-0 rounded transition-transform duration-200 
                                ${
                                  selectedCategory.includes(category.id!)
                                    ? "scale-100 opacity-100"
                                    : "scale-0 opacity-0"
                                }`}
                    >
                      <div className="absolute inset-0 rounded bg-primary/10 animate-pulse"></div>
                    </div>
                  </div>
                  <span
                    className={`font-medium transition-colors duration-200 ${
                      selectedCategory.includes(category.id!)
                        ? "text-primary"
                        : "text-darkGray group-hover:text-primary"
                    }`}
                  >
                    {category.name}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-darkGray">
            {t("shop.sortBy")}
          </h3>
          <select
            value={filters.sortOrder}
            onChange={(e) =>
              handleFilterChange({
                sortOrder: e.target.value as "ASC" | "DESC",
              })
            }
            className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lightGray"
          >
            <option value="DESC">{t("shop.newest")}</option>
            <option value="ASC">{t("shop.oldest")}</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
