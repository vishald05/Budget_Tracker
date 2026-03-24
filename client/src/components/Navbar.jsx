import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { currentUser } = useAuth();
    const { balance } = useUser();

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
            <div className="container mx-auto px-4 max-w-7xl h-16 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-1.5 rounded-lg group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 3h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 3h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        Budget<span className="text-indigo-600">Tracker</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                           <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Balance</p> 
                           <p className={`text-lg font-bold ${balance >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                                ${typeof balance === 'number' ? balance.toFixed(2) : '0.00'}
                           </p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end">
                             <span className="text-sm font-medium text-slate-700">{currentUser?.email?.split('@')[0]}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
