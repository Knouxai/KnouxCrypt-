import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      if (password) {
        onLogin();
      } else {
        setError('Please enter your master password');
      }
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="glass-morphism p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="neon-purple-text text-4xl font-bold mb-2">KnouxCrypt™</h1>
          <p className="text-gray-300 text-lg">تشفير الأنظمة والأقراص</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Master Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-900 bg-opacity-50 border border-gray-600 rounded-md w-full p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neon-purple"
              placeholder="Enter your master password"
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <div>
            <button 
              type="submit"
              className="w-full bg-neon-purple hover:bg-opacity-80 text-white py-3 rounded-md font-medium shadow-neon-purple-glow transition-all duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? "Authenticating..." : "Unlock & Enter"}
            </button>
          </div>

          <div className="text-center">
            <a href="#" className="text-sm text-gray-400 hover:text-neon-purple">Forgot master password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;