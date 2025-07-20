import React, { useState } from 'react';
import { AlertCircle, Link, HelpCircle } from 'lucide-react';

const LeetCodeSection = ({ darkMode, profileData, leetcodeStats, loadingLeetcode, setShowProfileModal }) => {
  const [showReputationTooltip, setShowReputationTooltip] = useState(false);

  return (
  <div className="space-y-4">
    {profileData.leetcode ? (
      loadingLeetcode ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-b-2 border-yellow-500 rounded-full animate-spin"></div>
        </div>
      ) : leetcodeStats && leetcodeStats.configured ? (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-yellow-500">Lee</span>tCode
            </h3>
            <span className={`text-xs px-2 py-1 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-yellow-600'} font-semibold border-0 shadow-none`}>Rank #{leetcodeStats.ranking ?? 'N/A'}</span>
          </div>

          {/* Core Stats: Total Solved + Streaks */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-green-500">{leetcodeStats.totalSolved ?? 0}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problems Solved</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-blue-500">{leetcodeStats.maxStreak ?? 0}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Max Streak</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-yellow-500">{leetcodeStats.currentStreak ?? 0}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Streak</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-purple-500">{leetcodeStats.reputation ?? 0}</div>
              <div className="flex items-center justify-center gap-1 text-xs">
                Reputation
                <span className="relative">
                  <HelpCircle 
                    className="w-3.5 h-3.5 text-gray-400 cursor-pointer" 
                    onClick={() => setShowReputationTooltip(!showReputationTooltip)}
                  />
                  {showReputationTooltip && (
                    <span className="absolute z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded left-1/2 -translate-x-1/2">
                      Reputation is earned from upvotes on your LeetCode Discuss posts and comments. It is not related to problem solving or contests.
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className={`p-2 rounded text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-lg font-bold text-green-500">{leetcodeStats.easySolved ?? 0}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Easy</div>
            </div>
            <div className={`p-2 rounded text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-lg font-bold text-yellow-500">{leetcodeStats.mediumSolved ?? 0}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Medium</div>
            </div>
            <div className={`p-2 rounded text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-lg font-bold text-red-500">{leetcodeStats.hardSolved ?? 0}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hard</div>
            </div>
          </div>

          {/* Quick Action */}
          <a
            href="https://leetcode.com/problemset/all/"
            target="_blank"
            className={`block text-center text-sm p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            Solve Random Problem →
          </a>
        </div>
      ) : (
        <div className="py-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{leetcodeStats?.error || "Failed to load LeetCode stats"}</h3>
          <button onClick={() => setShowProfileModal(true)} className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-yellow-600 rounded-lg hover:bg-yellow-700"><Link className="w-4 h-4" /><span>Setup Profile</span></button>
        </div>
      )
    ) : (
      <div className="py-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Connect Your LeetCode</h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add your LeetCode username to track your progress</p>
        <button onClick={() => setShowProfileModal(true)} className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-yellow-600 rounded-lg hover:bg-yellow-700"><Link className="w-4 h-4" /><span>Setup Profile</span></button>
      </div>
    )}
    </div>
  );
};

export default LeetCodeSection; 