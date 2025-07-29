import { useEffect, useState } from 'react';
import ProductForm from '../../ProductForm';
import axiosInstance from "../../../../../utils/axiosInstance";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/product/${params.id}`).then(res => {
      setInitialData(res.data.data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!initialData) return <div>Product not found</div>;

  // Handler to update the product
  const handleEditProduct = async (formData: any) => {
    try {
      const data = new FormData();
      // Separate new files and existing image URLs
      (formData.images || []).forEach((img: any) => {
        if (typeof img === 'string') {
          data.append('existingImages', img); // send existing URLs
        } else {
          data.append('images', img); // send new files
        }
      });
      // Append other fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          data.append(key, formData[key]);
        }
      });
      await axiosInstance.put(`/product/${params.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product updated successfully');
      // Optionally, redirect or refresh
    } catch (error) {
      alert('Failed to update product');
    }
  };

  // Handler to close the form (navigate back or similar)
  const handleClose = () => {
    window.history.back();
  };

  return (
    <ProductForm
      initialData={initialData}
      onSubmit={handleEditProduct}
      onClose={handleClose}
    />
  );
}
