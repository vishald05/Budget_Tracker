import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { identifier, password });
            localStorage.setItem('user', JSON.stringify({ username: res.data.username }));
            navigate('/');
            window.location.reload(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username or Email</label>
                    <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                
                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
                    Login
                </button>
                
                <p className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
