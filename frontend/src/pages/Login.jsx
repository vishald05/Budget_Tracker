import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-96 transition-colors duration-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold">Password</label>
                        <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">Forgot Password?</Link>
                    </div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                
                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
                    Login
                </button>
                
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
