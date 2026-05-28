import { useGetSessionsQuery, useDeleteSessionMutation } from '../../redux/slices/sessionsApiSlice';
import { toast } from 'react-toastify';
import { UserX } from 'lucide-react';
import { format } from 'date-fns';

const AdminSessions = () => {
    const { data: sessions, isLoading, error, refetch } = useGetSessionsQuery();
    const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

    const handleForceLogout = async (id) => {
        if (window.confirm('Force logout this user session?')) {
            try {
                await deleteSession(id).unwrap();
                toast.success('Session terminated successfully');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    if (isLoading) return <div className="p-8">Loading sessions...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading sessions</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Active User Sessions</h1>
            
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100/50 text-slate-600 text-sm">
                            <th className="p-4 font-semibold border-b border-slate-200">User</th>
                            <th className="p-4 font-semibold border-b border-slate-200">Device</th>
                            <th className="p-4 font-semibold border-b border-slate-200">IP Address</th>
                            <th className="p-4 font-semibold border-b border-slate-200">Login Time</th>
                            <th className="p-4 font-semibold border-b border-slate-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions?.map((session) => (
                            <tr key={session._id} className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-sm text-slate-800 font-medium">
                                    {session.userId?.name} <br/>
                                    <span className="text-xs text-slate-500 font-normal">{session.userId?.email}</span>
                                </td>
                                <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={session.deviceInfo}>{session.deviceInfo}</td>
                                <td className="p-4 text-sm text-slate-600">{session.ipAddress}</td>
                                <td className="p-4 text-sm text-slate-600">
                                    {format(new Date(session.loginTime), 'PPpp')}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleForceLogout(session._id)}
                                        disabled={isDeleting}
                                        className="inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-800 bg-red-100/50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <UserX size={14} className="mr-1" /> Force Logout
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sessions?.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">No active sessions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSessions;
