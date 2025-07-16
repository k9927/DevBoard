import React, { useState, useEffect } from 'react';
import { 
  User, Plus, BookOpen, Trophy, Target, Code, 
  Github, BarChart3, X, CheckCircle, Circle,
  AlertCircle, ArrowRight, Link, Upload, 
  ChevronDown, ChevronUp, Zap, Users,
  ExternalLink, Settings, Star, Activity, Trash2
} from 'lucide-react';
import Header from '../components/DevBoard/Header';
import ProfileModal from '../components/DevBoard/ProfileModal';
import PlatformCard from '../components/DevBoard/PlatformCard';
import GoalsSection from '../components/DevBoard/GoalsSection';
import ResourcesSection from '../components/DevBoard/ResourcesSection';
import OverviewPlatform from '../components/DevBoard/OverviewPlatform';
import QuickActionsPlatform from '../components/DevBoard/QuickActionsPlatform';
import LeetCodePlatform from '../components/DevBoard/LeetCodePlatform';
import CodeforcesPlatform from '../components/DevBoard/CodeforcesPlatform';
import GitHubPlatform from '../components/DevBoard/GitHubPlatform';
import ActivityPlatform from '../components/DevBoard/ActivityPlatform';
import SummaryPlatform from '../components/DevBoard/SummaryPlatform';

const API_URL = import.meta.env.VITE_API_URL;

const DevBoardPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  
  // Profile data state
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('devboard-profiles');
    return saved ? JSON.parse(saved) : {
      leetcode: '',
      codeforces: '',
      github: '',
      codechef: '',
      hackerrank: ''
    };
  });

  // Resources state
  const [resources, setResources] = useState([]);
  
  // Load resources when component mounts
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/resources`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  // Goals state
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Solve 5 LeetCode problems",
      type: "DSA",
      completed: false,
      date: "2025-07-15"
    },
    {
      id: 2,
      title: "Complete React component",
      type: "Project",
      completed: true,
      date: "2025-07-15"
    },
    {
      id: 3,
      title: "Read system design chapter",
      type: "Study",
      completed: false,
      date: "2025-07-15"
    }
  ]);

  // Check if any profiles are connected
  const hasAnyProfile = () => {
    return Object.values(profileData).some(val => val.trim() !== '');
  };

  // Save profiles to localStorage when they change
  useEffect(() => {
    localStorage.setItem('devboard-profiles', JSON.stringify(profileData));
  }, [profileData]);

  // Handle profile form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setShowProfileModal(false);
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
      component: <OverviewPlatform darkMode={darkMode} goals={goals} />
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
      component: <ResourcesSection 
        darkMode={darkMode} 
        resources={resources} 
        setResources={setResources}
      />
    },
    {
      id: 'goals',
      name: 'Daily Goals',
      icon: Target,
      iconBg: 'bg-blue-100 text-blue-600',
      summary: {
        count: `${goals.length} tasks today`,
        last: `${goals.filter(g => g.completed).length} done`
      },
      component: <GoalsSection 
        darkMode={darkMode} 
        goals={goals} 
        setGoals={setGoals}
      />
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
      component: <QuickActionsPlatform 
        darkMode={darkMode} 
        setShowProfileModal={setShowProfileModal}
      />
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Trophy,
      iconBg: 'bg-yellow-100 text-yellow-600',
      needsProfile: !profileData.leetcode,
      summary: {
        count: profileData.leetcode ? 'Total Solved: 487' : 'Setup Required',
        last: profileData.leetcode ? 'Rank: #18,456' : 'Add your username'
      },
      component: <LeetCodePlatform 
        darkMode={darkMode} 
        hasProfile={!!profileData.leetcode}
        setShowProfileModal={setShowProfileModal}
      />
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      icon: Code,
      iconBg: 'bg-purple-100 text-purple-600',
      needsProfile: !profileData.codeforces,
      summary: {
        count: profileData.codeforces ? 'Rating: 1458' : 'Setup Required',
        last: profileData.codeforces ? 'Rank: Pupil' : 'Add your username'
      },
      component: <CodeforcesPlatform 
        darkMode={darkMode} 
        hasProfile={!!profileData.codeforces}
        setShowProfileModal={setShowProfileModal}
      />
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      iconBg: 'bg-gray-100 text-gray-700',
      needsProfile: !profileData.github,
      summary: {
        count: profileData.github ? 'Commit Streak: 5 days' : 'Setup Required',
        last: profileData.github ? 'Top Repo: leetcode-grind' : 'Add your username'
      },
      component: <GitHubPlatform 
        darkMode={darkMode} 
        hasProfile={!!profileData.github}
        setShowProfileModal={setShowProfileModal}
      />
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
      component: <ActivityPlatform darkMode={darkMode} />
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
      component: <SummaryPlatform darkMode={darkMode} />
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        setShowProfileModal={setShowProfileModal}
        hasAnyProfile={hasAnyProfile()}
      />

      {/* Welcome Banner */}
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
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <main className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              darkMode={darkMode}
              expandedPlatform={expandedPlatform}
              setExpandedPlatform={setExpandedPlatform}
            />
          ))}
        </div>
      </main>

      {/* Profile Setup Modal */}
      <ProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        darkMode={darkMode}
        profileData={profileData}
        setProfileData={setProfileData}
        handleProfileSubmit={handleProfileSubmit}
      />
    </div>
  );
};

export default DevBoardPage;