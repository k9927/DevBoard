import React from 'react';
import { BarChart3 } from 'lucide-react';

const SummaryPlatform = ({ darkMode }) => {
  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        This Week's Progress
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-2xl font-bold text-indigo-500">9</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problems Solved</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-2xl font-bold text-blue-500">4</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Resources Added</div>
        </div>
      </div>
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="mb-2 text-lg font-medium text-green-500">🎉 Great Progress!</div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          You've been consistent with your coding practice this week. Keep it up!
        </div>
      </div>
    </div>
  );
};

export default SummaryPlatform;