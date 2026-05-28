import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../redux/slices/productsApiSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { ChevronLeft, ShoppingBag, Zap, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rentalDurationDays, setRentalDurationDays] = useState(30);

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

    const addToCartHandler = () => {
        const computedPrice = product.priceMonthly 
            ? (product.priceMonthly / 30) * rentalDurationDays 
            : product.priceDaily * rentalDurationDays;

        dispatch(addToCart({
            ...product,
            qty: Number(qty),
            rentalDurationDays: Number(rentalDurationDays),
            price: Math.round(computedPrice * qty)
        }));
        
        toast.success(`${product.name} added to your cart`);
    };

    const rentNowHandler = () => {
        addToCartHandler();
        navigate('/cart');
    };

    if (isLoading) return <div className="text-center mt-20 text-slate-500 font-medium animate-pulse">Loading Product Details...</div>;
    if (error) return <div className="text-center mt-20 text-red-500 font-medium">System Error: Cannot Fetch Details</div>;

    return (
        <div className="min-h-screen bg-brand-sand relative font-sans pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/collection" className="inline-flex items-center text-sm font-bold text-brand-teal hover:underline mb-6 transition-colors">
                    <ChevronLeft size={16} className="mr-1" /> Back to Collection
                </Link>

                <div className="bg-white flex flex-col lg:flex-row shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                    {/* Left: Product Image */}
                    <div className="lg:w-1/2 bg-slate-100 p-8 flex items-center justify-center relative min-h-[400px]">
                        <img 
                            src={product.images?.[0] || 'https://via.placeholder.com/600'} 
                            alt={product.name} 
                            className="w-full h-auto max-h-[500px] object-contain mix-blend-multiply"
                        />
                        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-sm font-bold text-slate-700 shadow-sm flex items-center gap-1">
                            <Star size={14} className="text-brand-orange fill-brand-orange" /> 
                            {product.rating > 0 ? product.rating.toFixed(1) : 'New'} 
                            <span className="text-slate-400 text-xs ml-1 font-normal">({product.numReviews} Reviews)</span>
                        </div>
                    </div>
                    
                    {/* Right: Product Details */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
                        <div className="uppercase tracking-widest text-brand-teal font-bold text-xs mb-3">
                            {product.category || 'Furniture'}
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4 leading-tight">{product.name}</h1>
                        
                        <p className="text-slate-600 mb-8 leading-relaxed whitespace-pre-wrap flex-1">
                            {product.description}
                        </p>

                        <div className="border-t border-slate-200 pt-8 mb-8">
                            <p className="text-sm text-slate-500 font-semibold mb-2">Rent it for</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-extrabold text-brand-navy">₹{product.priceMonthly}</span>
                                <span className="text-slate-500 font-medium mb-1">/ month</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Days)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium text-brand-navy" 
                                    value={rentalDurationDays} 
                                    min="1"
                                    onChange={(e) => setRentalDurationDays(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                                <select 
                                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium text-brand-navy appearance-none bg-white"
                                    value={qty} 
                                    onChange={(e) => setQty(e.target.value)}
                                >
                                    {[...Array(product.stock > 0 ? product.stock : 0).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                    {product.stock === 0 && <option value="0">Out of Stock</option>}
                                </select>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3">
                            <button 
                                onClick={addToCartHandler} 
                                disabled={product.stock === 0}
                                className="w-full flex items-center justify-center gap-2 bg-brand-mint text-brand-teal border border-brand-mint px-6 py-4 rounded font-bold hover:bg-[#D0EBE8] transition-colors disabled:opacity-50"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>
                            <button 
                                onClick={rentNowHandler}
                                disabled={product.stock === 0}
                                className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white px-6 py-4 rounded font-bold hover:bg-[#008A7B] transition-colors disabled:opacity-50"
                            >
                                <Zap size={20} />
                                Rent Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
