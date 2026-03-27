import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const History = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all'); // all, expense, income

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

    const filteredTransactions = transactions.filter(tx => filter === 'all' || tx.type === filter);

    return (
        <div className="container mx-auto p-6 max-w-6xl transition-colors duration-200">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Transaction History</h1>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
                {/* Filter Buttons */}
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setFilter('all')} 
                        className={`px-6 py-2 rounded-md font-bold transition-colors ${filter === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter('expense')} 
                        className={`px-6 py-2 rounded-md font-bold transition-colors ${filter === 'expense' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        Expenses
                    </button>
                    <button 
                        onClick={() => setFilter('income')} 
                        className={`px-6 py-2 rounded-md font-bold transition-colors ${filter === 'income' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        Incomes
                    </button>
                </div>

                {/* Table */}
                {filteredTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 dark:border-gray-700">
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Category</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Type</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{tx.date}</td>
                                        <td className="py-4 px-4 text-gray-800 dark:text-gray-200 font-medium">{tx.category}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tx.type === 'expense' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className={`py-4 px-4 text-right font-bold whitespace-nowrap ${tx.type === 'expense' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                                            {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No {filter !== 'all' ? filter : ''} transactions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;