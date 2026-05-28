import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/checkout');
    };

    return (
        <div className="min-h-screen bg-brand-sand relative font-sans pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-8 flex items-center gap-3">
                    <ShoppingBag size={32} className="text-brand-teal" />
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-16 text-center shadow-sm">
                        <div className="h-24 w-24 bg-brand-mint text-brand-teal rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-navy mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any premium furniture to your rental queue yet.</p>
                        <Link to="/collection" className="bg-brand-teal text-white px-8 py-3 rounded font-bold shadow-sm hover:bg-[#008A7B] transition-colors">
                            Browse Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-24 h-24 shrink-0 rounded bg-slate-100 p-2 border border-slate-100">
                                        <img src={item.images?.[0] || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <Link to={`/product/${item._id}`} className="text-lg font-bold text-brand-navy hover:text-brand-teal transition-colors">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm font-medium text-slate-500 mt-1">
                                            {item.rentalDurationDays} Days Duration
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                                            <p className="font-extrabold text-brand-navy">₹{item.price}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Qty</p>
                                            <p className="font-extrabold text-brand-navy">{item.qty}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCartHandler(item._id)}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 sticky top-8">
                                <h2 className="text-xl font-bold text-brand-navy mb-6 pb-4 border-b border-slate-100">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Total Items</span>
                                        <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Delivery & Assembly</span>
                                        <span className="text-brand-teal font-bold">Free</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-brand-navy">Subtotal</span>
                                        <span className="text-3xl font-extrabold text-brand-navy">
                                            ₹{cartItems.reduce((acc, item) => acc + item.price, 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={checkoutHandler}
                                    className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white px-6 py-4 rounded font-bold shadow-sm hover:bg-[#008A7B] transition-colors"
                                >
                                    Proceed To Checkout
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
