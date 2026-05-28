import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation, useVerifyOTPMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { Loader2, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../utils/validations';

const RegisterPage = () => {
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);

    const { register: registerField, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(registerSchema),
        mode: 'onChange',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();
    
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    const [register, { isLoading }] = useRegisterMutation();
    const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = async (data) => {
        try {
            const res = await register(data).unwrap();
            setRegistrationData(data);
            setShowOtp(true);
            toast.success(res.message || 'OTP sent to your email!');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const resendOtpHandler = async () => {
        if (!registrationData) return;
        try {
            const res = await register(registrationData).unwrap();
            toast.success(res.message || 'OTP resent to your email!');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const verifyHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await verifyOTP({ email: registrationData.email, otp }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
            toast.success('Email verified and account created!');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-sand">
            <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-sm border border-slate-200 rounded-xl">
                {!showOtp ? (
                    <>
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-brand-navy">
                                Create an account
                            </h2>
                            <p className="mt-2 text-center text-sm text-slate-500 font-medium">
                                Join RentEase for a premium furniture experience
                            </p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        className={`relative mt-1 block w-full rounded border ${errors.name ? 'border-red-500' : 'border-slate-300'} py-3 px-4 text-brand-navy placeholder-slate-400 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal sm:text-sm font-medium bg-white`}
                                        placeholder="Your Name"
                                        {...registerField('name')}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email address</label>
                                    <input
                                        type="email"
                                        className={`relative mt-1 block w-full rounded border ${errors.email ? 'border-red-500' : 'border-slate-300'} py-3 px-4 text-brand-navy placeholder-slate-400 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal sm:text-sm font-medium bg-white`}
                                        placeholder="Email address"
                                        {...registerField('email')}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        className={`relative mt-1 block w-full rounded border ${errors.phone ? 'border-red-500' : 'border-slate-300'} py-3 px-4 text-brand-navy placeholder-slate-400 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal sm:text-sm font-medium bg-white`}
                                        placeholder="Phone Number"
                                        {...registerField('phone')}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                                    <input
                                        type="password"
                                        className={`relative mt-1 block w-full rounded border ${errors.password ? 'border-red-500' : 'border-slate-300'} py-3 px-4 text-brand-navy placeholder-slate-400 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal sm:text-sm font-medium bg-white`}
                                        placeholder="Password"
                                        {...registerField('password')}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        className={`relative mt-1 block w-full rounded border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'} py-3 px-4 text-brand-navy placeholder-slate-400 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal sm:text-sm font-medium bg-white`}
                                        placeholder="Confirm Password"
                                        {...registerField('confirmPassword')}
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !isValid}
                                    className="group relative flex w-full justify-center rounded bg-brand-teal py-3 px-4 text-sm font-bold text-white hover:bg-[#008A7B] focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                    {isLoading ? 'Sending OTP...' : 'Register'}
                                </button>
                            </div>
                        </form>

                        <div className="text-sm text-center pt-4">
                            <span className="text-slate-600 font-medium">Already have an account? </span>
                            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="font-bold text-brand-teal hover:underline">
                                Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <button 
                            onClick={() => setShowOtp(false)}
                            className="flex items-center text-sm font-bold text-slate-500 hover:text-brand-navy transition-colors mb-4"
                        >
                            <ArrowLeft size={16} className="mr-1" /> Back to details
                        </button>
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-brand-mint rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="text-brand-teal" size={32} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-brand-navy">Verify your email</h2>
                            <p className="mt-2 text-sm text-slate-500 font-medium">
                                We've sent a 6-digit code to <br />
                                <span className="text-brand-navy font-bold">{registrationData?.email}</span>
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={verifyHandler}>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Enter 6-digit OTP</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    className="block w-full text-center text-3xl tracking-[1em] font-bold rounded border border-slate-300 py-4 px-4 text-brand-navy focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifying}
                                className="group relative flex w-full justify-center rounded bg-brand-teal py-3 px-4 text-sm font-bold text-white hover:bg-[#008A7B] focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                {isVerifying ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                {isVerifying ? 'Verifying...' : 'Verify & Create Account'}
                            </button>
                        </form>

                        <div className="text-sm text-center">
                            <p className="text-slate-500 font-medium mb-2">Didn't receive the code?</p>
                            <button 
                                onClick={resendOtpHandler}
                                className="font-bold text-brand-teal hover:underline disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
