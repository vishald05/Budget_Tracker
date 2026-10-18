import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
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
        <main className="page-width">
            <span className="eyebrow">Overview</span>
            <h1 className="page-title">Your money, at a glance.</h1>
            <p className="page-intro">A simple place to keep the record straight. Add a transaction, then use the signals below to decide what deserves your attention.</p>
            
            <div className="dashboard-grid">
                {/* Form Section */}
                <div className="surface surface-pad">
                    <div className="section-heading"><h2>New transaction</h2><span className="eyebrow">Quick entry</span></div>
                    <form onSubmit={handleAdd} className="form-grid">
                        <div className="field">
                            <label>Transaction type</label>
                            <div className="type-switch">
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={type === 'expense' ? 'active expense' : ''}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={type === 'income' ? 'active income' : ''}
                                >
                                    Income
                                </button>
                            </div>
                            </div>
                        
                        <div className="field">
                            <label>Amount (₹)</label>
                            <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
                                className="field-input" />
                        </div>
                        
                        <div className="field">
                            <label>Category</label>
                            <input type="text" list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g., Food, Salary..."
                                className="field-input" />
                            <datalist id="category-options">
                                {type === 'expense' ? (
                                    <>
                                        <option value="Food" />
                                        <option value="Housing" />
                                        <option value="Transportation" />
                                        <option value="Entertainment" />
                                        <option value="Utilities" />
                                        <option value="Healthcare" />
                                        <option value="Clothing" />
                                        <option value="Personal" />
                                        <option value="Education" />
                                    </>
                                ) : (
                                    <>
                                        <option value="Salary" />
                                        <option value="Freelance" />
                                        <option value="Investments" />
                                        <option value="Gifts" />
                                        <option value="Other Income" />
                                    </>
                                )}
                            </datalist>
                        </div>
                        
                        <button type="submit" className="primary-button">
                            <Plus size={17} /> Add {type === 'expense' ? 'expense' : 'income'}
                        </button>
                    </form>
                </div>

                {/* Graph Section */}
                <div className="surface surface-pad">
                    <div className="section-heading"><h2>Where spending goes</h2><span className="eyebrow">By category</span></div>
                    {expenseData.length > 0 ? (
                        <div className="chart-wrap">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ backgroundColor: '#1f2937', color: '#f3f4f6', border: 'none', borderRadius: '8px' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="empty-state"><p>No expenses yet. Add your first one to see the pattern.</p></div>
                    )}
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="surface surface-pad recent">
                <div className="section-heading"><h2>Recent activity</h2><span className="eyebrow">Last five</span></div>
                {transactions.length > 0 ? (
                    <ul className="transaction-list">
                        {transactions.slice(0, 5).map(tx => (
                            <li key={tx.id} className="transaction-row">
                                <div className="transaction-meta">
                                    <strong>{tx.category}</strong>
                                    <span>{tx.date}</span>
                                </div>
                                <span className={`amount ${tx.type}`}>
                                    {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="empty-state"><p>No transactions recorded. Your ledger starts with the first entry.</p></div>
                )}
            </div>
        </main>
    );
};

export default Dashboard;
