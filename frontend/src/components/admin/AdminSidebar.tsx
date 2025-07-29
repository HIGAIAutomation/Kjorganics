'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ChartBarIcon,
  CogIcon,
  CubeIcon as BoxIcon,
  TagIcon,
  CurrencyRupeeIcon,
  GiftIcon,
  ShoppingCartIcon,
  FireIcon,
  StarIcon,
  SparklesIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';

type MenuItem = {
  name: string;
  href: string;
  icon?: any;
  subItems?: MenuItem[];
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems: MenuItem[] = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: HomeIcon 
    },
    { 
      name: 'Products', 
      href: '/admin/products', 
      icon: BoxIcon,
      subItems: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add Product', href: '/admin/products/add' },
        { name: 'Featured Products', href: '/admin/products/featured' },
        { name: 'Trending Products', href: '/admin/products/trending' }
      ]
    },
    { 
      name: 'Categories', 
      href: '/admin/categories', 
      icon: TagIcon 
    },
    { 
      name: 'Orders', 
      href: '/admin/orders', 
      icon: ShoppingBagIcon,
      subItems: [
        { name: 'All Orders', href: '/admin/orders' },
        { name: 'Pending', href: '/admin/orders/pending' },
        { name: 'Processing', href: '/admin/orders/processing' },
        { name: 'Shipped', href: '/admin/orders/shipped' },
        { name: 'Delivered', href: '/admin/orders/delivered' }
      ]
    },
    { 
      name: 'Customers', 
      href: '/admin/customers', 
      icon: UsersIcon 
    },
    { 
      name: 'Payments', 
      href: '/admin/payments', 
      icon: CurrencyRupeeIcon 
    },
    { 
      name: 'Coupons', 
      href: '/admin/coupons', 
      icon: GiftIcon 
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: ChartBarIcon,
      subItems: [
        { name: 'Sales Overview', href: '/admin/analytics/sales' },
        { name: 'Customer Insights', href: '/admin/analytics/customers' },
        { name: 'Product Performance', href: '/admin/analytics/products' }
      ]
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: CogIcon,
      subItems: [
        { name: 'General', href: '/admin/settings' },
        { name: 'Payment Methods', href: '/admin/settings/payments' },
        { name: 'Shipping', href: '/admin/settings/shipping' }
      ]
    },
  ];

  return (
    <aside className={`bg-white shadow-md ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {isOpen && <h2 className="text-xl font-semibold">Admin Panel</h2>}
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? '←' : '→'}
          </button>
        </div>
      </div>

      <nav className="mt-4">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon className={`h-5 w-5 mr-3 ${pathname === item.href ? 'text-indigo-600' : 'text-gray-400'}`} />
                {isOpen && <span>{item.name}</span>}
              </Link>

              {isOpen && item.subItems && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`
                        flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                        ${pathname === subItem.href ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}
                      `}
                    >
                      {/* Only render icon if subItem.icon exists */}
                      {subItem.icon ? (
                        <subItem.icon className="h-4 w-4 mr-2" />
                      ) : (
                        <span className="w-4 mr-2 inline-block" />
                      )}
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
