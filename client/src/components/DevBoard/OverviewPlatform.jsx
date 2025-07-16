import { Trophy, Code, Github, Target, Zap } from 'lucide-react';

const OverviewPlatform = ({ darkMode, goals }) => {
  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Your Coding Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-xl font-bold">487</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>LeetCode Solved</div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-xl font-bold">1458</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Codeforces Rating</div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <div>
              <div className="text-xl font-bold">5</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-xl font-bold">{goals.filter(g => g.completed).length}/{goals.length}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals Completed</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-yellow-500" />
          <div>
            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Daily Motivation</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              "The expert in anything was once a beginner." - Helen Hayes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPlatform;