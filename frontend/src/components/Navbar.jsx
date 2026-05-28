import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="fixed w-full bg-white z-50 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-brand-navy">
                            RentEase.
                        </Link>
                    </div>
                    <div className="hidden md:ml-6 md:flex md:space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-brand-teal px-3 py-2 text-sm font-bold transition-colors border-b-2 border-transparent hover:border-brand-teal">
                            Home
                        </Link>
                        <Link to="/collection" className="text-slate-600 hover:text-brand-teal px-3 py-2 text-sm font-bold transition-colors border-b-2 border-transparent hover:border-brand-teal">
                            Collection
                        </Link>
                        <Link to="/contact" className="text-slate-600 hover:text-brand-teal px-3 py-2 text-sm font-bold transition-colors border-b-2 border-transparent hover:border-brand-teal">
                            Contact Us
                        </Link>
                        <Link to="/about" className="text-slate-600 hover:text-brand-teal px-3 py-2 text-sm font-bold transition-colors border-b-2 border-transparent hover:border-brand-teal">
                            About Us
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <Link to="/cart" className="text-brand-navy hover:text-brand-teal transition-colors relative">
                            <ShoppingCart size={22} />
                            {cartItems && cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </Link>
                        
                        {/* Desktop Auth Section */}
                        <div className="hidden md:flex items-center space-x-4">
                            {userInfo ? (
                                <>
                                    <Link to="/profile" className="text-brand-navy hover:text-brand-teal transition-colors flex items-center font-bold text-sm gap-2 whitespace-nowrap">
                                        <User size={20} />
                                        {userInfo.name.split(' ')[0]}
                                    </Link>
                                    {userInfo.isAdmin && (
                                        <Link to="/admin" className="bg-brand-mint text-brand-teal border border-brand-mint px-3 py-1 text-xs rounded font-bold hover:bg-[#D0EBE8] transition-colors">
                                            Admin
                                        </Link>
                                    )}
                                    <button 
                                        onClick={logoutHandler}
                                        className="text-slate-500 hover:text-red-500 text-xs font-bold transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="text-brand-navy hover:text-brand-teal transition-colors">
                                    <User size={22} />
                                </Link>
                            )}
                        </div>

                        {/* Mobile Hamburger Toggle */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-navy hover:text-brand-teal focus:outline-none">
                                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-xl absolute w-full animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-4 space-y-4">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-brand-navy font-bold hover:text-brand-teal">Home</Link>
                        <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)} className="block text-brand-navy font-bold hover:text-brand-teal">Collection</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-brand-navy font-bold hover:text-brand-teal">Contact Us</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-brand-navy font-bold hover:text-brand-teal">About Us</Link>
                        
                        <div className="pt-4 border-t border-slate-100">
                            {userInfo ? (
                                <div className="space-y-4">
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-brand-navy font-bold hover:text-brand-teal">
                                        <User size={18} /> My Profile
                                    </Link>
                                    {userInfo.isAdmin && (
                                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-brand-teal font-bold hover:text-[#008A7B]">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="block text-red-500 font-bold w-full text-left">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-brand-navy font-bold hover:text-brand-teal">
                                    <User size={18} /> Sign In / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
