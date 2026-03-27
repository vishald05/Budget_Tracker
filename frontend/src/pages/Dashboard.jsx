import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('budget_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense'); 

    useEffect(() => {
        localStorage.setItem('budget_transactions', JSON.stringify(transactions));
        window.dispatchEvent(new Event('storage'));
    }, [transactions]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!amount || !category) return;
        const newTx = {
            id: Date.now(),
            amount: parseFloat(amount),
            category,
            type,
            date: new Date().toLocaleDateString()
        };
        setTransactions([...transactions, newTx]);
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
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Add Transaction</h2>
                    <form onSubmit={handleAdd}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring">
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                            <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring" />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category (e.g., Food, Salary)</label>
                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring" />
                        </div>
                        
                        <button type="submit" className={`w-full text-white font-bold py-2 rounded-md transition ${type === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                            Add {type === 'expense' ? 'Expense' : 'Income'}
                        </button>
                    </form>
                </div>

                {/* Graph Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Expenses Breakdown</h2>
                    {expenseData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center mt-10">No expenses to display yet.</p>
                    )}
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Recent Transactions</h2>
                {transactions.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {transactions.slice().reverse().map(tx => (
                            <li key={tx.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{tx.category}</p>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                                <span className={`font-bold ${tx.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                                    {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No transactions recorded.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
