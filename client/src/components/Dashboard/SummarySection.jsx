import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, BookOpen, Trophy, Calendar, Zap, Info } from 'lucide-react';
import CountUp from 'react-countup';

const API_URL = import.meta.env.VITE_API_URL;

const SummarySection = ({ darkMode, weeklyData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMessageColor = (messageType) => {
    switch (messageType) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'decent': return 'text-yellow-500';
      case 'improving': return 'text-orange-500';
      case 'motivational': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-gray-500';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return '🏆';
    if (score >= 60) return '🚀';
    if (score >= 40) return '💪';
    if (score >= 20) return '📈';
    return '🌟';
  };

  if (!weeklyData) {
    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          This Week's Progress
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { stats, productivityScore, motivationalMessage, messageType } = weeklyData;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          This Week's Progress
        </h3>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date(weeklyData.weekStart).toLocaleDateString()} - {new Date(weeklyData.weekEnd).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Productivity Score */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-blue-500`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <TrendingUp className={`w-5 h-5 ${getScoreColor(productivityScore)}`} />
            </div>
            <div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Productivity Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(productivityScore)}`}>
                <CountUp end={productivityScore} duration={1.5} />%
              </div>
            </div>
          </div>
          <div className="text-3xl">{getScoreIcon(productivityScore)}</div>
        </div>
      </div>

      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problems Solved</div>
            <span className="relative group">
              <Info className="w-4 h-4 text-gray-400 cursor-pointer group-hover:text-blue-500" />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                Only LeetCode problems are counted
              </span>
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-500">
            <CountUp end={stats.problemsSolved} duration={1} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Resources Added</div>
          </div>
          <div className="text-2xl font-bold text-blue-500">
            <CountUp end={stats.resourcesAdded} duration={1} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-green-500" />
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals Completed</div>
          </div>
          <div className="text-2xl font-bold text-green-500">
            <CountUp end={stats.goalsCompleted} duration={1} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-500" />
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Days</div>
          </div>
          <div className="text-2xl font-bold text-purple-500">
            <CountUp end={stats.activeDays} duration={1} />
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-green-500`}>
        <div className={`mb-2 text-lg font-medium ${getMessageColor(messageType)}`}>
          {motivationalMessage}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Total activities this week: <span className="font-semibold">{stats.totalActivity}</span>
        </div>
      </div>
    </div>
  );
};

export default SummarySection; 