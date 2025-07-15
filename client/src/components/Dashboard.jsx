import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Code, GitBranch, Calendar,
  Clock, Users, Target, Plus, Search, Filter, MoreVertical,
  Activity, Star, AlertCircle, CheckCircle, XCircle, 
  Moon, Sun, Bell, Settings, User, LogOut, Folder,
  Terminal, Database, Globe, Cpu, HardDrive, Wifi
} from 'lucide-react';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+2.5%',
      trend: 'up',
      icon: Folder,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Code Commits',
      value: '347',
      change: '+12.3%',
      trend: 'up',
      icon: GitBranch,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Issues Resolved',
      value: '28',
      change: '-5.2%',
      trend: 'down',
      icon: CheckCircle,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+1',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const recentProjects = [
    {
      name: 'E-commerce Platform',
      status: 'Active',
      progress: 85,
      lastUpdate: '2 hours ago',
      team: 4,
      priority: 'High'
    },
    {
      name: 'Mobile App Redesign',
      status: 'In Review',
      progress: 60,
      lastUpdate: '1 day ago',
      team: 3,
      priority: 'Medium'
    },
    {
      name: 'API Integration',
      status: 'Testing',
      progress: 92,
      lastUpdate: '3 hours ago',
      team: 2,
      priority: 'High'
    },
    {
      name: 'Database Migration',
      status: 'Planning',
      progress: 25,
      lastUpdate: '2 days ago',
      team: 5,
      priority: 'Low'
    }
  ];

  const activities = [
    {
      type: 'commit',
      user: 'John Doe',
      action: 'pushed 3 commits to main branch',
      project: 'E-commerce Platform',
      time: '15 minutes ago',
      icon: GitBranch
    },
    {
      type: 'issue',
      user: 'Sarah Wilson',
      action: 'resolved issue #142',
      project: 'Mobile App Redesign',
      time: '1 hour ago',
      icon: CheckCircle
    },
    {
      type: 'deployment',
      user: 'Mike Johnson',
      action: 'deployed to production',
      project: 'API Integration',
      time: '2 hours ago',
      icon: Globe
    },
    {
      type: 'review',
      user: 'Emily Chen',
      action: 'requested code review',
      project: 'Database Migration',
      time: '4 hours ago',
      icon: Code
    }
  ];

  const quickActions = [
    { name: 'New Project', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Deploy Code', icon: Globe, color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Run Tests', icon: Terminal, color: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'View Metrics', icon: BarChart3, color: 'bg-orange-500 hover:bg-orange-600' }
  ];

  const systemStatus = [
    { service: 'API Server', status: 'Online', uptime: '99.9%', icon: Database, color: 'text-green-500' },
    { service: 'CDN', status: 'Online', uptime: '99.8%', icon: Globe, color: 'text-green-500' },
    { service: 'Database', status: 'Online', uptime: '99.7%', icon: HardDrive, color: 'text-green-500' },
    { service: 'Monitoring', status: 'Warning', uptime: '98.1%', icon: Activity, color: 'text-yellow-500' }
  ];

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Testing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Planning': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">DevBoard</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                {['overview', 'projects', 'analytics', 'team'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Progress: {project.progress}%</span>
                          <span>Team: {project.team} members</span>
                          <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority} Priority
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Last updated {project.lastUpdate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2`}
                  >
                    <action.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h2>
              <div className="space-y-3">
                {systemStatus.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <service.icon className={`w-5 h-5 ${service.color}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.service}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.uptime}</p>
                      <p className={`text-xs ${service.color}`}>{service.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {activities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <activity.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.project}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;