import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, addDoc, serverTimestamp, where, deleteDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// --- Custom Icon Components (Simulating lucide-react) ---
const Star = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const Briefcase = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const Mail = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const Phone = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.7-6.7A19.79 19.79 0 0 1 2 4.18V2a2 2 0 0 1 2-2 16.92 16.92 0 0 1 8.63 3.07 19.5 19.5 0 0 1 6.7 6.7A19.79 19.79 0 0 1 22 16.92z"/></svg>);
const ArrowRight = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const CornerDownRight = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l5 5-5 5"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>);
const Zap = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const Shield = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const Landmark = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><path d="M6 18H2v-7l6-6 6 6v7h-4"/><path d="M21 18h-4v-7l-6-6-2 2"/></svg>);
const Sprout = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M12 4v16"/><path d="M7 12a3 3 0 0 1 6 0 3 3 0 0 0 6 0c0-3-2-6-2-6s-1.5-3-2-3-4 2-4 2-2 1.5-2 3c0 3 2 6 2 6a3 3 0 0 0-6 0c0-3-2-6-2-6s-1.5-3-2-3-4 2-4 2-2 1.5-2 3a3 3 0 0 0 6 0Z"/></svg>);
const X = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const Check = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>);
const Key = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.2 15.6-3.8-3.8C18.2 10.5 19 8.7 19 7c0-3.9-3.1-7-7-7s-7 3.1-7 7c0 1.7.8 3.5 1.6 4.8l-3.8 3.8a1 1 0 0 0 0 1.4l.6.6a1 1 0 0 0 1.4 0l3.8-3.8C9.5 18.2 11.3 19 13 19c3.9 0 7-3.1 7-7s-3.1-7-7-7c-1.7 0-3.5.8-4.8 1.6l-3.8 3.8a1 1 0 0 0 0 1.4l.6.6a1 1 0 0 0 1.4 0l3.8-3.8C15.5 18.2 17.3 19 19 19c3.9 0 7-3.1 7-7s-3.1-7-7-7z"/></svg>);
const AtSign = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4.89 8.64"/></svg>);


// --- Firebase Setup & Context ---

// Global Firebase state
let db = null;
let auth = null;
let functions = null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const FirebaseProvider = ({ children }) => {
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [hiringStatus, setHiringStatus] = useState({});

    // 1. Firebase Initialization and Authentication
    useEffect(() => {
        if (!firebaseConfig) {
            console.warn("Firebase config not available. Running in demo mode without backend features.");
            setIsAuthReady(true);
            return;
        }

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        functions = getFunctions(app, 'us-central1'); // Specify region

        // Sign in or set up auth listener
        const signInUser = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase Auth error:", error);
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setIsAuthReady(true);
        });

        signInUser();

        return () => unsubscribeAuth();
    }, []);

    // 2. Real-time Job Data Listener (onSnapshot)
    useEffect(() => {
        if (!isAuthReady || !db) return;

        const jobsCollectionPath = `/artifacts/${appId}/public/data/jobs`;
        const q = query(collection(db, jobsCollectionPath));

        const unsubscribeJobs = onSnapshot(q, (snapshot) => {
            const fetchedJobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                datePosted: doc.data().datePosted?.toDate ? doc.data().datePosted.toDate() : new Date(),
            })).sort((a, b) => b.datePosted - a.datePosted); // Sort by newest first

            setJobs(fetchedJobs);

            // Calculate hiring status for portfolio companies
            const statusMap = fetchedJobs.reduce((acc, job) => {
                acc[job.company] = true;
                return acc;
            }, {});
            setHiringStatus(statusMap);

        }, (error) => {
            console.error("Firestore Job Data error:", error);
        });

        return () => unsubscribeJobs();
    }, [isAuthReady]);

    // Value exposed to children components
    const contextValue = {
        isAuthReady,
        db,
        userId,
        jobs,
        hiringStatus,
        appId,
        auth
    };

    if (!isAuthReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <p className="text-xl">Initializing services...</p>
            </div>
        );
    }

    return (
        <FirebaseContext.Provider value={contextValue}>
            {children}
        </FirebaseContext.Provider>
    );
};

// Create a context for state management
const FirebaseContext = React.createContext();
const useFirebase = () => React.useContext(FirebaseContext);

// --- Custom Components ---

// Blue Star Logo
const Logo = ({ className = "" }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <Star className="w-8 h-8 text-yellow-400 fill-current" />
        <span className="text-2xl font-extrabold tracking-tight text-white">
            Blue Star
        </span>
        <span className="text-2xl font-light tracking-tight text-yellow-400">
            Equity Group
        </span>
    </div>
);

// Navigation Bar
const Navbar = ({ sections, currentPage, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (id) => {
        onNavigate(id);
        setIsOpen(false);
        // Smooth scroll only if it's a section on the main page
        if (id !== 'post-job') {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-95 shadow-lg backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center transition-all duration-300">
                <Logo />

                {/* Desktop Nav */}
                <nav className="hidden lg:flex space-x-8">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => handleNavigation(section.id)}
                            className={`font-medium transition duration-150 ease-in-out uppercase text-sm tracking-widest ${
                                currentPage === section.id
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
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-gray-800 border-t border-gray-700">
                    {sections.map((section) => (
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

// Hero Section
const HeroSection = ({ id, onNavigate }) => (
    <section id={id} className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Abstract Background Grid/Pattern for Finance Aesthetic */}
        <div className="absolute inset-0 opacity-10">
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
            <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-tight mb-4 animate-fadeInUp">
                Fueling <span className="text-yellow-400">Growth</span>, Building <span className="text-blue-400">Legacy</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-3xl mx-auto animate-fadeInUp delay-200">
                A modern private equity group dedicated to transformative value creation through strategic acquisition and ground-up ventures.
            </p>
            <button
                onClick={() => document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-xl transform hover:scale-105"
            >
                Explore Our Portfolio
                <ArrowRight className="ml-3 w-4 h-4" />
            </button>
        </div>
    </section>
);

// About Section (Corrected JSX)
const AboutSection = ({ id }) => (
    <section id={id} className="py-24 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-center mb-16 border-b-2 border-yellow-400 pb-2 inline-block mx-auto">
                Our Investment Strategy
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Blue Star Equity Group is an active management private equity firm focused on identifying, acquiring, and developing high-potential businesses across diverse sectors. Our model is built on flexibility and deep operational expertise, allowing us to generate superior returns regardless of the investment origin.
                    </p>
                    <p className="text-xl font-semibold text-blue-700">
                        We don't just invest capital; we invest operational leadership and strategic vision to unlock intrinsic value.
                    </p>
                    <ul className="space-y-4 pt-4">
                        <li className="flex items-start">
                            <Zap className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Acquisition & Transformation</h3>
                                <p className="text-gray-600">Acquiring established businesses with solid fundamentals that require strategic realignment and aggressive growth initiatives.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CornerDownRight className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Ground-Up Ventures</h3>
                                <p className="text-gray-600">Building new, innovative companies from the initial concept, leveraging market gaps and technology for scalable solutions.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                {/* Value Creation Visual Placeholder */}
                <div className="bg-gray-100 p-8 rounded-xl shadow-2xl">
                    <div className="text-center">
                        <Briefcase className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">Value Creation Cycle</h4>
                        <div className="space-y-4">
                            <p className="flex items-center justify-center text-lg bg-white p-3 rounded-lg shadow-md border-b-4 border-blue-500">
                                1. Target Identification & Due Diligence
                            </p>
                            <p className="flex items-center justify-center text-lg bg-white p-3 rounded-lg shadow-md border-b-4 border-blue-500">
                                2. Strategic Investment & Operational Overhaul
                            </p>
                            <p className="flex items-center justify-center text-lg bg-white p-3 rounded-lg shadow-md border-b-4 border-blue-500">
                                3. Sustained Growth & Market Expansion
                            </p>
                            <p className="flex items-center justify-center text-lg bg-yellow-400 p-3 rounded-lg shadow-md border-b-4 border-yellow-600 font-bold">
                                4. Successful Exit & Investor Return
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Portfolio Section (Updated with Hiring Indicator)
const PortfolioSection = ({ id, onNavigate }) => {
    const { hiringStatus } = useFirebase();

    const portfolioCompanies = [
        {
            name: "Lonestar Hydro Solutions",
            description: "Providing advanced, sustainable water management and hydraulic solutions for commercial and industrial applications.",
            icon: <Landmark className="w-10 h-10 text-white" />,
            type: "Acquisition & Optimization",
            url: "https://funny-concha-c4f069.netlify.app/",
            isHiring: hiringStatus["Lonestar Hydro Solutions"]
        },
        {
            name: "Circle H Lawn and Tree",
            description: "A comprehensive, customer-focused provider of professional landscape and arboreal maintenance services.",
            icon: <Sprout className="w-10 h-10 text-white" />,
            type: "Acquisition & Optimization",
            url: "https://v5h4wvjryn-star.github.io/CHLTv2/",
            isHiring: hiringStatus["Circle H Lawn and Tree"]
        },
        {
            name: "Blue Star Heritage Insurance",
            description: "A modern insurance brokerage specializing in risk management and tailored personal and commercial coverage solutions.",
            icon: <Shield className="w-10 h-10 text-white" />,
            type: "Ground-Up Venture",
            url: "https://jovial-manatee-38798e.netlify.app/#services",
            isHiring: hiringStatus["Blue Star Heritage Insurance"]
        },
        {
            name: "Blue Star FinCo",
            description: "Financial services platform offering flexible debt and equity financing solutions to small and mid-market businesses.",
            icon: <Briefcase className="w-10 h-10 text-white" />,
            type: "Ground-Up Venture",
            url: null,
            isHiring: hiringStatus["Blue Star FinCo"]
        },
    ];

    return (
        <section id={id} className="py-24 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center mb-16 border-b-2 border-blue-400 pb-2 inline-block mx-auto">
                    Our Portfolio of Companies
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {portfolioCompanies.map((company, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 p-6 rounded-xl shadow-2xl transition duration-500 hover:shadow-yellow-400/30 hover:bg-gray-700/80 transform hover:scale-[1.02] border-t-4 border-yellow-400 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-4 rounded-full bg-blue-600 inline-block">
                                        {company.icon}
                                    </div>
                                    {/* Now Hiring Indicator (Green Light) */}
                                    <div
                                        className={`flex items-center space-x-2 text-sm font-semibold rounded-full px-3 py-1 transition-colors duration-500 ${
                                            company.isHiring
                                                ? 'bg-green-600 text-white shadow-lg cursor-pointer'
                                                : 'bg-gray-600 text-gray-400'
                                        }`}
                                        onClick={() => company.isHiring && onNavigate('careers')}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${company.isHiring ? 'bg-green-300 animate-pulse' : 'bg-gray-400'}`}></div>
                                        <span>{company.isHiring ? 'Now Hiring' : 'No Openings'}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                                    {company.name}
                                </h3>
                                <p className="text-gray-300 mb-4 text-sm font-light italic">
                                    {company.type}
                                </p>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    {company.description}
                                </p>
                            </div>

                            {/* Conditional Website Button */}
                            {company.url ? (
                                <a
                                    href={company.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-lg transform hover:scale-[1.01]"
                                >
                                    Visit Website
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-500 bg-gray-700 cursor-not-allowed"
                                >
                                    Website Coming Soon
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Careers Section (New Public Page)
const CareersSection = ({ id, onNavigate }) => {
    const { jobs } = useFirebase();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterLocation, setFilterLocation] = useState('');

    const portfolioCompanies = [
        "All Companies", "Lonestar Hydro Solutions", "Circle H Lawn and Tree",
        "Blue Star Heritage Insurance", "Blue Star FinCo"
    ];

    const allLocations = [...new Set(jobs.map(job => job.location))].sort();

    const filteredJobs = jobs.filter(job => {
        const matchesQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             job.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCompany = filterCompany === 'All Companies' || !filterCompany || job.company === filterCompany;
        const matchesLocation = !filterLocation || job.location === filterLocation;

        return matchesQuery && matchesCompany && matchesLocation;
    });

    return (
        <section id={id} className="py-24 bg-gray-50 text-gray-900 min-h-[80vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center mb-16 border-b-2 border-blue-500 pb-2 inline-block mx-auto">
                    Career Opportunities
                </h2>

                {/* Filter and Search */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                        type="text"
                        placeholder="Search job title or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <select
                        value={filterCompany}
                        onChange={(e) => setFilterCompany(e.target.value)}
                        className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        {portfolioCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        <option value="">All Locations</option>
                        {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                {/* Job Listings */}
                {filteredJobs.length > 0 ? (
                    <div className="space-y-6">
                        {filteredJobs.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition">
                                <h3 className="text-2xl font-bold text-blue-700">{job.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    {job.company} | {job.location} | Posted: {new Date(job.datePosted).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
                                <button className="mt-4 text-sm font-semibold text-yellow-600 hover:text-yellow-700 flex items-center">
                                    Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10 bg-white rounded-xl shadow-lg text-gray-500">
                        <X className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl font-semibold">No open positions matching your criteria at this time.</p>
                        <p className="mt-2">Check back soon or try adjusting your search filters.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

// Auth Box Component (used by PrivateJobPost)
const AuthBox = ({ children, title, id }) => (
    <section id={id} className="py-24 bg-gray-900 text-white min-h-screen flex items-center">
        <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border-t-4 border-yellow-400">
            <AtSign className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
            {children}
        </div>
    </section>
);

// Post Job Form Component (moved outside to prevent re-renders)
const PostJobForm = ({ handleSubmit, jobData, handleChange, portfolioCompanies, status }) => (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company</label>
            <select
                id="company"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 transition"
            >
                {portfolioCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={jobData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location (City, State/Remote)</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Job Description</label>
            <textarea
                id="description"
                name="description"
                rows="8"
                value={jobData.description}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 transition"
            ></textarea>
        </div>

        <button
            type="submit"
            disabled={status?.type === 'submitting'}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {status?.type === 'submitting' ? status.message : 'Post New Job Opening'}
            {status?.type === 'submitting' ? <Star className="ml-2 w-4 h-4 animate-spin" /> : <Check className="ml-2 w-4 h-4" />}
        </button>
    </form>
);

// Manage Jobs List Component (moved outside to prevent re-renders)
const ManageJobsList = ({ jobs, confirmDeleteId, handleDeleteStart, handleDeleteConfirm, status }) => (
    <div>
        {jobs.length === 0 ? (
            <div className="text-center p-10 bg-gray-700 rounded-xl text-gray-400">
                <X className="w-12 h-12 mx-auto mb-4" />
                <p className="text-xl font-semibold">No open positions found.</p>
                <p className="mt-2">Use the "Post New Job" tab to create a role.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {jobs.map(job => (
                    <div key={job.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md">
                        <div>
                            <h4 className="text-lg font-bold text-white">{job.title}</h4>
                            <p className="text-sm text-gray-400">
                                {job.company} - {job.location}
                            </p>
                        </div>

                        {confirmDeleteId === job.id ? (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleDeleteConfirm(job.id, job.title)}
                                    disabled={status?.type === 'submitting'}
                                    className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    CONFIRM CLOSE
                                </button>
                                <button
                                    onClick={() => handleDeleteStart(null)}
                                    className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleDeleteStart(job.id)}
                                disabled={status?.type === 'submitting'}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Close Role
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
);

// Private Job Posting Page (Updated with Email/Code Auth and Management)
const PrivateJobPost = ({ id }) => {
    const { db, appId, jobs } = useFirebase();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authStep, setAuthStep] = useState('email'); // 'email', 'code'
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState(null);
    const [jobData, setJobData] = useState({ title: '', company: 'Lonestar Hydro Solutions', location: '', description: '' });
    const [managementView, setManagementView] = useState('post'); // 'post' or 'manage'
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // NEW: Track which job is pending deletion


    // Portfolio companies list
    const portfolioCompanies = [
        "Lonestar Hydro Solutions", "Circle H Lawn and Tree",
        "Blue Star Heritage Insurance", "Blue Star FinCo"
    ];

    // Step 1: Handle Email Submission - Call Cloud Function to send code
    const handleSendCode = async (e) => {
        e.preventDefault();
        setStatus({ type: 'submitting', message: 'Sending code...' });

        try {
            // Call cloud function
            const sendLoginCode = httpsCallable(functions, 'sendLoginCode');
            const result = await sendLoginCode({ email });

            setAuthStep('code');
            setStatus({
                type: 'info',
                message: `A 6-digit code has been sent to ${email}. Please check your inbox (and spam folder).`
            });
        } catch (error) {
            console.error('Error sending code:', error);

            let errorMessage = 'Failed to send code. Please try again.';
            if (error.code === 'functions/permission-denied') {
                errorMessage = 'Access denied. Only authorized users can log in.';
            } else if (error.code === 'functions/invalid-argument') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'functions/unavailable') {
                errorMessage = 'Email service temporarily unavailable. Please contact support.';
            }

            setStatus({ type: 'error', message: errorMessage });
        }
    };

    // Step 2: Handle Code Verification - Call Cloud Function to verify
    const handleLoginWithCode = async (e) => {
        e.preventDefault();
        setStatus({ type: 'submitting', message: 'Verifying code...' });

        try {
            // Call cloud function
            const verifyLoginCode = httpsCallable(functions, 'verifyLoginCode');
            const result = await verifyLoginCode({ email, code });

            // Sign in with custom token
            if (result.data.token) {
                await signInWithCustomToken(auth, result.data.token);
            }

            setIsLoggedIn(true);
            setStatus({ type: 'success', message: 'Login successful!' });
        } catch (error) {
            console.error('Error verifying code:', error);

            let errorMessage = 'Invalid code. Please try again.';
            if (error.code === 'functions/not-found') {
                errorMessage = 'Invalid or expired code.';
            } else if (error.code === 'functions/deadline-exceeded') {
                errorMessage = 'Code has expired. Please request a new one.';
            } else if (error.code === 'functions/permission-denied') {
                errorMessage = 'Invalid code. Please try again.';
            }

            setStatus({ type: 'error', message: errorMessage });
        }
    };

    // Job Post Submission
    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'submitting', message: 'Posting...' });
        if (!jobData.title || !jobData.location || !jobData.description) {
            setStatus({ type: 'error', message: 'Please fill out all required fields.' });
            return;
        }

        try {
            const jobsCollectionPath = `/artifacts/${appId}/public/data/jobs`;
            await addDoc(collection(db, jobsCollectionPath), {
                ...jobData,
                datePosted: serverTimestamp()
            });
            setStatus({ type: 'success', message: `Job "${jobData.title}" posted successfully for ${jobData.company}!` });
            setJobData({ title: '', company: 'Lonestar Hydro Solutions', location: '', description: '' }); // Reset form
        } catch (error) {
            console.error("Error posting job:", error);
            setStatus({ type: 'error', message: 'Failed to post job. Check console for details.' });
        }
    };

    // NEW: Function to start the deletion confirmation process
    const handleDeleteStart = (jobId) => {
        setConfirmDeleteId(jobId);
        setStatus(null); // Clear main status message
    };

    // NEW: Function to execute the deletion
    const handleDeleteConfirm = async (jobId, jobTitle) => {
        setConfirmDeleteId(null); // Clear confirmation flag
        setStatus({ type: 'submitting', message: `Closing ${jobTitle}...` });

        try {
            const jobDocPath = `/artifacts/${appId}/public/data/jobs/${jobId}`;
            await deleteDoc(doc(db, jobDocPath));
            setStatus({ type: 'success', message: `Position "${jobTitle}" successfully closed.` });
        } catch (error) {
            console.error("Error deleting job:", error);
            setStatus({ type: 'error', message: 'Failed to close job. Check console for details.' });
        }
    };


    // --- Conditional Rendering for Auth Steps ---

    if (!isLoggedIn) {
        if (authStep === 'email') {
            return (
                <AuthBox id={id} title="Admin Access: Enter Email">
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
                                required
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-yellow-500 focus:border-yellow-500 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-lg"
                        >
                            Send Login Code
                            <Mail className="ml-2 w-4 h-4" />
                        </button>
                        {status?.type === 'error' && (
                            <p className="text-center text-red-400">{status.message}</p>
                        )}
                        <p className="text-center text-xs text-gray-500 pt-2">
                            Only the authorized domain owner can proceed.
                        </p>
                    </form>
                </AuthBox>
            );
        }

        if (authStep === 'code') {
            return (
                <AuthBox id={id} title="Admin Access: Enter Code">
                    {status?.type === 'info' && (
                        <p className="text-center text-blue-400 p-2 mb-4 bg-gray-700 rounded-md">
                            {status.message}
                        </p>
                    )}
                    <form onSubmit={handleLoginWithCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">6-Digit Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => { setCode(e.target.value); setStatus(null); }}
                                required
                                maxLength="6"
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white text-center text-xl tracking-widest focus:ring-yellow-500 focus:border-yellow-500 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-lg"
                        >
                            Verify & Log In
                            <Key className="ml-2 w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { setAuthStep('email'); setStatus(null); setEmail(''); setCode(''); }}
                            className="w-full text-sm text-gray-400 hover:text-gray-200 transition"
                        >
                            Change Email
                        </button>
                        {status?.type === 'error' && (
                            <p className="text-center text-red-400">{status.message}</p>
                        )}
                    </form>
                </AuthBox>
            );
        }
    }

    return (
        <section id={id} className="py-24 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center mb-16 border-b-2 border-yellow-400 pb-2 inline-block mx-auto">
                    Admin: Job Management
                </h2>

                <div className="p-8 bg-gray-800 rounded-xl shadow-2xl">
                    <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-700">
                        <p className="text-sm text-green-400">Authenticated as {AUTHORIZED_EMAIL}</p>
                        <button
                            type="button"
                            onClick={() => setIsLoggedIn(false)}
                            className="text-sm text-red-400 hover:text-red-300"
                        >
                            Log Out
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-6 space-x-4">
                        <button
                            onClick={() => {setManagementView('post'); setConfirmDeleteId(null); setStatus(null);}} // Reset status/confirm on tab switch
                            className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition ${
                                managementView === 'post'
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Post New Job
                        </button>
                        <button
                            onClick={() => {setManagementView('manage'); setConfirmDeleteId(null); setStatus(null);}} // Reset status/confirm on tab switch
                            className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition ${
                                managementView === 'manage'
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Manage Open Positions ({jobs.length})
                        </button>
                    </div>


                    {/* Status Message */}
                    {status?.type && status.type !== 'submitting' && (
                        <p className={`text-center p-3 rounded-lg mb-4 font-semibold ${
                            status.type === 'success' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'
                        }`}>
                            {status.message}
                        </p>
                    )}


                    {managementView === 'post' ? (
                        <PostJobForm
                            handleSubmit={handleSubmit}
                            jobData={jobData}
                            handleChange={handleChange}
                            portfolioCompanies={portfolioCompanies}
                            status={status}
                        />
                    ) : (
                        <ManageJobsList
                            jobs={jobs}
                            confirmDeleteId={confirmDeleteId}
                            handleDeleteStart={handleDeleteStart}
                            handleDeleteConfirm={handleDeleteConfirm}
                            status={status}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};


// Contact Section (Unchanged)
const ContactSection = ({ id }) => {
    const [status, setStatus] = useState('');

    // Simulated form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
            e.target.reset(); // Clear the form
        }, 1500);
    };

    return (
        <section id={id} className="py-24 bg-white text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center mb-16 border-b-2 border-blue-400 pb-2 inline-block mx-auto">
                    Contact Us
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8 p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900">Reach Our Team</h3>
                        <p className="text-gray-600">
                            We are ready to discuss investment opportunities, partnerships, or any general inquiries.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-6 h-6 text-blue-600" />
                                <a href="mailto:info@bluestarequitygroup.com" className="text-lg text-blue-600 hover:text-blue-800 transition font-medium">
                                    info@bluestarequitygroup.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-6 h-6 text-blue-600" />
                                <a href="tel:+15555555555" className="text-lg text-blue-600 hover:text-blue-800 transition font-medium">
                                    555-555-5555
                                </a>
                            </div>
                            <div className="pt-4">
                                <p className="text-gray-500">Headquarters (Mock Location)</p>
                                <p className="text-gray-700 font-semibold">
                                    123 Equity Plaza, Suite 400<br />
                                    Dallas, Texas 75201
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 p-8 bg-gray-900 rounded-xl shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    required
                                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 transition"
                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </button>

                            {status === 'success' && (
                                <p className="text-center text-green-400 mt-4 font-semibold">
                                    Thank you! Your message has been received and we will be in touch shortly.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Footer Component (Unchanged)
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-gray-900 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:flex md:items-center md:justify-between">
                <div className="flex justify-center md:order-2">
                    <Logo className="text-sm" />
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                    <p className="text-center text-base text-gray-400">
                        &copy; {currentYear} Blue Star Equity Group. All rights reserved.
                    </p>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        Private Equity | Value Creation | Ground-Up Ventures
                    </p>
                </div>
            </div>
        </footer>
    );
};


// Main App Component with Routing
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');

    const sections = [
        { id: 'home', name: 'Home' },
        { id: 'about', name: 'About' },
        { id: 'portfolio', name: 'Portfolio' },
        { id: 'careers', name: 'Careers' },
        { id: 'contact', name: 'Contact' },
        { id: 'post-job', name: 'Admin (Job Post)' }
    ];

    const navigate = (pageId) => {
        setCurrentPage(pageId);
    };

    const mainContent = (() => {
        if (currentPage === 'post-job') {
            return <PrivateJobPost id="post-job" />;
        }

        return (
            <main className="pt-20">
                <HeroSection id="home" onNavigate={navigate} />
                <AboutSection id="about" />
                <PortfolioSection id="portfolio" onNavigate={navigate} />
                <CareersSection id="careers" onNavigate={navigate} />
                <ContactSection id="contact" />
            </main>
        );
    })();

    return (
        <FirebaseProvider>
            <div className="min-h-screen bg-white font-sans">
                <Navbar sections={sections} currentPage={currentPage} onNavigate={navigate} />
                {mainContent}
                <Footer />
            </div>
        </FirebaseProvider>
    );
};

export default App;
