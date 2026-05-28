import { useState, useEffect } from 'react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../redux/slices/ordersApiSlice';
import { toast } from 'react-toastify';
import { Download, Loader2 } from 'lucide-react';
import { generateInvoicePDF } from '../../utils/generatePDF';

const OrderList = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    const [updateOrderStatus, { isLoading: loadingUpdate }] = useUpdateOrderStatusMutation();

    const [localOrders, setLocalOrders] = useState([]);
    const [downloadingOrder, setDownloadingOrder] = useState(null);

    useEffect(() => {
        if (orders) {
            setLocalOrders(orders);
        }
    }, [orders]);

    const handleDownloadPDF = async (order) => {
        setDownloadingOrder(order._id);
        const success = await generateInvoicePDF(order, order.user);
        setDownloadingOrder(null);
        if (success) {
            toast.success('Invoice downloaded successfully');
        } else {
            toast.error('Failed to generate invoice');
        }
    };

    const markDelivered = async (id) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                await updateOrderStatus({ id, status: 'Delivered' }).unwrap();
                
                // Instant UI Update (Optimistic)
                setLocalOrders(prev =>
                  prev.map(order =>
                    order._id === id ? { ...order, status: "Delivered", isDelivered: true, deliveredAt: new Date().toISOString() } : order
                  )
                );
                
                toast.success('Order marked as delivered');
            } catch (err) {
                toast.error(err?.data?.message || err.error || "Update failed");
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Orders Management</h1>

            {loadingUpdate && <div className="text-zinc-500">Updating status...</div>}

            {isLoading ? (
                <div className="text-zinc-500 animate-pulse">Loading orders...</div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-500 rounded-md">Error connecting: {error?.error || "Cannot load orders"}</div>
            ) : (
                <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-zinc-200">
                    <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">ID</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">USER</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">DATE</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">TOTAL</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">STATUS</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-zinc-900">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {localOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500 font-mono text-xs">{order._id}</td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">{order.user && order.user.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500">{order.createdAt.substring(0, 10)}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-zinc-900 font-medium">₹{order.totalPrice}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span
                                              className={
                                                order.status === "Delivered"
                                                  ? "text-green-600 font-bold"
                                                  : order.status === "Pending"
                                                  ? "text-yellow-500 font-medium"
                                                  : "text-blue-500 font-medium"
                                              }
                                            >
                                              {order.status}
                                            </span>
                                            {order.status === "Delivered" && order.deliveredAt && (
                                                <span className="text-[10px] text-zinc-400">
                                                    on {order.deliveredAt.substring(0, 10)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            {order.status !== "Delivered" ? (
                                                <button 
                                                    onClick={() => markDelivered(order._id)}
                                                    className="text-amber-600 hover:text-amber-800 transition-colors font-medium text-xs border border-amber-200 bg-amber-50 px-2 py-1 rounded"
                                                >
                                                    Mark Delivered
                                                </button>
                                            ) : (
                                                <button disabled className="text-zinc-400 font-medium text-xs border border-zinc-200 bg-zinc-50 px-2 py-1 rounded opacity-50 cursor-not-allowed">
                                                    Delivered
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDownloadPDF(order)}
                                                disabled={downloadingOrder === order._id}
                                                title="Download Invoice"
                                                className="text-brand-teal hover:text-teal-800 transition-colors border border-brand-mint bg-brand-sand px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                                            >
                                                {downloadingOrder === order._id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {localOrders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-zinc-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderList;
