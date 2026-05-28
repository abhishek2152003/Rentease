import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSendContactMessageMutation } from '../redux/slices/contactApiSlice';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [sendMessage, { isLoading }] = useSendContactMessageMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await sendMessage({ name, email, phone, subject, message }).unwrap();
            toast.success('Your message has been sent successfully. We will get back to you soon!');
            // Clear fields naturally
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
        } catch (err) {
            toast.error(err?.data?.message || err.error || 'Failed to send message');
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand font-sans pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-navy mb-4">Get in Touch</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">Have a question about our collections or a custom luxury request? We're here to help.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-slate-200 rounded p-8 flex items-start space-x-4">
                            <div className="p-3 rounded bg-brand-mint text-brand-teal">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-navy mb-1">Email Us</h3>
                                <p className="text-slate-500 text-sm font-medium">support@rentease.com</p>
                                <p className="text-slate-500 text-sm font-medium">sales@rentease.com</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded p-8 flex items-start space-x-4">
                            <div className="p-3 rounded bg-amber-50 text-brand-orange">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-navy mb-1">Call Us</h3>
                                <p className="text-slate-500 text-sm font-medium">+91 90000 12345</p>
                                <p className="text-slate-400 text-xs mt-1 font-medium">Mon-Fri, 9am to 6pm</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded p-8 flex items-start space-x-4">
                            <div className="p-3 rounded bg-brand-mint text-brand-teal">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-navy mb-1">Office</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    BKC, Bandra East<br />
                                    Mumbai, 400051<br />
                                    India
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <form onSubmit={submitHandler} className="bg-white border border-slate-200 rounded p-8 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name <span className="text-brand-orange">*</span></label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium bg-white transition-colors" 
                                        placeholder="John Doe" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address <span className="text-brand-orange">*</span></label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium bg-white transition-colors" 
                                        placeholder="john@example.com" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium bg-white transition-colors" 
                                        placeholder="+91 90000 00000" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject <span className="text-brand-orange">*</span></label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium bg-white transition-colors" 
                                        placeholder="How can we help?" 
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message <span className="text-brand-orange">*</span></label>
                                <textarea 
                                    required 
                                    rows="5"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-medium bg-white transition-colors resize-none" 
                                    placeholder="Write your message here..." 
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white px-8 py-4 rounded font-bold hover:bg-[#008A7B] transition-colors disabled:opacity-50"
                            >
                                <Send size={20} />
                                {isLoading ? 'Sending Message...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
