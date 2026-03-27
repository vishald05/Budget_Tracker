import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const updateTotals = () => {
        const currentData = JSON.parse(localStorage.getItem('budget_transactions') || '[]');
        let totalInc = 0;
        let totalExp = 0;
        currentData.forEach(tx => {
            if (tx.type === 'income') totalInc += tx.amount;
            else if (tx.type === 'expense') totalExp += tx.amount;
        });
        setSummary({
            income: totalInc,
            expense: totalExp,
            balance: totalInc - totalExp
        });
    };

    useEffect(() => {
        updateTotals();
        window.addEventListener('storage', updateTotals);
        return () => window.removeEventListener('storage', updateTotals);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="bg-white shadow-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Wallet className="h-8 w-8 text-blue-600" />
                        <span className="font-bold text-xl text-gray-900 hidden sm:block">BudgetTracker</span>
                    </div>

                    {/* Stats Center Area */}
                    <div className="flex bg-gray-100 rounded-lg p-2 gap-4 sm:gap-8 mx-2 text-sm sm:text-base shadow-inner">
                        <div className="flex items-center gap-2 px-2 text-green-700">
                            <TrendingUp className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="text-xs text-green-600/70 uppercase font-semibold tracking-wider">Income</span>
                                <span className="font-bold leading-none">${summary.income.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="w-px bg-gray-300"></div>
                        <div className="flex items-center gap-2 px-2 text-red-600">
                            <TrendingDown className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="text-xs text-red-500/70 uppercase font-semibold tracking-wider">Expense</span>
                                <span className="font-bold leading-none">${summary.expense.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="w-px bg-gray-300"></div>
                        <div className="flex items-center gap-2 px-2 text-blue-700">
                            <DollarSign className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="text-xs text-blue-600/70 uppercase font-semibold tracking-wider">Balance</span>
                                <span className={`font-bold leading-none ${summary.balance < 0 ? 'text-red-500' : ''}`}>
                                    ${summary.balance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                                {user?.username?.charAt(0) || 'U'}
                            </div>
                            <span className="font-medium text-gray-700">{user?.username || 'User'}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
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
