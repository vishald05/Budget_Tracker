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
        <div className="auth-shell"><aside className="auth-aside"><div className="brand"><span className="brand-mark">₹</span><span className="brand-name">BudgetTracker</span></div><div><span className="eyebrow">A calmer ledger</span><h1>Know where your money is going.</h1><p>Keep a clear, private record of the choices behind each rupee.</p></div></aside>
          <div className="auth-panel"><form onSubmit={handleLogin} className="auth-form">
                <span className="eyebrow">Welcome back</span><h2>Sign in</h2><p className="page-intro">Pick up where you left off.</p>
                {error && <p className="alert">{error}</p>}
                
                <div className="field">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           />
                </div>
                
                <div className="field">
                    <div className="flex justify-between items-center"><label>Password</label>
                        <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                    </div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           />
                </div>
                
                <button type="submit" className="primary-button">Sign in
                </button>
                
                <p className="auth-footer">Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
                </p>
            </form></div>
        </div>
    );
};

export default Login;
