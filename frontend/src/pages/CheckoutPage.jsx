import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../redux/slices/ordersApiSlice';
import { clearCartItems, saveShippingAddress } from '../redux/slices/cartSlice';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=/checkout');
        }
    }, [userInfo, navigate]);

    const [address, setAddress] = useState(cart.shippingAddress?.address || '');
    const [city, setCity] = useState(cart.shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(cart.shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(cart.shippingAddress?.country || 'India');
    const [phone, setPhone] = useState('');

    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const subtotal = cart.cartItems.reduce((acc, item) => acc + item.price, 0);

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        
        if (cart.cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            dispatch(saveShippingAddress({ address, city, postalCode, country, phone }));
            navigate('/payment');
        } catch (error) {
            toast.error('Failed to save details');
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand relative font-sans pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-3">Secure Checkout</h1>
                    <p className="text-slate-500">Complete your rental delivery details.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Panel: Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={placeOrderHandler} className="bg-white border border-slate-200 shadow-sm rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                                <Truck className="text-brand-teal" /> Shipping Information
                            </h2>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Address</label>
                                        <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium text-brand-navy bg-white" placeholder="123 Main St, Apt 4B" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                        <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium text-brand-navy bg-white" placeholder="Mumbai" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Postal Code</label>
                                        <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium text-brand-navy bg-white" placeholder="400001" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Country</label>
                                        <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium text-brand-navy bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium text-brand-navy bg-white" placeholder="+91 9000000000" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={cart.cartItems.length === 0}
                                className="w-full mt-10 bg-brand-teal text-white px-6 py-4 rounded font-bold shadow-sm hover:bg-[#008A7B] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <ShieldCheck size={20} />
                                Proceed to Payment
                            </button>
                        </form>
                    </div>

                    {/* Right Panel: Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 sticky top-8">
                            <h2 className="text-xl font-bold text-brand-navy mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                                <CreditCard className="text-brand-teal" /> Order Summary
                            </h2>
                            
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center border-b border-slate-100 pb-4">
                                        <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-slate-100 p-1 border border-slate-100">
                                            <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-brand-navy truncate">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium uppercase">{item.rentalDurationDays} Days × {item.qty}</p>
                                        </div>
                                        <div className="font-bold text-brand-navy">
                                            ₹{item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-slate-600">Grand Total</span>
                                    <span className="text-3xl font-extrabold text-brand-navy">
                                        ₹{subtotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
