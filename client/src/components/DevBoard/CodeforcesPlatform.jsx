import { AlertCircle, Link } from 'lucide-react';

const CodeforcesPlatform = ({ darkMode, profileData, setShowProfileModal }) => {
  return (
    <div className="space-y-4">
      {profileData.codeforces ? (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Codeforces Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-purple-500">1458</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Rating</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-pink-500">Pupil</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rank</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Connect Your Codeforces
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add your Codeforces username to see your rating and contests
          </p>
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            <Link className="w-4 h-4" />
            <span>Setup Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeforcesPlatform;