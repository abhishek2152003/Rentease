import { useGetSessionsQuery, useDeleteSessionMutation } from '../redux/slices/sessionsApiSlice';
import { toast } from 'react-toastify';
import { LogOut, MonitorSmartphone } from 'lucide-react';
import { format } from 'date-fns';

const Sessions = () => {
    const { data: sessions, isLoading, error, refetch } = useGetSessionsQuery();
    const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

    const handleLogoutSession = async (id) => {
        if (window.confirm('Are you sure you want to log out from this device?')) {
            try {
                await deleteSession(id).unwrap();
                toast.success('Successfully logged out from the device');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading sessions...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading sessions</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-8 flex items-center gap-2">
                <MonitorSmartphone /> Active Sessions
            </h1>
            <div className="bg-white shadow border border-zinc-100 rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-[#FAF9F6]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Device</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">IP Address</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Login Time</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-100">
                        {sessions?.map((session) => (
                            <tr key={session._id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-zinc-900 max-w-xs truncate" title={session.deviceInfo}>{session.deviceInfo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{session.ipAddress}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {format(new Date(session.loginTime), 'PPpp')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleLogoutSession(session._id)}
                                        disabled={isDeleting}
                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg items-center gap-2 inline-flex transition-colors font-semibold"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sessions?.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">No active sessions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sessions;
