import { useState } from 'react';
import { 
    useGetContactsQuery, 
    useUpdateContactStatusMutation, 
    useDeleteContactMutation 
} from '../../redux/slices/contactApiSlice';
import { toast } from 'react-toastify';
import { Trash2, MessageSquare, CheckCircle, Mail, Loader2 } from 'lucide-react';

const AdminContacts = () => {
    const { data: contacts, isLoading, error, refetch } = useGetContactsQuery();
    const [updateStatus] = useUpdateContactStatusMutation();
    const [deleteContact] = useDeleteContactMutation();

    const [selectedContact, setSelectedContact] = useState(null);

    const glassCard = "bg-white/60 backdrop-blur-lg border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl";

    const statusBadgeColors = {
        unread: 'bg-red-100 text-red-700 border border-red-200',
        read: 'bg-blue-100 text-blue-700 border border-blue-200',
        replied: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    };

    const updateStatusHandler = async (id, newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Message marked as ${newStatus}`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you absolutely sure you want to purge this message?')) {
            try {
                await deleteContact(id).unwrap();
                toast.success('Message permanently deleted');
                if (selectedContact?._id === id) setSelectedContact(null);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 size={48} className="animate-spin text-slate-400" /></div>;
    if (error) return <div className="text-center text-red-500 font-bold mt-10">Error fetching contacts</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Message Control</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact List */}
                <div className={`lg:col-span-2 ${glassCard} overflow-hidden flex flex-col h-[700px]`}>
                    <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/30">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare size={20} className="text-indigo-600" /> Inbox
                        </h2>
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                            Total: {contacts.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ul className="divide-y divide-slate-200/50">
                            {contacts.length === 0 && (
                                <li className="p-8 text-center text-slate-500 font-medium">No messages found.</li>
                            )}
                            {contacts.map((contact) => (
                                <li 
                                    key={contact._id} 
                                    className={`p-6 cursor-pointer transition-colors hover:bg-white/80 ${selectedContact?._id === contact._id ? 'bg-white/80 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                                    onClick={() => {
                                        setSelectedContact(contact);
                                        // Auto mark as read if unread and clicked
                                        if (contact.status === 'unread') updateStatusHandler(contact._id, 'read');
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {contact.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{contact.name}</h3>
                                                <p className="text-xs text-slate-500">{new Date(contact.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeColors[contact.status]}`}>
                                            {contact.status}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-1">{contact.subject}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-2">{contact.message}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Contact Detail View */}
                <div className={`lg:col-span-1 ${glassCard} p-6 h-[700px] overflow-y-auto`}>
                    {selectedContact ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start border-b border-slate-200/50 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedContact.name}</h2>
                                    <a href={`mailto:${selectedContact.email}`} className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1 mt-1">
                                        <Mail size={14} /> {selectedContact.email}
                                    </a>
                                    {selectedContact.phone && (
                                        <p className="text-slate-500 text-sm mt-1">{selectedContact.phone}</p>
                                    )}
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusBadgeColors[selectedContact.status]}`}>
                                    {selectedContact.status}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Subject: {selectedContact.subject}</h3>
                                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-medium">
                                    {selectedContact.message}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200/50 space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => updateStatusHandler(selectedContact._id, 'replied')}
                                        disabled={selectedContact.status === 'replied'}
                                        className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle size={16} /> Mark Replied
                                    </button>
                                    <button 
                                        onClick={() => updateStatusHandler(selectedContact._id, 'unread')}
                                        disabled={selectedContact.status === 'unread'}
                                        className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
                                    >
                                        <MessageSquare size={16} /> Mark Unread
                                    </button>
                                </div>
                                <button 
                                    onClick={() => deleteHandler(selectedContact._id)}
                                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 py-2.5 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors mt-2"
                                >
                                    <Trash2 size={16} /> Delete Record
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={24} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No Message Selected</h3>
                            <p className="text-sm">Click on any message from the inbox to view its full contents and management actions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContacts;
