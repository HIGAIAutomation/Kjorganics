import ProductForm from '../ProductForm';
import axiosInstance from '../../../../utils/axiosInstance';

export default function NewProductPage() {
  // Handler to add a new product
  const handleAddProduct = async (formData: any) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images' && Array.isArray(formData[key])) {
          formData[key].forEach((image: any) => {
            data.append('images', image);
          });
        } else {
          data.append(key, formData[key]);
        }
      });
      await axiosInstance.post('/product', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product added successfully');
      window.history.back();
    } catch (error: any) {
      alert(error?.customMessage || 'Failed to add product');
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
    <ProductForm
      onSubmit={handleAddProduct}
      onClose={handleClose}
    />
  );
}
