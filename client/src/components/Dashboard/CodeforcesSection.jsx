import { AlertCircle, Link, HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CodeforceSection = ({ darkMode, profileData, codeforcesStats, loadingCodeforces, setShowProfileModal }) => {
  const getRankColor = (rating) => {
    if (rating >= 3000) return 'text-red-600'; // Legendary Grandmaster
    if (rating >= 2600) return 'text-red-500'; // International Grandmaster
    if (rating >= 2400) return 'text-red-400'; // Grandmaster
    if (rating >= 2300) return 'text-orange-500'; // International Master
    if (rating >= 2100) return 'text-orange-400'; // Master
    if (rating >= 1900) return 'text-purple-500'; // Candidate Master
    if (rating >= 1600) return 'text-blue-500';  // Expert
    if (rating >= 1400) return 'text-cyan-500';  // Specialist
    if (rating >= 1200) return 'text-green-500'; // Pupil
    return 'text-gray-500'; // Newbie
  };

  const getRatingChangeIndicator = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      {profileData.codeforces ? (
        loadingCodeforces ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : codeforcesStats ? (
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-blue-500">Code</span>forces
              </h3>
              <div className="flex items-center gap-3">
                {codeforcesStats.avatar && (
                  <img src={codeforcesStats.avatar} alt="avatar" className="border rounded-full w-9 h-9" />
                )}
                <div className="text-right">
                  <div className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {codeforcesStats.handle || 'N/A'}
                  </div>
                  <div className={`text-xs font-bold ${getRankColor(codeforcesStats.rating)}`}>
                    {codeforcesStats.rank || 'Unrated'}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard label="Current Rating" value={codeforcesStats.rating} color={getRankColor(codeforcesStats.rating)} darkMode={darkMode} />
              <StatCard label="Max Rating" value={codeforcesStats.maxRating} color="text-purple-500" darkMode={darkMode} />
            </div>

            {/* More Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard label="Friends" value={codeforcesStats.friendOfCount ?? 0} color="text-blue-500" darkMode={darkMode} />
              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-lg font-bold text-blue-500">{codeforcesStats.contribution ?? 0}</div>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Contribution</span>
                  <span className="relative group">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    <span className="absolute z-10 w-48 p-2 mt-1 text-xs text-white transition-opacity -translate-x-1/2 bg-black rounded opacity-0 pointer-events-none bg-opacity-80 left-1/2 group-hover:opacity-100">
                      Represents your helpfulness on Codeforces via posts, blogs, and problem contributions.
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Rank & Join Date */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard label="Max Rank" value={codeforcesStats.rank} color={getRankColor(codeforcesStats.maxRating)} darkMode={darkMode} />
              <StatCard label="Joined" value={codeforcesStats.registrationTimeSeconds ? new Date(codeforcesStats.registrationTimeSeconds * 1000).toLocaleDateString() : 'N/A'} darkMode={darkMode} />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <a href="https://codeforces.com/contests" target="_blank" rel="noopener noreferrer" className={`text-center text-sm p-2 rounded-md transition-colors font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                View Contests →
              </a>
              <a href="https://codeforces.com/problemset" target="_blank" rel="noopener noreferrer" className={`text-center text-sm p-2 rounded-md transition-colors font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                Solve Problems →
              </a>
            </div>
          </div>
        ) : (
          <ErrorBox darkMode={darkMode} message={codeforcesStats?.error || "Failed to load Codeforces stats"} setShowProfileModal={setShowProfileModal} />
        )
      ) : (
        <ErrorBox darkMode={darkMode} message="Connect Your Codeforces" setShowProfileModal={setShowProfileModal} />
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, darkMode }) => (
  <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all`}>
    <div className={`text-lg font-bold ${color ?? (darkMode ? 'text-white' : 'text-gray-800')}`}>
      {value ?? 'N/A'}
    </div>
    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
  </div>
);

const ErrorBox = ({ darkMode, message, setShowProfileModal }) => (
  <div className="py-10 text-center">
    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-500" />
    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{message}</h3>
    <button
      onClick={() => setShowProfileModal(true)}
      className="flex items-center px-4 py-2 mx-auto mt-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      <Link className="w-4 h-4" />
      <span>Setup Profile</span>
    </button>
  </div>
);

export default CodeforceSection;
