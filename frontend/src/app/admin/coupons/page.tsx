'use client';

import { useState, useEffect } from 'react';
import  axiosInstance  from '../../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
}

interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  minPurchase: string;
  maxDiscount: string;
  validFrom: string;
  validUntil: string;
  usageLimit: string;
  description: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState<CouponFormData>({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    description: '',
  });
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/coupons');
      setCoupons(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch coupons';
      toast.error(errorMessage);
      setCoupons([]); // Reset coupons on error
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const now = new Date();
    const validFrom = new Date(newCoupon.validFrom);
    const validUntil = new Date(newCoupon.validUntil);

    if (!newCoupon.code.trim()) {
      toast.error('Coupon code is required');
      return false;
    }

    if (Number(newCoupon.discountValue) <= 0) {
      toast.error('Discount value must be greater than 0');
      return false;
    }

    if (newCoupon.discountType === 'percentage' && Number(newCoupon.discountValue) > 100) {
      toast.error('Percentage discount cannot be greater than 100%');
      return false;
    }

    if (validFrom > validUntil) {
      toast.error('Valid from date must be before valid until date');
      return false;
    }

    if (validUntil < now) {
      toast.error('Valid until date must be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const couponData = {
        ...newCoupon,
        code: newCoupon.code.toUpperCase().trim(),
        discountValue: Number(newCoupon.discountValue),
        minPurchase: newCoupon.minPurchase ? Number(newCoupon.minPurchase) : 0,
        maxDiscount: newCoupon.maxDiscount ? Number(newCoupon.maxDiscount) : undefined,
        usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : undefined,
      };

      if (editingCoupon) {
        await axiosInstance.put(`/coupons/${editingCoupon._id}`, couponData);
        toast.success('Coupon updated successfully');
      } else {
        await axiosInstance.post('/coupons', couponData);
        toast.success('Coupon added successfully');
      }
      resetForm();
      fetchCoupons();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
        (editingCoupon ? 'Failed to update coupon' : 'Failed to add coupon');
      toast.error(errorMessage);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minPurchase: String(coupon.minPurchase),
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : '',
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
      description: coupon.description || '',
    });
  };

  const handleDelete = async (couponId: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/coupons/${couponId}`);
      if (response.status === 200) {
        toast.success('Coupon deleted successfully');
        setCoupons(coupons.filter(coupon => coupon._id !== couponId)); // Optimistic update
      } else {
        throw new Error('Failed to delete coupon');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete coupon';
      toast.error(errorMessage);
      // Refresh the list in case of error
      fetchCoupons();
    }
  };

  const resetForm = () => {
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      validFrom: '',
      validUntil: '',
      usageLimit: '',
      description: '',
    });
    setEditingCoupon(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Coupon Management</h1>

      {/* Coupon Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              value={newCoupon.discountType}
              onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Value</label>
            <input
              type="number"
              value={newCoupon.discountValue}
              onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Purchase</label>
            <input
              type="number"
              value={newCoupon.minPurchase}
              onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Discount</label>
            <input
              type="number"
              value={newCoupon.maxDiscount}
              onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
            <input
              type="number"
              value={newCoupon.usageLimit}
              onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valid From</label>
            <input
              type="date"
              value={newCoupon.validFrom}
              onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valid Until</label>
            <input
              type="date"
              value={newCoupon.validUntil}
              onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={newCoupon.description}
            onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
          </button>
          {editingCoupon && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Coupons Table */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code / Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage / Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{coupon.code}</div>
                    {coupon.description && (
                      <div className="text-sm text-gray-500">{coupon.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {coupon.minPurchase > 0 && `Min: ₹${coupon.minPurchase}`}
                      {coupon.maxDiscount > 0 && ` | Max: ₹${coupon.maxDiscount}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>From: {new Date(coupon.validFrom).toLocaleDateString('en-IN')}</div>
                      <div>Until: {new Date(coupon.validUntil).toLocaleDateString('en-IN')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm">
                        {coupon.usedCount} / {coupon.usageLimit || '∞'} used
                      </div>
                      <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${new Date(coupon.validUntil) > new Date() 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'}`}>
                        {new Date(coupon.validUntil) > new Date() ? (
                          <><FiCheck className="w-3 h-3 mr-1" /> Active</>
                        ) : (
                          <><FiX className="w-3 h-3 mr-1" /> Expired</>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="inline-flex items-center text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No coupons found. Create your first coupon to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
