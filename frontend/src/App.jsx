import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import History from './pages/History';
import Chatbot from './pages/Chatbot';
import Landing from './pages/Landing';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial dark mode theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="app-shell empty-state">Loading your ledger…</div>;

  return (
    <Router>
      <div className="app-shell">
        {user && <Navbar user={user} />}
        
        {/* Sub-navbar for pages */}
        {user && (
          <div className="subnav">
            <div className="subnav-inner">
               <NavLink 
                  to="/" 
                  className={({isActive}) => isActive ? "active" : ""}
                  end
               >
                  Dashboard
               </NavLink>
               <NavLink 
                  to="/history" 
                  className={({isActive}) => isActive ? "active" : ""}
               >
                  History
               </NavLink>
               <NavLink 
                  to="/chat" 
                  className={({isActive}) => isActive ? "active" : ""}
               >
                  AI Advisor
               </NavLink>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
          <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chatbot user={user} /> : <Navigate to="/login" />} />
          <Route path="/" element={user ? <Dashboard user={user} /> : <Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
