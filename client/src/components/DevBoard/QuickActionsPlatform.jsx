import { Trophy, Code, Github, Target } from 'lucide-react';

const QuickActionsPlatform = ({ darkMode, setShowAddGoal }) => {
  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <a 
          href="https://leetcode.com/problemset/all/" 
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3 rounded-lg flex flex-col items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
        >
          <Trophy className="w-6 h-6 mb-2 text-yellow-500" />
          <span className="text-sm font-medium">LeetCode</span>
        </a>
        
        <a 
          href="https://codeforces.com/problemset" 
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3 rounded-lg flex flex-col items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
        >
          <Code className="w-6 h-6 mb-2 text-purple-500" />
          <span className="text-sm font-medium">Codeforces</span>
        </a>
        
        <a 
          href="https://github.com" 
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3 rounded-lg flex flex-col items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
        >
          <Github className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">GitHub</span>
        </a>
        
        <button 
          onClick={() => setShowAddGoal(true)}
          className={`p-3 rounded-lg flex flex-col items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
        >
          <Target className="w-6 h-6 mb-2 text-blue-500" />
          <span className="text-sm font-medium">Add Goal</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsPlatform;