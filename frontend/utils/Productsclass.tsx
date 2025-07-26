"use clientside"

import React, { Component } from "react";

interface Product {
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit: "g" | "kg" | "ml" | "ltr" | "pack" | "box";
  unitQuantity: number;
  type: "veg" | "non-veg" | "egg" | "vegan";
  category: string; // category ID
  ingredients?: string[];
  images?: string[]; // Cloudinary URLs
  isVisible?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isSnack?: boolean;
}

interface ProductProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

interface ProductState {
  currentImageIndex: number;
  quantity: number;
}

class ProductCard extends Component<ProductProps, ProductState> {
  intervalId?: NodeJS.Timeout;

  constructor(props: ProductProps) {
    super(props);
    this.state = {
      currentImageIndex: 0,
      quantity: 1,
    };
  }

  componentDidMount() {
    const { images = [] } = this.props.product;
    if (images.length > 1) {
      this.intervalId = setInterval(() => {
        this.setState((prevState) => ({
          currentImageIndex:
            (prevState.currentImageIndex + 1) % images.length,
        }));
      }, 10000); // 10 seconds
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  handleIncrease = () => {
    const { quantity } = this.state;
    const { stock } = this.props.product;
    if (quantity < stock) {
      this.setState({ quantity: quantity + 1 });
    }
  };

  handleDecrease = () => {
    const { quantity } = this.state;
    if (quantity > 1) {
      this.setState({ quantity: quantity - 1 });
    }
  };

  render() {
    const { product, onAddToCart } = this.props;
    const { name, price, unit, unitQuantity, images = [] } = product;
    const { currentImageIndex, quantity } = this.state;

    const totalPrice = (quantity * price).toFixed(2);

    return (
      <div className="max-w-xs bg-white shadow-lg rounded-lg p-4 flex flex-col items-center gap-4">
        {/* Image Carousel or Product Name Fallback */}
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[currentImageIndex]}
              alt={name}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-500 text-lg font-semibold">{name}</span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-center">{name}</h3>

        {/* Price */}
        <p className="text-green-600 font-bold text-lg">
          ₹{price} <span className="text-gray-600 text-sm">/ {unitQuantity}{unit}</span>
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <button
            onClick={this.handleDecrease}
            className="px-3 py-1 bg-gray-200 rounded-md text-lg font-bold"
            disabled={quantity === 1}
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={this.handleIncrease}
            className="px-3 py-1 bg-gray-200 rounded-md text-lg font-bold"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <p className="text-gray-700">
          Total: <span className="font-bold">₹{totalPrice}</span>
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product, quantity)}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          + Add to Cart
        </button>
      </div>
    );
  }
}

export default ProductCard;