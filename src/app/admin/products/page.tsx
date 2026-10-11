'use client';

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, ProductGrade } from '@/types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { compressAndResizeImage } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle,
  Package,
  Layers
} from 'lucide-react';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    code: '',
    category: 'Acidulants',
    casNumber: '',
    insNumber: '',
    grade: 'FCC (Food Grade)',
    shortDescription: '',
    description: '',
    appearance: 'White crystalline powder',
    chemicalFormula: '',
    molecularWeight: '',
    purity: '≥ 99.0%',
    shelfLife: '24 Months',
    storageCondition: 'Cool, dry warehouse storage.',
    minOrderQuantity: '1,000 kg',
    standardLeadTime: '5 – 7 Business Days',
    packagingOptions: ['25 kg kraft bags with PE liner', '1,000 kg FIBC totes'],
    applications: ['Industrial food processing', 'Beverage acidification'],
    certifications: ['FCC Compliant', 'ISO 22000', 'Halal', 'Kosher'],
    stockStatus: 'In Stock'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.casNumber.toLowerCase().includes(q) ||
          p.insNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      code: `PB-${Math.floor(10 + Math.random() * 90)}`,
      category: 'Acidulants',
      casNumber: '',
      insNumber: '',
      grade: 'FCC (Food Grade)',
      shortDescription: '',
      description: '',
      appearance: 'White crystalline powder',
      chemicalFormula: '',
      molecularWeight: '',
      purity: '≥ 99.5%',
      shelfLife: '24 Months',
      storageCondition: 'Dry ambient warehouse storage.',
      minOrderQuantity: '1,000 kg',
      standardLeadTime: '5 Business Days',
      packagingOptions: ['25 kg kraft bags with poly liner'],
      applications: ['Commercial food manufacturing'],
      certifications: ['FCC 13', 'ISO 22000', 'Halal Certified', 'Kosher Certified'],
      stockStatus: 'In Stock'
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setFormErrors({});
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = 'Product name is required';
    if (!formData.code?.trim()) errs.code = 'Product code is required';
    if (!formData.casNumber?.trim()) errs.casNumber = 'CAS number is required';
    if (!formData.insNumber?.trim()) errs.insNumber = 'INS number is required';
    if (!formData.purity?.trim()) errs.purity = 'Assay purity is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? ({ ...p, ...formData } as Product) : p
        )
      );
      showToast({
        title: 'Product Updated',
        description: `${formData.name} specifications updated in catalog.`,
        type: 'success'
      });
      setEditingProduct(null);
    } else {
      // Create new
      const newId = formData.name!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newProduct: Product = {
        ...formData,
        id: newId,
        packagingOptions: formData.packagingOptions || ['25 kg bags'],
        applications: formData.applications || ['Food processing'],
        certifications: formData.certifications || ['FCC Standard']
      } as Product;

      setProducts((prev) => [newProduct, ...prev]);
      showToast({
        title: 'New Product Registered',
        description: `${formData.name} added to catalog.`,
        type: 'success'
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    showToast({
      title: 'Product Deleted',
      description: `${deletingProduct.name} removed from catalog.`,
      type: 'warning'
    });
    setDeletingProduct(null);
  };

  const handleToggleStock = (id: string, current: string) => {
    const nextStatus = current === 'In Stock' ? 'Limited Stock' : 'In Stock';
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockStatus: nextStatus as any } : p))
    );
    showToast({
      title: 'Inventory Status Changed',
      description: `Stock level updated to "${nextStatus}"`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            Catalogue Database
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Product Inventory Management
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Maintain technical monographs, chemical identifiers, assay purity limits, and stock availability.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Food Chemical
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-border-subtle p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search SKUs by name, code, CAS, INS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="sm:w-64">
          <Select
            options={[
              { value: 'all', label: 'All Categories' },
              ...CATEGORIES_DATA.map((c) => ({ value: c.name, label: c.name }))
            ]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-border-subtle shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-white border-b border-border-subtle text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Ingredient Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">CAS / INS</th>
                <th className="py-3 px-4">Assay Purity</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-warm-white/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-forest">
                    {product.code}
                  </td>
                  <td className="py-3 px-4 font-bold text-charcoal">
                    {product.name}
                    <span className="block text-[11px] font-normal text-secondary-text">{product.grade}</span>
                  </td>
                  <td className="py-3 px-4 text-secondary-text">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-secondary-text">
                    {product.insNumber} · {product.casNumber}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-charcoal">
                    {product.purity}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(product.id, product.stockStatus)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge variant={product.stockStatus === 'In Stock' ? 'success' : 'warning'}>
                        {product.stockStatus}
                      </Badge>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 text-secondary-text hover:text-forest hover:bg-slate-100 rounded transition-colors"
                      title="Edit specifications"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(product)}
                      className="p-1.5 text-secondary-text hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete SKU"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? `Edit Monograph: ${editingProduct.name}` : 'Register New Food Chemical SKU'}
        subtitle="Ensure chemical identifiers and assay limits match official manufacturer Certificates of Analysis."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ingredient Common Name"
              required
              placeholder="e.g. Sodium Erythorbate Crystalline"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
            <Input
              label="Product SKU Code"
              required
              placeholder="e.g. PB-AO-09"
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              error={formErrors.code}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              options={CATEGORIES_DATA.map((c) => ({ value: c.name, label: c.name }))}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            />
            <Input
              label="CAS Registry"
              required
              placeholder="e.g. 6381-77-7"
              value={formData.casNumber || ''}
              onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
              error={formErrors.casNumber}
            />
            <Input
              label="INS / E-Number"
              required
              placeholder="e.g. INS 316"
              value={formData.insNumber || ''}
              onChange={(e) => setFormData({ ...formData, insNumber: e.target.value })}
              error={formErrors.insNumber}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Pharmacopeial Grade"
              options={[
                { value: 'FCC (Food Grade)', label: 'FCC (Food Grade)' },
                { value: 'USP Grade', label: 'USP Grade' },
                { value: 'BP Grade', label: 'BP Grade' }
              ]}
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
            />
            <Input
              label="Assay Purity Standard"
              required
              placeholder="e.g. 98.0% – 100.0%"
              value={formData.purity || ''}
              onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
              error={formErrors.purity}
            />
            <Select
              label="Stock Availability"
              options={[
                { value: 'In Stock', label: 'In Stock' },
                { value: 'Limited Stock', label: 'Limited Stock' },
                { value: 'Contract Basis Only', label: 'Contract Basis Only' }
              ]}
              value={formData.stockStatus}
              onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Chemical Formula"
              placeholder="e.g. C6H7NaO6·H2O"
              value={formData.chemicalFormula || ''}
              onChange={(e) => setFormData({ ...formData, chemicalFormula: e.target.value })}
            />
            <Input
              label="Molecular Weight"
              placeholder="e.g. 216.12 g/mol"
              value={formData.molecularWeight || ''}
              onChange={(e) => setFormData({ ...formData, molecularWeight: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Product Image / Background Asset (URL or File Upload)
            </label>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="https://... or /images/products/..."
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="flex-1"
              />
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-[#F0F4F1] hover:bg-[#E2ECE7] text-forest text-xs font-semibold rounded border border-[#D8E2DC] transition-colors shrink-0">
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const compressedDataUrl = await compressAndResizeImage(file, 1000, 1000, 0.85);
                      setFormData({ ...formData, imageUrl: compressedDataUrl });
                      showToast({
                        title: 'Image Compressed & Uploaded',
                        description: `${file.name} optimized and loaded successfully.`,
                        type: 'success'
                      });
                    } catch {
                      showToast({
                        title: 'Upload Error',
                        description: 'Failed to compress or read image file.',
                        type: 'error'
                      });
                    }
                  }}
                />
              </label>
            </div>
            {formData.imageUrl && (
              <div className="mt-2 flex items-center gap-2">
                <div className="relative w-12 h-12 rounded border border-border-subtle overflow-hidden bg-warm-white">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[11px] text-secondary-text">Preview loaded image asset</span>
              </div>
            )}
          </div>

          <Textarea
            label="Monograph Technical Description"
            rows={2}
            placeholder="Describe origin, functional role, solubility, and preservation mechanism..."
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Save Monograph Changes' : 'Publish Product to Catalog'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Confirm SKU Removal"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded border border-red-200 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            <div>
              <strong className="block">Caution: Permanent Action</strong>
              <span>
                Removing <strong>{deletingProduct?.name}</strong> ({deletingProduct?.code}) will immediately unpublish its technical datasheet and disable incoming quote links.
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Yes, Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
