// src/components/Header.tsx
"use client"; // This is a Client Component due to interactive elements (mobile menu, search form, login state)

import Link from "next/link";
import Image from "next/image";
import LogoImg from "../utils/KJ_Organics_Logo.png"; // Assuming this path is correct


import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null); // Simulated login state

  // Simulate login/logout for demonstration
  const handleLoginToggle = () => {
    if (user) {
      setUser(null);
      alert("Logged out!");
    } else {
      setUser({ name: "Raja" }); // Example user name
      alert("Logged in as Raja!");
    }
    closeMobileMenu(); // Close menu after action
  };

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint in Tailwind
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="bg-[#154a1e] text-white w-full shadow-lg sticky top-0 z-50 transition-all duration-300 ease-in-out"
      role="banner"
    >
      {/* Top Bar: Logo, Search, User/Cart/Mobile-Toggle */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/*
          Removed flex-wrap from here, as elements are now strictly controlled for desktop.
          Vertical gap removed as items shouldn't wrap here anymore.
        */}

        {/* Logo and Brand */}
        <Link
          href="/"
          className="flex items-center space-x-3 flex-shrink-0"
          aria-label="KJ Organics Home"
        >
          <Image
            src={LogoImg}
            alt="KJ Organics Logo"
            width={60}
            height={60}
            priority
            className="rounded-full"
          />
          <span className="font-bold text-2xl tracking-wide uppercase whitespace-nowrap">
            KJ ORGANICS
          </span>
        </Link>

        {/* Right Section: Search, User/Cart Icons, Mobile Toggle */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Search Bar (Desktop) - Hidden on small, flexible on medium+ */}
          <form
            action="/search"
            method="get"
            className="hidden md:flex flex-1 max-w-sm" // max-w-sm to control length on desktop
            role="search"
          >
            <input
              type="text"
              name="q"
              placeholder="Search products..." // Shorter placeholder
              aria-label="Search products"
              className="w-full px-3 py-2 rounded-l-md bg-[#f8f8e8] text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="bg-green-600 px-3 rounded-r-md flex items-center justify-center hover:bg-green-700 transition-colors duration-200"
            >
              <FaSearch className="text-white text-base" />{" "}
              {/* Adjusted icon size */}
            </button>
          </form>

          {/* User and Cart Icons (Desktop Only - Conditional Rendering) */}
          <div className="hidden md:flex items-center space-x-5 flex-shrink-0 ml-4">
            {" "}
            {/* Added ml-4 for spacing from search */}
            {user ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200"
                  aria-label="My Account"
                >
                  <FaUser className="text-lg" />
                  <span className="text-base whitespace-nowrap">
                    Hi, {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLoginToggle}
                  className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 px-2 py-1 rounded"
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="text-base whitespace-nowrap">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200"
                  aria-label="Sign In or Register"
                >
                  <FaUser className="text-lg" />
                  <span className="text-base whitespace-nowrap">Sign in</span>
                </Link>
              </>
            )}
            <Link
              href="/cart"
              className="relative flex items-center hover:text-gray-200 transition-colors duration-200"
              aria-label="View Shopping Cart with 0 items"
            >
              <FaShoppingCart className="text-lg" />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center p-0.5">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button (Hamburger) and Cart Icon for Mobile */}
          <div className="flex items-center md:hidden space-x-4">
            {" "}
            {/* Adjusted spacing for mobile icons */}
            {/* Cart icon visible on mobile next to hamburger */}
            <Link
              href="/cart"
              className="relative flex items-center hover:text-gray-200 transition-colors duration-200"
              aria-label="View Shopping Cart"
            >
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0 {/* Dynamically updated cart item count */}
              </span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-white text-2xl focus:outline-none focus:ring-2 focus:ring-green-400 p-2 rounded"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>
      {/* Main Navigation Bar (Desktop) */}
    
      <nav
        className="hidden md:block bg-[#1A5724] text-sm md:text-base border-t border-[#1f6b2b]"
        role="navigation"
        aria-label="Main Store Navigation"
      >
        {/* The crucial change is flex-wrap on the ul */}
        <ul className="max-w-7xl mx-auto flex flex-wrap justify-start gap-x-4 md:gap-x-6 px-4 py-2 font-bold md:py-3">
          {/* Removed whitespace-nowrap from individual <li><Link> items */}
          <li>
            <Link href="/" className="hover:underline py-1 px-2">
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/traditional-food"
              className="hover:underline py-1 px-2"
            >
              TRADITIONAL FOOD
            </Link>
          </li>
          <li>
            <Link href="/oil-ghee" className="hover:underline py-1 px-2">
              OIL & GHEE
            </Link>
          </li>
          <li>
            <Link href="/organic" className="hover:underline py-1 px-2">
              ORGANIC
            </Link>
          </li>
          <li>
            <Link href="/malt" className="hover:underline py-1 px-2">
              MALT
            </Link>
          </li>
          <li>
            <Link
              href="/beauty-health-care"
              className="hover:underline py-1 px-2"
            >
              BEAUTY & HEALTH CARE
            </Link>
          </li>
          <li>
            <Link href="/product" className="hover:underline py-1 px-2">
              ALL PRODUCTS
            </Link>
          </li>
        </ul>
      </nav>
      {/* --- Mobile Navigation Menu (Overlay) --- */}
      <nav
        className={`fixed inset-0 bg-[#154a1e] z-40 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden flex flex-col`} /* Added flex flex-col for better layout */
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {/* Header of the mobile menu */}
        <div className="bg-[#1A5724] px-4 py-4 flex justify-between items-center shadow-md">
          <span className="text-xl font-bold">Menu</span>
          <button
            onClick={toggleMobileMenu}
            className="text-white text-3xl focus:outline-none focus:ring-2 focus:ring-green-400 p-2 rounded"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Search Bar (Mobile Only) */}
        <form
          action="/search"
          method="get"
          className="p-4 bg-[#1A5724] border-b border-[#1f6b2b] flex"
          role="search"
        >
          <input
            type="text"
            name="q"
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full px-4 py-2 rounded-l-md bg-[#f8f8e8] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            aria-label="Search"
            className="bg-green-600 px-4 rounded-r-md flex items-center justify-center hover:bg-green-700 transition-colors duration-200"
          >
            <FaSearch className="text-white text-lg" />
          </button>
        </form>

        {/* Main Menu Links */}
        <ul className="flex flex-col items-start space-y-2 text-xl mt-4 px-4 flex-grow overflow-y-auto">
          {" "}
          {/* Adjusted spacing and added scroll */}
          <li>
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="hover:underline py-2 block w-full border-b border-white/10"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/traditional-food"
              onClick={closeMobileMenu}
              className="hover:underline py-2 block w-full border-b border-white/10"
            >
              TRADITIONAL FOOD
            </Link>
          </li>
          <li>
            <Link
              href="/oil-ghee"
              onClick={closeMobileMenu}
              className="hover:underline py-2 block w-full border-b border-white/10"
            >
              OIL & GHEE
            </Link>
          </li>
          <li>
            <Link
              href="/organic"
              onClick={closeMobileMenu}
              className="hover:underline py-2 block w-full border-b border-white/10"
            >
              ORGANIC
            </Link>
          </li>
          <li>
            <Link
              href="/malt"
              onClick={closeMobileMenu}
              className="hover:underline py-2 block w-full border-b border-white/10"
            >
              MALT
            </Link>
          </li>
          <li>
            <Link
              href="/beauty-health-care"
              onClick={closeMobileMenu}
              className="hover:underline py-2 block w-full border-b border-white/10"
            >
              BEAUTY & HEALTH CARE
            </Link>
          </li>
          <li>
            <Link
              href="/product"
              onClick={closeMobileMenu}
              className="hover:underline py-2 block w-full border-b border-white/10"
            >
              ALL PRODUCTS
            </Link>
          </li>
        </ul>

        {/* User/Login Section (Mobile) - at the bottom of the menu */}
        <div className="mt-auto p-4 bg-[#1A5724] border-t border-[#1f6b2b] flex flex-col space-y-4">
          {user ? (
            <>
              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 text-lg hover:text-gray-200"
              >
                <FaUser className="text-xl" />
                <span>Hi, {user.name}</span>
              </Link>
              <button
                onClick={handleLoginToggle}
                className="flex items-center space-x-3 text-lg hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 px-3 py-2 rounded-md justify-start"
                aria-label="Logout"
              >
                <FaSignOutAlt className="text-xl" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 text-lg hover:text-gray-200"
              aria-label="Sign In or Register"
            >
              <FaUser className="text-xl" />
              <span>Sign in / Register</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
