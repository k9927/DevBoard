import { X } from 'lucide-react';

const ProfileModal = ({ 
  darkMode, 
  showProfileModal, 
  setShowProfileModal, 
  profileData, 
  setProfileData,
  handleProfileSubmit 
}) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${showProfileModal ? 'block' : 'hidden'}`}>
      <div className={`w-full max-w-md rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Connect Your Profiles
          </h2>
          <button
            onClick={() => setShowProfileModal(false)}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              LeetCode Username
            </label>
            <input
              type="text"
              value={profileData.leetcode}
              onChange={(e) => setProfileData({...profileData, leetcode: e.target.value})}
              className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              placeholder="your_leetcode_username"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Codeforces Handle
            </label>
            <input
              type="text"
              value={profileData.codeforces}
              onChange={(e) => setProfileData({...profileData, codeforces: e.target.value})}
              className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              placeholder="your_codeforces_handle"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              GitHub Username
            </label>
            <input
              type="text"
              value={profileData.github}
              onChange={(e) => setProfileData({...profileData, github: e.target.value})}
              className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              placeholder="your_github_username"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Save Profiles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;