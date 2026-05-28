import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { ChevronRight, Search, Star } from 'lucide-react';

const CollectionPage = () => {
    const [keyword, setKeyword] = useState('');
    const { data: products, isLoading, error } = useGetProductsQuery({ keyword });

    return (
        <div className="min-h-screen bg-brand-sand relative font-sans pt-12 pb-24">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center pb-10 border-b border-slate-200">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-navy mb-4">Complete Collection</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">Discover our entire catalog of premium furniture. Ready to elevate your space.</p>
                    
                    <div className="max-w-xl mx-auto relative flex items-center justify-center">
                        <div className="absolute left-4 text-slate-400">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search catalogue..."
                            className="w-full bg-white shadow-sm border border-slate-200 rounded-lg py-4 pl-12 pr-6 text-brand-navy font-medium focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-all"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-6 rounded-md text-center text-red-600 font-medium">
                        {error?.data?.message || error.error || "Cannot load catalogue at this time."}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="h-56 bg-slate-100 relative p-4 flex items-center justify-center">
                                    <img 
                                        src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                                        alt={product.name} 
                                        className={`h-full w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`} 
                                    />
                                    {product.stock <= 0 ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="bg-slate-900/80 text-white font-bold tracking-widest uppercase text-xs px-4 py-2 rounded shadow-md backdrop-blur-sm">Out of Stock</span>
                                        </div>
                                    ) : (
                                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                                            <Star size={12} className="text-brand-orange fill-brand-orange" /> {product.rating}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-brand-navy mb-1 truncate">{product.name}</h3>
                                    <p className="text-xs text-slate-500 mb-4">{product.category || 'Furniture'}</p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-0.5">Rent for</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-brand-navy">₹{product.priceMonthly}</span>
                                                <span className="text-xs text-slate-500">/mo</span>
                                            </div>
                                        </div>
                                        <button className="bg-brand-mint text-brand-teal p-2 rounded hover:bg-brand-teal hover:text-white transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                No products found in the active catalog.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
