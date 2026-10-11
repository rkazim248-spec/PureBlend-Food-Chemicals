'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { RFQModal } from '@/components/forms/RFQModal';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '@/data/mockData';
import { PackageSearch, FileText } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [userCategory, setUserCategory] = useState<string | null>(null);
  const selectedCategory = userCategory !== null ? userCategory : (categoryParam || 'all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRfqOpen, setIsRfqOpen] = useState<boolean>(false);

  const categoriesList = useMemo(() => CATEGORIES_DATA.map((c) => c.name), []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCode = product.code.toLowerCase().includes(query);
        const matchesCas = product.casNumber.toLowerCase().includes(query);
        const matchesIns = product.insNumber.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesCas && !matchesIns && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Grade filter
      if (selectedGrade !== 'all' && product.grade !== selectedGrade) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'code') return a.code.localeCompare(b.code);
      // featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, selectedGrade, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setUserCategory('all');
    setSelectedGrade('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Products Catalogue' }]} />

        {/* Page Header */}
        <div className="my-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-green">
              Technical Food Ingredients
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight mt-1">
              Food Chemicals & Specialty Ingredients Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text mt-1.5 max-w-2xl leading-relaxed">
              Industrial grade Food Chemicals Codex (FCC) acidulants, antimicrobial preservatives, hydrocolloids, and leavening phosphates for commercial manufacturing lines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRfqOpen(true)}
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Request Custom Quote (RFQ)
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => {
            setUserCategory(c);
            setCurrentPage(1);
          }}
          selectedGrade={selectedGrade}
          onGradeChange={(g) => {
            setSelectedGrade(g);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
          categories={categoriesList}
          totalResults={filteredProducts.length}
        />

        {/* Product Cards Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          <EmptyState
            icon={<PackageSearch className="w-7 h-7 text-forest" />}
            title="No Matching Ingredients Found"
            description="No items match your active search terms or category filters. Check spelling, clear filters, or request custom ingredient sourcing."
            action={
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsRfqOpen(true)}>
                  Submit Sourcing Inquiry
                </Button>
              </div>
            }
          />
        )}
      </div>

      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </PublicLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <PublicLayout>
          <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-secondary-text">
            Loading products catalogue...
          </div>
        </PublicLayout>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

