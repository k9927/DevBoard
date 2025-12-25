import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const PasswordStrengthIndicator = ({ password, darkMode }) => {
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
      {password && (
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

export default PasswordStrengthIndicator;