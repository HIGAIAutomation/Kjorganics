'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  unit: 'g' | 'kg' | 'ml' | 'ltr' | 'pack' | 'box';
  unitQuantity: string;
  type: 'veg' | 'non-veg' | 'egg' | 'vegan';
  ingredients: string[];
  images: File[];
  isVisible: boolean;
  isTrending: boolean;
  isNewProduct: boolean;
  isSnack: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string };
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => Promise<void> | void | ((id: string, formData: ProductFormData) => Promise<void> | void);
}

const defaultFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  unit: 'g',
  unitQuantity: '',
  type: 'veg',
  ingredients: [],
  images: [],
  isVisible: true,
  isTrending: false,
  isNewProduct: false,
  isSnack: false,
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ProductFormData>(initialData || defaultFormData);
  type ProductFormErrors = {
    [K in keyof ProductFormData]?: string;
  };
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData || defaultFormData);
    setPreviewImages(initialData && (initialData as any).images ? (initialData as any).images : []);
  }, [initialData]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof ProductFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (!formData.unitQuantity) newErrors.unitQuantity = 'Unit quantity is required';
    if (!formData.type) newErrors.type = 'Product type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (initialData && initialData.id) {
        await (typeof onSubmit === 'function' ? onSubmit(formData) : Promise.resolve());
      } else {
        await (typeof onSubmit === 'function' ? onSubmit(formData) : Promise.resolve());
      }
      onClose();
    } catch (error) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          {initialData ? 'Edit Product' : 'Create New Product'}
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`} />
            {errors.name && (<p className="mt-1 text-sm text-red-600">{errors.name}</p>)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (<p className="mt-1 text-sm text-red-600">{errors.description}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            {errors.category && (<p className="mt-1 text-sm text-red-600">{errors.category}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleInputChange} 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            >
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="egg">Egg</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input 
                type="number" 
                name="unitQuantity" 
                value={formData.unitQuantity} 
                onChange={handleInputChange} 
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <select 
                name="unit" 
                value={formData.unit} 
                onChange={handleInputChange} 
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="ltr">Liters (ltr)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleInputChange} 
              step="0.01"
              min="0"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && (<p className="mt-1 text-sm text-red-600">{errors.price}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleInputChange} 
              min="0"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.stock ? 'border-red-500' : ''}`}
            />
            {errors.stock && (<p className="mt-1 text-sm text-red-600">{errors.stock}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm">{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients.splice(index, 1);
                      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                    }}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add ingredient and press Enter"
                className="flex-1 min-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      setFormData(prev => ({
                        ...prev,
                        ingredients: [...prev.ingredients, value]
                      }));
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input type="file" name="images" accept="image/*" multiple onChange={handleImageChange} className="mt-1 block w-full" />
            <div className="flex flex-wrap mt-2">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative mr-2 mb-2">
                  <img src={img} alt="Preview" className="w-16 h-16 object-cover rounded" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Status</label>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
                <input 
                  type="checkbox" 
                  name="isVisible" 
                  checked={formData.isVisible} 
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Visible</span>
                  <p className="text-xs text-gray-500">Show this product in the store</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
                <input 
                  type="checkbox" 
                  name="isTrending" 
                  checked={formData.isTrending} 
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Trending</span>
                  <p className="text-xs text-gray-500">Mark as a trending product</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
                <input 
                  type="checkbox" 
                  name="isNewProduct" 
                  checked={formData.isNewProduct} 
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">New Product</span>
                  <p className="text-xs text-gray-500">Show in new arrivals</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
                <input 
                  type="checkbox" 
                  name="isSnack" 
                  checked={formData.isSnack} 
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Snack</span>
                  <p className="text-xs text-gray-500">Mark as a snack item</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;

