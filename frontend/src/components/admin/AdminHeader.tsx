'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear admin cookies
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'adminUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
