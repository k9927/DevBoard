import { Plus, X, Target, Circle, CheckCircle } from 'lucide-react';

const GoalsSection = ({
  darkMode,
  goals,
  toggleGoal,
  showAddGoal,
  setShowAddGoal,
  newGoal,
  setNewGoal,
  handleAddGoal,
  getTypeColor
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Today's Goals
        </h3>
        <button 
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {showAddGoal && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Goal</h4>
            <button 
              onClick={() => setShowAddGoal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              placeholder="Goal title"
              className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
            />
            <select
              value={newGoal.type}
              onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
              className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="DSA">DSA</option>
              <option value="Project">Project</option>
              <option value="Study">Study</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleAddGoal}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 overflow-y-auto max-h-64">
        {goals.map(goal => (
          <div key={goal.id} className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <button
              onClick={() => toggleGoal(goal.id)}
              className="mr-3"
            >
              {goal.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div className="flex-1">
              <p className={`font-medium ${goal.completed ? 'line-through text-gray-500' : (darkMode ? 'text-white' : 'text-gray-900')}`}>
                {goal.title}
              </p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${getTypeColor(goal.type)}`}></div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goal.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsSection;