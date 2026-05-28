import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Users, 
    ListOrdered, 
    Tags, 
    Ticket, 
    LogOut,
    Mail,
    MonitorSmartphone
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
        { name: 'Users', path: '/admin/userlist', icon: Users },
        { name: 'Orders', path: '/admin/orders', icon: ListOrdered },
        { name: 'Messages', path: '/admin/contacts', icon: Mail },
        { name: 'Categories', path: '/admin/categories', icon: Tags },
        { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
        { name: 'Sessions', path: '/admin/sessions', icon: MonitorSmartphone },
    ];

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative font-sans">
            {/* Ambient Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none z-0" />
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-amber-100/40 blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none z-0" />
            {/* Sidebar */}
            <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/60 text-slate-700 flex flex-col hidden md:flex z-10 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
                <div className="h-16 flex items-center px-6 border-b border-white/50 bg-white/30">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">RentEase</span><span className="text-xl font-medium tracking-tight text-indigo-600 ml-1">Admin</span>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-6 py-4 text-sm font-semibold transition-all mb-1 mx-2 rounded-xl ${
                                    isActive 
                                    ? 'bg-white/80 text-indigo-700 shadow-sm border border-white/60' 
                                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'
                                }`}
                            >
                                <Icon className="mr-3" size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mx-2 mb-4 bg-white/40 border border-white/50 rounded-xl cursor-pointer hover:bg-white/60 hover:shadow-sm transition-all text-red-600" onClick={handleLogout}>
                    <div className="flex items-center text-sm font-semibold">
                        <LogOut className="mr-3" size={20} />
                        Sign out
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden z-10">
                {/* Mobile Header (hidden on large screens) */}
                <header className="h-16 bg-white/60 backdrop-blur-md border-b border-white/50 flex items-center px-4 md:hidden z-20">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">RentEase Admin</span>
                </header>

                <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
