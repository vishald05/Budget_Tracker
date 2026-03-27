import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: username
            });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                
                <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition">
                    Register
                </button>
                
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
