import React, { useState, useEffect } from 'react';
import {
  Code, Target, BookOpen, GitBranch, TrendingUp, Zap,
  Moon, Sun, ArrowRight, Trophy, FileText, Eye, EyeOff,
  CheckCircle, XCircle, AlertCircle, Loader2
} from 'lucide-react';
import axios from "axios";

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
  const PasswordStrengthIndicator = ({ password }) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[A-Z]/, text: 'One uppercase letter' },
      { regex: /[a-z]/, text: 'One lowercase letter' },
      { regex: /\d/, text: 'One number' },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'One special character' }
    ];

    const strength = requirements.filter(req => req.regex.test(password)).length;
    const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    return (
      <div className="mt-2 space-y-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded transition-all duration-300 ${
                i < strength ? strengthColors[strength - 1] : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {password && `Password strength: ${strengthLabels[strength - 1] || 'Very Weak'}`}
          </span>
        </div>
        {authMode === 'signup' && password && (
          <div className="space-y-1">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center space-x-2">
                {req.regex.test(password) ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs transition-colors ${
                  req.regex.test(password) 
                    ? 'text-green-500' 
                    : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Handle Enter key press
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
          {/* Email Input */}
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

          {/* Password Input */}
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
            {authMode === 'signup' && <PasswordStrengthIndicator password={password} />}
          </div>

          {/* Confirm Password Input (only for signup) */}
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

          {/* General Error */}
          {error && (
            <div className="p-3 border border-red-200 rounded-lg bg-red-50 animate-slide-in">
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
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

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : type === 'error' 
          ? 'bg-red-500 text-white' 
          : 'bg-blue-500 text-white'
    }`}>
      {type === 'success' && <CheckCircle className="w-5 h-5" />}
      {type === 'error' && <XCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
};

const API_URL = import.meta.env.VITE_API_URL;

export default function DevBoardLanding() {
  const [darkMode, setDarkMode] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (authMode === 'signup') {
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        setPasswordError("Password must contain at least one uppercase letter");
        return false;
      }
      if (!/[a-z]/.test(password)) {
        setPasswordError("Password must contain at least one lowercase letter");
        return false;
      }
      if (!/\d/.test(password)) {
        setPasswordError("Password must contain at least one number");
        return false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setPasswordError("Password must contain at least one special character");
        return false;
      }
    }
    setPasswordError("");
    return true;
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword) => {
    if (authMode === 'signup') {
      if (!confirmPassword) {
        setConfirmPasswordError("Please confirm your password");
        return false;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        return false;
      }
    }
    setConfirmPasswordError("");
    return true;
  };

  // Real-time validation
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password && (authMode === 'login' || (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  ));
  const isConfirmPasswordValid = authMode === 'login' || (confirmPassword && password === confirmPassword);

  // Handle form submission
  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    // Validate all fields
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const confirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!emailValid || !passwordValid || !confirmPasswordValid) {
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = authMode === "signup" ? "/signup" : "/login";
      const res = await axios.post(`${API_URL}${endpoint}`, {
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);
      
      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setShowAuthModal(false);
      
      // Show success toast
      showToast(
        authMode === 'login' ? 'Successfully signed in!' : 'Account created successfully!',
        'success'
      );
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Authentication failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when switching between login/signup
  const handleAuthModeChange = (mode) => {
    setAuthMode(mode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const FeatureCard = ({ icon, title, description, gradient }) => {
    const IconComponent = icon;
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group`}>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{description}</p>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'}`}></div>
        </div>
        
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} animate-fade-in`}>
              Your Developer
              <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text"> Productivity</span>
              <br />Command Center
            </h1>
            
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'} animate-fade-in-delay`}>
              Track your coding progress, save resources, manage goals, and visualize your growth—all in one powerful dashboard built for developers.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-delay-2">
              <button
                onClick={() => {setShowAuthModal(true); handleAuthModeChange('signup');}}
                className="flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => showToast('Demo feature coming soon!', 'info')}
                className={`px-8 py-4 border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105`}
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need to Level Up
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Powerful features designed specifically for developers
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Trophy}
              title="LeetCode & CF Tracker"
              description="Monitor your competitive programming progress with real-time stats, solved problems count, and contest rankings."
              gradient="from-yellow-400 to-orange-500"
            />
            
            <FeatureCard
              icon={BookOpen}
              title="Resource Library"
              description="Save and organize coding resources, tutorials, blogs, and YouTube videos with smart tagging and search."
              gradient="from-green-400 to-blue-500"
            />
            
            <FeatureCard
              icon={Target}
              title="Goal Management"
              description="Set daily coding goals, track progress, and build consistent habits with color-coded task organization."
              gradient="from-purple-400 to-pink-500"
            />
            
            <FeatureCard
              icon={GitBranch}
              title="GitHub Integration"
              description="Visualize your commit streaks, repository stats, and contribution patterns in beautiful charts."
              gradient="from-blue-400 to-indigo-500"
            />
            
            <FeatureCard
              icon={FileText}
              title="Weekly Summary"
              description="Track your weekly progress with detailed analytics, productivity scores, and motivational insights to keep you motivated."
              gradient="from-red-400 to-pink-500"
            />
            
            <FeatureCard
              icon={TrendingUp}
              title="Progress Analytics"
              description="Get insights into your coding journey with detailed analytics, streak tracking, and performance metrics."
              gradient="from-cyan-400 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div className="group">
              <div className="mb-2 text-4xl font-bold text-transparent transition-transform bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text group-hover:scale-110">
                500+
              </div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Developers Trust DevBoard</p>
            </div>
            
            <div className="group">
              <div className="mb-2 text-4xl font-bold text-transparent transition-transform bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text group-hover:scale-110">
                10k+
              </div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problems Tracked</p>
            </div>
            
            <div className="group">
              <div className="mb-2 text-4xl font-bold text-transparent transition-transform bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text group-hover:scale-110">
                50k+
              </div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Resources Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Supercharge Your Coding Journey?
          </h2>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of developers who are already tracking their progress and achieving their goals.
          </p>
          
          <button
            onClick={() => {setShowAuthModal(true); handleAuthModeChange('signup');}}
            className="flex items-center px-8 py-4 mx-auto space-x-2 text-lg font-semibold text-white transition-all duration-200 transform bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            <span>Start Building Today</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>DevBoard</span>
            </div>
            
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 DevBoard. Built with ❤️ for developers.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          darkMode={darkMode}
          authMode={authMode}
          setAuthMode={setAuthMode}
          setShowAuthModal={setShowAuthModal}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          emailError={emailError}
          passwordError={passwordError}
          confirmPasswordError={confirmPasswordError}
          isEmailValid={isEmailValid}
          isPasswordValid={isPasswordValid}
          isConfirmPasswordValid={isConfirmPasswordValid}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
}