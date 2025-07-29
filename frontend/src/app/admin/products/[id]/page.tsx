'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import  axiosInstance  from '../../../../utils/axiosInstance';
import {
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  stock: number;
  status: 'active' | 'inactive';
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface SalesData {
  totalSales: number;
  monthlyRevenue: number[];
  monthlySales: number[];
}

export default function ProductDetail({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, salesRes] = await Promise.all([
          axiosInstance.get(`/products/${productId}`),
          axiosInstance.get(`/products/${productId}/sales`),
        ]);

        setProduct(productRes.data);
        setSalesData(salesRes.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/admin/products/${productId}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PencilIcon className="h-5 w-5" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Product Information */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Product Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Category
              </label>
              <p className="mt-1">{product.category.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Price
              </label>
              <p className="mt-1">${product.price.toFixed(2)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Stock
              </label>
              <p className="mt-1">{product.stock} units</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Status
              </label>
              <span
                className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.status}
              </span>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="mt-1">{product.description}</p>
            </div>
          </div>

          {/* Product Images */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Product Images
            </label>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className="h-32 w-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sales Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Analytics</h2>
          
          {salesData && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500">
                  Total Sales
                </label>
                <p className="text-2xl font-semibold text-indigo-600">
                  {salesData.totalSales}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500">
                  Revenue (Last 30 Days)
                </label>
                <p className="text-2xl font-semibold text-green-600">
                  ${salesData.monthlyRevenue[0]?.toFixed(2) || '0.00'}
                </p>
              </div>

              {/* Add Chart.js component here for sales trends */}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
            <p>
              Are you sure you want to delete {product.name}? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
