import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../redux/slices/ordersApiSlice';
import { useCreateReviewMutation } from '../redux/slices/productsApiSlice';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Calendar, Star, X, Loader2, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateInvoicePDF } from '../utils/generatePDF';

const OrderSuccess = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();

    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState('');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const openReviewModal = (productId) => {
        setReviewProductId(productId);
        setRating(5);
        setComment('');
        setReviewModalOpen(true);
    };

    const downloadInvoiceHandler = async () => {
        setIsGeneratingPDF(true);
        const success = await generateInvoicePDF(order, order.user);
        setIsGeneratingPDF(false);
        if (success) {
            toast.success('Invoice downloaded successfully');
        } else {
            toast.error('Failed to generate invoice');
        }
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productId: reviewProductId,
                rating,
                comment,
            }).unwrap();
            toast.success('Review submitted successfully!');
            setReviewModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-sand">
                <p className="text-brand-navy font-bold flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Loading your confirmation...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-sand px-4">
                <p className="text-red-500 font-bold mb-4">Could not load order details.</p>
                <button onClick={() => navigate('/collection')} className="text-brand-teal font-bold hover:underline">Return to Collection</button>
            </div>
        );
    }

    const deliveryDateObj = order.deliveryDate ? new Date(order.deliveryDate) : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const dateFormatted = deliveryDateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-brand-sand pt-16 pb-24 font-sans px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
                    
                    {/* Header Banner */}
                    <div className="bg-brand-mint px-8 py-12 text-center border-b border-brand-mint">
                        <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border border-brand-teal">
                            <CheckCircle className="text-brand-teal" size={40} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-brand-teal mb-2">
                            {order.paymentMethod === 'Cash on Delivery' ? 'Order Placed Successfully!' : 'Payment Verified & Order Placed!'}
                        </h1>
                        <p className="text-brand-navy font-medium max-w-md mx-auto">
                            🎉 Thank you for your order! {order.paymentMethod === 'Cash on Delivery' ? 'Your Cash on Delivery order is confirmed and your furniture will be dispatched shortly.' : 'Payment has been processed and your furniture will be dispatched shortly.'}
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 space-y-10">
                        
                        {/* Delivery Estimate Box */}
                        <div className="bg-slate-50 border border-slate-200 rounded p-6 flex items-start gap-4">
                            <Truck className="text-brand-navy shrink-0 mt-1" size={28} />
                            <div>
                                <h3 className="font-bold text-brand-navy text-lg">Estimated Delivery</h3>
                                <p className="text-slate-500 flex items-center gap-2 mt-1 font-medium">
                                    <Calendar size={16} className="text-brand-teal" /> {dateFormatted}
                                </p>
                                <p className="text-sm text-slate-500 mt-2 font-medium">🚚 Your order will arrive within 10 days guaranteed.</p>
                            </div>
                        </div>

                        {/* Order Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Left Col: Details */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                        <Package size={16} /> Order Details
                                    </h4>
                                    <p className="text-brand-navy font-bold"><span className="text-slate-500 font-medium mr-2">ID:</span> {order._id}</p>
                                    <p className="text-brand-navy font-bold mt-2 flex items-center"><span className="text-slate-500 font-medium mr-2">Status:</span> 
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-brand-mint text-brand-teal ml-1 border border-brand-mint">
                                            {order.status}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                        <CreditCard size={16} /> Payment
                                    </h4>
                                    <p className="text-brand-navy font-bold"><span className="text-slate-500 font-medium mr-2">Method:</span> {order.paymentMethod}</p>
                                    <p className="text-brand-navy font-bold mt-2"><span className="text-slate-500 font-medium mr-2">Amount Paid:</span> ₹{order.totalPrice.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Right Col: Address */}
                            <div className="bg-white rounded p-6 border border-slate-200">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                    <MapPin size={16} /> Delivery Address
                                </h4>
                                <div className="text-brand-navy font-medium leading-relaxed">
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Items List */}
                        <div>
                            <h4 className="text-lg font-bold text-brand-navy mb-4">Purchased Items</h4>
                            <div className="space-y-4">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white border border-slate-200 rounded p-4">
                                        <img src={item.image || item.images?.[0]} alt={item.name} className="w-16 h-16 object-cover rounded bg-slate-100 border border-slate-200" />
                                        <div className="flex-1">
                                            <p className="font-bold text-brand-navy">{item.name}</p>
                                            <p className="text-sm font-medium text-slate-500">Qty: {item.qty} &bull; {item.rentalDurationDays} Days</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 pr-4">
                                            <div className="font-bold text-brand-navy">
                                                ₹{item.price.toLocaleString()}
                                            </div>
                                            {order.status === 'Delivered' && (
                                                <button 
                                                    onClick={() => openReviewModal(item.product)}
                                                    className="text-[10px] bg-brand-mint text-brand-teal hover:bg-[#D0EBE8] px-3 py-1 rounded font-bold transition-colors"
                                                >
                                                    Rate Item
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="bg-brand-sand px-8 py-6 border-t border-slate-200 flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/collection" className="bg-brand-teal text-white px-8 py-3 rounded font-bold hover:bg-[#008A7B] transition-colors text-center">
                            Continue Shopping
                        </Link>
                        <button 
                            onClick={downloadInvoiceHandler} 
                            disabled={isGeneratingPDF}
                            className="bg-white text-brand-navy border border-slate-300 px-8 py-3 rounded font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGeneratingPDF ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                            Download PDF Report
                        </button>
                    </div>

                </div>
            </div>

            {/* Review Modal Override */}
            {reviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                    <div className="bg-white rounded shadow-xl w-full max-w-md overflow-hidden flex flex-col hover:-translate-y-1 transition-transform animate-in slide-in-from-bottom-4 duration-300">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-brand-sand">
                            <h3 className="font-bold text-brand-navy flex items-center gap-2"><Star size={18} className="text-brand-orange fill-brand-orange" /> Object Feedback</h3>
                            <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitReviewHandler} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
                                <select 
                                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal outline-none bg-white text-brand-navy font-medium"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience Review</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal outline-none bg-white text-brand-navy font-medium resize-none"
                                    placeholder="Write your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={submittingReview}
                                className="w-full bg-brand-teal text-white font-bold py-3 rounded hover:bg-[#008A7B] transition-colors flex items-center justify-center gap-2"
                            >
                                {submittingReview ? <Loader2 size={18} className="animate-spin" /> : null} Submit Assessment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderSuccess;
