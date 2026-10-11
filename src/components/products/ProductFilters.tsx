'use client';

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ProductCategory, ProductGrade } from '@/types';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  categories: string[];
  totalResults: number;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedGrade,
  onGradeChange,
  sortBy,
  onSortChange,
  onReset,
  categories,
  totalResults
}: ProductFiltersProps) {
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedGrade !== 'all';

  return (
    <div className="bg-white rounded-lg border border-border-subtle p-4 sm:p-5 mb-6 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search by product name, INS, CAS..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="pointer-events-auto p-1 hover:text-charcoal"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Category Filter */}
        <Select
          options={[
            { value: 'all', label: 'All Product Categories' },
            ...categories.map((c) => ({ value: c, label: c }))
          ]}
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        />

        {/* Grade Filter */}
        <Select
          options={[
            { value: 'all', label: 'All Quality Grades' },
            { value: 'FCC (Food Grade)', label: 'FCC (Food Grade)' },
            { value: 'USP Grade', label: 'USP Grade' },
            { value: 'BP Grade', label: 'BP Grade' }
          ]}
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
        />

        {/* Sort Control */}
        <Select
          options={[
            { value: 'featured', label: 'Sort: Featured First' },
            { value: 'name-asc', label: 'Sort: Name (A–Z)' },
            { value: 'name-desc', label: 'Sort: Name (Z–A)' },
            { value: 'code', label: 'Sort: Product Code' }
          ]}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        />
      </div>

      {/* Filter Stats & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle text-xs text-secondary-text">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-charcoal">{totalResults}</span>
          <span>{totalResults === 1 ? 'ingredient item matches criteria' : 'ingredient items match criteria'}</span>
          {hasActiveFilters && (
            <span className="text-primary-green font-medium">(Filtered)</span>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs h-7 text-secondary-text hover:text-charcoal"
            leftIcon={<X className="w-3 h-3" />}
          >
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}
