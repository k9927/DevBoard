import React, { useState, useEffect } from 'react';
import { 
  User, Plus, BookOpen, Trophy, Target, Code, 
  Github, BarChart3, X, CheckCircle, Circle,
  AlertCircle, ArrowRight, Link, Upload, 
  ChevronDown, ChevronUp, Zap, Users,
  ExternalLink, Settings, Star, Activity, Trash2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const DevBoard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [resourceErrors, setResourceErrors] = useState({
    title: '',
    url: ''
  });
const [leetcodeStats, setLeetcodeStats] = useState();
const [loadingLeetcode, setLoadingLeetcode] = useState(true);

  // Profile data state
    const [profileData, setProfileData] = useState({
    leetcode_username: '',
    codeforces_handle: '',
    github_username: ''
  });

  // Resources state
  const [resources, setResources] = useState([]);
  // Goals state
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  
  // Load resources and goals when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        //Fetch Profiles 
         setLoadingProfiles(true);
        const profilesResponse = await fetch(`${API_URL}/api/profiles`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profilesResponse.ok) {
          throw new Error('Failed to fetch profiles');
        }
        
        const profilesData = await profilesResponse.json();
        setProfileData(profilesData);
  //Leetcode fetchhhhhh
        if (profilesData?.id && profilesData?.leetcode_username) {
  const leetcodeStatsResponse = await fetch(`https://leetcode-stats-api.herokuapp.com/${profilesData.leetcode_username}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!leetcodeStatsResponse.ok) {
    throw new Error("Failed to fetch LeetCode stats");
  }

  const stats = await leetcodeStatsResponse.json();
  setLeetcodeStats(stats);
  setLoadingLeetcode(false);
}

        // Fetch resources
        const resourcesResponse = await fetch(`${API_URL}/api/resources`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!resourcesResponse.ok) {
          throw new Error('Failed to fetch resources');
        }
        
        const resourcesData = await resourcesResponse.json();
        setResources(resourcesData);
        
        // Fetch goals
        setLoadingGoals(true);
        const goalsResponse = await fetch(`${API_URL}/api/goals`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!goalsResponse.ok) {
          throw new Error('Failed to fetch goals');
        }
        
        const goalsData = await goalsResponse.json();
        setGoals(goalsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
         setLoadingProfiles(false);
    setLoadingGoals(false);
    setLoadingLeetcode(false);
      }
    };

    fetchData();
  }, []);

  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    tags: [],
    type: 'article',
    date: new Date().toISOString().split('T')[0]
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'DSA',
    date: new Date().toISOString().split('T')[0]
  });

  // Check if any profiles are connected
  const hasAnyProfile = () => {
    return Object.values(profileData).some(val => val.trim() !== '');
  };

  // Save profiles to localStorage when they change
  useEffect(() => {
    localStorage.setItem('devboard-profiles', JSON.stringify(profileData));
  }, [profileData]);

  // Handle profile form submission
    const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save profiles');
      }
      
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  };

  // Toggle goal completion
  const toggleGoal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const goal = goals.find(g => g.id === id);
      
      const response = await fetch(`${API_URL}/api/goals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          completed: !goal.completed
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      
      const updatedGoal = await response.json();
      
      setGoals(goals.map(g => 
        g.id === id ? updatedGoal : g
      ));
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  // Get color for goal/resource type
  const getTypeColor = (type) => {
    const colors = {
      DSA: 'bg-blue-500',
      Project: 'bg-green-500',
      Study: 'bg-purple-500',
      Course: 'bg-gray-400',
      'Open Source': 'bg-pink-500',
      Revision: 'bg-yellow-500',
      Reading: 'bg-indigo-500',
      'Mock Interview': 'bg-red-500',
      Resume: 'bg-orange-500',
      Content: 'bg-teal-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) {
      alert('Please enter a goal title');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newGoal.title,
          type: newGoal.type
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add goal');
      }
      
      const addedGoal = await response.json();
      
      setGoals([...goals, addedGoal]);
      setNewGoal({
        title: '',
        type: 'DSA',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddGoal(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleAddResource = async () => {
    // Reset errors
    setResourceErrors({ title: '', url: '' });
    
    // Validate
    let isValid = true;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;  
    
    if (!newResource.title.trim()) {
      setResourceErrors(prev => ({ ...prev, title: 'Please enter a resource title' }));
      isValid = false;
    }
    
    if (!newResource.url.trim()) {
      setResourceErrors(prev => ({ ...prev, url: 'Please enter a URL' }));
      isValid = false;
    } else if (!urlPattern.test(newResource.url)) {
      setResourceErrors(prev => ({ ...prev, url: 'Please enter a valid URL (e.g., https://example.com)' }));
      isValid = false;
    }
    
    if (!isValid) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newResource.title,
          url: newResource.url.includes('://') ? newResource.url : `https://${newResource.url}`,
          tags: newResource.tags,
          type: newResource.type
        }),
      });
      
      if (!response.ok) {  
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add resource');
      }

      const data = await response.json();
      // If valid, add the resource
      setResources([...resources, data]);
      setNewResource({
        title: '',
        url: '',
        tags: [],
        type: 'article',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddResource(false);
    } catch (error) {
      console.error('Error adding resource:', error);
      setResourceErrors(prev => ({ ...prev, general: 'Failed to add resource. Please try again.' }));
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setResources(resources.filter((r) => r.id !== id));
      } else {
        console.error("Failed to delete");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Platform data configuration
  const platforms = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Activity,
      iconBg: 'bg-pink-100 text-pink-600',
      summary: {
        count: 'Daily Progress',
        last: 'Track your coding journey'
      },
      expandedContent: (
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
      )
    },
    {
      id: 'resources',
      name: 'Resources',
      icon: BookOpen,
      iconBg: 'bg-emerald-100 text-emerald-600',
      summary: {
        count: `${resources.length} saved`,
        last: resources[0]?.title || 'No resources yet'
      },
      expandedContent: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Saved Resources
            </h3>
            <button 
              onClick={() => setShowAddResource(true)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>

          {showAddResource && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Resource</h4>
                <button 
                  onClick={() => setShowAddResource(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="Resource title"
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} ${resourceErrors.title ? 'border-red-500' : ''}`}
                  />
                  {resourceErrors.title && (
                    <div className="mt-1 text-sm text-red-500">{resourceErrors.title}</div>
                  )}
                </div>
                <div>
                  <input
                    type="url"
                    value={newResource.url}
                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    placeholder="URL"
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} ${resourceErrors.url ? 'border-red-500' : ''}`}
                  />
                  {resourceErrors.url && (
                    <div className="mt-1 text-sm text-red-500">{resourceErrors.url}</div>
                  )}
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newResource.tags.join(', ')}
                    onChange={(e) => setNewResource({
                      ...newResource, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    placeholder="React, Performance, JavaScript"
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="course">Course</option>
                  <option value="tool">Tool</option>
                  <option value="book">Book</option>
                  <option value="podcast">Podcast</option>
                  <option value="cheatsheet">Cheatsheet</option>
                  <option value="project">Project</option>
                  <option value="note">Note</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddResource}
                    className="flex-1 px-4 py-2 text-white rounded bg-emerald-600 hover:bg-emerald-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddResource(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 overflow-y-auto max-h-64">
            {resources.map(resource => (
              <div
                key={resource.id}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title */}
                    <h4
                      className={`font-medium mb-1 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {resource.title}
                    </h4>

                    {/* Tags + Type */}
                    <div className="flex flex-wrap items-center gap-1 mb-2">
                      {resource.tags && resource.tags.map(tag => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs rounded-full ${
                            darkMode
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      {resource.type && (
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full font-semibold ${
                            darkMode
                              ? 'bg-emerald-700 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    {resource.created_at && (
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Added on {new Date(resource.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* External link + delete */}
                  <div className="flex items-center ml-2 space-x-2">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 transition-colors rounded hover:bg-gray-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      name: 'Daily Goals',
      icon: Target,
      iconBg: 'bg-blue-100 text-blue-600',
      summary: {
        count: loadingGoals ? 'Loading...' : `${goals.length} tasks today`,
        last: loadingGoals ? '' : `${goals.filter(g => g.completed).length} done`
      },
      expandedContent: (
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
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="DSA">DSA</option>
                  <option value="Project">Project</option>
                  <option value="Study">Study</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Revision">Revision</option>
                  <option value="Course">Course</option>
                  <option value="Reading">Reading</option>
                  <option value="Mock Interview">Mock Interview</option>
                  <option value="Resume">Resume</option>
                  <option value="Content">Content</option>
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

          {loadingGoals ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-64">
              {goals.length === 0 ? (
                <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No goals yet. Add your first goal!</p>
                </div>
              ) : (
                goals.map(goal => (
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
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'quick',
      name: 'Quick Actions',
      icon: Zap,
      iconBg: 'bg-green-100 text-green-600',
      summary: {
        count: 'Jump to tasks',
        last: 'Save time with quick access'
      },
      expandedContent: (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
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
            

          </div>
        </div>
      )
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Trophy,
      iconBg: 'bg-yellow-100 text-yellow-600',
      needsProfile: !profileData.leetcode_username,
      summary: {
        count: profileData.leetcode_username? 'Total Solved: 487' : 'Setup Required',
        last: profileData.leetcode_username? 'Rank: #18,456' : 'Add your username'
      },
      expandedContent: (
        <div className="space-y-4">
          {profileData.leetcode_username ? (
           <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
  {/* Header with Logo */}
  <div className="flex items-center justify-between mb-3">
    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <span className="text-yellow-500">Lee</span>tCode
    </h3>
    <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
      Rank #18,456
    </span>
  </div>

  {/* Core Stats: Total Solved + Streak */}
  <div className="grid grid-cols-2 gap-3 mb-4">
    <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className="text-2xl font-bold text-green-500">487</div>
      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problems Solved</div>
    </div>
    <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className="text-2xl font-bold text-blue-500">42</div>
      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
    </div>
  </div>

  {/* Difficulty Breakdown */}
  <div className="grid grid-cols-3 gap-2 mb-4">
    {[
      { type: 'Easy', solved: 120, color: 'bg-green-500' },
      { type: 'Medium', solved: 300, color: 'bg-yellow-500' },
      { type: 'Hard', solved: 67, color: 'bg-red-500' }
    ].map((item) => (
      <div 
        key={item.type} 
        className={`p-2 rounded text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
      >
        <div className={`text-lg font-bold ${item.color.replace('bg', 'text')}`}>{item.solved}</div>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.type}</div>
      </div>
    ))}
  </div>

  {/* Total Submissions */}
  <div className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <div className="flex items-center justify-between">
      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Submissions</span>
      <span className="font-bold text-purple-500">1,024</span>
    </div>
  </div>

  {/* Contest Rating (Optional) */}
  <div className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <div className="flex items-center justify-between">
      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contest Rating</span>
      <span className="font-bold text-blue-500">1,458</span>
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
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Connect Your LeetCode
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add your LeetCode username to track your progress
              </p>
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-yellow-600 rounded-lg hover:bg-yellow-700"
              >
                <Link className="w-4 h-4" />
                <span>Setup Profile</span>
              </button>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      icon: Code,
      iconBg: 'bg-purple-100 text-purple-600',
      needsProfile: !profileData.codeforces_handle,
      summary: {
        count: profileData.codeforces_handle ? 'Rating: 1458' : 'Setup Required',
        last: profileData.codeforces_handle ? 'Rank: Pupil' : 'Add your username'
      },
      expandedContent: (
        <div className="space-y-4">
          {profileData.codeforces_handle ? (
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
      )
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      iconBg: 'bg-gray-100 text-gray-700',
      needsProfile: !profileData.github_username,
      summary: {
        count: profileData.github_username ? 'Commit Streak: 5 days' : 'Setup Required',
        last: profileData.github_username ? 'Top Repo: leetcode-grind' : 'Add your username'
      },
      expandedContent: (
        <div className="space-y-4">
          {profileData.github_username ? (
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                GitHub Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-2xl font-bold text-green-500">5</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-lg font-bold text-blue-500">leetcode-grind</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Repo</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Connect Your GitHub
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add your GitHub username to track commits and repos
              </p>
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center px-4 py-2 mx-auto space-x-2 text-white transition-all bg-gray-700 rounded-lg hover:bg-gray-800"
              >
                <Link className="w-4 h-4" />
                <span>Setup Profile</span>
              </button>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'activity',
      name: 'Recent Activity',
      icon: Users,
      iconBg: 'bg-orange-100 text-orange-600',
      summary: {
        count: 'Your recent actions',
        last: 'Track your progress'
      },
      expandedContent: (
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
      )
    },
    {
      id: 'summary',
      name: 'Weekly Summary',
      icon: BarChart3,
      iconBg: 'bg-indigo-100 text-indigo-600',
      summary: {
        count: '9 problems solved',
        last: 'Great progress this week!'
      },
      expandedContent: (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            This Week's Progress
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-indigo-500">9</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problems Solved</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold text-blue-500">4</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Resources Added</div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="mb-2 text-lg font-medium text-green-500">🎉 Great Progress!</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You've been consistent with your coding practice this week. Keep it up!
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DevBoard</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Developer Productivity Hub
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setShowProfileModal(true)}
                className={`p-2 rounded-xl relative ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <User className="w-6 h-6" />
                {!hasAnyProfile() && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner (shown only when no profiles are connected) */}
      {!hasAnyProfile() && (
        <div className="container px-4 mx-auto mt-6 sm:px-6 lg:px-8">
          <div className={`relative overflow-hidden rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
            <div className="relative z-10">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Welcome to DevBoard! 🚀</h2>
                    <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                      Connect your coding profiles to unlock personalized stats
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center px-6 py-3 space-x-2 text-white transition-all shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                >
                  <Upload className="w-5 h-5" />
                  <span>Setup Your Profiles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-8 translate-y-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-600 opacity-10"></div>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
  <main className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border ${expandedPlatform === platform.id ? 'ring-2 ring-blue-500 md:col-span-2 lg:col-span-3 shadow-xl' : ''}`}
            >
              {/* Platform Header */}
              <div 
                className={`p-5 cursor-pointer ${expandedPlatform === platform.id ? (darkMode ? 'bg-gray-700' : 'bg-gray-50') : ''}`}
                onClick={() => setExpandedPlatform(expandedPlatform === platform.id ? null : platform.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${platform.iconBg} ${darkMode ? 'bg-opacity-20' : ''}`}>
                      <platform.icon className={`w-5 h-5 ${darkMode ? 'text-white' : ''}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      {platform.needsProfile && (
                        <div className="flex items-center space-x-1 text-xs text-orange-500">
                          <AlertCircle className="w-3 h-3" />
                          <span>Profile needed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {expandedPlatform === platform.id ? (
                    <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </div>
              </div>
              
              {/* Platform Summary */}
              <div className="px-5 pb-5">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {platform.summary.count}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {platform.summary.last}
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedPlatform === platform.id && (
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-5`}>
                  {platform.expandedContent}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Profile Setup Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
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
                  value={profileData.leetcode_username}
                  onChange={(e) => setProfileData({...profileData, leetcode_username: e.target.value})}
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
                  value={profileData.codeforces_handle}
                  onChange={(e) => setProfileData({...profileData, codeforces_handle: e.target.value})}
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
                  value={profileData.github_username}
                  onChange={(e) => setProfileData({...profileData, github_username: e.target.value})}
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
      )}
    </div>
  );
};

export default DevBoard;