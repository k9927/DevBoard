import React from 'react';
import {
  CheckCircle, XCircle, AlertCircle, Loader2,
  Eye, EyeOff, ArrowRight
} from 'lucide-react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const AuthModal = ({
  darkMode,
  authMode,
  setAuthMode,
  setShowAuthModal,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  error,
  isLoading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  emailError,
  passwordError,
  confirmPasswordError,
  isEmailValid,
  isPasswordValid,
  isConfirmPasswordValid
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="mb-6 text-center">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {authMode === 'login' ? 'Welcome Back!' : 'Join DevBoard'}
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {authMode === 'login' ? 'Sign in to your account' : 'Create your developer account'}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Email address"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                  emailError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : email && isEmailValid 
                      ? 'border-green-500 focus:ring-green-500'
                      : darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                disabled={isLoading}
                autoComplete="email"
              />
              {email && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {isEmailValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {emailError && (
              <p className="flex items-center mt-1 text-sm text-red-500 animate-slide-in">
                <AlertCircle className="w-4 h-4 mr-1" />
                {emailError}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                  passwordError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : password && isPasswordValid 
                      ? 'border-green-500 focus:ring-green-500'
                      : darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                disabled={isLoading}
                autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 transition-transform hover:scale-110"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                ) : (
                  <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="flex items-center mt-1 text-sm text-red-500 animate-slide-in">
                <AlertCircle className="w-4 h-4 mr-1" />
                {passwordError}
              </p>
            )}
            {authMode === 'signup' && <PasswordStrengthIndicator password={password} darkMode={darkMode} />}
          </div>

          {authMode === 'signup' && (
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                    confirmPasswordError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : confirmPassword && isConfirmPasswordValid 
                        ? 'border-green-500 focus:ring-green-500'
                        : darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 transition-transform hover:scale-110"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="flex items-center mt-1 text-sm text-red-500 animate-slide-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {confirmPasswordError}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 border border-red-200 rounded-lg bg-red-50 animate-slide-in">
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              authMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="ml-1 font-medium text-blue-500 transition-all hover:text-blue-400 disabled:opacity-50 hover:underline"
              disabled={isLoading}
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <button
          onClick={() => setShowAuthModal(false)}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-all disabled:opacity-50`}
          disabled={isLoading}
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;