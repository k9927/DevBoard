import { AlertCircle, Link } from 'lucide-react';

const GitHubPlatform = ({ darkMode, profileData, setShowProfileModal }) => {
  return (
    <div className="space-y-4">
      {profileData.github ? (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            GitHub Activity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-green-500">5</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-lg font-bold text-blue-500">leetcode-grind</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Repo</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Connect Your GitHub
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add your GitHub username to track commits and repos
          </p>
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-gray-700 rounded-lg hover:bg-gray-800"
          >
            <Link className="w-4 h-4" />
            <span>Setup Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubPlatform;