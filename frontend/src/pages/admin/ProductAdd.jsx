import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    useCreateProductMutation,
    useUploadProductImageMutation
} from '../../redux/slices/productsApiSlice';

const ProductAdd = () => {
    const [name, setName] = useState('');
    const [priceMonthly, setPriceMonthly] = useState(0);
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const navigate = useNavigate();

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        const files = Array.from(e.target.files);
        files.forEach((file) => formData.append('images', file));

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            // Append newly uploaded images to the existing list
            setImages([...images, ...res.images]);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createProduct({
                name,
                priceMonthly,
                priceDaily: Math.ceil(Number(priceMonthly) / 30),
                images,
                category,
                description,
                stock,
                isActive,
            }).unwrap();
            toast.success('Product completely created');
            navigate('/admin/products');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Add New Product</h1>
                <Link to="/admin/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded-md">Go Back</Link>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-700">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 text-zinc-900 border focus:ring-zinc-900 focus:border-zinc-900" placeholder="e.g. Minimalist Oak Chair" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Monthly Price (₹)</label>
                        <input type="number" value={priceMonthly} onChange={(e) => setPriceMonthly(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 text-zinc-900 border focus:ring-zinc-900 focus:border-zinc-900" />
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-zinc-700">Daily Price (₹)</label>
                        <input type="number" value={priceDaily} onChange={(e) => setPriceDaily(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 text-zinc-900 border focus:ring-zinc-900 focus:border-zinc-900" />
                    </div> */}
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700">Images</label>
                    <input type="text" value={images.join(', ')} onChange={(e) => setImages(e.target.value.split(',').map(s=>s.trim()))} className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 text-zinc-900 border focus:ring-zinc-900 focus:border-zinc-900" placeholder="Enter image URLs or upload below" />
                    <div className="mt-3">
                        <input type="file" multiple onChange={uploadFileHandler} className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200" />
                        {loadingUpload && <p className="text-xs text-blue-500 mt-2">Uploading...</p>}
                    </div>
                    {images.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto p-2 border rounded-md">
                            {images.map((imgUrl, idx) => (
                                <img key={idx} src={imgUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md shadow-sm" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Category Name</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 text-zinc-900 border focus:ring-zinc-900 focus:border-zinc-900" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Stock Count</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 text-zinc-900 border focus:ring-zinc-900 focus:border-zinc-900" />
                    </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-50 p-4 border rounded-md">
                    <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-5 w-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                    <label htmlFor="isActive" className="text-sm font-medium text-zinc-700 cursor-pointer">Product is Active (Visible on Storefront)</label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700">Description</label>
                    <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 text-zinc-900 border focus:ring-zinc-900 focus:border-zinc-900"></textarea>
                </div>

                <button type="submit" disabled={loadingCreate} className="bg-zinc-900 text-white px-6 py-2 rounded-md font-medium hover:bg-zinc-800 transition-colors">
                    {loadingCreate ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductAdd;
