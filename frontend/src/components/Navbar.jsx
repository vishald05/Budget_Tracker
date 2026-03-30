import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Wallet, TrendingUp, TrendingDown, IndianRupee, Sun, Moon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Initial sync of dark state
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }
        
        if (!user) return;
        const txRef = ref(db, `transactions/${user.uid}`);
        const unsubscribe = onValue(txRef, (snapshot) => {
            const data = snapshot.val();
            let totalInc = 0;
            let totalExp = 0;
            if (data) {
                Object.values(data).forEach(tx => {
                    if (tx.type === 'income') totalInc += tx.amount;
                    else if (tx.type === 'expense') totalExp += tx.amount;
                });
            }
            setSummary({
                income: totalInc,
                expense: totalExp,
                balance: totalInc - totalExp
            });
        });
        return () => unsubscribe();
    }, [user]);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-xl text-gray-900 dark:text-gray-100 hidden sm:block delay-75">BudgetTracker</span>
                    </div>

                    {/* Stats Center Area */}
                    <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-2 gap-4 sm:gap-8 mx-2 text-sm sm:text-base shadow-inner transition-colors duration-200">
                        <div className="flex items-center gap-2 px-2 text-green-700 dark:text-green-400">
                            <TrendingUp className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="text-xs text-green-600/70 dark:text-green-400/70 uppercase font-semibold tracking-wider">Income</span>
                                <span className="font-bold leading-none">₹{summary.income.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-2 px-2 text-red-600 dark:text-red-400">
                            <TrendingDown className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="text-xs text-red-500/70 dark:text-red-400/70 uppercase font-semibold tracking-wider">Expense</span>
                                <span className="font-bold leading-none">₹{summary.expense.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-2 px-2 text-blue-700 dark:text-blue-400">
                            <IndianRupee className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="text-xs text-blue-600/70 dark:text-blue-400/70 uppercase font-semibold tracking-wider">Balance</span>
                                <span className={`font-bold leading-none ${summary.balance < 0 ? 'text-red-500 dark:text-red-400' : ''}`}>
                                    ₹{summary.balance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Theme toggle, Profile, Logout */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleTheme} 
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            title="Toggle Dark Mode"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        
                        <div className="hidden md:flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold uppercase transition-colors">
                                {displayName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">{displayName}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
