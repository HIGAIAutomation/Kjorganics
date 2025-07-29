import React from 'react';

interface ProductTableProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (productId: any) => Promise<void>;
}


const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  // Toggle handler for product flags
  const handleToggle = async (productId: string, flag: string, value: boolean) => {
    try {
      await fetch(`/api/product/${productId}/flag`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag, value }),
      });
      // Optionally: refetch products or optimistically update UI
      // (In admin page, this should be handled by parent after toggle)
      // Optionally: refetch products or optimistically update UI
    } catch (err) {
      alert('Failed to update flag');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Visible</th>
            <th className="px-4 py-2">Trending</th>
            <th className="px-4 py-2">New</th>
            <th className="px-4 py-2">Snack</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, idx) => (
            <tr key={product._id || idx}>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">₹{product.price}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2">{product.category?.name || '-'}</td>
              <td className="px-4 py-2 text-center">
                <input type="checkbox" checked={product.isVisible} onChange={e => handleToggle(product._id, 'isVisible', e.target.checked)} />
              </td>
              <td className="px-4 py-2 text-center">
                <input type="checkbox" checked={product.isTrending} onChange={e => handleToggle(product._id, 'isTrending', e.target.checked)} />
              </td>
              <td className="px-4 py-2 text-center">
                <input type="checkbox" checked={product.isNewProduct} onChange={e => handleToggle(product._id, 'isNewProduct', e.target.checked)} />
              </td>
              <td className="px-4 py-2 text-center">
                <input type="checkbox" checked={product.isSnack} onChange={e => handleToggle(product._id, 'isSnack', e.target.checked)} />
              </td>
              <td className="px-4 py-2">
                <button onClick={() => onEdit(product)} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                <button onClick={() => onDelete(product._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
