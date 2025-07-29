import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${params.id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/cart/add', {
        productId: product._id,
        quantity,
      });
      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      // Add to cart first
      await axiosInstance.post('/cart/add', {
        productId: product._id,
        quantity,
      });
      // Redirect to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Failed to proceed to checkout');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square w-full ${
                  selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="text-2xl font-bold">₹{product.price}</div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium">{product.category.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-medium">{product.type}</p>
              </div>
              <div>
                <p className="text-gray-600">Unit</p>
                <p className="font-medium">{product.unitQuantity} {product.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Stock</p>
                <p className="font-medium">{product.stock} available</p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-600">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
