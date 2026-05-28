import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../redux/slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../redux/slices/ordersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { UserCircle, MapPin, Package, Loader2, Star, X, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCreateReviewMutation } from '../redux/slices/productsApiSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateProfileSchema, updateAddressSchema, reviewSchema } from '../utils/validations';
import { generateInvoicePDF } from '../utils/generatePDF';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('info');

    const { register: registerInfo, handleSubmit: handleInfoSubmit, formState: { errors: infoErrors, isValid: isInfoValid } } = useForm({
        resolver: yupResolver(updateProfileSchema),
        defaultValues: {
            name: userInfo?.name || '',
            email: userInfo?.email || '',
            phone: userInfo?.phone || '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange'
    });

    const { register: registerAddress, handleSubmit: handleAddressSubmit, formState: { errors: addressErrors, isValid: isAddressValid } } = useForm({
        resolver: yupResolver(updateAddressSchema),
        defaultValues: {
            addressLine: userInfo?.address?.addressLine || '',
            city: userInfo?.address?.city || '',
            state: userInfo?.address?.state || '',
            pincode: userInfo?.address?.pincode || '',
        },
        mode: 'onChange'
    });

    const { register: registerReview, handleSubmit: handleReviewSubmit, formState: { errors: reviewErrors }, reset: resetReview } = useForm({
        resolver: yupResolver(reviewSchema),
        defaultValues: { rating: 5, comment: '' },
        mode: 'onChange'
    });

    const [updateProfile, { isLoading: isUpdating }] = useProfileMutation();
    const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();
    const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState('');
    const [downloadingOrder, setDownloadingOrder] = useState(null);

    const openReviewModal = (productId) => {
        setReviewProductId(productId);
        resetReview();
        setReviewModalOpen(true);
    };

    const handleDownloadPDF = async (order) => {
        setDownloadingOrder(order._id);
        const success = await generateInvoicePDF(order, userInfo);
        setDownloadingOrder(null);
        if (success) {
            toast.success('Invoice downloaded successfully');
        } else {
            toast.error('Failed to generate invoice');
        }
    };

    const submitReviewHandler = async (data) => {
        try {
            await createReview({
                productId: reviewProductId,
                rating: data.rating,
                comment: data.comment,
            }).unwrap();
            toast.success('Review submitted successfully!');
            setReviewModalOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const submitProfileHandler = async (data) => {
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Profile Information Updated Successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const submitAddressHandler = async (data) => {
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                address: {
                    addressLine: data.addressLine,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                }
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Shipping Address Updated Successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand font-sans pt-12 pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your personal details, addresses, and order history.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="md:w-1/4">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-24">
                            <ul className="divide-y divide-slate-100 flex flex-col">
                                <li>
                                    <button 
                                        className={`w-full text-left px-6 py-4 flex items-center gap-3 font-bold transition-colors ${activeTab === 'info' ? 'bg-brand-mint text-brand-teal border-l-4 border-brand-teal' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent hover:text-brand-teal'}`}
                                        onClick={() => setActiveTab('info')}
                                    >
                                        <UserCircle size={20} /> Personal Info
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`w-full text-left px-6 py-4 flex items-center gap-3 font-bold transition-colors ${activeTab === 'address' ? 'bg-brand-mint text-brand-teal border-l-4 border-brand-teal' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent hover:text-brand-teal'}`}
                                        onClick={() => setActiveTab('address')}
                                    >
                                        <MapPin size={20} /> My Address
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`w-full text-left px-6 py-4 flex items-center gap-3 font-bold transition-colors ${activeTab === 'orders' ? 'bg-brand-mint text-brand-teal border-l-4 border-brand-teal' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent hover:text-brand-teal'}`}
                                        onClick={() => setActiveTab('orders')}
                                    >
                                        <Package size={20} /> Order History
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Pane */}
                    <div className="md:w-3/4">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 sm:p-10 transition-all">
                            
                            {/* Tab: Profile Info */}
                            {activeTab === 'info' && (
                                <form onSubmit={handleInfoSubmit(submitProfileHandler)} className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-2xl font-bold text-brand-navy border-b border-slate-100 pb-4 mb-6">Personal Details</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input type="text" className={`w-full px-4 py-3 rounded border ${infoErrors.name ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium`} {...registerInfo('name')} />
                                            {infoErrors.name && <p className="text-red-500 text-xs mt-1">{infoErrors.name.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                            <input type="tel" className={`w-full px-4 py-3 rounded border ${infoErrors.phone ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium`} {...registerInfo('phone')} />
                                            {infoErrors.phone && <p className="text-red-500 text-xs mt-1">{infoErrors.phone.message}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <input type="email" className={`w-full px-4 py-3 rounded border ${infoErrors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium`} {...registerInfo('email')} />
                                            {infoErrors.email && <p className="text-red-500 text-xs mt-1">{infoErrors.email.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Change Password</label>
                                            <input type="password" placeholder="Leave blank to keep current" className={`w-full px-4 py-3 rounded border ${infoErrors.password ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium placeholder:text-slate-400 placeholder:font-normal`} {...registerInfo('password')} />
                                            {infoErrors.password && <p className="text-red-500 text-xs mt-1">{infoErrors.password.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                                            <input type="password" placeholder="Re-enter new password" className={`w-full px-4 py-3 rounded border ${infoErrors.confirmPassword ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium placeholder:text-slate-400 placeholder:font-normal`} {...registerInfo('confirmPassword')} />
                                            {infoErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{infoErrors.confirmPassword.message}</p>}
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" disabled={isUpdating || !isInfoValid} className="bg-brand-teal text-white px-8 py-3 rounded font-bold hover:bg-[#008A7B] transition-colors flex items-center gap-2 disabled:opacity-50">
                                            {isUpdating ? <Loader2 className="animate-spin" size={18} /> : null} Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Tab: Address */}
                            {activeTab === 'address' && (
                                <form onSubmit={handleAddressSubmit(submitAddressHandler)} className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-2xl font-bold text-brand-navy border-b border-slate-100 pb-4 mb-6">Default Shipping Address</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Street Address</label>
                                            <input type="text" className={`w-full px-4 py-3 rounded border ${addressErrors.addressLine ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium`} {...registerAddress('addressLine')} placeholder="123 Main St, Apartment block" />
                                            {addressErrors.addressLine && <p className="text-red-500 text-xs mt-1">{addressErrors.addressLine.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                            <input type="text" className={`w-full px-4 py-3 rounded border ${addressErrors.city ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium`} {...registerAddress('city')} />
                                            {addressErrors.city && <p className="text-red-500 text-xs mt-1">{addressErrors.city.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">State</label>
                                            <input type="text" className={`w-full px-4 py-3 rounded border ${addressErrors.state ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium`} {...registerAddress('state')} />
                                            {addressErrors.state && <p className="text-red-500 text-xs mt-1">{addressErrors.state.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pincode</label>
                                            <input type="text" className={`w-full px-4 py-3 rounded border ${addressErrors.pincode ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal transition-shadow bg-white text-brand-navy font-medium`} {...registerAddress('pincode')} />
                                            {addressErrors.pincode && <p className="text-red-500 text-xs mt-1">{addressErrors.pincode.message}</p>}
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" disabled={isUpdating || !isAddressValid} className="bg-brand-teal text-white px-8 py-3 rounded font-bold hover:bg-[#008A7B] transition-colors flex items-center gap-2 disabled:opacity-50">
                                            {isUpdating ? <Loader2 className="animate-spin" size={18} /> : null} Update Address
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Tab: Orders */}
                            {activeTab === 'orders' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-2xl font-bold text-brand-navy border-b border-slate-100 pb-4 mb-6">Order History</h2>
                                    
                                    {loadingOrders ? (
                                        <div className="text-brand-teal font-bold flex items-center gap-2 py-10"><Loader2 className="animate-spin" size={20} /> Fetching Records...</div>
                                    ) : errorOrders ? (
                                        <div className="bg-red-50 text-red-500 font-bold p-4 rounded border border-red-100">Failure bridging order logs. Please try again.</div>
                                    ) : orders.length === 0 ? (
                                        <div className="py-20 text-center">
                                            <Package className="mx-auto text-slate-300 mb-4" size={48} />
                                            <h3 className="text-xl font-bold text-brand-navy mb-2">No active rentals yet</h3>
                                            <p className="text-slate-500 mb-6 font-medium">Browse our catalog and lease your first setup.</p>
                                            <Link to="/collection" className="text-brand-teal font-bold hover:underline">Explore Collection &rarr;</Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order._id} className="border border-slate-200 rounded p-6 hover:shadow-sm transition-shadow bg-white">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Order ID</p>
                                                            <p className="font-mono text-sm font-medium text-brand-navy">{order._id}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="inline-flex px-3 py-1 rounded text-xs font-bold bg-slate-100 text-brand-navy border border-slate-200">₹{order.totalPrice}</span>
                                                            <span className={`inline-flex px-3 py-1 rounded text-xs font-bold border ${order.status === 'Delivered' ? 'bg-brand-mint text-brand-teal border-brand-mint' : order.status === 'Pending' ? 'bg-amber-50 text-brand-orange border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="border-t border-slate-100 pt-4 mb-4 flex gap-4 overflow-x-auto pb-2">
                                                        {order.orderItems.map((item, idx) => (
                                                            <div key={idx} className="shrink-0 flex items-center gap-3 pr-4 border-r border-slate-100 last:border-0">
                                                                <img src={item.image || item.images?.[0]} className="w-12 h-12 rounded object-cover border border-slate-200" alt={item.name} />
                                                                <div className="w-32 truncate">
                                                                    <p className="text-sm font-bold text-brand-navy truncate">{item.name}</p>
                                                                    <div className="flex justify-between items-center mt-1">
                                                                        <p className="text-xs font-medium text-slate-500">Qty: {item.qty}</p>
                                                                        {order.status === 'Delivered' && (
                                                                            <button 
                                                                                onClick={() => openReviewModal(item.product)}
                                                                                className="text-[10px] bg-brand-mint text-brand-teal hover:bg-[#D0EBE8] px-2 py-0.5 rounded font-bold transition-colors"
                                                                            >
                                                                                Rate
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="text-xs font-bold text-slate-500">
                                                            {order.deliveryDate ? `Est. Delivery: ${new Date(order.deliveryDate).toLocaleDateString()}` : 'Configuring logistics...'}
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={() => handleDownloadPDF(order)}
                                                                disabled={downloadingOrder === order._id}
                                                                className="text-sm font-bold text-slate-500 hover:text-brand-teal flex items-center gap-1 disabled:opacity-50"
                                                            >
                                                                {downloadingOrder === order._id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                                                Invoice
                                                            </button>
                                                            <Link to={`/order-success/${order._id}`} className="text-sm font-bold text-brand-teal hover:underline flex items-center gap-1">
                                                                View Receipt
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
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
                        <form onSubmit={handleReviewSubmit(submitReviewHandler)} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
                                <select 
                                    className={`w-full px-4 py-3 rounded border ${reviewErrors.rating ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal outline-none bg-white text-brand-navy font-medium`}
                                    {...registerReview('rating')}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                                {reviewErrors.rating && <p className="text-red-500 text-xs mt-1">{reviewErrors.rating.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience Review</label>
                                <textarea 
                                    rows="4"
                                    className={`w-full px-4 py-3 rounded border ${reviewErrors.comment ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-brand-teal outline-none bg-white text-brand-navy font-medium resize-none`}
                                    placeholder="Write your experience..."
                                    {...registerReview('comment')}
                                ></textarea>
                                {reviewErrors.comment && <p className="text-red-500 text-xs mt-1">{reviewErrors.comment.message}</p>}
                            </div>
                            <button 
                                type="submit" 
                                disabled={submittingReview}
                                className="w-full bg-brand-teal text-white font-bold py-3 rounded hover:bg-[#008A7B] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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

export default ProfilePage;
