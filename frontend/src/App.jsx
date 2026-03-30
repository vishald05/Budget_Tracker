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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {user && <Navbar user={user} />}
        
        {/* Sub-navbar for pages */}
        {user && (
          <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex gap-8 h-12 items-center">
               <NavLink 
                  to="/" 
                  className={({isActive}) => isActive 
                    ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 h-full flex items-center" 
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium h-full flex items-center transition"}
                  end
               >
                  Dashboard
               </NavLink>
               <NavLink 
                  to="/history" 
                  className={({isActive}) => isActive 
                    ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 h-full flex items-center" 
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium h-full flex items-center transition"}
               >
                  History
               </NavLink>
               <NavLink 
                  to="/chat" 
                  className={({isActive}) => isActive 
                    ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 h-full flex items-center" 
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium h-full flex items-center transition"}
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
