import React, { useState, useEffect } from 'react';
import ProfileModal from '../components/Dashboard/ProfileModal';
import PlatformCard from '../components/Dashboard/PlatformCard';
import LeetCodeSection from '../components/Dashboard/LeetCodeSection';
import ResourcesSection from '../components/Dashboard/ResourcesSection';
import GoalsSection from '../components/Dashboard/GoalsSection';
import OverviewSection from '../components/Dashboard/OverviewSection';
import QuickActionsSection from '../components/Dashboard/QuickActionsSection';
import CodeforcesSection from '../components/Dashboard/CodeforcesSection';
import GitHubSection from '../components/Dashboard/GitHubSection';
import ActivitySection from '../components/Dashboard/ActivitySection';
import SummarySection from '../components/Dashboard/SummarySection';
import { Activity, BookOpen, Target, Zap, Trophy, Code, Github, Users, BarChart3, LogOut } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboards = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const [loading, setLoading] = useState(true); // Global loading state
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({ leetcode: '', codeforces: '', github: '' });

  // Resources state
  const [resources, setResources] = useState([]);
  const [showAddResource, setShowAddResource] = useState(false);
  const [resourceErrors, setResourceErrors] = useState({ title: '', url: '' });
  const [newResource, setNewResource] = useState({ title: '', url: '', tags: [], type: 'article', date: new Date().toISOString().split('T')[0] });

  // Goals state
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', type: 'DSA', date: new Date().toISOString().split('T')[0] });

  // LeetCode stats state
  const [leetcodeStats, setLeetcodeStats] = useState();
  const [loadingLeetcode, setLoadingLeetcode] = useState(true);

  // Codeforces stats state
  const [codeforcesStats, setCodeforcesStats] = useState();
  const [loadingCodeforces, setLoadingCodeforces] = useState(true);

  // GitHub stats state
  const [githubStats, setGithubStats] = useState();
  const [loadingGithub, setLoadingGithub] = useState(true);

  // Refactored data fetching logic
  const fetchAllData = async () => {
    setLoading(true); // Start loading
    let anyApiSucceeded = false;
    try {
      const token = localStorage.getItem('token');
      // Fetch Profiles
      setLoadingProfiles(true);
      const profilesResponse = await fetch(`${API_URL}/api/profiles`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (profilesResponse.ok) {
        anyApiSucceeded = true;
        const profilesData = await profilesResponse.json();
        setProfileData({
          leetcode: profilesData.leetcode_username || '',
          codeforces: profilesData.codeforces_handle || '',
          github: profilesData.github_username || ''
        });
        // Fetch LeetCode stats if username exists
        if (profilesData.leetcode_username) {
          setLoadingLeetcode(true);
          try {
            const leetcodeStatsResponse = await fetch(`${API_URL}/api/leetcode/${profilesData.leetcode_username}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!leetcodeStatsResponse.ok) {
              setLeetcodeStats({ error: 'LeetCode username not found or unavailable.', configured: false });
            } else {
              const stats = await leetcodeStatsResponse.json();
              setLeetcodeStats({
                configured: true,
                username: stats.username,
                ranking: stats.ranking,
                totalSolved: stats.totalSolved,
                easySolved: stats.easySolved,
                mediumSolved: stats.mediumSolved,
                hardSolved: stats.hardSolved,
                reputation: stats.reputation,
                maxStreak: stats.maxStreak,
                currentStreak: stats.currentStreak
              });
            }
          } catch (err) {
            setLeetcodeStats({ error: 'Failed to fetch LeetCode stats', configured: false });
          }
          setLoadingLeetcode(false);
        } else {
          setLeetcodeStats(undefined);
        }
        // Fetch Codeforces stats if handle exists
        if (profilesData.codeforces_handle) {
          setLoadingCodeforces(true);
          try {
            const codeforcesStatsResponse = await fetch(`${API_URL}/api/codeforces/${profilesData.codeforces_handle}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!codeforcesStatsResponse.ok) {
              setCodeforcesStats({ error: 'Codeforces handle not found or unavailable.', configured: false });
            } else {
              const stats = await codeforcesStatsResponse.json();
              setCodeforcesStats({ configured: true, ...stats });
            }
          } catch (err) {
            setCodeforcesStats({ error: 'Failed to fetch Codeforces stats', configured: false });
          }
          setLoadingCodeforces(false);
        } else {
          setCodeforcesStats(undefined);
        }
        // Fetch GitHub stats if username exists
        if (profilesData.github_username) {
          setLoadingGithub(true);
          try {
            const githubStatsResponse = await fetch(`${API_URL}/api/github/${profilesData.github_username}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!githubStatsResponse.ok) {
              setGithubStats({ error: 'GitHub username not found or unavailable.', configured: false });
            } else {
              const stats = await githubStatsResponse.json();
              setGithubStats({
                configured: true,
                username: stats.login,
                avatarUrl: stats.avatar_url,
                publicRepos: stats.public_repos,
                followers: stats.followers,
                following: stats.following,
                createdAt: stats.created_at,
                name: stats.name,
                bio: stats.bio,
                htmlUrl: stats.html_url,
                topRepo: stats.topRepo,
                topLanguages: stats.topLanguages,
                totalCommits: stats.totalCommits
              });
              anyApiSucceeded = true;
            }
          } catch (err) {
            setGithubStats({ error: 'Failed to fetch GitHub stats', configured: false });
          }
          setLoadingGithub(false);
        } else {
          setGithubStats(undefined);
        }
      }
      setLoadingProfiles(false);
      // Fetch resources
      const resourcesResponse = await fetch(`${API_URL}/api/resources`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        setResources(resourcesData);
      }
      // Fetch goals
      setLoadingGoals(true);
      const goalsResponse = await fetch(`${API_URL}/api/goals`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json();
        setGoals(goalsData);
        anyApiSucceeded = true;
      }
      setLoadingGoals(false);
    } catch (err) {
      setLoadingProfiles(false);
      setLoadingGoals(false);
    } finally {
      if (anyApiSucceeded) setLoading(false); // Only hide loader if at least one main API succeeded
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Callback for ProfileModal to trigger data refresh
  const handleProfileUpdated = () => {
    fetchAllData();
  };

  // Profile modal submit handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          leetcode_username: profileData.leetcode,
          codeforces_handle: profileData.codeforces,
          github_username: profileData.github
        })
      });
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  };

  // Resource handlers
  const handleAddResource = async () => {
    setResourceErrors({ title: '', url: '' });
    let isValid = true;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: newResource.title,
          url: newResource.url.includes('://') ? newResource.url : `https://${newResource.url}`,
          tags: newResource.tags,
          type: newResource.type
        })
      });
      if (response.ok) {
        setResources([...resources, await response.json()]);
        setNewResource({ title: '', url: '', tags: [], type: 'article', date: new Date().toISOString().split('T')[0] });
        setShowAddResource(false);
      }
    } catch {
      // intentionally empty
    }
  };
  const handleDeleteResource = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/resources/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setResources(resources.filter((r) => r.id !== id));
      }
    } catch {
      // intentionally empty
    }
  };

  // Goals handlers
  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: newGoal.title, type: newGoal.type })
      });
      if (response.ok) {
        setGoals([...goals, await response.json()]);
        setNewGoal({ title: '', type: 'DSA', date: new Date().toISOString().split('T')[0] });
        setShowAddGoal(false);
      }
    } catch {
      // intentionally empty
    }
  };
  const toggleGoal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const goal = goals.find(g => g.id === id);
      const response = await fetch(`${API_URL}/api/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ completed: !goal.completed })
      });
      if (response.ok) {
        const updatedGoal = await response.json();
        setGoals(goals.map(g => g.id === id ? updatedGoal : g));
      }
    } catch {
      // intentionally empty
    }
  };
  const handleDeleteGoal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setGoals(goals.filter(goal => goal.id !== id));
      }
    } catch {
      // intentionally empty
    }
  };
  const getTypeColor = (type) => {
    const colors = {
      DSA: 'bg-blue-500', Project: 'bg-green-500', Study: 'bg-purple-500', Course: 'bg-gray-400', 'Open Source': 'bg-pink-500', Revision: 'bg-yellow-500', Reading: 'bg-indigo-500', 'Mock Interview': 'bg-red-500', Resume: 'bg-orange-500', Content: 'bg-teal-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const hasAnyProfile = () => Object.values(profileData).some(val => val.trim() !== '');

  const platforms = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Activity,
      iconBg: 'bg-pink-100 text-pink-600',
      summary: { count: 'Daily Progress', last: 'Track your coding journey' },
      component: <OverviewSection darkMode={darkMode} goals={goals} leetcodeStats={leetcodeStats} codeforcesStats={codeforcesStats} githubStats={githubStats} />
    },
    {
      id: 'resources',
      name: 'Resources',
      icon: BookOpen,
      iconBg: 'bg-emerald-100 text-emerald-600',
      summary: { count: `${resources.length} saved`, last: resources[0]?.title || 'No resources yet' },
      component: <ResourcesSection darkMode={darkMode} resources={resources} showAddResource={showAddResource} setShowAddResource={setShowAddResource} newResource={newResource} setNewResource={setNewResource} handleAddResource={handleAddResource} resourceErrors={resourceErrors} handleDeleteResource={handleDeleteResource} />
    },
    {
      id: 'goals',
      name: 'Daily Goals',
      icon: Target,
      iconBg: 'bg-blue-100 text-blue-600',
      summary: { count: `${goals.length} tasks today`, last: `${goals.filter(g => g.completed).length} done` },
      component: <GoalsSection darkMode={darkMode} goals={goals} toggleGoal={toggleGoal} showAddGoal={showAddGoal} setShowAddGoal={setShowAddGoal} newGoal={newGoal} setNewGoal={setNewGoal} handleAddGoal={handleAddGoal} handleDeleteGoal={handleDeleteGoal} getTypeColor={getTypeColor} />
    },
    {
      id: 'quick',
      name: 'Quick Actions',
      icon: Zap,
      iconBg: 'bg-green-100 text-green-600',
      summary: { count: 'Jump to tasks', last: 'Save time with quick access' },
      component: <QuickActionsSection darkMode={darkMode} setShowProfileModal={setShowProfileModal} setShowAddGoal={setShowAddGoal} />
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Trophy,
      iconBg: 'bg-yellow-100 text-yellow-600',
      needsProfile: !profileData.leetcode,
      summary: { count: profileData.leetcode && leetcodeStats ? `Total Solved: ${leetcodeStats.totalSolved}` : 'Setup Required', last: profileData.leetcode && leetcodeStats ? `Rank: #${leetcodeStats.ranking}` : 'Add your username' },
      component: <LeetCodeSection darkMode={darkMode} profileData={profileData} leetcodeStats={leetcodeStats} loadingLeetcode={loadingLeetcode} setShowProfileModal={setShowProfileModal} />
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      icon: Code,
      iconBg: 'bg-purple-100 text-purple-600',
      needsProfile: !profileData.codeforces,
      summary: {
        count: profileData.codeforces && codeforcesStats ? `Rating: ${codeforcesStats.rating ?? 'N/A'}` : 'Setup Required',
        last: profileData.codeforces && codeforcesStats ? `Rank: ${codeforcesStats.rank || 'Unrated'}` : 'Add your username'
      },
      component: <CodeforcesSection darkMode={darkMode} profileData={profileData} codeforcesStats={codeforcesStats} loadingCodeforces={loadingCodeforces} setShowProfileModal={setShowProfileModal} />
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      iconBg: 'bg-gray-100 text-gray-700',
      needsProfile: !profileData.github,
      summary: {
        count: profileData.github && githubStats ? `Total Commits: ${githubStats.totalCommits ?? '—'}` : 'Setup Required',
        last: profileData.github && githubStats && githubStats.topRepo ? `Top Repo: ${githubStats.topRepo.name}` : 'Add your username'
      },
      component: <GitHubSection darkMode={darkMode} profileData={profileData} githubStats={githubStats} loadingGithub={loadingGithub} setShowProfileModal={setShowProfileModal} />
    },
    {
      id: 'activity',
      name: 'Recent Activity',
      icon: Users,
      iconBg: 'bg-orange-100 text-orange-600',
      summary: { count: 'Your recent actions', last: 'Track your progress' },
      component: <ActivitySection darkMode={darkMode} />
    },
    {
      id: 'summary',
      name: 'Weekly Summary',
      icon: BarChart3,
      iconBg: 'bg-indigo-100 text-indigo-600',
      summary: { count: '9 problems solved', last: 'Great progress this week!' },
      component: <SummarySection darkMode={darkMode} />
    }
  ];

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800`}>
        <div className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700`}>
          <div className="mb-4">
            <svg className="w-10 h-10 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">Loading your dashboard...</div>
          <div className="mt-2 text-sm text-gray-400">Fetching your coding stats and resources</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <span role="img" aria-label="zap">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">DevBoard</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Developer Productivity Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>{darkMode ? '☀️' : '🌙'}</button>
              <button onClick={() => setShowProfileModal(true)} className={`p-2 rounded-xl relative ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>{!hasAnyProfile() && (<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>)}<span role="img" aria-label="user">👤</span></button>
            </div>
          </div>
        </div>
      </header>
      {!hasAnyProfile() && (
        <div className="container px-4 mx-auto mt-6 sm:px-6 lg:px-8">
          <div className={`relative overflow-hidden rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
            <div className="relative z-10">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"><span role="img" aria-label="zap">⚡</span></div>
                  <div>
                    <h2 className="text-xl font-bold">Welcome to DevBoard! 🚀</h2>
                    <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>Connect your coding profiles to unlock personalized stats</p>
                  </div>
                </div>
                <button onClick={() => setShowProfileModal(true)} className="flex items-center px-6 py-3 space-x-2 text-white transition-all shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"><span role="img" aria-label="upload">⬆️</span><span>Setup Your Profiles</span><span role="img" aria-label="arrow-right">➡️</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              darkMode={darkMode}
              expandedPlatform={expandedPlatform}
              setExpandedPlatform={setExpandedPlatform}
            >
              {platform.component}
            </PlatformCard>
          ))}
        </div>
      </main>
      <ProfileModal
        darkMode={darkMode}
        show={showProfileModal}
        setShow={setShowProfileModal}
        profileData={profileData}
        setProfileData={setProfileData}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
};

export default Dashboards;