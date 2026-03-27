import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileJson } from 'lucide-react';

const History = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [typeFilter, setTypeFilter] = useState('all'); // all, expense, income
    
    // New States for Time-filtering & Charts
    const [dateRangeFilter, setDateRangeFilter] = useState('all'); // all, thisMonth, lastMonth, custom
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [chartGrouping, setChartGrouping] = useState('month'); // day, week, month, year

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

    // Filtering Logic
    const filteredTransactions = transactions.filter(tx => {
        // 1. Transaction Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

        // 2. Date Boundary filter
        if (dateRangeFilter === 'thisMonth') {
            const txDate = new Date(tx.timestamp);
            const today = new Date();
            if (txDate.getMonth() !== today.getMonth() || txDate.getFullYear() !== today.getFullYear()) return false;
        } else if (dateRangeFilter === 'lastMonth') {
            const txDate = new Date(tx.timestamp);
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            if (txDate.getMonth() !== lastMonth.getMonth() || txDate.getFullYear() !== lastMonth.getFullYear()) return false;
        } else if (dateRangeFilter === 'custom') {
            const txDate = new Date(tx.timestamp);
            if (customRange.start && txDate < new Date(customRange.start)) return false;
            if (customRange.end && txDate > new Date(customRange.end).setHours(23, 59, 59, 999)) return false;
        }

        return true;
    });

    // Chart Grouping Function
    const getChartData = () => {
        const dataObj = {};
        
        filteredTransactions.forEach(tx => {
            const d = new Date(tx.timestamp);
            let key = '';
            const pad = (n) => String(n).padStart(2, '0');

            if (chartGrouping === 'day') {
                key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            } else if (chartGrouping === 'week') {
                const weekNum = Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7);
                key = `${d.getFullYear()}-${pad(d.getMonth() + 1)} W${weekNum}`;
            } else if (chartGrouping === 'month') {
                key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
            } else if (chartGrouping === 'year') {
                key = `${d.getFullYear()}`;
            }

            if (!dataObj[key]) dataObj[key] = { name: key, expense: 0, income: 0 };
            
            if (tx.type === 'expense') {
                dataObj[key].expense += Number(tx.amount);
            } else {
                dataObj[key].income += Number(tx.amount);
            }
        });

        // Ensure chronological sort
        return Object.values(dataObj).sort((a, b) => a.name.localeCompare(b.name));
    };

    const chartData = getChartData();

    // Export Logic
    const exportCSV = () => {
        if (filteredTransactions.length === 0) return alert('No data to export.');
        const headers = ['ID', 'Date', 'Type', 'Category', 'Amount'];
        const rows = filteredTransactions.map(tx => 
            `"${tx.id}","${tx.date}","${tx.type}","${tx.category}","${tx.amount}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions_backup.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportJSON = () => {
        if (filteredTransactions.length === 0) return alert('No data to export.');
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredTransactions, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", "transactions_backup.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl transition-colors duration-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transaction History</h1>
                
                {/* Export Buttons */}
                <div className="flex gap-3">
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold shadow-sm transition-colors text-sm">
                        <Download size={18} /> CSV
                    </button>
                    <button onClick={exportJSON} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-bold shadow-sm transition-colors text-sm">
                        <FileJson size={18} /> JSON
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200 mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Filters & Controls</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Type Filter */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Transaction Type</label>
                        <div className="flex gap-2">
                            {['all', 'expense', 'income'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setTypeFilter(type)} 
                                    className={`flex-1 py-2 rounded-md font-bold transition-colors capitalize ${typeFilter === type ? (type === 'expense' ? 'bg-red-500 text-white' : type === 'income' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white') : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Time Filter */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Date Range</label>
                        <select 
                            value={dateRangeFilter}
                            onChange={(e) => setDateRangeFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-semibold"
                        >
                            <option value="all">All Time</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="custom">Custom Date Bounds</option>
                        </select>
                        
                        {/* Custom Date Pickers rendering condition */}
                        {dateRangeFilter === 'custom' && (
                            <div className="flex gap-2 mt-2">
                                <input 
                                    type="date" 
                                    value={customRange.start}
                                    onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1"
                                />
                                <span className="text-gray-500 self-center">to</span>
                                <input 
                                    type="date" 
                                    value={customRange.end}
                                    onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Chart Grouping Control */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Graph Grouping</label>
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            {['day', 'week', 'month', 'year'].map(group => (
                                <button 
                                    key={group}
                                    onClick={() => setChartGrouping(group)} 
                                    className={`flex-1 py-1.5 text-sm rounded-md font-bold transition-all capitalize ${chartGrouping === group ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Interactive Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200 mb-8 h-[400px]">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Trend Overview</h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280'}} tickMargin={10} />
                            <YAxis stroke="#6b7280" tick={{fill: '#6b7280'}} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 pb-12">
                        No graph data available for the chosen filters.
                    </div>
                )}
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Detailed Transactions</h2>
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
                                            {tx.type === 'expense' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions match these rules.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;