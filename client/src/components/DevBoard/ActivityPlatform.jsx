import React from 'react';
import { 
  CheckCircle, BookOpen, Trophy, Users
} from 'lucide-react';

const ActivityPlatform = ({ darkMode }) => {
  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Recent Activity
      </h3>
      
      <div className="space-y-3">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 mt-1 text-green-600 bg-green-100 rounded-full">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Completed goal: "Complete React component"
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Today at 3:45 PM
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 mt-1 text-blue-600 bg-blue-100 rounded-full">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Added resource: "React Performance Guide"
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Yesterday at 2:30 PM
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 mt-1 text-purple-600 bg-purple-100 rounded-full">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Solved LeetCode problem: "Two Sum"
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                2 days ago at 11:20 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPlatform;