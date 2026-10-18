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
        <div className="auth-shell"><aside className="auth-aside"><div className="brand"><span className="brand-mark">₹</span><span className="brand-name">BudgetTracker</span></div><div><span className="eyebrow">Start with clarity</span><h1>A better habit begins with a record.</h1><p>Build a view of your spending that feels useful, not judgmental.</p></div></aside>
          <div className="auth-panel"><form onSubmit={handleRegister} className="auth-form">
                <span className="eyebrow">New here?</span><h2>Create your account</h2><p className="page-intro">Your personal ledger is a few details away.</p>
                {error && <p className="alert">{error}</p>}
                
                <div className="field"><label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                           />
                </div>
                
                <div className="field"><label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           />
                </div>
                
                <div className="field"><label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           />
                </div>
                
                <div className="field"><label>Confirm password</label>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                           />
                </div>
                
                <button type="submit" className="primary-button">Create account
                </button>
                
                <p className="auth-footer">Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                </p>
            </form></div>
        </div>
    );
};

export default Register;
