"use client";

import React from 'react';
import { useTranslations } from "next-intl";

interface SearchBarProps {
  searchTerm: string;
  handleSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, handleSearchChange }: SearchBarProps) {
  const t = useTranslations();

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder={t("shop.searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}
