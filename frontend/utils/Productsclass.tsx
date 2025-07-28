"use client";

import React, { Component } from "react";

interface Product {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  unit: "g" | "kg" | "ml" | "ltr" | "pack" | "box";
  unitQuantity: number;
  type: "veg" | "non-veg" | "egg" | "vegan";
  category: string;
  ingredients?: string[];
  images?: string[];
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
          currentImageIndex: (prevState.currentImageIndex + 1) % images.length,
        }));
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
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

  getTypeIndicator(type: string) {
    const map: Record<string, string> = {
      veg: "bg-green-600",
      "non-veg": "bg-red-600",
      egg: "bg-yellow-500",
      vegan: "bg-emerald-500",
    };
    return map[type.toLowerCase()] || "bg-gray-400";
  }

  render() {
    const { product, onAddToCart } = this.props;
    const {
      name,
      price,
      discountPrice,
      unit,
      unitQuantity,
      stock,
      images = [],
      isTrending,
      isNew,
      type,
    } = product;

    const { currentImageIndex, quantity } = this.state;
    const totalPrice = (quantity * (discountPrice ?? price)).toFixed(2);
    const dotColor = this.getTypeIndicator(type);

    return (
      <div className="max-w-sm w-full bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 flex flex-col relative">
        {/* Image Section */}
        <div className="relative w-full h-60 bg-gray-50 flex items-center justify-center overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[currentImageIndex]}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span className="text-gray-400 text-lg font-semibold">{name}</span>
          )}

          {/* Type Dot */}
          <div
            className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border border-white shadow ${dotColor}`}
            title={type}
          ></div>

          {/* "New" Badge */}
          {isNew && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 font-bold rounded-full z-10">
              New
            </span>
          )}

          {isTrending && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm z-10">
              TRENDING
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Product Name */}
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {name}
          </h3>

          {/* Price Block */}
          <div className="text-green-700 font-bold text-md flex items-center gap-2">
            {discountPrice ? (
              <>
                <span className="line-through text-gray-500 text-sm">
                  ₹{price}
                </span>
                <span className="text-lg text-green-600">₹{discountPrice}</span>
              </>
            ) : (
              <span className="text-lg">₹{price}</span>
            )}
            <span className="text-sm text-gray-500">
              / {unitQuantity}
              {unit}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={this.handleDecrease}
                className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
                disabled={quantity <= 1}
              >
                –
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={this.handleIncrease}
                className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
                disabled={quantity >= stock}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">In Stock: {stock}</span>
          </div>

          {/* Total & Add to Cart */}
          <div className="mt-3">
            <p className="text-sm text-gray-700 mb-2">
              Total:{" "}
              <span className="font-bold text-gray-900">₹{totalPrice}</span>
            </p>
            <button
              onClick={() => onAddToCart(product, quantity)}
              className="w-full bg-green-800 hover:bg-green-950 text-white py-2 rounded-lg transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCard;
