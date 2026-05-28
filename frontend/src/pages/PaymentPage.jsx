import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCartItems } from '../redux/slices/cartSlice';
import { 
    useCreateOrderMutation,
    useCreateRazorpayOrderMutation,
    useVerifyRazorpayPaymentMutation 
} from '../redux/slices/ordersApiSlice';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('Razorpay');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
    const [createRazorpayOrder, { isLoading: isCreatingRP }] = useCreateRazorpayOrderMutation();
    const [verifyRazorpayPayment, { isLoading: isVerifying }] = useVerifyRazorpayPaymentMutation();

    useEffect(() => {
        if (!userInfo) navigate('/login');
        if (!cart.shippingAddress?.address) navigate('/checkout');
    }, [userInfo, cart.shippingAddress, navigate]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const processPaymentLogic = async () => {
        if (cart.cartItems.length === 0) return toast.error("Cart is empty");

        const subtotal = cart.cartItems.reduce((acc, item) => acc + item.price, 0);

        try {
            const formattedOrderItems = cart.cartItems.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.images && item.images.length > 0 ? item.images[0] : item.image || '',
                price: item.price,
                rentalDurationDays: item.rentalDurationDays,
                product: item._id || item.product,
            }));

            // 1. Create standard Mongo Order
            const orderRes = await createOrder({
                orderItems: formattedOrderItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod,
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: subtotal,
            }).unwrap();

            dispatch(clearCartItems());

            if (paymentMethod === 'Cash on Delivery') {
                toast.success('Order Placed Successfully! Pay directly upon delivery.');
                return navigate(`/order-success/${orderRes._id}`);
            }

            // 2. Razorpay / UPI Flow
            toast.info('Initializing Razorpay gateway...');
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) return toast.error('Failed to load Razorpay SDK');

            const rpOrder = await createRazorpayOrder({ orderId: orderRes._id }).unwrap();

            const options = {
                key: rpOrder.key, 
                amount: rpOrder.amount,
                currency: rpOrder.currency,
                name: "RentEase",
                description: "Furniture Rental Payment",
                order_id: rpOrder.id,
                theme: {
                    color: "#00A896", // brand-teal
                },
                handler: async function (response) {
                    try {
                        await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderRes._id
                        }).unwrap();

                        toast.success('Payment Verification Successful! Order fully paid.');
                        navigate(`/order-success/${orderRes._id}`);
                    } catch (err) {
                        toast.error(err?.data?.message || 'Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: function() {
                        toast.error("Payment modal closed. Your order is pending in your account.");
                        navigate(`/order-success/${orderRes._id}`);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            toast.error(error?.data?.message || error.error || 'Failed to process checkout');
        }
    };

    const isLoading = isCreatingOrder || isCreatingRP || isVerifying;

    return (
        <div className="min-h-screen bg-brand-sand relative font-sans pt-10 pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-3">Payment Method</h1>
                    <p className="text-slate-500">Select how you'd like to pay for your rentals.</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8">
                    <div className="space-y-4">
                        
                        <label className={`flex items-center gap-4 p-5 border rounded cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-brand-teal bg-brand-mint/30' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input type="radio" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-brand-teal focus:ring-brand-teal" />
                            <CreditCard className="text-brand-navy" size={24} />
                            <div>
                                <h3 className="font-bold text-brand-navy">Razorpay (Cards / Netbanking)</h3>
                                <p className="text-sm text-slate-500">Fast and secure online payments natively powered by Razorpay checkout.</p>
                            </div>
                        </label>

                        <label className={`flex items-center gap-4 p-5 border rounded cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-brand-teal bg-brand-mint/30' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input type="radio" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-brand-teal focus:ring-brand-teal" />
                            <Smartphone className="text-brand-navy" size={24} />
                            <div>
                                <h3 className="font-bold text-brand-navy">UPI Interface</h3>
                                <p className="text-sm text-slate-500">Simulated dynamic UPI support integrated via the generic Razorpay system module.</p>
                            </div>
                        </label>

                        <label className={`flex items-center gap-4 p-5 border rounded cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-brand-teal bg-brand-mint/30' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input type="radio" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-brand-teal focus:ring-brand-teal" />
                            <Banknote className="text-brand-navy" size={24} />
                            <div>
                                <h3 className="font-bold text-brand-navy">Cash on Delivery (COD)</h3>
                                <p className="text-sm text-slate-500">Pay in cash directly or utilizing QR codes upon delivery.</p>
                            </div>
                        </label>

                    </div>

                    <button 
                        onClick={processPaymentLogic}
                        disabled={isLoading}
                        className="w-full mt-10 bg-brand-teal text-white px-6 py-4 rounded font-bold shadow-sm hover:bg-[#008A7B] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing Request...' : `Confirm & Pay with ${paymentMethod}`}
                    </button>
                    
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full mt-4 bg-white text-brand-navy border border-slate-200 px-6 py-3 rounded font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        Back to Shipping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
