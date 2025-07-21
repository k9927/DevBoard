import React, { useState } from 'react';
import { Zap, ArrowRight, Trophy, BookOpen, Target, GitBranch, TrendingUp, FileText,Code} from 'lucide-react';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const LandingPage = () => {
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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate=useNavigate();
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

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

  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password && (authMode === 'login' || (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  ));
  const isConfirmPasswordValid = authMode === 'login' || (confirmPassword && password === confirmPassword);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    // Handle forgot password mode
    if (authMode === 'forgot-password') {
      const emailValid = validateEmail(email);
      if (!emailValid) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.post(`${API_URL}/forgot-password`, {
          email,
        });

        setEmail("");
        setError("");
        setEmailError("");
        setShowAuthModal(false);
        
        showToast('Password reset email sent! Check your inbox.', 'success');
        
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Failed to send reset email. Try again.");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Handle login and signup modes
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
      
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setShowAuthModal(false);
      
      showToast(
        authMode === 'login' ? 'Successfully signed in!' : 'Account created successfully!',
        'success'
      );
      navigate("/dashboard");
      
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

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        setShowAuthModal={setShowAuthModal}
        handleAuthModeChange={handleAuthModeChange}
      />
      
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
              
            
            </div>
          </div>
        </div>
      </section>

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
              darkMode={darkMode}
            />
            
            <FeatureCard
              icon={BookOpen}
              title="Resource Library"
              description="Save and organize coding resources, tutorials, blogs, and YouTube videos with smart tagging and search."
              gradient="from-green-400 to-blue-500"
              darkMode={darkMode}
            />
            
            <FeatureCard
              icon={Target}
              title="Goal Management"
              description="Set daily coding goals, track progress, and build consistent habits with color-coded task organization."
              gradient="from-purple-400 to-pink-500"
              darkMode={darkMode}
            />
            
            <FeatureCard
              icon={GitBranch}
              title="GitHub Integration"
              description="Visualize your commit streaks, repository stats, and contribution patterns in beautiful charts."
              gradient="from-blue-400 to-indigo-500"
              darkMode={darkMode}
            />
            
            <FeatureCard
              icon={FileText}
            title="Weekly Summary"
              description="Track your weekly progress with detailed analytics, productivity scores, and motivational insights to keep you motivated."
              gradient="from-red-400 to-pink-500"
              darkMode={darkMode}
            />
            
            <FeatureCard
              icon={TrendingUp}
              title="Progress Analytics"
              description="Get insights into your coding journey with detailed analytics, streak tracking, and performance metrics."
              gradient="from-cyan-400 to-blue-500"
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

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
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default LandingPage;