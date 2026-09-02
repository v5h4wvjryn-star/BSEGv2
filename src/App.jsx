import React, { useState, useEffect, useCallback } from 'react';

// --- Contact routing -------------------------------------------------------
// Only addresses that are known-good are used here. See README.md.
const EMAIL_GENERAL = 'info@bluestarequitygroup.com';
const EMAIL_ACQUISITIONS = 'acquisitions@bluestarequitygroup.com';
// Commercial real estate inquiries currently route to the acquisitions mailbox.
// Switch this to 'realestate@bluestarequitygroup.com' once that mailbox is live.
const EMAIL_REAL_ESTATE = EMAIL_ACQUISITIONS;

// --- Icon components (lucide-style, inlined to avoid a dependency) ----------
const iconProps = (props) => ({
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...props,
});

const Star = (p) => (<svg {...iconProps(p)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const Briefcase = (p) => (<svg {...iconProps(p)}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const Mail = (p) => (<svg {...iconProps(p)}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const ArrowRight = (p) => (<svg {...iconProps(p)}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const Zap = (p) => (<svg {...iconProps(p)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const Building = (p) => (<svg {...iconProps(p)}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M12 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg>);
const Store = (p) => (<svg {...iconProps(p)}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>);
const Warehouse = (p) => (<svg {...iconProps(p)}><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/></svg>);
const Users = (p) => (<svg {...iconProps(p)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const TrendingUp = (p) => (<svg {...iconProps(p)}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>);
const Clock = (p) => (<svg {...iconProps(p)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const Calculator = (p) => (<svg {...iconProps(p)}><rect width="16" height="20" x="4" y="2" rx="2"/><rect width="10" height="4" x="7" y="5" rx="1"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/></svg>);
const Wrench = (p) => (<svg {...iconProps(p)}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>);
const Scale = (p) => (<svg {...iconProps(p)}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>);
const DoorOpen = (p) => (<svg {...iconProps(p)}><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5.483 20.32a1 1 0 0 1-.759-.97V5.562a1 1 0 0 1 .759-.97l6.275-1.37a1 1 0 0 1 1.242.97z"/></svg>);
const MapPin = (p) => (<svg {...iconProps(p)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);

// --- Shared pieces ---------------------------------------------------------

const SECTIONS = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'focus', name: 'What We Do' },
    { id: 'real-estate', name: 'Real Estate' },
    { id: 'sellers', name: 'Sellers' },
    { id: 'contact', name: 'Contact' },
];

const Logo = ({ className = '' }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-current flex-shrink-0" />
        <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Blue Star
        </span>
        <span className="text-lg sm:text-xl md:text-2xl font-light tracking-tight text-yellow-400 whitespace-nowrap">
            Equity Group
        </span>
    </div>
);

// Centred section heading. The previous markup used `inline-block mx-auto`,
// which does not centre an inline-block element — headings rendered flush
// left. Wrapping in a `text-center` block fixes it consistently everywhere.
const SectionHeading = ({ children, accent = 'yellow', className = '' }) => (
    <div className={`text-center ${className}`}>
        <h2 className={`text-4xl font-extrabold pb-2 inline-block border-b-2 ${
            accent === 'blue' ? 'border-blue-400' : 'border-yellow-400'
        }`}>
            {children}
        </h2>
    </div>
);

// --- Navigation ------------------------------------------------------------

const Navbar = ({ currentSection, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (id) => {
        onNavigate(id);
        setIsOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-95 shadow-lg backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center transition-all duration-300">
                <button
                    onClick={() => handleNavigation('home')}
                    aria-label="Blue Star Equity Group — back to top"
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
                >
                    <Logo />
                </button>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex lg:space-x-6 xl:space-x-8" aria-label="Primary">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => handleNavigation(section.id)}
                            aria-current={currentSection === section.id ? 'true' : undefined}
                            className={`font-medium transition duration-150 ease-in-out uppercase text-sm tracking-widest whitespace-nowrap ${
                                currentSection === section.id
                                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                                    : 'text-white hover:text-yellow-400'
                            }`}
                        >
                            {section.name}
                        </button>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-white p-2 rounded-md hover:bg-gray-800 transition"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-gray-800 border-t border-gray-700">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => handleNavigation(section.id)}
                            className="block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition font-medium uppercase text-sm tracking-widest"
                        >
                            {section.name}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
};

// --- Hero ------------------------------------------------------------------

const HeroSection = ({ id, onNavigate }) => (
    <section
        id={id}
        className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden scroll-mt-20 py-28"
    >
        {/* Abstract background grid */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#374151" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp">
                <span className="block">Long-term <span className="text-yellow-400">ownership</span>.</span>
                <span className="block">Disciplined <span className="text-blue-400">capital</span>.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-3xl mx-auto animate-fadeInUp delay-200">
                Blue Star Equity Group is a privately held investment company building
                long-term value through operating businesses, commercial real estate,
                and strategic investments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp delay-200">
                <button
                    onClick={() => onNavigate('focus')}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-lg"
                >
                    What We Do
                    <ArrowRight className="ml-2 w-4 h-4" />
                </button>
                <button
                    onClick={() => onNavigate('contact')}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-white border border-gray-500 hover:border-white hover:bg-white/5 transition duration-300"
                >
                    Contact
                </button>
            </div>
        </div>
    </section>
);

// --- About -----------------------------------------------------------------

const AT_A_GLANCE = [
    ['Structure', 'Privately held investment and holding company'],
    ['Based in', 'Dallas–Fort Worth, Texas'],
    ['Focus', 'Operating businesses, commercial real estate, strategic investments'],
    ['Horizon', 'Long-term ownership'],
    ['Process', 'Direct, confidential, and deliberate'],
];

const AboutSection = ({ id }) => (
    <section id={id} className="py-24 bg-white text-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading className="mb-16">About Blue Star</SectionHeading>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Blue Star Equity Group is a privately held investment and holding company
                        based in the Dallas–Fort Worth area. We acquire, build, and hold — operating
                        businesses, commercial real estate, and select strategic investments.
                    </p>
                    <p className="text-xl font-semibold text-blue-700 leading-relaxed">
                        Our private ownership allows us to invest on our own timeline, remain patient
                        when patience is warranted, and walk away when the economics don't make sense.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We prefer businesses and assets we can understand: durable demand, honest
                        economics, and a clear reason the value should still be there in ten years.
                        We would rather pass on a good opportunity than force a marginal one.
                    </p>
                </div>

                {/* At a glance */}
                <div className="bg-gray-100 p-8 rounded-xl shadow-2xl">
                    <div className="text-center">
                        <Briefcase className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">At a Glance</h3>
                    </div>
                    <dl className="space-y-4">
                        {AT_A_GLANCE.map(([term, detail]) => (
                            <div key={term} className="bg-white p-4 rounded-lg shadow-md border-b-4 border-blue-500">
                                <dt className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-1">
                                    {term}
                                </dt>
                                <dd className="text-gray-700">{detail}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    </section>
);

// --- What We Do ------------------------------------------------------------

const FOCUS_AREAS = [
    {
        name: 'Operating Businesses',
        icon: <Briefcase className="w-10 h-10 text-white" />,
        body: 'We acquire, invest in, and partner with privately held businesses where long-term ownership, operational focus, and sensible use of technology can create durable value. We prefer companies with real customers, understandable economics, and a reason to exist in ten years.',
    },
    {
        name: 'Commercial Real Estate',
        icon: <Building className="w-10 h-10 text-white" />,
        body: 'We selectively evaluate commercial real estate where durable cash flow, strategic use, and long-term ownership can create value. Our interest is in owning good assets for a long time, not in transaction volume.',
        link: { label: 'What we evaluate', target: 'real-estate' },
    },
    {
        name: 'Strategic & Venture Investments',
        icon: <Zap className="w-10 h-10 text-white" />,
        body: 'We consider focused investments in technology and emerging businesses where there is genuine strategic alignment with what we own or understand, and a realistic path to long-term value rather than a story.',
    },
];

const FocusSection = ({ id, onNavigate }) => (
    <section id={id} className="py-24 bg-gray-900 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading accent="blue" className="mb-6">What We Do</SectionHeading>
            <p className="text-center text-lg text-gray-400 max-w-3xl mx-auto mb-16">
                Three areas, one approach: understandable assets, disciplined pricing,
                and a holding period measured in years rather than quarters.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {FOCUS_AREAS.map((area) => (
                    <div
                        key={area.name}
                        className="bg-gray-800 p-8 rounded-xl shadow-2xl transition duration-500 hover:shadow-yellow-400/30 hover:bg-gray-700/80 border-t-4 border-yellow-400 flex flex-col"
                    >
                        <div className="p-4 rounded-full bg-blue-600 inline-block self-start mb-6">
                            {area.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-yellow-400">{area.name}</h3>
                        <p className="text-gray-300 leading-relaxed flex-grow">{area.body}</p>
                        {area.link && (
                            <button
                                onClick={() => onNavigate(area.link.target)}
                                className="mt-6 inline-flex items-center self-start text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition"
                            >
                                {area.link.label}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Commercial Real Estate ------------------------------------------------

const RE_CATEGORIES = [
    {
        name: 'Income-producing commercial property',
        icon: <Building className="w-8 h-8 text-blue-600" />,
        body: 'Assets with credible in-place cash flow and a tenant base we can understand.',
    },
    {
        name: 'Owner-occupied and operationally useful property',
        icon: <Store className="w-8 h-8 text-blue-600" />,
        body: 'Real estate that supports a business we own or intend to own.',
    },
    {
        name: 'Small business and flex space',
        icon: <Warehouse className="w-8 h-8 text-blue-600" />,
        body: 'Light industrial, flex, and small-bay properties serving local operators.',
    },
    {
        name: 'Multi-tenant commercial',
        icon: <Users className="w-8 h-8 text-blue-600" />,
        body: 'Properties where diversified tenancy supports steadier income.',
    },
    {
        name: 'Select value-add opportunities',
        icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
        body: 'Situations where focused capital, better management, or repositioning improves the asset — not speculative development.',
    },
];

const RealEstateSection = ({ id }) => (
    <section id={id} className="py-24 bg-gradient-to-b from-gray-50 to-white text-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading className="mb-6">Commercial Real Estate</SectionHeading>
            <p className="text-center text-lg text-gray-500 max-w-3xl mx-auto mb-16">
                Real estate is a natural extension of how we already invest: understandable
                assets, durable cash flow, and a long holding period. We evaluate commercial
                property in the Dallas–Fort Worth area and across Texas where income, strategic
                use, or long-term ownership can create value.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {RE_CATEGORIES.map((cat) => (
                    <div
                        key={cat.name}
                        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                    >
                        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                            {cat.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-3">{cat.name}</h3>
                        <p className="text-gray-500 leading-relaxed">{cat.body}</p>
                    </div>
                ))}
            </div>

            {/* How we underwrite */}
            <div className="bg-gray-900 text-white rounded-2xl p-10">
                <h3 className="text-2xl font-bold mb-4 text-center">How We Underwrite</h3>
                <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto text-center mb-8">
                    We underwrite to in-place income, verified operating expenses, and realistic
                    reserves. We size debt conservatively, we review leases and tenant credit
                    carefully, and we prefer clean diligence over speed. If the economics don't
                    support the price, we say so early rather than retrade late.
                </p>
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        <span className="font-semibold text-white">Brokers and property owners:</span>{' '}
                        we review commercial opportunities directly and respond promptly, including
                        on the ones we pass on.
                    </p>
                    <a
                        href={`mailto:${EMAIL_REAL_ESTATE}?subject=Commercial%20real%20estate%20opportunity`}
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-lg transition"
                    >
                        Send Us a Property
                    </a>
                </div>
            </div>
        </div>
    </section>
);

// --- How We Invest ---------------------------------------------------------

const PRINCIPLES = [
    {
        name: 'Long-Term Ownership',
        icon: <Clock className="w-7 h-7 text-gray-900" />,
        body: 'We buy to hold. Our default holding period is indefinite, and we underwrite as though we will still own the asset in ten years.',
    },
    {
        name: 'Disciplined Underwriting',
        icon: <Calculator className="w-7 h-7 text-gray-900" />,
        body: 'We underwrite to what a business or property actually produces today, not to what it might produce under ideal conditions.',
    },
    {
        name: 'Operational Understanding',
        icon: <Wrench className="w-7 h-7 text-gray-900" />,
        body: 'We want to understand how something actually runs — its customers, its costs, its people — before we own it.',
    },
    {
        name: 'Responsible Leverage',
        icon: <Scale className="w-7 h-7 text-gray-900" />,
        body: 'Debt is a tool, not a strategy. We size it so an asset can carry itself through a soft year.',
    },
    {
        name: 'Willingness to Walk',
        icon: <DoorOpen className="w-7 h-7 text-gray-900" />,
        body: 'Most opportunities do not work. We say no early and clearly rather than retrade late.',
    },
];

const ApproachSection = ({ id }) => (
    <section id={id} className="py-24 bg-gray-900 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading accent="blue" className="mb-16">How We Invest</SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {PRINCIPLES.map((principle, index) => (
                    <div
                        key={principle.name}
                        className={`flex items-start bg-gray-800/60 rounded-xl p-6 border-l-4 border-yellow-400 ${
                            index === PRINCIPLES.length - 1 ? 'md:col-span-2' : ''
                        }`}
                    >
                        <div className="bg-yellow-400 rounded-lg p-3 mr-5 flex-shrink-0">
                            {principle.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{principle.name}</h3>
                            <p className="text-gray-400 leading-relaxed">{principle.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Sellers (preserved from the existing site) ----------------------------

const SellerSection = ({ id }) => (
    <section id={id} className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-6 leading-tight">Thinking About Selling Your Business?</h2>
            <p className="text-center text-xl text-gray-500 mb-16 max-w-3xl mx-auto">
                Blue Star Equity Group acquires service-based businesses from owners who have built something worth preserving.
            </p>
            <div className="grid lg:grid-cols-3 gap-8 mb-12">

                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-8 lg:p-10 text-center border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                    <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3">We Buy Service Businesses</h3>
                    <p className="text-gray-500">Insurance agencies, landscaping, property services, home services, and similar businesses with recurring revenue and strong local reputations.</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-8 lg:p-10 text-center border border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3">We Honor What You Built</h3>
                    <p className="text-gray-500">We protect your customers, retain your team, and continue your legacy — we don't buy businesses to strip them down. We buy them to make them stronger.</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-8 lg:p-10 text-center border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                    <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3">Confidential &amp; Straightforward</h3>
                    <p className="text-gray-500">Our process is direct and confidential. We work readily with brokers, attorneys, and CPAs when you prefer, and we move with respect for your timeline and clear communication throughout.</p>
                </div>

            </div>

            {/* What We Look For */}
            <div className="bg-gray-900 text-white rounded-2xl p-10 text-center">
                <h3 className="text-2xl font-bold mb-4">What We Look For</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
                    <div className="flex items-start"><span className="text-blue-400 mr-3 text-xl">✓</span><span>Established service business with 2+ years of operation</span></div>
                    <div className="flex items-start"><span className="text-blue-400 mr-3 text-xl">✓</span><span>Revenue between $300K–$5M annually</span></div>
                    <div className="flex items-start"><span className="text-blue-400 mr-3 text-xl">✓</span><span>Owner ready to transition within 12–24 months</span></div>
                    <div className="flex items-start"><span className="text-blue-400 mr-3 text-xl">✓</span><span>Texas-based or surrounding region preferred</span></div>
                </div>
                <a href={`mailto:${EMAIL_ACQUISITIONS}`} className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-lg transition">
                    Start a Confidential Conversation
                </a>
            </div>

        </div>
    </section>
);

// --- Contact ---------------------------------------------------------------

const CONTACT_ROUTES = [
    { label: 'General inquiries', email: EMAIL_GENERAL },
    { label: 'Business owners & intermediaries', email: EMAIL_ACQUISITIONS },
    { label: 'Commercial real estate', email: EMAIL_REAL_ESTATE },
];

const ContactSection = ({ id }) => (
    <section id={id} className="py-24 bg-white text-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading accent="blue" className="mb-6">Contact</SectionHeading>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                We welcome inquiries regarding acquisitions, partnerships, and commercial
                real estate opportunities. Every message is read directly and answered.
            </p>

            <a
                href={`mailto:${EMAIL_GENERAL}`}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-lg"
            >
                <Mail className="mr-3 w-5 h-5" />
                Email Us
            </a>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                {CONTACT_ROUTES.map((route) => (
                    <div key={route.label} className="border-t-2 border-gray-200 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2 sm:min-h-[2.25rem]">
                            {route.label}
                        </p>
                        <a
                            href={`mailto:${route.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800 transition font-medium break-words"
                        >
                            {route.email}
                        </a>
                    </div>
                ))}
            </div>

            <p className="mt-12 inline-flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                Dallas–Fort Worth, Texas
            </p>
        </div>
    </section>
);

// --- Footer ----------------------------------------------------------------

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-gray-900 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:order-2">
                        <Logo className="text-sm" />
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center md:text-left text-base text-gray-400">
                            &copy; {currentYear} Blue Star Equity Group. All rights reserved.
                        </p>
                        <p className="text-center md:text-left text-xs text-gray-500 mt-1">
                            Operating Businesses &middot; Commercial Real Estate &middot; Strategic Investments
                        </p>
                        <p className="text-center md:text-left text-xs text-gray-500 mt-1">
                            Dallas–Fort Worth, Texas
                        </p>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-800">
                    <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
                        Blue Star Equity Group is a privately held investment and holding company.
                        Information presented on this website is for general informational purposes
                        only and does not constitute an offer, solicitation, investment advice, legal
                        advice, or tax advice.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// --- App -------------------------------------------------------------------

const App = () => {
    const [currentSection, setCurrentSection] = useState('home');

    const navigate = useCallback((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(id);

        if (window.history?.replaceState) {
            const base = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', id === 'home' ? base : `${base}#${id}`);
        }
    }, []);

    // Honour a deep link such as /#real-estate on first load. React has not
    // rendered when the browser performs its own hash jump, so do it here.
    useEffect(() => {
        const id = window.location.hash.replace('#', '');
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        setCurrentSection(id);
        // Explicit 'auto' overrides the global `scroll-behavior: smooth`, so a
        // deep link such as /#real-estate lands immediately instead of
        // animating the whole page past the visitor.
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'auto' }));
    }, []);

    // Keep the active nav item in sync while scrolling.
    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setCurrentSection(visible.target.id);
            },
            { rootMargin: '-80px 0px -50% 0px', threshold: [0.1, 0.5] }
        );

        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar currentSection={currentSection} onNavigate={navigate} />
            <main>
                <HeroSection id="home" onNavigate={navigate} />
                <AboutSection id="about" />
                <FocusSection id="focus" onNavigate={navigate} />
                <RealEstateSection id="real-estate" />
                <ApproachSection id="approach" />
                <SellerSection id="sellers" />
                <ContactSection id="contact" />
            </main>
            <Footer />
        </div>
    );
};

export default App;
