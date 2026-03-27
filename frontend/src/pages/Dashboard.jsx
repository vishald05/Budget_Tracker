import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase';

const Dashboard = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense'); 

    useEffect(() => {
        if (!user) return;
        const txRef = ref(db, `transactions/${user.uid}`);
        const unsubscribe = onValue(txRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedTransactions = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...val
                }));
                // Sort descending by timestamp
                loadedTransactions.sort((a, b) => b.timestamp - a.timestamp);
                setTransactions(loadedTransactions);
            } else {
                setTransactions([]);
            }
        });
        return () => unsubscribe();
    }, [user]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!amount || !category || !user) return;
        
        const newTx = {
            amount: parseFloat(amount),
            category,
            type,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };
        
        const txRef = ref(db, `transactions/${user.uid}`);
        push(txRef, newTx);
        
        setAmount('');
        setCategory('');
    };

    const expenseData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.category);
            if (existing) existing.value += curr.amount;
            else acc.push({ name: curr.category, value: curr.amount });
            return acc;
        }, []);

    const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];

    return (
        <div className="container mx-auto p-6 max-w-6xl transition-colors duration-200">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-gray-100">Add Transaction</h2>
                    <form onSubmit={handleAdd}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Type</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`flex-1 py-2 rounded-md font-bold transition-colors ${type === 'expense' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={`flex-1 py-2 rounded-md font-bold transition-colors ${type === 'income' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    Income
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Amount</label>
                            <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Category (e.g., Food, Salary)</label>
                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                        </div>
                        
                        <button type="submit" className={`w-full text-white font-bold py-2 rounded-md transition ${type === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                            Add {type === 'expense' ? 'Expense' : 'Income'}
                        </button>
                    </form>
                </div>

                {/* Graph Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
                    <h2 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-gray-100">Expenses Breakdown</h2>
                    {expenseData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value}`} contentStyle={{ backgroundColor: '#1f2937', color: '#f3f4f6', border: 'none', borderRadius: '8px' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">No expenses to display yet.</p>
                    )}
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
                <h2 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-gray-100">Recent Transactions</h2>
                {transactions.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map(tx => (
                            <li key={tx.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold dark:text-gray-200">{tx.category}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                                </div>
                                <span className={`font-bold ${tx.type === 'expense' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                                    {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No transactions recorded.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
