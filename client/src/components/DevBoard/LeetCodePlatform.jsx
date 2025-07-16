import { AlertCircle, Link } from 'lucide-react';

const LeetCodePlatform = ({ darkMode, profileData, setShowProfileModal }) => {
  return (
    <div className="space-y-4">
      {profileData.leetcode ? (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            LeetCode Progress
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-green-500">487</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problems Solved</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-blue-500">#18,456</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Global Rank</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Connect Your LeetCode
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add your LeetCode username to track your progress
          </p>
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-yellow-600 rounded-lg hover:bg-yellow-700"
          >
            <Link className="w-4 h-4" />
            <span>Setup Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LeetCodePlatform;