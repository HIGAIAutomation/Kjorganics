// src/components/Footer.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoImg from "../utils/KJ_Organics_Logo.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A5724] text-white pt-12">
      {/* Main content wrapper for consistent padding and max-width */}
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        {/* Grid for Information, Company, Support, Follow Us */}
        <div className="grid grid-cols-1 md:ml-24 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-sm pb-8">
          {/* Column 1: Information */}
          <div className="col-span-1">
            <h3 className="font-semibold uppercase mb-4 tracking-wide">
              Information
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/delivery-time"
                  className="hover:underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-sm transition-opacity duration-200"
                  aria-label="Delivery Time Information"
                >
                  Delivery Time
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="col-span-1">
            <h3 className="font-semibold uppercase mb-4 tracking-wide">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="hover:underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-sm transition-opacity duration-200"
                  aria-label="About Us"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/secure-payment"
                  className="hover:underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-sm transition-opacity duration-200"
                  aria-label="Secure Payment Methods"
                >
                  Secure payment
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-sm transition-opacity duration-200"
                  aria-label="Terms of Service"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="col-span-1">
            <h3 className="font-semibold uppercase mb-4 tracking-wide">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="hover:underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-sm transition-opacity duration-200"
                  aria-label="Frequently Asked Questions"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-sm transition-opacity duration-200"
                  aria-label="Contact Us"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us - Corrected SVG attributes */}
          <div className="col-span-1">
            <h3 className="font-semibold uppercase mb-4 tracking-wide">
              Follow Us
            </h3>
            <div className="flex items-center gap-4">
              {/* Facebook Icon Link */}
              <Link
                href="https://facebook.com/kjorganics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-md transition-opacity duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                >
                  <title>Facebook</title>
                  <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29h-3.128V11.12h3.128V8.62c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.92c-1.5 0-1.793.715-1.793 1.763v2.31h3.584l-.465 3.58H16.56V24h6.115c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"></path>
                </svg>
              </Link>

              {/* Instagram Icon Link */}
              <Link
                href="https://instagram.com/kjorganics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-md transition-opacity duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                >
                  <title>Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path>
                </svg>
              </Link>

              {/* X (Twitter) Icon Link */}
              <Link
                href="https://x.com/kjorganics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-md transition-opacity duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                >
                  <title>X</title>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </Link>

              {/* WhatsApp Icon Link - IMPORTANT: Corrected clip-rule and fill-rule */}
              <Link
                href="https://wa.me/your-number" // Replace 'your-number' with actual WhatsApp number
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A5724] focus:ring-white rounded-md transition-opacity duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                >
                  <title>WhatsApp</title>
                  <path
                    d="M12.04 2.01A10.03 10.03 0 0 0 2.01 12.04a10.03 10.03 0 0 0 10.03 10.03 10.03 10.03 0 0 0 10.03-10.03c0-5.52-4.51-10.03-10.03-10.03zm0 0c-.01 0-.01 0 0 0zm4.5 14.45c-.2-.1-.72-.36-1.09-.5s-.42-.2-.6-.35-.36-.35-.5-.5a.5.5 0 0 1 .15-.55c.1-.1.2-.2.3-.35a.44.44 0 0 0 .1-.35c0-.1-.05-.2-.1-.25s-.1-.15-.2-.2c-.05-.05-.1-.05-.15-.05h-.1c-.05 0-.1 0-.15.05s-.2.2-.55.65c-.2.25-.35.45-.45.55s-.2.15-.3.15h-.1c-.1 0-.25-.05-.35-.1s-.45-.45-1.1-1c-.4-.4-.7-.85-.9-1.2-.1-.15-.1-.25 0-.35s.1-.15.2-.2c.1 0 .15-.05.2-.05h.1c.05 0 .1 0 .15.05s.1.05.15.1c.05.1.1.15.1.25s.05.2.05.25c0 .1-.05.2-.1.25s-.1.1-.15.15c-.05.05-.1.05-.15.05h-.05c-.1 0-.2-.05-.25-.1s-.5-.55-.7-1.1c-.2-.55-.25-.95-.25-1.2s.25-.5.35-.6c.1-.05.25-.1.35-.1h.3c.1 0 .2 0 .25.05s.35.15.5.35c.15.2.2.4.25.55s.05.3.05.45v.2c0 .1 0 .2-.05.3s-.1.15-.15.2c-.05.05-.1.05-.15.05h-.1c-.05 0-.1 0-.15-.05s-.1-.05-.1-.1c0-.1-.05-.25-.2-.45-.1-.15-.2-.25-.25-.25s-.1 0-.15.05c-.05 0-.1.05-.15.1s-.1.1-.1.15c0 .05.05.15.15.3s.15.2.2.3c.05.1.1.15.15.25.25.35.5.7.85 1.1.55.65 1.02 1 1.57 1.2.2.1.35.1.5.1h.1c.15 0 .35-.05.5-.15s.3-.2.4-.35c.1-.1.15-.25.2-.4s.1-.3.1-.45c0-.15-.05-.3-.05-.4s-.1-.25-.15-.35c-.05-.1-.1-.15-.1-.25s0-.15.05-.2c.05-.05.1-.1.15-.1s.1-.05.15-.05h-.1c.1 0 .2.05.35.15s.2.2.25.35c.05.15.05.3.05.5s-.1.45-.15.6z"
                    clipRule="evenodd" // Corrected from clip-rule
                    fillRule="evenodd" // Corrected from fill-rule
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        {/* Added px-4 md:px-0 to control padding consistently */}
        <div className="mt-12 text-sm leading-relaxed space-y-4 px-4 md:px-0">
          <p>
            <strong>
              Buy Regional Famous Sweets, Snacks, Candies, & More At KJ Organics:
            </strong>{" "}
            Tamilnadu's Premier Online Shopping Website. KJ Organics facilitates
            South Indian people to shop sweets, snacks, candies, chocolates, and
            groceries from its authentic region. We get it all delivered to your
            doorstep within 5 days. We make people taste the regional famous
            delicacies of Tamilnadu for their cravings.
          </p>
          <p>
            <strong>Traditional Online Shopping: Fresh and Safe</strong>
            <br />
            KJ Organics is your one-stop destination for all your regional famous
            cravings. We maintain the freshness of our products with our 48 hours
            procurement process. All sweets and snacks are packed in air-tight
            pouches to maintain the freshness and deliver products safely.
          </p>
          <p>
            <strong>KJ Organics: The Authentic Online Store</strong>
            <br />
            Explore and shop on the go to taste the authentic specialties of
            Tamilnadu from your home. Each and every delicacy listed on
            KJOrganics.com is a hand-picked collection, sourced from its authentic
            region.
          </p>
          <p>
            <strong>KJ Organics Store: Support Our Traditional Taste</strong>
            <br />
            We, KJ Organics, have tied up with 15+ vendors who are famous for
            their handmade preparation of sweets and snacks for decades. Most of
            the regions in Tamilnadu are famous for their heritage preparation of
            sweets like Halwa in Tirunelveli, Palkova in Srivilliputhur, etc.
            These iconic sweets play a vital role among the people in those
            regions. We enable those rural vendors to sell preparations globally.
            Support us with your regular orders which will directly improve the
            livelihood of these vendors.
          </p>
        </div>
      </div> {/* End of max-w-7xl mx-auto px-4 md:px-8 */}

      {/* BOTTOM BAR - Full width background, inner content centered and padded */}
      <div className="bg-[#154a1e] mt-12 py-6 w-full">
        {/* Inner container for alignment and max-width */}
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
            {/* Address */}
            <div>
              <p className="font-semibold">REGISTERED OFFICE:</p>
              <address className="not-italic mt-1 text-sm">
                KJOrganics.com,
                <br />
                Sankar Nagar, Tirunelveli,
                <br />
                Tamilnadu - 627357, India.
              </address>
            </div>

            {/* #VOCALFORLOCAL - Centered on mobile, pushes to middle on desktop */}
            <p className="text-xl font-bold tracking-wide">
              #VOCALFORLOCAL
            </p>

            {/* Logo */}
            <div className="flex justify-center md:justify-end"> {/* Centered on mobile, aligned right on desktop */}
              <Image
                src={LogoImg}
                alt="KJ Organics Logo"
                width={100}
                height={100}
                priority={false}
                // Removed className="mr-2" as it could cause misalignment. Padding handled by parent flex/spacing.
              />
            </div>
          </div>
          <div className="mt-6 border-t border-white/20 pt-4 text-center text-xs">
            © {currentYear} KJ Organics. All rights reserved.
          </div>
        </div> {/* End of inner max-w-7xl mx-auto px-4 md:px-8 */}
      </div>
    </footer>
  );
};

export default Footer;