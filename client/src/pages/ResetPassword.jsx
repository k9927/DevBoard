import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import PasswordStrengthIndicator from '../components/AuthModal/PasswordStrengthIndicator';

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password validation
  const isPasswordValid = newPassword.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword);
  const isConfirmPasswordValid = confirmPassword === newPassword && confirmPassword.length > 0;
  const passwordError = newPassword && !isPasswordValid ? 'Password must be at least 8 characters with uppercase, lowercase, and number' : '';
  const confirmPasswordError = confirmPassword && !isConfirmPasswordValid ? 'Passwords do not match' : '';

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
      setIsValidating(false);
      return;
    }

    // Verify token
    fetch(`${API_URL}/verify-reset-token/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsTokenValid(true);
        } else {
          setError('Invalid or expired reset link');
        }
      })
      .catch(err => {
        setError('Failed to verify reset link');
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid || !isConfirmPasswordValid) {
      setError('Please fix the validation errors');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h2>
            <p className="text-gray-600 mb-6">You will be redirected to the login page shortly.</p>
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                  passwordError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : newPassword && isPasswordValid 
                      ? 'border-green-500 focus:ring-green-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 transition-transform hover:scale-110"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="flex items-center mt-1 text-sm text-red-500 animate-slide-in">
                <AlertCircle className="w-4 h-4 mr-1" />
                {passwordError}
              </p>
            )}
            <PasswordStrengthIndicator password={newPassword} darkMode={false} />
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                  confirmPasswordError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : confirmPassword && isConfirmPasswordValid 
                      ? 'border-green-500 focus:ring-green-500'
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
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
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
            disabled={isLoading || !isPasswordValid || !isConfirmPasswordValid}
            className="flex items-center justify-center w-full py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-medium text-blue-500 transition-all hover:text-blue-400 hover:underline"
            disabled={isLoading}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 