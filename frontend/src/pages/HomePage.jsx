import { useState } from 'react';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { ShoppingBag, ChevronRight, Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../redux/slices/apiSlice';

const HomePage = () => {
    const { data: products, isLoading, error } = useGetProductsQuery({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const heroProduct = products?.find(p => p.name.toLowerCase().includes('eames')) || products?.[0];

    const handleHeroCheckout = () => {
        if (heroProduct) {
            dispatch(addToCart({ 
                ...heroProduct, 
                qty: 1, 
                rentalDurationDays: 30, 
                price: heroProduct.priceMonthly 
            }));
            navigate('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand relative font-sans">
            
            {/* Hero Section - Solid Clean Look */}
            <div className="bg-brand-mint/50 pt-16 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="inline-block py-1 px-3 rounded-md bg-brand-navy text-white text-xs font-bold tracking-wider uppercase">
                                Awesome Furniture. Awesome Price.
                            </span>
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-brand-navy leading-tight">
                                Bring home the <br />
                                furniture you love.
                            </h1>
                            <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                                Rent premium, award-winning furniture on a monthly subscription. Zero commitment, total flexibility.
                            </p>
                            <div className="pt-4 flex items-center space-x-4">
                                <Link to="/collection" className="bg-brand-teal text-white px-8 py-4 rounded-md font-bold shadow-sm hover:bg-[#008A7B] transition-colors">
                                    Explore Packages
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image - Flat, No Glass */}
                        <div className="relative w-full cursor-pointer" onClick={handleHeroCheckout}>
                            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgb(0,0,0,0.08)] overflow-hidden relative group">
                                <div className="aspect-[4/3] bg-slate-100 p-8 flex items-center justify-center">
                                    <img 
                                        src={getImageUrl(heroProduct?.images?.[0]) || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
                                        alt={heroProduct?.name || "Hero Furniture"} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="absolute top-4 left-4 bg-brand-orange text-brand-navy font-bold px-3 py-1 text-sm rounded">
                                    Trending Now
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-slate-100 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-brand-navy text-xl">{heroProduct?.name || 'Loading...'}</p>
                                        <p className="text-brand-teal font-semibold">₹{heroProduct?.priceMonthly || '1,200'} / month</p>
                                    </div>
                                    <div className="bg-brand-navy text-white px-5 py-2.5 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Rent Now
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Value Propositions - Furlenco Style */}
            <div className="bg-white py-16 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-center text-brand-navy mb-12">Why Rent With Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-brand-mint flex items-center justify-center text-brand-teal mb-6">
                                <RefreshCw size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-navy mb-2">Free Relocation</h3>
                            <p className="text-slate-500">Moving houses? We'll relocate your rented furniture for free.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-6">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-navy mb-2">72-Hour Delivery</h3>
                            <p className="text-slate-500">Get your furniture delivered and assembled within 3 days.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center text-brand-orange mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-navy mb-2">Damage Waiver</h3>
                            <p className="text-slate-500">Don't worry about accidental damages, we have got it covered.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Collection Section */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-brand-navy mb-2">Popular Furniture</h2>
                        <p className="text-slate-500">Our most rented pieces for this month.</p>
                    </div>
                    <Link to="/collection" className="text-brand-teal font-bold hover:underline hidden sm:flex items-center gap-1">
                        View All <ChevronRight size={16} />
                    </Link>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 4).map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="h-48 bg-slate-100 relative p-4 flex items-center justify-center">
                                    <img 
                                        src={getImageUrl(product.images[0])} 
                                        alt={product.name} 
                                        className="h-full w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                                        <Star size={12} className="text-brand-orange fill-brand-orange" /> {product.rating}
                                    </div>
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
                    </div>
                )}
                <div className="mt-8 text-center sm:hidden">
                    <Link to="/collection" className="inline-flex items-center gap-1 text-brand-teal font-bold hover:underline">
                        View All <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
            
        </div>
    );
};

export default HomePage;
