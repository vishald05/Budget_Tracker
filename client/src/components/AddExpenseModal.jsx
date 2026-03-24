import React, { useState } from 'react';

const AddExpenseModal = ({ isOpen, onClose, onAddExpense }) => {
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
    });
    const [loading, setLoading] = useState(false);

    const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAddExpense(formData);
            setFormData({ ...formData, amount: '', description: '' });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

                {/* Modal Panel */}
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-xl font-bold leading-6 text-slate-900">Add Transaction</h3>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Type Selector */}
                                    <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-xl border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'expense'})}
                                            className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'expense' ? 'bg-white text-red-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Expense
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'income'})}
                                            className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'income' ? 'bg-white text-green-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Income
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Amount</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-slate-400">$</span>
                                            </div>
                                            <input 
                                                type="number" 
                                                value={formData.amount}
                                                onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                                                className="input-field pl-7 text-lg font-semibold"
                                                placeholder="0.00"
                                                required
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Description</label>
                                        <input 
                                            type="text" 
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            className="input-field"
                                            placeholder="What is this for?"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Category</label>
                                            <select 
                                                value={formData.category}
                                                onChange={e => setFormData({...formData, category: e.target.value})}
                                                className="input-field bg-white"
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Date</label>
                                            <input 
                                                type="date" 
                                                value={formData.date}
                                                onChange={e => setFormData({...formData, date: e.target.value})}
                                                className="input-field"
                                                required
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full btn-primary py-3 text-lg shadow-indigo-200"
                                        >
                                            {loading ? 'Saving...' : 'Save Transaction'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpenseModal;
