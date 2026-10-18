import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    useEffect(() => {
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
        <nav className="site-header">
            <div className="site-header-inner">
                    <div className="brand" onClick={() => navigate('/')}><span className="brand-mark">₹</span><span className="brand-name">BudgetTracker</span></div>
                    <div className="summary-strip">
                        <div className="summary-item teal"><span className="summary-label">Income</span><strong>₹{summary.income.toFixed(2)}</strong></div>
                        <div className="summary-item"><span className="summary-label">Spent</span><strong>₹{summary.expense.toFixed(2)}</strong></div>
                        <div className="summary-item"><span className="summary-label">Balance</span><strong className={summary.balance < 0 ? 'amount expense' : ''}>₹{summary.balance.toFixed(2)}</strong></div>
                    </div>
                    <div className="header-actions">
                        <span className="user-chip">{displayName}</span>
                        <button onClick={toggleTheme} className="icon-button" title="Toggle dark mode" aria-label="Toggle dark mode">
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button onClick={handleLogout} className="icon-button" title="Log out" aria-label="Log out">
                            <LogOut size={18} />
                        </button>
                    </div>
            </div>
        </nav>
    );
};

export default Navbar;
