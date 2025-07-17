import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { motion } from 'framer-motion';

function App() {
  // Mock authentication state - in a real app would come from context/auth provider
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showLogin, setShowLogin] = useState(!isAuthenticated);

  // Login form submission handler
  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  // Login modal animation variants
  const loginVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  // Login form component
  const LoginForm = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 backdrop-blur-md">
      <motion.div
        variants={loginVariants}
        initial="hidden"
        animate="visible"
        className="glass-morphism w-full max-w-md p-8 rounded-xl"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center items-center w-16 h-16 rounded-lg bg-purple-600 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white neon-purple-text">KnouxCrypt™</h2>
          <p className="text-gray-300 mt-1">Enter your master password</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Master Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="input-glass w-full px-4 py-3 rounded-lg"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 bg-gray-700 border-gray-500 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember device
              </label>
            </div>
            <a href="#" className="text-sm text-neon-purple hover:underline">
              Reset Password
            </a>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-neon-purple hover:bg-purple-700 rounded-lg text-white font-medium transition-colors shadow-lg"
          >
            Unlock & Access
          </button>
        </form>
      </motion.div>
    </div>
  );

  // Main app layout
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {showLogin ? (
        <LoginForm />
      ) : (
        <>
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
              <Dashboard />
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;