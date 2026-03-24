import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import AddExpenseModal from '../components/AddExpenseModal'; // Import the new modal
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const { balance, fetchBalance, setBalance } = useUser();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#3b82f6', '#f59e0b', '#64748b'];

    useEffect(() => {
        fetchExpenses();
        fetchBalance(); // Ensure balance is up to date
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            // Ensure expenses are sorted by date desc
            const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setExpenses(sorted);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching expenses", error);
            setLoading(false);
        }
    };

    const handleAddExpense = async (expenseData) => {
        try {
            const res = await api.post('/expenses', expenseData);
            setExpenses([res.data, ...expenses]);
            // Update balance immediately based on the response or fetch again
             if (res.data.updatedBalance !== undefined) {
                 setBalance(res.data.updatedBalance);
             } else {
                 fetchBalance();
             }
        } catch (error) {
            console.error("Error adding expense", error);
            // Optionally show error to user
        }
    };

    // --- Calculations ---
    const totalIncome = expenses
        .filter(e => e.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = expenses
        .filter(e => e.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Filter categories for Pie Chart
    const categoryData = Object.entries(
        expenses
            .filter(e => e.type === 'expense')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                return acc;
            }, {})
    ).map(([name, value]) => ({ name, value }));

    // Weekly Data for Bar Chart
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    };

    // Properly group expenses by date for the bar chart
    const weeklyData = getLast7Days().map(dateStr => {
        const dayExpenses = expenses
            .filter(e => e.date.startsWith(dateStr) && e.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
        
        return {
            day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
            amount: dayExpenses
        };
    });

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="container mx-auto px-4 max-w-7xl pt-8">
                
                {/* Header & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 text-sm">Welcome back, here's your financial overview.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Transaction
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balance */}
                    <div className="card border-l-4 border-l-indigo-500 flex flex-col justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Balance</p>
                            <h2 className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                                ${balance?.toFixed(2)}
                            </h2>
                        </div>
                        <div className="mt-4 text-xs text-slate-400 flex items-center gap-1">
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">All Accounts</span>
                        </div>
                    </div>

                    {/* Income */}
                    <div className="card border-l-4 border-l-emerald-500 flex flex-col justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Income</p>
                            <h2 className="text-3xl font-bold mt-2 text-slate-800">
                                ${totalIncome.toFixed(2)}
                            </h2>
                        </div>
                         <div className="mt-4 text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                            </svg>
                            Income
                        </div>
                    </div>

                    {/* Expense */}
                    <div className="card border-l-4 border-l-rose-500 flex flex-col justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Expense</p>
                            <h2 className="text-3xl font-bold mt-2 text-slate-800">
                                ${totalExpense.toFixed(2)}
                            </h2>
                        </div>
                        <div className="mt-4 text-xs text-rose-500 flex items-center gap-1 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                            </svg>
                            Expense
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Bar Chart - Spending Trend */}
                    <div className="card lg:col-span-2 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800">Spending Trends (Last 7 Days)</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="day" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 12}} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 12}} 
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip 
                                        cursor={{fill: '#f1f5f9'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart - Category Breakdown */}
                    <div className="card min-h-[400px] flex flex-col">
                        <h3 className="font-bold text-slate-800 mb-6">Expense By Category</h3>
                        <div className="flex-1 min-h-[200px] relative">
                             {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36} 
                                            iconType="circle"
                                            iconSize={8}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                             ) : (
                                 <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                                     No expense data available
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="card overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                         <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <th className="pb-3 font-semibold pl-4">Transaction</th>
                                    <th className="pb-3 font-semibold">Category</th>
                                    <th className="pb-3 font-semibold">Date</th>
                                    <th className="pb-3 font-semibold text-right pr-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-600">
                                {expenses.length > 0 ? (
                                    expenses.slice(0, 5).map((expense, idx) => (
                                        <tr key={expense.id || idx} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none">
                                            <td className="py-4 pl-4 font-medium text-slate-900 flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expense.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {expense.type === 'income' ? (
                                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                                    ) : (
                                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                                                    )}
                                                </div>
                                                {expense.description || "Untitled"}
                                            </td>
                                            <td className="py-4">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="py-4 text-slate-500">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </td>
                                            <td className={`py-4 text-right pr-4 font-semibold ${expense.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-400">
                                            No transactions yet. Add one to see it here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AddExpenseModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onAddExpense={handleAddExpense} 
                />
            </div>
        </div>
    );
};

export default Dashboard;
