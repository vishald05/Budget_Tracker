import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, BarChart3, PieChart, Sun, Moon, ArrowRight } from 'lucide-react';

const Landing = () => {
    const [isDark, setIsDark] = useState(false);

    // Sync theme on mount
    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
            {/* Minimal Header for Unauthenticated Page */}
            <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-500/50">
                        ₹
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">BudgetTracker</span>
                </div>
                
                <div className="flex items-center gap-6">
                    <button 
                        onClick={toggleTheme} 
                        className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                        title="Toggle Dark Mode"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <Link to="/login" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden sm:block">
                        Login
                    </Link>
                    <Link to="/register" className="text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full transition shadow-md shadow-emerald-500/20">
                        Sign up free
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center text-center px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 max-w-4xl mx-auto w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Now with AI Financial Advisor ✨
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Master your money. <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 block mt-2 pb-2">
                        Shape your future.
                    </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Track every rupee, brilliantly visualize your spending trends, and let our embedded Artificial Intelligence guide you toward better financial habits natively.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link to="/register" className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-gray-900/20 dark:shadow-emerald-500/30">
                        Start Tracking Currently <ArrowRight size={20} />
                    </Link>
                </div>
            </main>

            {/* Quotes Section */}
            <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-800 transition-colors">
                <div className="max-w-5xl mx-auto px-6 text-center">
                   <blockquote className="text-xl sm:text-2xl font-serif italic text-gray-800 dark:text-gray-200">
                    "A budget is telling your money where to go instead of wondering where it went."
                   </blockquote>
                   <p className="mt-4 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-sm">— John C. Maxwell</p>
                </div>
            </section>

            {/* Application Features Detail Grid */}
            <section className="py-20 px-6 max-w-6xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold mb-4">Everything you need to succeed</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A beautifully simple yet powerful toolset designed for elegant people who want to take control of their financial destiny without the clutter.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <PieChart size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Live Visualizations</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            See your spending habits instantly with intelligent pie charts and trend graphs natively integrated to map every transaction type.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 transform md:-translate-y-4">
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Bot size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Financial Advisor</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Powered natively by Google Gemini. Get contextual answers and highly personalized advice based directly on your actual wallet behavior.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Deep Filtering</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Browse through your history bounds smoothly by day, week, month, or year. Export everything flawlessly to secure frontend CSVs or JSON arrays.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer space */}
            <footer className="mt-auto py-8 text-center text-sm font-medium text-gray-500 border-t border-gray-200 dark:border-gray-800">
                <p>© {new Date().getFullYear()} BudgetTracker App. Empowering finances securely.</p>
            </footer>
        </div>
    );
};

export default Landing;
