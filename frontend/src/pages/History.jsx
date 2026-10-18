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
        <main className="page-width">
            <span className="eyebrow">Your ledger</span>
            <div className="section-heading">
                <div><h1 className="page-title">Transaction history</h1><p className="page-intro">Filter the record, compare the movement, or take a copy with you.</p></div>
                
                {/* Export Buttons */}
                <div className="toolbar-actions">
                    <button onClick={exportCSV} className="secondary-button">
                        <Download size={18} /> CSV
                    </button>
                    <button onClick={exportJSON} className="secondary-button">
                        <FileJson size={18} /> JSON
                    </button>
                </div>
            </div>
            
            <div className="surface surface-pad">
                <div className="section-heading"><h2>Filter the record</h2><span className="eyebrow">Controls</span></div>
                
                <div className="history-toolbar">
                    {/* Basic Type Filter */}
                    <div className="field">
                        <label>Transaction type</label>
                        <div className="segmented">
                            {['all', 'expense', 'income'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setTypeFilter(type)} 
                                    className={typeFilter === type ? 'active' : ''}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Time Filter */}
                    <div className="field">
                        <label>Date range</label>
                        <select 
                            value={dateRangeFilter}
                            onChange={(e) => setDateRangeFilter(e.target.value)}
                            className="field-input"
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
                                    className="field-input"
                                />
                                <span className="text-gray-500 self-center">to</span>
                                <input 
                                    type="date" 
                                    value={customRange.end}
                                    onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                                    className="field-input"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Chart Grouping Control */}
                    <div className="field">
                        <label>Group chart by</label>
                        <div className="segmented">
                            {['day', 'week', 'month', 'year'].map(group => (
                                <button 
                                    key={group}
                                    onClick={() => setChartGrouping(group)} 
                                    className={chartGrouping === group ? 'active' : ''}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Interactive Chart */}
            <div className="surface surface-pad chart-panel">
                <div className="section-heading"><h2>Movement over time</h2><span className="eyebrow">{chartGrouping}</span></div>
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
                    <div className="empty-state">
                        No graph data available for the chosen filters.
                    </div>
                )}
            </div>

            {/* History Table */}
            <div className="surface surface-pad">
                <div className="section-heading"><h2>Detailed transactions</h2><span className="eyebrow">{filteredTransactions.length} shown</span></div>
                {filteredTransactions.length > 0 ? (
                    <div className="table-wrap">
                        <table className="ledger">
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
                                            {tx.type === 'expense' ? '-' : '+'}₹{Number(tx.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No transactions match these filters.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default History;