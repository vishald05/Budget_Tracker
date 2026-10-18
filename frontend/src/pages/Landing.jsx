import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Bot, Moon, PieChart, Sun } from 'lucide-react';

const Landing = () => {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    useEffect(() => {
        const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    const toggleTheme = () => {
        const nextDark = !isDark;
        document.documentElement.classList.toggle('dark', nextDark);
        localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    };

    return <div className="landing">
        <header className="landing-header">
            <div className="brand"><span className="brand-mark">₹</span><span className="brand-name">BudgetTracker</span></div>
            <div className="landing-actions">
                <button onClick={toggleTheme} className="icon-button" title="Toggle dark mode" aria-label="Toggle dark mode">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
                <Link to="/login">Sign in</Link>
                <Link to="/register" className="primary-button">Create account</Link>
            </div>
        </header>
        <main>
            <section className="landing-hero">
                <div>
                    <span className="eyebrow">A personal money log</span>
                    <h1>Make room for what <em>matters.</em></h1>
                    <p>BudgetTracker gives every rupee a place. Record spending without friction, see your patterns clearly, and make decisions from your own numbers.</p>
                    <Link to="/register" className="primary-button">Start your ledger <ArrowRight size={17} /></Link>
                </div>
                <div className="landing-visual" aria-label="Example ledger summary">
                    <span className="eyebrow">This month</span>
                    <div className="visual-line"><span>Available balance</span><strong>₹42,680</strong></div>
                    <div className="visual-line"><span>Home & utilities</span><span>₹12,400</span></div>
                    <div className="visual-line"><span>Food & everyday</span><span>₹6,180</span></div>
                    <div className="visual-line"><span>Income recorded</span><strong>₹61,260</strong></div>
                </div>
            </section>
            <section className="feature-strip">
                <div className="feature-item"><PieChart size={19} color="var(--accent)" /><h3>See the shape</h3><p>Understand where spending gathers with focused category and trend views.</p></div>
                <div className="feature-item"><Bot size={19} color="var(--accent)" /><h3>Ask better questions</h3><p>Talk to an advisor that has your actual transaction history in context.</p></div>
                <div className="feature-item"><BarChart3 size={19} color="var(--accent)" /><h3>Keep the record</h3><p>Filter, review, and export your ledger whenever you need a clean backup.</p></div>
            </section>
        </main>
    </div>;
};

export default Landing;
