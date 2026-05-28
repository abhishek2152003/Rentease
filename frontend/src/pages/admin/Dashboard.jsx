import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, IndianRupee, ShoppingCart, Loader2 } from 'lucide-react';
import { useGetOrdersQuery } from '../../redux/slices/ordersApiSlice';
import { useGetUsersQuery } from '../../redux/slices/usersApiSlice';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white/60 backdrop-blur-lg border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-2xl flex items-center transition-all hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="p-3 rounded-full bg-indigo-50/50 text-indigo-600 mr-4 border border-indigo-100/50">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h3>
            {trend && <p className="text-xs font-medium text-emerald-600 mt-1">{trend}</p>}
        </div>
    </div>
);

const Dashboard = () => {
    const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery();
    const { data: users, isLoading: loadingUsers } = useGetUsersQuery();

    if (loadingOrders || loadingUsers) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 size={48} className="animate-spin text-zinc-400" />
            </div>
        );
    }

    // Calculations
    const totalRevenue = orders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;
    const totalUsers = users?.length || 0;
    const productsRented = orders?.reduce((acc, order) => acc + order.orderItems.reduce((sum, item) => sum + item.qty, 0), 0) || 0;
    const pendingOrdersCount = orders?.filter(order => order.status === 'Pending').length || 0;

    // Process Chart Data (Last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Initialize exactly 6 months back up to current
    const chartData = {};
    for (let i = 5; i >= 0; i--) {
        let m = currentMonth - i;
        if (m < 0) m += 12;
        chartData[m] = { name: monthNames[m], revenue: 0 };
    }

    orders?.forEach((order) => {
        const orderMonth = new Date(order.createdAt).getMonth();
        if (chartData[orderMonth]) {
            chartData[orderMonth].revenue += order.totalPrice;
        }
    });

    const mockData = Object.values(chartData);

    // Recent Activity (Last 5 orders)
    const recentActivity = [...(orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toLocaleString()}`} 
                    icon={IndianRupee} 
                    trend="Actual Pipeline Value" 
                />
                <StatCard 
                    title="Total Users" 
                    value={totalUsers} 
                    icon={Users} 
                    trend="Registered Users" 
                />
                <StatCard 
                    title="Products Rented" 
                    value={productsRented} 
                    icon={Package} 
                />
                <StatCard 
                    title="Pending Orders" 
                    value={pendingOrdersCount} 
                    icon={ShoppingCart} 
                    trend={pendingOrdersCount > 0 ? "Needs attention" : "All clear"} 
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-white/60 backdrop-blur-lg border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-2xl h-96 flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Trends</h2>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip cursor={{ stroke: '#e2e8f0' }} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-lg border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-2xl flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Transactions</h2>
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-zinc-500">No recent orders found.</p>
                        ) : (
                            recentActivity.map((order) => (
                                <div key={order._id} className="flex items-start space-x-3 text-sm border-b border-slate-200/50 pb-3 last:border-0 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-default">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-bold text-slate-900 truncate">
                                            Order #{order._id.substring(order._id.length - 6)}
                                        </p>
                                        <p className="text-slate-500 font-medium text-xs truncate mt-0.5">
                                            {order.orderItems?.[0]?.name || 'Product'} {order.orderItems?.length > 1 && `+ ${order.orderItems.length - 1} more`}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-extrabold text-slate-900">₹{order.totalPrice}</p>
                                        <p className="text-xs font-semibold text-slate-400 mt-0.5 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
