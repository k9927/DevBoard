import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, gradient, darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group`}>
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {Icon && <Icon className="w-6 h-6 text-white" />}
      </div>
      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{description}</p>
    </div>
  );
};
export default FeatureCard;