import React, { useState } from 'react';
import { AlertCircle, Link, HelpCircle, Star, GitFork, Users, Calendar, ExternalLink } from 'lucide-react';

const GitHubSection = ({ darkMode, profileData, githubStats, loadingGithub, setShowProfileModal }) => {
  const [showLanguagesTooltip, setShowLanguagesTooltip] = useState(false);
  // Function to format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  // Function to format join date
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  // Function to get language color (simplified version)
  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'bg-yellow-400',
      'Python': 'bg-blue-500',
      'Java': 'bg-red-500',
      'TypeScript': 'bg-blue-600',
      'C++': 'bg-pink-500',
      'C': 'bg-gray-600',
      'Go': 'bg-cyan-400',
      'Rust': 'bg-orange-600',
      'PHP': 'bg-purple-500',
      'Ruby': 'bg-red-600',
      'Swift': 'bg-orange-500',
      'Kotlin': 'bg-purple-600',
      'C#': 'bg-green-600',
      'HTML': 'bg-orange-400',
      'CSS': 'bg-blue-400',
    };
    return colors[language] || 'bg-gray-400';
  };

  return (
    <div className="space-y-4">
      {profileData.github ? (
        loadingGithub ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          </div>
        ) : githubStats && githubStats.configured ? (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Header with Logo and Profile Info */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>GitHub</h3>
              <div className="flex items-center space-x-3">
                {githubStats.avatarUrl && (
                  <img src={githubStats.avatarUrl} alt="GitHub Avatar" className="w-8 h-8 border-2 border-green-500 rounded-full" />
                )}
                <div className="text-right">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{githubStats.name || githubStats.username || 'GitHub User'}</div>
                  {githubStats.bio && <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{githubStats.bio}</div>}
                </div>
              </div>
            </div>

            {/* Main Stats: Public Repos and Total Commits */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}> <div className="text-2xl font-bold text-green-500">{githubStats.publicRepos ?? 0}</div> <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Public Repos</div> </div>
              <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}> <div className="text-2xl font-bold text-blue-500">{githubStats.totalCommits ?? '—'}</div> <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Commits</div> </div>
            </div>

            {/* Joined Date */}
            <div className={`p-2 rounded text-center mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}> <div className="flex items-center justify-center mb-1 space-x-1"> <Calendar className="w-3 h-3 text-gray-400" /> <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatJoinDate(githubStats.createdAt)}</span> </div> <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Joined GitHub</div> </div>

            {/* Top Languages */}
            {githubStats.topLanguages && githubStats.topLanguages.length > 0 && (
              <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Top Languages</span>
                  <span className="relative">
                    <HelpCircle 
                      className="w-3.5 h-3.5 text-gray-400 cursor-pointer" 
                      onClick={() => setShowLanguagesTooltip(!showLanguagesTooltip)}
                    />
                    {showLanguagesTooltip && (
                      <span className="absolute right-0 z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded">
                        Based on the primary language of your public repositories
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {githubStats.topLanguages.map((lang, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getLanguageColor(lang.name)}`}></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{lang.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Repo */}
            {githubStats.topRepo && (
              <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}> <div className="flex items-center justify-between"> <div className="flex-1 min-w-0">
                <a href={githubStats.topRepo.url} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium truncate ${darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'}`}>{githubStats.topRepo.name}</a>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Repo</div> </div> </div> </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2"> <a href={`https://github.com/${githubStats.username}`} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center space-x-2 text-sm p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}> <ExternalLink className="w-4 h-4" /> <span>View Profile</span> </a> <a href={`https://github.com/${githubStats.username}?tab=repositories`} target="_blank" rel="noopener noreferrer" className={`text-center text-sm p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>Browse Repos →</a> </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {githubStats?.error || "Failed to load GitHub stats"}
            </h3>
            <button 
              onClick={() => setShowProfileModal(true)} 
              className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Link className="w-4 h-4" />
              <span>Setup Profile</span>
            </button>
          </div>
        )
      ) : (
        <div className="py-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Connect Your GitHub
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add your GitHub username to track commits and repos
          </p>
          <button 
            onClick={() => setShowProfileModal(true)} 
            className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
          >
            <Link className="w-4 h-4" />
            <span>Setup Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubSection;