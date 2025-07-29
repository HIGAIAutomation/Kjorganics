"use client";
import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import ProductForm from '../../admin/products/ProductForm';
import ProductTable from '../../../components/admin/ProductTable';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../../../store';
import { setProducts, setLoading } from '../../../slices/productsSlice';

function AdminProductsInner() {
  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.products.products);
  const loading = useSelector((state: any) => state.products.loading);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get('/product');
      dispatch(setProducts(response.data.data || []));
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          productData[key].forEach((image: any) => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });
      await axiosInstance.post('/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Product added successfully');
      fetchProducts();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async (productId: any, productData: any) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images' && Array.isArray(productData[key])) {
          productData[key].forEach((image: any) => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });
      await axiosInstance.put(`/product/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Product updated successfully');
      fetchProducts();
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: any) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await axiosInstance.delete(`/product/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products Management</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Product
        </button>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProductForm
              initialData={editingProduct}
              onSubmit={
                editingProduct
                  ? ((formData: any) => handleEditProduct(editingProduct.id, formData))
                  : handleAddProduct
              }
              onClose={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEditClick}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
}

export default function AdminProducts() {
  return (
    <Provider store={store}>
      <AdminProductsInner />
    </Provider>
  );
}
