import React from 'react';
import { Code, Moon, Sun, LogOut, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode, setShowAuthModal, handleAuthModeChange }) => {
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const isOnDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm sticky top-0 z-40`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>DevBoard</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-110 transition-all duration-200`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLoggedIn ? (
              <>
                {!isOnDashboard && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center px-4 py-2 space-x-2 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className={`flex items-center px-3 py-2 space-x-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} transition-all duration-200`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {setShowAuthModal(true); handleAuthModeChange('login');}}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} transition-all duration-200`}
                >
                  Login
                </button>
                <button
                  onClick={() => {setShowAuthModal(true); handleAuthModeChange('signup');}}
                  className="px-6 py-2 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;