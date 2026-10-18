import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
        <div className="auth-shell"><aside className="auth-aside"><div className="brand"><span className="brand-mark">₹</span><span className="brand-name">BudgetTracker</span></div><div><span className="eyebrow">No worries</span><h1>Getting back in should be simple.</h1><p>We’ll send a secure reset link to your inbox.</p></div></aside>
          <div className="auth-panel"><form onSubmit={handleReset} className="auth-form">
                <span className="eyebrow">Account access</span><h2>Reset password</h2><p className="page-intro">Enter the email attached to your account.</p>
                {error && <p className="alert">{error}</p>}
                {message && <p className="alert success">{message}</p>}
                
                <div className="field"><label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           />
                </div>
                
                <button type="submit" className="primary-button">Send reset link
                </button>
                
                <p className="auth-footer">Remembered your password? <Link to="/login" className="auth-link">Sign in</Link>
                </p>
            </form></div>
        </div>
    );
};

export default ForgotPassword;
