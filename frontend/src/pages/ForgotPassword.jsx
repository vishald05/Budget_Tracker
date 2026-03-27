import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
            setMessage('');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <form onSubmit={handleReset} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-96 transition-colors duration-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Reset Password</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                
                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
                    Send Reset Link
                </button>
                
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Remembered your password? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
