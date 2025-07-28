"use client";

import React from "react";
import ProductCard from "../../utils/Productsclass"; // USES: ProductCard class component
import Header from "../../components/Header";
import Footer from "../../components/Footer"

// Mock product data (replace with actual data from your backend / DB)
const newProducts = [
  {
    name: "Mint Herbal Detox Powder",
    price: 10,
    discountPrice: 2, // This must be a valid number less than price
    stock: 20,
    unit: "g" as const,
    unitQuantity: 200,
    isNew: true,
    isTrending: true,
    type: "veg" as const,
    category: "category1",
    images: [
      // IMAGES: replace with your Cloudinary URLs
      "https://www.sweetkadai.com/514-large_default/omapodi.jpg",
      "https://www.sweetkadai.com/514-large_default/omapodi.jpg",
    ],
  },
  {
    name: "GreenLeaf Boost",
    price: 12,
    stock: 25,
    unit: "g" as const,
    unitQuantity: 200,
    type: "veg" as const,
    category: "category2",
    images: [
      // IMAGES: replace with your Cloudinary URLs
      "https://www.sweetkadai.com/514-large_default/omapodi.jpg",
    ],
  },
];

const trendingProducts = [
  {
    name: "Berry Glow Face Mask",
    price: 13,
    discountPrice:5,
    stock: 30,
    unit: "g" as const,
    unitQuantity: 200,
    type: "vegan" as const,
    category: "category3",
    images: [
      // IMAGES: replace with your Cloudinary URLs
      "https://www.sweetkadai.com/514-large_default/omapodi.jpg",
    ],
  },
];

const snackProducts = [
  {
    name: "Organic Nut Juice Elixir",
    price: 14,
    stock: 15,
    unit: "ml" as const,
    unitQuantity: 500,
    type: "veg" as const,
    category: "category4",
    images: [
      // IMAGES: replace with your Cloudinary URLs
      "https://www.sweetkadai.com/514-large_default/omapodi.jpg",
    ],
  },
];

const ProductsPage: React.FC = () => {
  const handleAddToCart = (product: any, quantity: number) => {
    console.log("Added to cart:", product.name, "Qty:", quantity);
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-[#f8fdf5]">
     
      {/* Hero Banner */}
      <section className="w-full">
        <img
          src="https://res.cloudinary.com/demo/image/upload/hero-banner.jpg" // IMAGES: replace with your Cloudinary hero banner URL
          alt="Hero Banner"
          className="w-full h-64 object-cover"
        />
      </section>

      {/* New Products */}
      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-green-800">New Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {newProducts.map((product, index) => (
            <ProductCard key={index} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      {/* Promo Banners */}
      <section className="px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <img
          src="https://res.cloudinary.com/demo/image/upload/promo1.jpg" // IMAGES: replace
          alt="Promo 1"
          className="rounded-lg"
        />
        <img
          src="https://res.cloudinary.com/demo/image/upload/promo2.jpg" // IMAGES: replace
          alt="Promo 2"
          className="rounded-lg"
        />
        <img
          src="https://res.cloudinary.com/demo/image/upload/promo3.jpg" // IMAGES: replace
          alt="Promo 3"
          className="rounded-lg"
        />
      </section>

      {/* Trending Products */}
      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Trending Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trendingProducts.map((product, index) => (
            <ProductCard key={index} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      {/* Snacks Products */}
      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Snacks Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {snackProducts.map((product, index) => (
            <ProductCard key={index} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default ProductsPage;