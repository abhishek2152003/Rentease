import { Gem, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
    return (
        <div className="min-h-screen bg-brand-sand relative overflow-hidden font-sans pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
                
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto pt-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-brand-navy mb-6">
                        Furnishing the future, <br />
                        <span className="text-brand-teal">without the commitment.</span>
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium">
                        At RentEase, we believe that high-end interior design shouldn't require a permanent anchor. We are on a mission to democratize luxury furniture, granting total flexibility to your lifestyle.
                    </p>
                </div>

                {/* Our Story Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative h-[600px] w-full">
                        <div className="absolute inset-0 z-10 p-4 flex flex-col bg-white border border-slate-200 shadow-sm rounded">
                            <div className="flex-1 rounded overflow-hidden relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80" 
                                    alt="Our Studio" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-brand-navy/60 flex items-end p-8">
                                    <h3 className="text-3xl font-bold text-white tracking-tight">Our Origin</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-8 lg:pl-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded bg-brand-mint flex items-center justify-center text-brand-teal font-bold border border-brand-teal">01</div>
                                <h3 className="text-2xl font-bold text-brand-navy">The Problem</h3>
                            </div>
                            <p className="text-slate-500 font-medium pl-14">
                                Fast furniture was destroying the environment, but premium pieces locked people into 10-year aesthetic commitments. Moving meant discarding or heavy logistical nightmares.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded bg-amber-50 flex items-center justify-center text-brand-orange font-bold border border-brand-orange">02</div>
                                <h3 className="text-2xl font-bold text-brand-navy">The Vision</h3>
                            </div>
                            <p className="text-slate-500 font-medium pl-14">
                                What if you could cycle perfectly curated, hermetically sanitized luxury sets every time your lease renewed? We built the pipeline to handle white-glove curation perfectly.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded bg-brand-navy/10 flex items-center justify-center text-brand-navy font-bold border border-brand-navy">03</div>
                                <h3 className="text-2xl font-bold text-brand-navy">The Scale</h3>
                            </div>
                            <p className="text-slate-500 font-medium pl-14">
                                Today, we manage over 5000+ products circulating actively across premium lofts, offices, and studios—giving absolute friction-free luxury to thousands.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Principles Grid */}
                <div className="text-center pt-8">
                    <h2 className="text-3xl font-extrabold text-brand-navy mb-12">Our Core Architecture</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white border border-slate-200 p-8 text-left rounded">
                            <div className="h-12 w-12 rounded bg-brand-mint text-brand-teal flex items-center justify-center mb-6 border border-brand-mint">
                                <Gem size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-brand-navy mb-2">Uncompromising Quality</h3>
                            <p className="text-slate-500 text-sm font-medium">Every piece is genuine. Hardwoods, authentic leathers, and verified designer marks.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 text-left rounded">
                            <div className="h-12 w-12 rounded bg-amber-50 text-brand-orange flex items-center justify-center mb-6 border border-amber-100">
                                <Compass size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-brand-navy mb-2">Absolute Fluidity</h3>
                            <p className="text-slate-500 text-sm font-medium">Upgrade, swap, or return with zero predatory fees. Your space flows with you.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 text-left rounded">
                            <div className="h-12 w-12 rounded bg-brand-mint text-brand-teal flex items-center justify-center mb-6 border border-brand-mint">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-brand-navy mb-2">Deep Sanitization</h3>
                            <p className="text-slate-500 text-sm font-medium">Our warehouse executes an intensive multi-stage cleaning pipeline for every cycle.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 text-left rounded">
                            <div className="h-12 w-12 rounded bg-brand-navy/10 text-brand-navy flex items-center justify-center mb-6 border border-brand-navy/20">
                                <HeartHandshake size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-brand-navy mb-2">White-Glove Care</h3>
                            <p className="text-slate-500 text-sm font-medium">Delivery and assembly is orchestrated by our in-house spatial technicians.</p>
                        </div>
                    </div>
                </div>

                {/* Call To Action */}
                <div className="bg-brand-navy p-12 text-center rounded">
                    <h2 className="text-3xl font-extrabold text-white mb-4">Ready to transform your environment?</h2>
                    <p className="text-brand-mint font-medium max-w-2xl mx-auto mb-8">
                        Join our network of designers, expats, and aesthetes who have broken free from fast furniture.
                    </p>
                    <Link to="/collection" className="inline-block bg-brand-teal text-white px-8 py-4 rounded font-bold hover:bg-[#008A7B] transition-colors">
                        Explore The Collection
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default AboutUsPage;
