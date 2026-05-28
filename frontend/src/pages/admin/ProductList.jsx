import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
    useGetProductsQuery, 
    useDeleteProductMutation,
    useCreateProductMutation 
} from '../../redux/slices/productsApiSlice';

const ProductList = () => {
    const { data: products, isLoading, error, refetch } = useGetProductsQuery({ isAdmin: 'true' });
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Products Management</h1>
                <Link to="/admin/product/new" className="bg-zinc-900 text-white px-4 py-2 rounded-md font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            {loadingDelete && <div className="text-zinc-500">Deleting...</div>}
            
            {isLoading ? (
                <div className="text-zinc-500 animate-pulse">Loading products...</div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-500 rounded-md">Error connecting: {error?.error || "Cannot load products"}</div>
            ) : (
                <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-zinc-200">
                    <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">ID</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">IMAGE</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">NAME</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">PRICE (/MO)</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">STOCK</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500 font-mono text-xs">{product._id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <img src={product.images[0]} alt={product.name} className="h-10 w-10 object-cover rounded-md border border-zinc-200" />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">{product.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500">₹{product.priceMonthly}</td>
                                    <td className={`whitespace-nowrap px-6 py-4 font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.stock > 0 ? product.stock : 'Out of Stock'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 space-x-4">
                                        <Link to={`/admin/product/${product._id}/edit`} className="text-blue-600 hover:text-blue-800 transition-colors inline-block">
                                            <Edit size={18} />
                                        </Link>
                                        <button onClick={() => deleteHandler(product._id)} className="text-red-500 hover:text-red-700 transition-colors inline-block">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">No products found. Start by adding one.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;
