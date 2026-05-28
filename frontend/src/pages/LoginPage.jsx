import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validations';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();
    
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    const [loginApi, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = async (data) => {
        try {
            const res = await loginApi(data).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
            toast.success('Logged in successfully!');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-sand">
            <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-sm border border-slate-200 rounded-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-brand-navy">
                        Sign in to account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email address</label>
                            <input
                                type="email"
                                className={`relative mt-1 block w-full rounded border ${errors.email ? 'border-red-500' : 'border-slate-300'} py-3 px-4 text-brand-navy placeholder-slate-400 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal sm:text-sm font-medium bg-white`}
                                placeholder="Email address"
                                {...register('email')}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                            <input
                                type="password"
                                className={`relative mt-1 block w-full rounded border ${errors.password ? 'border-red-500' : 'border-slate-300'} py-3 px-4 text-brand-navy placeholder-slate-400 focus:z-10 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal sm:text-sm font-medium bg-white`}
                                placeholder="Password"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !isValid}
                            className="group relative flex w-full justify-center rounded bg-brand-teal py-3 px-4 text-sm font-bold text-white hover:bg-[#008A7B] focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center pt-4">
                    <span className="text-slate-600 font-medium">New Customer? </span>
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="font-bold text-brand-teal hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
