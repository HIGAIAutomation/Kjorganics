'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit: 'g' | 'kg' | 'ml' | 'ltr' | 'pack' | 'box';
  unitQuantity: number;
  type: 'veg' | 'non-veg' | 'egg' | 'vegan';
  category: {
    _id: string;
    name: string;
  };
  ingredients?: string[];
  images?: string[];
  isVisible: boolean;
  isTrending?: boolean;
  isNewProduct?: boolean;
  isSnack?: boolean;
}

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    isVisible: '',
    minPrice: '',
    maxPrice: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/category/all');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.isVisible) queryParams.append('isVisible', filters.isVisible);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const response = await axiosInstance.get(`/product?${queryParams}`);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, filters]);

  const handleBulkAction = async (action: 'delete' | 'show' | 'hide') => {
    try {
      await axiosInstance.post('/product/bulk', {
        action,
        productIds: selectedProducts,
      });
      const response = await axiosInstance.get('/product');
      setProducts(response.data.data);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
      </div>

      {/* Search and Filter Card */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 space-y-6">
          {/* Search */}
          <div className="max-w-2xl">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search by name, description, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Product Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Types</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="egg">Egg</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                id="visibility"
                value={filters.isVisible}
                onChange={(e) => setFilters((prev) => ({ ...prev, isVisible: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Status</option>
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="sm:flex sm:items-center p-6 border-b">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold leading-6 text-gray-900">Product List</h2>
            <p className="mt-2 text-sm text-gray-700">
              A list of all products in your store with their details and actions.
            </p>
          </div>
          {selectedProducts.length > 0 && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2">
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <TrashIcon className="h-4 w-4 mr-1.5" />
                Delete
              </button>
              <button
                onClick={() => handleBulkAction('show')}
                className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Show
              </button>
              <button
                onClick={() => handleBulkAction('hide')}
                className="flex items-center px-3 py-2 bg-yellow-600 text-white text-sm font-semibold rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Hide
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={(e) =>
                      setSelectedProducts(e.target.checked ? products.map((p) => p._id) : [])
                    }
                  />
                </th>
                <th className="text-left px-6 py-3">Product Details</th>
                <th className="text-left px-6 py-3">Category & Type</th>
                <th className="text-left px-6 py-3">Quantity & Price</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => toggleProductSelection(product._id)}
                    />
                  </td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    {product.images && product.images.length > 0 && typeof product.images[0] === 'string' ? (
                      <img src={product.images[0]} className="h-12 w-12 object-cover rounded-full" alt={product.name} />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                        No Img
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.description || 'No description'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{product.category.name}</p>
                    <p className="text-sm text-gray-500">{product.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{product.unitQuantity} {product.unit}</p>
                    <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                    {product.isTrending && <span className="block text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Trending</span>}
                    {product.isNewProduct && <span className="block text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">New</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                        className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4 inline-block mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => router.push(`/admin/products/${product._id}`)}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
